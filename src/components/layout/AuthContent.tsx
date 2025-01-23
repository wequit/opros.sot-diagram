'use client';
import { useAuth } from "@/lib/utils/AuthContext";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

// Динамическое импортирование LoginPage
const LoginPage = dynamic(() => import("@/app/login/page"));

export function AuthContent({ children }: { children: React.ReactNode }) {
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