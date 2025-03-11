import { RegisterForm } from '@/components/features/Auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Регистрация | Eneca Work',
  description: 'Регистрация в системе Eneca Work',
};

/**
 * Страница регистрации
 */
export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center">
      <RegisterForm />
    </div>
  );
} 