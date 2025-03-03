"use client";

import Header from "@/components/layout/Header";
import { SurveyProvider } from "@/context/SurveyContext";
import "@/styles/responsiveRemarks.css"; // Только этот файл будет влиять на компонент

export default function RegionalCourtsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="regional-courts-wrapper">
      <SurveyProvider>
        <Header />
        <div>{children}</div>
      </SurveyProvider>
    </div>
  );
}