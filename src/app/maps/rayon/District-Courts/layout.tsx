"use client";

import { SurveyProvider } from "@/context/SurveyContext";

export default function RegionalCourtsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SurveyProvider>
      <div>{children}</div>
    </SurveyProvider>
  );
}
