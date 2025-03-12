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
          department_id: response.data.department_id,
          team_id: response.data.team_id,
          position_id: response.data.position_id,
          category_id: response.data.category_id,
          created_at: response.data.created_at
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