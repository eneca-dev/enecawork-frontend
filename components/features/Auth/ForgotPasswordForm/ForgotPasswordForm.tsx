'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await authApi.forgotPassword(email);
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/password-reset-sent');
      }, 1500);
    } catch (err) {
      setError('Не удалось отправить инструкции по восстановлению пароля. Пожалуйста, проверьте email и попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Восстановление пароля</h2>
      
      {success ? (
        <div className="p-3 bg-green-100 text-green-700 rounded-md mb-4">
          Инструкции по восстановлению пароля отправлены на ваш email.
        </div>
      ) : (
        <>
          <p className="mb-4 text-gray-600">
            Введите ваш email, и мы отправим вам инструкции по восстановлению пароля.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Отправка...' : 'Отправить инструкции'}
            </button>
          </form>
        </>
      )}
      
      <div className="mt-4 text-center">
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Вернуться к входу
        </Link>
      </div>
    </div>
  );
} 