import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Главная | Eneca Work',
  description: 'Главная страница Eneca Work',
};

/**
 * Главная страница дашборда
 */
export default function MainPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Добро пожаловать в Eneca Work</h1>
      <p className="text-gray-600 mb-4">
        Это главная страница дашборда. Здесь будет отображаться основная информация.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Задачи</h2>
          <p className="text-gray-600">Здесь будут отображаться ваши текущие задачи.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Проекты</h2>
          <p className="text-gray-600">Здесь будут отображаться ваши текущие проекты.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Статистика</h2>
          <p className="text-gray-600">Здесь будет отображаться ваша статистика.</p>
        </div>
      </div>
    </div>
  );
} 