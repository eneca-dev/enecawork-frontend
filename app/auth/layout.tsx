'use client';

import React from 'react';

/**
 * Макет для страниц аутентификации
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Eneca Work</h1>
              <p className="text-gray-600">Платформа для эффективной работы</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 