// src/app/layout.tsx
import React from 'react';
import './globals.css';
import Header from '@/components/Header'; // Импортируем Header
import Link from 'next/link';

export const metadata = {
  title: 'Судебная оценка',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gray-100">
        {/* Header */}
        <Header />

        {/* Sidebar + Content */}
        <div className="flex">
          {/* Sidebar */}
          <aside className="bg-green-100 w-48 flex flex-col p-2">
            <Link href="/" className="py-2 px-4 text-left bg-white rounded mb-2 hover:bg-gray-200">
              Оценки
            </Link>
            <a
              href="/suggestions"
              className="py-2 px-4 text-left bg-white rounded hover:bg-gray-200">
              Замечания и предложения
            </a>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-gray-50 p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
