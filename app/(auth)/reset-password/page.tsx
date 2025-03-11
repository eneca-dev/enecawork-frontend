import { ResetPasswordForm } from '@/components/features/Auth/ResetPasswordForm';
import { Metadata } from 'next';

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
      <ResetPasswordForm />
    </div>
  );
} 