import { Suspense } from 'react';
import { UserProfile } from './components/UserProfile';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eneca Work',
  description: 'Платформа для эффективной работы',
};

/**
 * Главная страница
 * Будет перенаправлена middleware в зависимости от статуса аутентификации
 */
export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Suspense fallback={<div className="text-center p-4">Загрузка...</div>}>
        <UserProfile />
      </Suspense>
    </div>
  );
} 