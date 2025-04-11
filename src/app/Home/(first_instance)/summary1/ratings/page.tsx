"use client";

import React from "react";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";
import CourtApi from "@/lib/api/CourtAPI";
import { useAuth } from "@/context/AuthContext";

export default function SecondInstanceSummaryPage() {
  const { user } = useAuth();

  if (!user || !user.court_id) {
    return (
      <div className="max-w-[1250px] mx-auto px-4 py-4">
        <Dates />
        <Evaluations />
        <div className="text-gray-500">Загрузка данных суда...</div>
      </div>
    );
  }

  const courtId = user.court_id; // Теперь court_id типизирован
  const court = user.court;

  return (
    <div className="max-w-[1250px] mx-auto px-4 py-4">
      <h2 className="font-bold text-3xl font-sans mb-4">{court}</h2>
      <Dates />
      <CourtApi courtId={courtId} />
      <Evaluations />
    </div>
  );
}