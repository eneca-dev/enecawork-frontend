'use client';

import { useAuth as useAuthContext } from '@/context/AuthContext';

/**
 * Хук для работы с аутентификацией
 * 
 * Реэкспортирует контекст аутентификации для удобства использования
 */
export const useAuth = () => {
  return useAuthContext();
}; 