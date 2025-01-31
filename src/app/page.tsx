"use client";
import React, { useEffect, useState } from "react";
import EvaluationQuestions from "@/app/Evaluations/page";
import Dates from "@/lib/utils/Dates";
import DataFetcher from "@/components/DataFetcher";
import { useAuth } from "@/lib/utils/AuthContext";
import SecondInstance from "@/components/roles/2 instance";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      
      {user?.role !== "Председатель 2 инстанции" ? (
        <>
          <Dates />
          <DataFetcher />
          <EvaluationQuestions />
        </>
      ) : (
        <SecondInstance />
      )}
    </div>
  );
}
