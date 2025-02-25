"use client";
import React, { useEffect } from "react";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";
import { getCookie } from "@/api/login";
import { useSurveyData } from "@/context/SurveyContext";
import SkeletonDashboard from "@/lib/utils/SkeletonLoader/SkeletonLoader";

export default function GeneralPageContent() {
  const { setSurveyData, setIsLoading, isLoading } = useSurveyData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie('access_token');
        if (!token) {
          throw new Error("Token is null");
        }
        
        const response = await fetch("https://opros.sot.kg/api/v1/results/65/?year=2025", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error("Ошибка при получении данных");
        }
        
        const data = await response.json();
        setSurveyData(data); 
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setSurveyData, setIsLoading]);

  if (isLoading) {
    return (
      <div className="mt-4">
       <Dates />
       <SkeletonDashboard/>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Dates />
      <Evaluations />
    </div>
  );
}1