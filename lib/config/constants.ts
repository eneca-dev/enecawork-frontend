/**
 * URL API сервера
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://enecawork-a6349fc0ebf0.herokuapp.com';

/**
 * Публичные маршруты, не требующие аутентификации
 */
export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/pending-verification',
  '/password-reset-sent',
];

/**
 * Маршруты аутентификации
 */
export const AUTH_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/pending-verification',
  '/password-reset-sent',
];

/**
 * Маршрут по умолчанию после успешной аутентификации
 */
export const DEFAULT_AUTH_REDIRECT = '/main';

/**
 * Маршрут по умолчанию для неаутентифицированных пользователей
 */
export const DEFAULT_UNAUTHENTICATED_REDIRECT = '/login'; 