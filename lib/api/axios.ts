import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getAuthToken, setAuthToken, getRefreshToken, setRefreshToken, removeAuthToken, removeRefreshToken } from '@/lib/utils/auth';
import { API_URL } from '@/lib/config/constants';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен к каждому запросу
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Обрабатываем ошибки и обновляем токен при необходимости
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Проверяем, что ошибка связана с ответом сервера
    if (!error.response) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Если ошибка 401 (Unauthorized) и запрос не был повторен
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          // Если нет refresh токена, выходим из системы
          removeAuthToken();
          removeRefreshToken();
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Запрос на обновление токена
        const response = await fetch(`${API_URL}/auth/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        
        if (!response.ok) {
          // Если не удалось обновить токен, выходим из системы
          removeAuthToken();
          removeRefreshToken();
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        const data = await response.json();
        setAuthToken(data.access_token);
        if (data.refresh_token) {
          setRefreshToken(data.refresh_token);
        }
        
        // Повторяем оригинальный запрос с новым токеном
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        }
        return axios(originalRequest);
      } catch (refreshError) {
        // В случае ошибки выходим из системы
        removeAuthToken();
        removeRefreshToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 