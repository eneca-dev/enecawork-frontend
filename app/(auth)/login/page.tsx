import { LoginForm } from '@/components/features/Auth/LoginForm';
import { Metadata } from 'next';

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
      <LoginForm />
    </div>
  );
} 