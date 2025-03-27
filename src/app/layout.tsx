"use client";
import React, { useEffect } from "react";
import "@/styles/globals.css";
import "@/styles/skeleton.css";
import "@/styles/map.css";
import "@/styles/spinner.css";
import "@/styles/responsive/responsive.css";
import Header from "@/components/layout/Header";
import { Inter } from "next/font/google";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SurveyProvider, useSurveyData } from "@/context/SurveyContext";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

const LoginPage = dynamic(() => import("@/app/login/page"));


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable}`}>
      <body className="min-h-screen slate-100 font-inter">
        <SurveyProvider>
          <AuthProvider>
            <div className="root-layout-wrapper">
              <AuthContent>{children}</AuthContent>
            </div>
          </AuthProvider>
        </SurveyProvider>
      </body>
    </html>
  );
}

function AuthContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { language } = isAuthenticated ? useSurveyData() : { language: "ru" };
  const pathname = usePathname();
  const router = useRouter();

  // Редирект после входа только с /results/login
  useEffect(() => {
    if (isAuthenticated && pathname === "/results/login") {
      router.push("/Home/summary/ratings");
    }
  }, [isAuthenticated, pathname, router]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  

  // Страница логина только если не авторизован и путь явно /results/login
  if (!isAuthenticated && pathname === "/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoginPage />
      </div>
    );
  }

  const isRemarksPath = pathname.startsWith("/results/remarks/");

  if (isRemarksPath) {
    return (
      <div className="w-full">
        <div className="flex min-h-[calc(100vh-48px)] mt-0">
          <main className="flex-1 w-full">{children}</main>
        </div>
      </div>
    );
  }

  // Основная разметка для всех остальных случаев
  return (
    <div className="max-w-[1250px] mx-auto layout">
      <Header />
      <div className="flex min-h-[calc(100vh-48px)] mt-16">
        <main className="flex-1 max-w-[1250px] mx-auto">{children}</main>
      </div>
    </div>
  );
}