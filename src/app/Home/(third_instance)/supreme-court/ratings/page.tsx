"use client";
import React from "react";
import dynamic from "next/dynamic";
import SkeletonDashboard from "@/lib/utils/SkeletonLoader/SkeletonLoader";
import CourtDataFetcher from "@/lib/api/CourtAPI"; 
import { useChartData } from "@/context/ChartDataContext";

const Dates = dynamic(() => import("@/components/Dates/Dates"), { ssr: false });
const Evaluations = dynamic(() => import("@/components/Evaluations/page"), { ssr: false });

export default function GeneralPageContent() {
  const { isLoading } = useChartData();

  return (
    <div className="mt-4">
      <Dates />
      <CourtDataFetcher /> 
      {isLoading ? <SkeletonDashboard /> : <Evaluations />}
    </div>
  );
}