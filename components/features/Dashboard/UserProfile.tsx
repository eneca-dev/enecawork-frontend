'use client';

import { useAuth } from '@/hooks/useAuth';

/**
 * Компонент для отображения данных пользователя в дашборде
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
        <span className="font-medium">ID:</span> {user.id}
      </div>
      <div className="mb-2">
        <span className="font-medium">Email:</span> {user.email}
      </div>
      {user.first_name && (
        <div className="mb-2">
          <span className="font-medium">Имя:</span> {user.first_name}
        </div>
      )}
      {user.last_name && (
        <div className="mb-2">
          <span className="font-medium">Фамилия:</span> {user.last_name}
        </div>
      )}
      {user.department_id && (
        <div className="mb-2">
          <span className="font-medium">ID отдела:</span> {user.department_id}
        </div>
      )}
      {user.team_id && (
        <div className="mb-2">
          <span className="font-medium">ID команды:</span> {user.team_id}
        </div>
      )}
      {user.position_id && (
        <div className="mb-2">
          <span className="font-medium">ID должности:</span> {user.position_id}
        </div>
      )}
      {user.category_id && (
        <div className="mb-2">
          <span className="font-medium">ID категории:</span> {user.category_id}
        </div>
      )}
      {user.created_at && (
        <div className="mb-2">
          <span className="font-medium">Дата создания:</span> {user.created_at}
        </div>
      )}
    </div>
  );
} 