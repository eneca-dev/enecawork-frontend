'use client';

import { LoginForm } from '@/components/features/Auth/LoginForm';
import { Suspense } from 'react';

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