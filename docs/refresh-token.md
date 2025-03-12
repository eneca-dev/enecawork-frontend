# Механизм Refresh Token в приложении

## Обзор

Механизм Refresh Token в нашем приложении обеспечивает безопасную и бесшовную аутентификацию пользователей. Он позволяет обновлять access token без необходимости повторного ввода учетных данных, когда срок действия текущего токена истекает.

## Архитектура

### Типы токенов

В приложении используются два типа токенов, управляемых Supabase Auth:

1. **Access Token**
   - Короткий срок жизни (30 дней)
   - Используется для аутентификации запросов к API
   - Хранится в cookie с именем `auth-token`
   - Содержит JWT с информацией о пользователе

2. **Refresh Token**
   - Длительный срок жизни (60 дней)
   - Используется для получения нового access token
   - Хранится в cookie с именем `refresh-token`
   - Согласно документации Supabase, refresh token никогда не истекает и может быть использован только один раз

### Хранение токенов

Токены хранятся в cookies браузера:

```typescript
// Установка access token
export const setAuthToken = (token: string): void => {
  cookies.set(TOKEN_NAME, token, {
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 дней
    sameSite: 'strict',
  });
};

// Установка refresh token
export const setRefreshToken = (token: string): void => {
  cookies.set(REFRESH_TOKEN_NAME, token, {
    path: '/',
    maxAge: 60 * 24 * 60 * 60, // 60 дней
    sameSite: 'strict',
  });
};
```

## Процесс обновления токена

### Фронтенд

#### 1. Автоматическое обновление при истечении срока действия

Когда access token истекает, приложение автоматически пытается обновить его с помощью refresh token. Это происходит в трех случаях:

- При получении ошибки 401 (Unauthorized) от API
- При проверке валидности токена во время инициализации приложения
- Проактивно, за некоторое время до истечения срока действия токена

Для проактивного обновления используется функция, которая проверяет срок действия токена и обновляет его, если до истечения осталось менее 5 минут:

```typescript
// Проверка необходимости обновления токена
function shouldRefreshToken(token: string): boolean {
  try {
    const decoded = jwtDecode(token);
    const expiresAt = decoded.exp * 1000; // в миллисекундах
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    return expiresAt - now < fiveMinutes;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // При ошибке декодирования считаем, что токен нужно обновить
  }
}

// Настройка таймера для проактивного обновления
function setupTokenRefreshTimer(token: string): void {
  try {
    const decoded = jwtDecode(token);
    const expiresAt = decoded.exp * 1000;
    const now = Date.now();
    const timeUntilRefresh = Math.max((expiresAt - now) - 5 * 60 * 1000, 0);
    
    setTimeout(async () => {
      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          const response = await authApi.refreshToken(refreshToken);
          setAuthToken(response.access_token);
          setRefreshToken(response.refresh_token);
          
          // Настраиваем следующее обновление
          setupTokenRefreshTimer(response.access_token);
        }
      } catch (error) {
        console.error('Token refresh error:', error);
      }
    }, timeUntilRefresh);
  } catch (error) {
    console.error('Error setting up token refresh timer:', error);
  }
}
```

#### 2. Перехватчик Axios

В файле `lib/api/axios.ts` настроен перехватчик, который автоматически обрабатывает ошибки 401 и пытается обновить токен:

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          // Выход из системы, если нет refresh token
          removeAuthToken();
          removeRefreshToken();
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Запрос на обновление токена
        const response = await fetch(`${API_URL}/auth/refresh-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setAuthToken(data.access_token);
          setRefreshToken(data.refresh_token);
          
          // Повторяем оригинальный запрос с новым токеном
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Выход из системы при ошибке
        removeAuthToken();
        removeRefreshToken();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);
```

#### 3. Функция проверки и обновления токена

В контексте аутентификации (`context/AuthContext.tsx`) реализована функция `checkAndRefreshToken`, которая проверяет валидность токена и обновляет его при необходимости:

```typescript
const checkAndRefreshToken = async (): Promise<boolean> => {
  try {
    const token = getAuthToken();
    if (!token) {
      return false;
    }

    // Проверяем валидность токена
    if (isTokenValid(token)) {
      // Настраиваем проактивное обновление
      setupTokenRefreshTimer(token);
      return true;
    }

    // Если токен невалиден, пробуем обновить его
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      removeAuthToken();
      setState(prev => ({ ...prev, isAuthenticated: false }));
      return false;
    }

    // Запрос на обновление токена
    const response = await authApi.refreshToken(refreshToken);
    setAuthToken(response.access_token);
    setRefreshToken(response.refresh_token);
    
    // Настраиваем проактивное обновление для нового токена
    setupTokenRefreshTimer(response.access_token);
    
    return true;
  } catch (error) {
    console.error('Token refresh error:', error);
    removeAuthToken();
    removeRefreshToken();
    setState(prev => ({ 
      ...prev, 
      isAuthenticated: false,
      error: 'Ошибка обновления токена. Пожалуйста, войдите снова.'
    }));
    return false;
  }
};
```

#### 4. API для обновления токена

В файле `lib/api/auth.ts` реализован метод для обновления токена, который использует встроенный механизм Supabase:

```typescript
refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
  try {
    // Используем fetch вместо axios, чтобы избежать перехватчиков
    // и предотвратить бесконечный цикл обновления токена
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Token refresh failed');
    }

    return response.json();
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
}
```

### Бэкенд

Бэкенд использует Supabase для аутентификации. Refresh token генерируется и обрабатывается Supabase.

#### 1. Получение токенов при входе

При успешном входе пользователя, бэкенд возвращает access и refresh токены, используя встроенный метод Supabase:

```python
@staticmethod
def login_user(
    supabase: Client,
    email: str,
    password: str,
) -> AuthLoginResponse:
    try:
        auth_response = supabase.auth.sign_in_with_password(
            {"email": email, "password": password}
        )

        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        return AuthLoginResponse(
            email=auth_response.user.email,
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token,
        )
    # ...
```

#### 2. Обработка refresh token

Supabase предоставляет встроенный механизм для обновления токенов. Согласно документации, refresh token никогда не истекает и может быть использован только один раз. При каждом обновлении токена Supabase генерирует новую пару access token и refresh token.

Для обновления сессии в Supabase можно использовать метод `refresh_session()`:

```python
# Обновление сессии с использованием текущего refresh token
response = supabase.auth.refresh_session()

# Или с явным указанием refresh token
response = supabase.auth.refresh_session(refresh_token)
```

#### 3. Инициализация проактивного обновления при входе

При успешном входе пользователя настраивается проактивное обновление токена:

```typescript
// Функция входа пользователя
async function login(email: string, password: string) {
  try {
    const response = await authApi.login(email, password);
    
    // Сохраняем токены
    setAuthToken(response.access_token);
    setRefreshToken(response.refresh_token);
    
    // Настраиваем проактивное обновление
    setupTokenRefreshTimer(response.access_token);
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
```

## Безопасность

1. **Хранение токенов**: Токены хранятся в cookies с флагом `sameSite: 'strict'` для защиты от CSRF-атак.
2. **Проверка валидности**: Перед использованием токена проверяется его срок действия.
3. **Автоматический выход**: При невозможности обновить токен пользователь автоматически выходит из системы.
4. **Одноразовые refresh токены**: Согласно документации Supabase, refresh token может быть использован только один раз, что повышает безопасность.

## Жизненный цикл токенов

1. **Получение токенов**: При успешной аутентификации пользователь получает access и refresh токены.
2. **Использование access token**: Все API-запросы включают access token в заголовок Authorization.
3. **Проактивное обновление**: За 5 минут до истечения срока действия access token автоматически обновляется.
4. **Реактивное обновление**: При получении ошибки 401 токен обновляется и запрос повторяется.
5. **Обновление токенов**: Если обновление успешно, пользователь получает новую пару токенов.
6. **Выход из системы**: При выходе из системы оба токена удаляются.

## Обработка ошибок

1. **Ошибка 401**: Если API возвращает ошибку 401, приложение пытается обновить токен.
2. **Ошибка обновления**: Если обновление токена не удается, пользователь перенаправляется на страницу входа.
3. **Отсутствие refresh token**: Если refresh token отсутствует, пользователь должен войти заново.

## Интеграция с Supabase

### Использование клиентской библиотеки Supabase

Для более тесной интеграции с Supabase можно использовать официальную JavaScript-библиотеку:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// Обновление сессии
const { data, error } = await supabase.auth.refreshSession()
```

### Настройка срока действия JWT

Срок действия access token (JWT) можно настроить в настройках проекта Supabase в разделе "JWT expiry limit". По умолчанию Supabase устанавливает срок действия JWT в 3600 секунд (1 час).

## Заключение

Механизм refresh token обеспечивает безопасную и удобную аутентификацию пользователей, позволяя им оставаться в системе длительное время без необходимости повторного ввода учетных данных. Интеграция с Supabase Auth упрощает реализацию этого механизма, предоставляя готовые решения для управления токенами и сессиями. 