import { Suspense } from 'react';
import { DashboardContent } from './components/DashboardContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Панель управления | Eneca Work',
  description: 'Панель управления Eneca Work',
};

/**
 * Страница дашборда
 * Отображает информацию о пользователе
 */
export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8">Загрузка...</div>}>
      <DashboardContent />
    </Suspense>
  );
} 