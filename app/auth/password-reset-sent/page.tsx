import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Инструкции отправлены | Eneca Work',
  description: 'Инструкции по восстановлению пароля отправлены',
};

/**
 * Страница подтверждения отправки инструкций по восстановлению пароля
 */
export default function PasswordResetSentPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Инструкции отправлены</h2>
      
      <div className="mb-6 text-center">
        <p className="mb-4 text-gray-600">
          Инструкции по восстановлению пароля были отправлены на указанный email.
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