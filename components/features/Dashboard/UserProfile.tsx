'use client';

import { useAuth } from '@/hooks/useAuth';

/**
 * Компонент для отображения данных пользователя
 */
export function UserProfile() {
  const { user, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Профиль пользователя</h2>
        <div className="text-gray-600">Загрузка данных пользователя...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Профиль пользователя</h2>
        <div className="text-red-500">Ошибка: {error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Профиль пользователя</h2>
        <div className="text-gray-600">Пользователь не авторизован</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Профиль пользователя</h2>
      <div className="mb-2">
        <span className="font-medium">Имя:</span> {user.first_name}
      </div>
      <div className="mb-2">
        <span className="font-medium">Фамилия:</span> {user.last_name}
      </div>
      <div className="mb-2">
        <span className="font-medium">Email:</span> {user.email}
      </div>
      <div className="mb-2">
        <span className="font-medium">Отдел:</span> {user.department}
      </div>
      <div className="mb-2">
        <span className="font-medium">Команда:</span> {user.team}
      </div>
      <div className="mb-2">
        <span className="font-medium">Должность:</span> {user.position}
      </div>
    </div>
  );
} 