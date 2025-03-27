"use client";

import Header from "@/components/layout/Header";
import { SurveyProvider } from "@/context/SurveyContext";
import "@/styles/responsive/responsiveRemarks.css";

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