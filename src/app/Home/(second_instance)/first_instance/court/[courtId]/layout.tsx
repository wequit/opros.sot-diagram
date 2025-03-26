"use client";

import Header from "@/components/layout/Header";
import { SurveyProvider } from "@/context/SurveyContext";

export default function CourtLayout({ children }: { children: React.ReactNode }) {
  return (
    <SurveyProvider>
      <Header />
      <div>{children}</div>
    </SurveyProvider>
  );
} 