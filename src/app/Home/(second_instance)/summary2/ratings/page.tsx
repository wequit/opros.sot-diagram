"use client";

import React from "react";
import Evaluations from "@/components/Evaluations/page";
import Dates from "@/components/Dates/Dates";

export default function ThirdInstancePage() {
  // Здесь просто импортируем и отображаем существующий компонент Evaluations
  return (
    <div className="max-w-[1250px] mx-auto px-4 py-4">
      <Dates />
      <Evaluations />
    </div>
  );
}