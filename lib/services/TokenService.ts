/**
 * Сервис для управления токенами аутентификации
 */

import { jwtDecode } from 'jwt-decode';
import { authApi } from '@/lib/api/auth';
import { 
  getAuthToken, 
  setAuthToken, 
  getRefreshToken, 
  setRefreshToken, 
  removeAuthToken, 
  removeRefreshToken 
} from '@/lib/utils/auth';

/**
 * Класс для централизованного управления токенами
 */
export class TokenService {
  private isRefreshing = false;
  private refreshQueue: Array<(token: string) => void> = [];

  /**
   * Получение действующего токена или его обновление при необходимости
   */
  async getValidToken(): Promise<string | null> {
    const token = getAuthToken();
    
    // Если токен действителен и не требует обновления
    if (token && !this.shouldRefreshToken(token)) {
      return token;
    }
    
    // Если обновление уже идет, добавляем запрос в очередь
    if (this.isRefreshing) {
      return new Promise(resolve => {
        this.refreshQueue.push(resolve);
      });
    }
    
    return this.refreshTokenIfNeeded();
  }
  
  /**
   * Проверка и обновление токена при необходимости
   */
  async refreshTokenIfNeeded(): Promise<string | null> {
    const token = getAuthToken();
    
    // Если токен отсутствует или требует обновления
    if (!token || this.shouldRefreshToken(token)) {
      return this.refreshToken();
    }
    
    return token;
  }
  
  /**
   * Проверка необходимости обновления токена
   * (обновляем за 5 минут до истечения срока)
   */
  shouldRefreshToken(token: string): boolean {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      const expiresAt = decoded.exp * 1000; // в миллисекундах
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      return expiresAt - now < fiveMinutes;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // При ошибке декодирования считаем, что токен нужно обновить
    }
  }
  
  /**
   * Обновление токена
   */
  async refreshToken(): Promise<string | null> {
    this.isRefreshing = true;
    
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        this.handleRefreshError(new Error('No refresh token available'));
        return null;
      }
      
      const response = await authApi.refreshToken(refreshToken);
      const newAccessToken = response.access_token;
      
      setAuthToken(newAccessToken);
      setRefreshToken(response.refresh_token);
      
      // Выполняем все отложенные запросы с новым токеном
      this.refreshQueue.forEach(resolve => resolve(newAccessToken));
      
      // Настраиваем автоматическое обновление перед истечением срока
      this.setupSilentRefresh(newAccessToken);
      
      return newAccessToken;
    } catch (error) {
      this.handleRefreshError(error);
      return null;
    } finally {
      this.isRefreshing = false;
      this.refreshQueue = [];
    }
  }
  
  /**
   * Настройка "тихого обновления" токена
   */
  setupSilentRefresh(token: string): void {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      const expiresAt = decoded.exp * 1000;
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;
      
      // Планируем обновление за 5 минут до истечения срока
      const refreshDelay = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0);
      
      setTimeout(() => {
        this.refreshToken()
          .catch(error => console.error('Silent refresh failed:', error));
      }, refreshDelay);
    } catch (error) {
      console.error('Error setting up silent refresh:', error);
    }
  }
  
  /**
   * Обработка ошибок обновления токена
   */
  handleRefreshError(error: any): void {
    console.error('Token refresh error:', error);
    
    // Очищаем токены
    removeAuthToken();
    removeRefreshToken();
    
    // Перенаправляем на страницу входа
    window.location.href = '/login';
  }
  
  /**
   * Проверка валидности токена
   */
  isTokenValid(token: string): boolean {
    if (!token) return false;
    
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  }
}

// Создаем экземпляр сервиса для использования в приложении
export const tokenService = new TokenService(); 