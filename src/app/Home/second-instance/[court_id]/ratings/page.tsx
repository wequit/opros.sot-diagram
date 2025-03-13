"use client";

import { useParams } from "next/navigation";
import { useSurveyData } from "@/context/SurveyContext";
import { useEffect, useState } from "react";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";
import { getCookie } from "@/lib/api/login";

const CourtRatingPage = () => {
  const params = useParams();
  const courtId = params?.court_id as string;

  const {
    selectedCourtId,
    selectedCourtName,
    setSelectedCourtId,
    setSelectedCourtName,
    setSurveyData,
    setIsLoading,
    regionName,
    setRegionName
  } = useSurveyData();

  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourtData = async () => {
      // ... (существующий код)
  
      // Загружаем regionName из localStorage, если оно не определено в контексте
      const storedRegionName = localStorage.getItem("regionName");
      if (storedRegionName && !regionName) {
        setRegionName(storedRegionName);
      }
    };
  
    loadCourtData();
  }, [
    courtId,
    selectedCourtId,
    setSelectedCourtId,
    setSelectedCourtName,
    setSurveyData,
    setIsLoading,
    regionName,
    setRegionName,
  ]);

  const handleCourtBackClick = () => {
    setSelectedCourtId(null);
    setSelectedCourtName(null);
    setSurveyData(null);
    window.location.href = `/results/Home/second-instance/regions`;
  };

  const handleRegionBackClick = () => {
    setSelectedCourtId(null);
    setSelectedCourtName(null);
    setSurveyData(null);
    window.location.href = "/results/Home/second-instance/regions";
  };

  useEffect(() => {
    console.log("regionName",regionName)
    const loadCourtData = async () => {
      if (!courtId) {
        setError("ID суда не указан в URL");
        setIsDataLoading(false);
        return;
      }

      const storedCourtId = localStorage.getItem("selectedCourtId");
      const storedCourtName = localStorage.getItem("selectedCourtName");

      if (courtId === storedCourtId && storedCourtName && selectedCourtId) {
        setIsDataLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setIsDataLoading(true);

        const token = getCookie("access_token");
        if (!token) throw new Error("Token is null");

        const response = await fetch(
          `https://opros.sot.kg/api/v1/results/${courtId}/?year=2025`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const newCourtId = Number(courtId);
        const newCourtName = storedCourtName || data.court_name || "Неизвестный суд";

        setSelectedCourtId(newCourtId);
        setSelectedCourtName(newCourtName);
        setSurveyData(data);
        localStorage.setItem("selectedCourtId", courtId);
        localStorage.setItem("selectedCourtName", newCourtName);

        setError(null);
      } catch (error) {
        console.error("Ошибка при получении данных суда:", error);
        setError(error instanceof Error ? error.message : "Неизвестная ошибка");
        // Устанавливаем базовые данные, чтобы страница не была пустой
        if (courtId) {
          setSelectedCourtId(Number(courtId));
          setSelectedCourtName(storedCourtName || "Неизвестный суд (данные недоступны)");
          localStorage.setItem("selectedCourtId", courtId);
          localStorage.setItem("selectedCourtName", storedCourtName || "Неизвестный суд (данные недоступны)");
        }
      } finally {
        setIsLoading(false);
        setIsDataLoading(false);
      }
    };

    loadCourtData();
  }, [
    courtId,
    selectedCourtId,
    setSelectedCourtId,
    setSelectedCourtName,
    setSurveyData,
    setIsLoading,
  ]);

  if (isDataLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-8 max-w-[1250px] mx-auto px-4 py-4">
      <Breadcrumb
        regionName={regionName}
        courtName={selectedCourtName}
        onCourtBackClick={handleCourtBackClick}
        onRegionBackClick={handleRegionBackClick}
      />
      <h2 className="text-3xl font-bold mb-4 mt-4">{selectedCourtName}</h2>
      <div className="space-y-6">
        <Dates />
        <Evaluations selectedCourtId={selectedCourtId} />
      </div>
    </div>
  );
};

export default CourtRatingPage;