"use client";
import React, { useEffect } from "react";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";
import { getCookie } from "@/lib/api/login";
import { useSurveyData } from "@/context/SurveyContext";
import { usePathname } from "next/navigation";
import SkeletonDashboard from "@/lib/utils/SkeletonLoader/SkeletonLoader";
import {
  getCircleCourtData,
  getRadarCourtData,
  getBarCourtData,
  getProgressCourtData,
  getColumnCourtData,
  getCircleRepublicData,
  getRadarRepublicData,
  getBarRepublicData,
  getProgressRepublicData,
  getColumnRepublicData,
} from "@/lib/api/charts";

export default function GeneralPageContent() {
  const { setSurveyData, setIsLoading, isLoading } = useSurveyData();
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie("access_token");
        if (!token) {
          throw new Error("Token is null");
        }

        let circleData, radarData, barData, progressData, columnData;

        // Проверяем, начинается ли путь с /Home/supreme-court/ratings
        const isSupremeCourtRatings = pathname.startsWith("/Home/supreme-court/ratings");

        if (isSupremeCourtRatings) {
          // Для Верховного суда используем фиксированный courtId (например, "1")
          const supremeCourtId = "1"; // Замените на актуальный courtId Верховного суда
          circleData = await getCircleCourtData(supremeCourtId);
          radarData = await getRadarCourtData(supremeCourtId);
          barData = await getBarCourtData(supremeCourtId);
          progressData = await getProgressCourtData(supremeCourtId);
          columnData = await getColumnCourtData(supremeCourtId);
        } else {
          // В остальных случаях запрашиваем республиканские данные
          circleData = await getCircleRepublicData();
          radarData = await getRadarRepublicData();
          barData = await getBarRepublicData();
          progressData = await getProgressRepublicData();
          columnData = await getColumnRepublicData();
        }

        // Формируем объект surveyData
        const surveyData = {
          circle: circleData,
          radar: radarData,
          bar: barData,
          progress: progressData,
          column: columnData,
        };

        setSurveyData(surveyData);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setSurveyData, setIsLoading, pathname]); // Зависимость от pathname

  if (isLoading) {
    return (
      <div className="mt-4">
        <Dates />
        <SkeletonDashboard />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Dates />
      <Evaluations />
    </div>
  );
}