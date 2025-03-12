# Работа с эндпоинтом users/me

## Обзор

Эндпоинт `users/me` используется для получения информации о текущем авторизованном пользователе. Этот документ описывает процесс взаимодействия с данным эндпоинтом, включая аутентификацию, обработку запросов и отображение данных.

## Аутентификация

Эндпоинт требует аутентификации через заголовок `Authorization`. Токен аутентификации хранится в куках:

- Имя куки для токена аутентификации: `auth-token`
- Имя куки для refresh-токена: `refresh-token`

## Процесс работы с эндпоинтом

### 1. Бэкенд (FastAPI)

На стороне бэкенда эндпоинт реализован в файле `app/routes/user.py`:

```python
@user_router.get(
    "/me",
    response_model=UserInformationResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user data",
    description="Get current user data using access token from Authorization header",
)
def get_current_user(
    request: Request, supabase: Client = Depends(get_admin_client)
) -> UserInformationResponse:
    """
    Get current user data:
    - Extract token from Authorization header
    - Validate access token
    - Get user ID from token
    - Return user data
    """
    return UserServices.get_current_user_from_header(supabase=supabase, request=request)
```

Сервис `UserServices.get_current_user_from_header` выполняет следующие действия:
1. Извлекает токен из заголовка `Authorization`
2. Проверяет валидность токена
3. Получает ID пользователя из токена
4. Запрашивает данные пользователя из таблицы `users` в Supabase
5. Возвращает данные пользователя

### 2. Фронтенд (Next.js)

На стороне фронтенда взаимодействие с эндпоинтом происходит через API-клиент в `lib/api/user.ts`:

```typescript
export const userApi = {
  /**
   * Получение данных текущего пользователя
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const token = getAuthToken();
      if (!token) {
        return null;
      }

      const response = await fetch(`${API_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }
};
```

### 3. Управление токенами

Токены управляются через утилиты в `lib/utils/auth.ts`:

```typescript
// Получение токена аутентификации из куки
export const getAuthToken = (): string | null => {
  return cookies.get(TOKEN_NAME) || null;
};

// Установка токена аутентификации в куки
export const setAuthToken = (token: string): void => {
  cookies.set(TOKEN_NAME, token, {
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 дней
    sameSite: 'strict',
  });
};
```

### 4. Контекст авторизации

Данные пользователя загружаются и хранятся в контексте авторизации (`context/AuthContext.tsx`):

```typescript
// Проверка аутентификации при загрузке
useEffect(() => {
  const checkAuth = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Проверяем и обновляем токен при необходимости
      const isValid = await checkAndRefreshToken();
      if (isValid) {
        // Запрос на получение данных пользователя
        try {
          const userData = await userApi.getCurrentUser();
          if (userData) {
            setState(prev => ({ 
              ...prev, 
              user: userData,
              isAuthenticated: true, 
              isLoading: false,
              error: null
            }));
          }
        } catch (userError) {
          console.error('Error fetching user data:', userError);
        }
      }
    } catch (error) {
      // Обработка ошибок
    }
  };

  checkAuth();
}, []);
```

## Отображение данных пользователя

Данные пользователя можно получить в любом компоненте с помощью хука `useAuth`:

```typescript
import { useAuth } from '@/hooks/useAuth';

export function UserProfile() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    return <div>Пользователь не авторизован</div>;
  }

  return (
    <div>
      <h2>Профиль пользователя</h2>
      <p>Имя: {user.first_name}</p>
      <p>Фамилия: {user.last_name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

## Обработка CORS

Для корректной работы с CORS на бэкенде настроен middleware:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене лучше указать конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Схема данных

Ответ от эндпоинта соответствует схеме `UserInformationResponse`:

```typescript
interface UserInformationResponse {
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  team: string;
  position: string;
  category: string;
}
```

## Обработка ошибок

- **401 Unauthorized**: Невалидный или отсутствующий токен
- **404 Not Found**: Пользователь не найден
- **500 Internal Server Error**: Внутренняя ошибка сервера 