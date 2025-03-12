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

// Список публичных эндпоинтов, которые не требуют токена
const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
  '/auth/update-password'
];

// Добавляем токен к каждому запросу
api.interceptors.request.use(
  async (config) => {
    console.log('Axios request interceptor:', { 
      url: config.url, 
      method: config.method,
      baseURL: config.baseURL
    });
    
    // Проверяем, является ли эндпоинт публичным
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => 
      config.url?.includes(endpoint)
    );
    
    if (isPublicEndpoint) {
      console.log('Public endpoint, no auth token needed');
      return config;
    }
    
    // Получаем действующий токен перед каждым запросом для защищенных эндпоинтов
    const token = await tokenService.getValidToken();
    
    if (token) {
      console.log('Adding auth token to request');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No auth token available');
    }
    
    return config;
  },
  (error) => {
    console.error('Axios request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Обрабатываем ошибки и обновляем токен при необходимости
api.interceptors.response.use(
  (response) => {
    console.log('Axios response interceptor:', { 
      status: response.status, 
      url: response.config.url 
    });
    return response;
  },
  async (error: AxiosError) => {
    console.error('Axios response interceptor error:', { 
      message: error.message,
      status: error.response?.status,
      url: error.config?.url
    });
    
    // Проверяем, что ошибка связана с ответом сервера
    if (!error.response) {
      console.error('No response from server');
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