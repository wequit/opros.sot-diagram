"use client";
import React from "react";
import dynamic from "next/dynamic";
import { useSurveyData } from "@/context/SurveyContext";
import SkeletonDashboard from "@/lib/utils/SkeletonLoader/SkeletonLoader";
import CourtDataFetcher from "@/lib/api/CourtAPI"; 

export default function GeneralPageContent() {
  const { isLoading } = useSurveyData();
  const Dates = dynamic(() => import("@/components/Dates/Dates"), { ssr: false });
  const Evaluations = dynamic(() => import("@/components/Evaluations/page"), { ssr: false });

  return (
    <div className="mt-4">
      <Dates />
      <CourtDataFetcher /> {/* По умолчанию используется courtId = "65" */}
      {isLoading ? <SkeletonDashboard /> : <Evaluations />}
    </div>
  );
}