/**
 * Типы для аутентификации
 */

/**
 * Перечисление для команды
 */
export enum Team {
  GENERAL = "general",
}

/**
 * Перечисление для категории
 */
export enum Category {
  GENERAL = "general",
}

/**
 * Пользователь
 */
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  department: string;
  team: Team;
  position: string;
  category: Category;
}

/**
 * Состояние аутентификации
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Запрос на вход
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Ответ на вход
 */
export interface LoginResponse {
  email: string;
  access_token: string;
  refresh_token: string;
}

/**
 * Запрос на регистрацию
 */
export interface RegisterRequest {
  first_name: string;
  last_name: string;
  department: string;
  team: Team;
  position: string;
  category: Category;
  email: string;
  password: string;
  password_confirm: string;
}

/**
 * Ответ на регистрацию
 */
export interface RegisterResponse {
  first_name: string;
  last_name: string;
  department: string;
  team: Team;
  position: string;
  category: Category;
  email: string;
}

/**
 * Запрос на восстановление пароля
 */
export interface ResetPasswordRequest {
  email: string;
}

/**
 * Запрос на обновление пароля
 */
export interface UpdatePasswordRequest {
  access_token: string;
  refresh_token: string;
  password: string;
  password_confirm: string;
}

/**
 * Запрос на обновление токена
 */
export interface RefreshTokenRequest {
  refresh_token: string;
}

/**
 * Ответ на обновление токена
 */
export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
} 