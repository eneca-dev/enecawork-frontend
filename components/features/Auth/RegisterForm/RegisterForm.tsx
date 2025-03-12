'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { RegisterFormData, RegisterRequest, Team, Category } from '@/types/auth.types';

export function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    first_name: '',
    last_name: '',
    department: '',
    team: Team.GENERAL,
    position: '',
    category: Category.GENERAL,
    email: '',
    password: '',
    password_confirm: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const { register, isLoading, error } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirm) {
      setPasswordError('Пароли не совпадают');
      return;
    }
    
    setPasswordError('');
    
    try {
      const requestData: RegisterRequest = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        department: formData.department,
        team: formData.team,
        position: formData.position,
        category: formData.category,
        email: formData.email,
        password: formData.password
      };
      
      await register(requestData);
      // Перенаправление произойдет в AuthContext
    } catch (err) {
      // Ошибка уже обрабатывается в AuthContext
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Регистрация</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
            Имя
          </label>
          <input
            id="first_name"
            type="text"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
            Фамилия
          </label>
          <input
            id="last_name"
            type="text"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Отдел
          </label>
          <input
            id="department"
            type="text"
            value={formData.department}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
            Должность
          </label>
          <input
            id="position"
            type="text"
            value={formData.position}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700 mb-1">
            Подтверждение пароля
          </label>
          <input
            id="password_confirm"
            type="password"
            value={formData.password_confirm}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
          {passwordError && (
            <p className="mt-1 text-sm text-red-600">{passwordError}</p>
          )}
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
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Уже есть аккаунт? Войти
        </Link>
      </div>
    </div>
  );
} 