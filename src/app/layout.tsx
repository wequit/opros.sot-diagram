"use client";
import React from "react";
import "@/styles/globals.css";
import Header from "@/components/layout/Header";
import {  Inter } from "next/font/google";
import { AuthProvider, useAuth } from "@/lib/utils/AuthContext";
// import Sidebar from "@/components/layout/Sidebar";
import { SurveyProvider } from '@/lib/context/SurveyContext';
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

// Динамическое импортирование LoginPage
const LoginPage = dynamic(() => import("@/app/login/page"));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable}`}>
      <body className="min-h-screen slate-100 font-inter">
        <SurveyProvider>
          <AuthProvider>
            <AuthContent>{children}</AuthContent>
          </AuthProvider>
        </SurveyProvider>
      </body>
    </html>
  );
}

function AuthContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <LoginPage />
      </div>
    );
  }

  // Определяем класс для main в зависимости от пути
  const mainClassName = pathname === '/login' ? 'flex-1' : 'flex-1 p-6';

  // Показываем Header и Sidebar только если пользователь авторизован
  return (
    <div className="max-w-[1450px] mx-auto">
      <Header />
      <div className="flex min-h-[calc(100vh-48px)]">
        {/* <Sidebar /> */}
        <main className={`${mainClassName} `}>{children}</main>
      </div>
    </div>
  );
}