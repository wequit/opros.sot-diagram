// src/app/layout.tsx
import React from 'react';
import './globals.css';
import Header from '@/components/Header';
import Link from 'next/link';
import { Roboto, Inter } from 'next/font/google';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
});

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata = {
  title: 'Судебная оценка',
  description: 'Система оценки деятельности районного суда',
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
  <Link 
    href={href} 
    className="py-2 px-4 text-left bg-white rounded-md mb-2 hover:bg-gray-50 transition-colors duration-200 font-medium"
  >
    {children}
  </Link>
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.className}>
      <body className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="flex min-h-[calc(100vh-48px)]">
          <aside className="w-56 bg-green-50 p-4 shadow-sm">
            <nav className="flex flex-col gap-2">
              <NavLink href="/">Оценки</NavLink>
              <NavLink href="/suggestions">Замечания и предложения</NavLink>
            </nav>
          </aside>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
