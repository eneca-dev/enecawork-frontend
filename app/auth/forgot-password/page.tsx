import { ForgotPasswordForm } from '@/components/features/Auth/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Восстановление пароля | Eneca Work',
  description: 'Восстановление пароля в системе Eneca Work',
};

/**
 * Страница восстановления пароля
 */
export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center">
      <ForgotPasswordForm />
    </div>
  );
} 