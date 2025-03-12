import { ResetPasswordForm } from '@/components/features/Auth/ResetPasswordForm';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Сброс пароля | Eneca Work',
  description: 'Сброс пароля в системе Eneca Work',
};

/**
 * Страница сброса пароля
 */
export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center">
      <Suspense fallback={<div className="text-center p-4">Загрузка...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
} 