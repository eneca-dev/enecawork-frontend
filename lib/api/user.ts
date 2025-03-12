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
      
      // Проверяем, что ответ содержит необходимые данные
      if (response.data && response.data.id) {
        return {
          id: response.data.id,
          email: response.data.email,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          department: response.data.department,
          team: response.data.team,
          position: response.data.position,
          category: response.data.category
        };
      }
      
      console.error('Invalid user data format:', response.data);
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Возвращаем null вместо выбрасывания исключения
      return null;
    }
  }
}; 