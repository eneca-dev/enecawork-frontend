'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from '@/lib/config/constants';

/**
 * Хук для защиты маршрутов, требующих аутентификации
 * @param redirectPath Путь для перенаправления неавторизованных пользователей
 */
export const useAuthProtection = (redirectPath = DEFAULT_UNAUTHENTICATED_REDIRECT) => {
  const { isAuthenticated, isLoading, checkAndRefreshToken } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoading) {
        return;
      }

      if (!isAuthenticated) {
        // Если пользователь не авторизован, перенаправляем на страницу входа
        router.push(redirectPath);
        return;
      }

      // Проверяем и обновляем токен при необходимости
      const isValid = await checkAndRefreshToken();
      if (!isValid) {
        // Если токен невалиден и не удалось его обновить, перенаправляем на страницу входа
        router.push(redirectPath);
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, isLoading, router, redirectPath, checkAndRefreshToken]);

  return { isChecking };
};

export default useAuthProtection; 