import api from './axios';
import { User } from '@/types/auth.types';

export const userApi = {
  /**
   * Получение данных текущего пользователя
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      // Токен будет автоматически добавлен в заголовки через axiosInstance
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Возвращаем null вместо выбрасывания исключения
      return null;
    }
  }
}; 