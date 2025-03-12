import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { removeAuthToken, removeRefreshToken } from '@/lib/utils/auth';
import { API_URL } from '@/lib/config/constants';
import { tokenService } from '@/lib/services/TokenService';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен к каждому запросу
api.interceptors.request.use(
  async (config) => {
    // Получаем действующий токен перед каждым запросом
    const token = await tokenService.getValidToken();
    
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
        // Принудительно обновляем токен
        const newToken = await tokenService.refreshToken();
        
        if (newToken) {
          // Повторяем оригинальный запрос с новым токеном
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Ошибка уже обработана в tokenService
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 