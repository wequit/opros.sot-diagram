"use client";
import React from "react";
import "@/styles/globals.css";
import Header from "@/components/layout/Header";
import { Roboto } from "next/font/google";
import { AuthProvider, useAuth } from "@/lib/utils/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import dynamic from "next/dynamic";
import { SurveyProvider } from '@/lib/context/SurveyContext';

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin", "cyrillic"],
});

// Динамическое импортирование LoginPage
const LoginPage = dynamic(() => import("@/app/login/page"));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={roboto.className}>
      <body className="min-h-screen">
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

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="max-w-[1440px] mx-auto">
      <Header />
      <div className="flex min-h-[calc(100vh-48px)]">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}