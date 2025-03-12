'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';
import { UpdatePasswordRequest } from '@/types/auth.types';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Недействительный токен сброса пароля');
      return;
    }
    
    if (password !== passwordConfirm) {
      setError('Пароли не совпадают');
      return;
    }
    
    if (password.length < 8) {
      setError('Пароль должен содержать не менее 8 символов');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const updatePasswordData: UpdatePasswordRequest = {
        access_token: token,
        refresh_token: '',
        password: password,
        password_confirm: passwordConfirm
      };
      
      await authApi.updatePassword(updatePasswordData);
      
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError('Ошибка при сбросе пароля. Пожалуйста, попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Ошибка сброса пароля</h2>
        <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
          Отсутствует токен сброса пароля. Пожалуйста, убедитесь, что вы перешли по правильной ссылке из письма.
        </div>
        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Запросить новую ссылку для сброса пароля
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Сброс пароля</h2>
      
      {isSuccess ? (
        <div className="text-center">
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            Пароль успешно изменен. Вы будете перенаправлены на страницу входа.
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Новый пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              minLength={8}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">
              Подтверждение пароля
            </label>
            <input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
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
            {isLoading ? 'Обработка...' : 'Сбросить пароль'}
          </button>
        </form>
      )}
      
      <div className="mt-4 text-center">
        <Link href="/login" className="text-blue-600 hover:underline">
          Вернуться к входу
        </Link>
      </div>
    </div>
  );
}