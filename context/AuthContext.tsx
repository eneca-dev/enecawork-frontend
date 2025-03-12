'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthState, LoginRequest, RegisterRequest, Team, Category } from '@/types/auth.types';
import { authApi } from '@/lib/api/auth';
import { userApi } from '@/lib/api/user';
import { setAuthToken, removeAuthToken, getAuthToken, setRefreshToken, getRefreshToken, removeRefreshToken, isTokenValid } from '@/lib/utils/auth';
import { DEFAULT_AUTH_REDIRECT } from '@/lib/config/constants';

/**
 * Интерфейс контекста аутентификации
 */
interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAndRefreshToken: () => Promise<boolean>;
}

/**
 * Создание контекста аутентификации
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Провайдер контекста аутентификации
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  /**
   * Проверка и обновление токена
   */
  const checkAndRefreshToken = async (): Promise<boolean> => {
    try {
      const token = getAuthToken();
      if (!token) {
        return false;
      }

      // Проверяем валидность токена
      if (isTokenValid(token)) {
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
          // Здесь добавляем запрос на получение данных пользователя
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
            } else {
              // Если данные пользователя не получены, но токен валиден
              // Устанавливаем флаг аутентификации, но не устанавливаем данные пользователя
              console.warn('User data not available, but token is valid');
              setState(prev => ({ 
                ...prev, 
                isAuthenticated: true, 
                isLoading: false,
                error: 'Не удалось загрузить данные пользователя'
              }));
            }
          } catch (userError) {
            console.error('Error fetching user data:', userError);
            setState(prev => ({ 
              ...prev, 
              isAuthenticated: true, 
              isLoading: false,
              error: 'Ошибка при получении данных пользователя'
            }));
          }
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        removeAuthToken();
        removeRefreshToken();
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Ошибка аутентификации',
        });
      }
    };

    checkAuth();
  }, []);

  /**
   * Вход в систему
   */
  const login = async (data: LoginRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authApi.login(data);
      setAuthToken(response.access_token);
      setRefreshToken(response.refresh_token);
      
      // Получаем данные пользователя с сервера
      try {
        const userData = await userApi.getCurrentUser();
        if (userData) {
          setState({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          // Если API не вернул данные пользователя, создаем базовый объект
          // и устанавливаем ошибку
          setState({
            user: null,
            isAuthenticated: true,
            isLoading: false,
            error: 'Не удалось загрузить данные пользователя',
          });
          console.error('Failed to fetch user data after login');
        }
      } catch (userError) {
        console.error('Error fetching user data:', userError);
        // Устанавливаем флаг аутентификации, но не устанавливаем данные пользователя
        setState({
          user: null,
          isAuthenticated: true,
          isLoading: false,
          error: 'Ошибка при получении данных пользователя',
        });
      }
      
      router.push(DEFAULT_AUTH_REDIRECT);
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Ошибка входа. Проверьте email и пароль.',
      }));
      throw error;
    }
  };

  /**
   * Регистрация
   */
  const register = async (data: RegisterRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authApi.register(data);
      
      // После успешной регистрации перенаправляем на страницу входа
      // или на страницу подтверждения email
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }));
      router.push('/auth/login');
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Ошибка регистрации. Попробуйте еще раз.',
      }));
      throw error;
    }
  };

  /**
   * Выход из системы
   */
  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeAuthToken();
      removeRefreshToken();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      router.push('/auth/login');
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    checkAndRefreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Хук для использования контекста аутентификации
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 