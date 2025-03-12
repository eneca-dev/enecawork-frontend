/**
 * URL API сервера
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://enecawork-a6349fc0ebf0.herokuapp.com';

/**
 * Публичные маршруты, не требующие аутентификации
 */
export const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/pending-verification',
  '/auth/password-reset-sent',
];

/**
 * Маршруты аутентификации
 */
export const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/pending-verification',
  '/auth/password-reset-sent',
];

/**
 * Маршрут по умолчанию после успешной аутентификации
 */
export const DEFAULT_AUTH_REDIRECT = '/dashboard/main';

/**
 * Маршрут по умолчанию для неаутентифицированных пользователей
 */
export const DEFAULT_UNAUTHENTICATED_REDIRECT = '/auth/login'; 