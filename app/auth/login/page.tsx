import { LoginForm } from '@/components/features/Auth/LoginForm';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Вход | Eneca Work',
  description: 'Вход в систему Eneca Work',
};

/**
 * Страница входа
 */
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center">
      <Suspense fallback={<div className="text-center p-4">Загрузка...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
} 