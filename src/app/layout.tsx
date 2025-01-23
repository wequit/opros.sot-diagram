// src/app/layout.tsx
import React from "react";
import "@/styles/globals.css";
import { Roboto } from "next/font/google";
import { AuthProvider } from "@/lib/utils/AuthContext";
import { AuthContent } from "@/components/layout/AuthContent";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin", "cyrillic"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={roboto.className}>
      <body className="min-h-screen">
        <AuthProvider>
          <AuthContent>{children}</AuthContent>
        </AuthProvider>
      </body>
    </html>
  );
}