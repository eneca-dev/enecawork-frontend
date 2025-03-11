'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import AuthGuard from '@/components/common/AuthGuard';

/**
 * Макет для страниц дашборда
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGuard
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Загрузка...</p>
            </div>
          </div>
        }
      >
        <div className="min-h-screen bg-gray-100">
          <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Eneca Work</h1>
                <nav>
                  {/* Здесь будет компонент навигации */}
                </nav>
              </div>
            </div>
          </header>
          
          <div className="container mx-auto px-4 py-8">
            <div className="flex">
              <aside className="w-64 mr-8">
                {/* Здесь будет компонент боковой панели */}
              </aside>
              
              <main className="flex-1">
                {children}
              </main>
            </div>
          </div>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
} 