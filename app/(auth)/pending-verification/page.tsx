import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ожидание подтверждения | Eneca Work',
  description: 'Ожидание подтверждения регистрации',
};

/**
 * Страница ожидания подтверждения регистрации
 */
export default function PendingVerificationPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Подтвердите ваш email</h2>
      
      <div className="mb-6 text-center">
        <p className="mb-4 text-gray-600">
          Мы отправили письмо с инструкциями по подтверждению вашего аккаунта.
        </p>
        <p className="text-gray-600">
          Пожалуйста, проверьте вашу почту и следуйте инструкциям в письме.
        </p>
      </div>
      
      <div className="mt-4 text-center">
        <Link href="/login" className="text-blue-600 hover:underline">
          Вернуться к входу
        </Link>
      </div>
    </div>
  );
} 