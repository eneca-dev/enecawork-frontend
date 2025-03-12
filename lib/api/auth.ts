import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  ResetPasswordRequest,
  UpdatePasswordRequest,
  RefreshTokenRequest,
  RefreshTokenResponse
} from '@/types/auth.types';
import api from './axios';
import { API_URL } from '@/lib/config/constants';
import axios from 'axios';

/**
 * API для работы с аутентификацией
 */
export const authApi = {
  /**
   * Вход в систему
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    console.log('API login function called');
    try {
      console.log('Sending POST request to /auth/login');
      const response = await api.post('/auth/login', data);
      console.log('API login response received:', { status: response.status });
      return response.data;
    } catch (error) {
      console.error('Login API error details:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error response:', error.response?.data);
        console.error('Axios error status:', error.response?.status);
        console.error('Axios error headers:', error.response?.headers);
      }
      throw error;
    }
  },

  /**
   * Регистрация
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Выход из системы
   */
  logout: async (): Promise<void> => {
    // Для выхода из системы на клиенте достаточно удалить токены
    // Если на бэкенде есть эндпоинт для логаута, можно добавить запрос
    return Promise.resolve();
  },

  /**
   * Запрос на восстановление пароля
   */
  forgotPassword: async (email: string): Promise<void> => {
    // Имитация запроса к API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  },

  /**
   * Сброс пароля
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    try {
      await api.post('/auth/reset-password', data);
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  },

  /**
   * Обновление пароля
   */
  updatePassword: async (data: UpdatePasswordRequest): Promise<void> => {
    try {
      await api.post('/auth/update-password', data);
    } catch (error) {
      console.error('Password update error:', error);
      throw error;
    }
  },

  /**
   * Подтверждение email
   */
  verifyEmail: async (token: string): Promise<void> => {
    try {
      await api.post('/auth/verify-email', { token });
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  },

  /**
   * Запрос на сброс пароля
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Password reset request failed');
    }
  },

  /**
   * Обновление токена
   */
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
  },
}; 