'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

/**
 * Клиентский компонент для отображения содержимого дашборда
 */
export function DashboardContent() {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Панель управления</h1>
      
      {isLoading ? (
        <div className="flex justify-center">
          <p className="text-xl">Загрузка данных...</p>
        </div>
      ) : isAuthenticated && user ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            Информация о пользователе
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-b pb-2">
              <span className="font-medium">ID:</span> {user.id}
            </div>
            
            <div className="border-b pb-2">
              <span className="font-medium">Email:</span> {user.email}
            </div>
            
            {user.first_name && (
              <div className="border-b pb-2">
                <span className="font-medium">Имя:</span> {user.first_name}
              </div>
            )}
            
            {user.last_name && (
              <div className="border-b pb-2">
                <span className="font-medium">Фамилия:</span> {user.last_name}
              </div>
            )}
            
            {user.department_id && (
              <div className="border-b pb-2">
                <span className="font-medium">ID отдела:</span> {user.department_id}
              </div>
            )}
            
            {user.position_id && (
              <div className="border-b pb-2">
                <span className="font-medium">ID должности:</span> {user.position_id}
              </div>
            )}
            
            {user.team_id && (
              <div className="border-b pb-2">
                <span className="font-medium">ID команды:</span> {user.team_id}
              </div>
            )}
            
            {user.category_id && (
              <div className="border-b pb-2">
                <span className="font-medium">ID категории:</span> {user.category_id}
              </div>
            )}
            
            {user.created_at && (
              <div className="border-b pb-2">
                <span className="font-medium">Дата создания:</span> {user.created_at}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-xl mb-4">Пожалуйста, войдите в систему для просмотра данных</p>
          {error && (
            <p className="text-red-500">{error}</p>
          )}
        </div>
      )}
    </div>
  );
} 