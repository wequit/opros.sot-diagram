"use client";
import React, { useEffect } from "react";
import "@/styles/globals.css";
import "@/styles/skeleton.css";
import "@/styles/map.css";
import "@/styles/spinner.css";
import Header from "@/components/layout/Header";
import { Inter } from "next/font/google";
import { AuthProvider, useAuth } from "@/lib/utils/AuthContext";
import { SurveyProvider, useSurveyData } from "@/context/SurveyContext";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

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
            <AuthContent>{children}</AuthContent>
          </AuthProvider>
        </SurveyProvider>
      </body>
    </html>
  );
}

function AuthContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { language } = useSurveyData();
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <LoginPage />
      </div>
    );
  }

  const mainClassName = pathname === "/login" ? "flex-1" : "flex-1 p-6";

  return (
    <div className="max-w-[1450px] mx-auto">
      <Header />
      <div className={`flex min-h-[calc(100vh-48px)] ${pathname === "/login" ? "mt-0" : "mt-16"}`}>
        <main className={`${mainClassName}`}>{children}</main>
      </div>
    </div>
  );
}
