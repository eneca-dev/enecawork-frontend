/**
 * Утилиты для работы с токенами аутентификации
 */

import { Cookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';

const cookies = new Cookies();
const TOKEN_NAME = 'auth-token';
const REFRESH_TOKEN_NAME = 'refresh-token';

/**
 * Установка токена аутентификации
 */
export const setAuthToken = (token: string): void => {
  cookies.set(TOKEN_NAME, token, {
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 дней
    sameSite: 'strict',
  });
};

/**
 * Получение токена аутентификации
 */
export const getAuthToken = (): string | null => {
  return cookies.get(TOKEN_NAME) || null;
};

/**
 * Удаление токена аутентификации
 */
export const removeAuthToken = (): void => {
  cookies.remove(TOKEN_NAME, { path: '/' });
};

/**
 * Установка refresh токена
 */
export const setRefreshToken = (token: string): void => {
  cookies.set(REFRESH_TOKEN_NAME, token, {
    path: '/',
    maxAge: 60 * 24 * 60 * 60, // 60 дней
    sameSite: 'strict',
  });
};

/**
 * Получение refresh токена
 */
export const getRefreshToken = (): string | null => {
  return cookies.get(REFRESH_TOKEN_NAME) || null;
};

/**
 * Удаление refresh токена
 */
export const removeRefreshToken = (): void => {
  cookies.remove(REFRESH_TOKEN_NAME, { path: '/' });
};

/**
 * Проверка валидности токена
 */
export const isTokenValid = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

/**
 * Получение данных из токена
 */
export const getTokenData = (token: string): any => {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
}; 