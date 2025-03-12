'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

/**
 * Клиентский компонент для отображения профиля пользователя на главной странице
 */
export function HomeUserProfile() {
  // Используем хук useAuth для получения данных пользователя
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Состояние для отображения ошибки загрузки данных пользователя
  const [error, setError] = useState<string | null>(null);
  
  // Эффект для обработки ошибок при загрузке данных пользователя
  useEffect(() => {
    if (isAuthenticated && !user) {
      setError('Не удалось загрузить данные пользователя');
    } else {
      setError(null);
    }
  }, [isAuthenticated, user]);

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Eneca Work</h1>
      
      {isLoading ? (
        <p className="text-xl mb-8">Загрузка...</p>
      ) : isAuthenticated && user ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            Привет, {user.first_name || user.email}!
          </h2>
          
          {user.last_name && (
            <p className="mb-2">Фамилия: {user.last_name}</p>
          )}
          
          {user.department_id && (
            <p className="mb-2">ID отдела: {user.department_id}</p>
          )}
          
          {user.position_id && (
            <p className="mb-2">ID должности: {user.position_id}</p>
          )}
          
          {user.team_id && (
            <p className="mb-2">ID команды: {user.team_id}</p>
          )}
          
          {user.category_id && (
            <p className="mb-2">ID категории: {user.category_id}</p>
          )}
        </div>
      ) : (
        <div>
          <p className="text-xl mb-4">Пожалуйста, войдите в систему</p>
          {error && (
            <p className="text-red-500">{error}</p>
          )}
        </div>
      )}
    </div>
  );
} 