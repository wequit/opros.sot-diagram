"use client";

import { useParams } from "next/navigation";
import { getTranslation, useSurveyData } from "@/context/SurveyContext";
import { useEffect, useState } from "react";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";
import { getCookie } from "@/lib/api/login";

const CourtRatingPage = () => {
  const params = useParams();
  const courtId = params?.courtId as string; // Используем courtId вместо court_id для соответствия маршруту

  const {
    courtName,
    setCourtName,
    courtNameId,
    setCourtNameId,
    setSurveyData,
    setIsLoading,
    language,
  } = useSurveyData();

  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = getCookie("access_token");

  const handleBackClick = () => {
    window.history.back(); // Возвращаемся на предыдущую страницу
  };

  useEffect(() => {
    const loadCourtData = async () => {
      if (!courtId) {
        setError("ID суда не указан в URL");
        setIsDataLoading(false);
        return;
      }

      // Загружаем данные из localStorage, если они есть
      const storedCourtName = localStorage.getItem("courtName") || courtName;
      const storedCourtId = localStorage.getItem("courtNameId") || courtId;

      if (storedCourtId === courtId && storedCourtName && courtNameId) {
        setIsDataLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setIsDataLoading(true);

        if (!token) throw new Error("Token is null");

        const response = await fetch(
          `https://opros.sot.kg/api/v1/results/${courtId}/?year=2025`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const newCourtName = storedCourtName || data.court || "Неизвестный суд";

        setCourtName(newCourtName);
        setCourtNameId(courtId);
        setSurveyData(data);
        localStorage.setItem("courtNameId", courtId);
        localStorage.setItem("courtName", newCourtName);
        localStorage.setItem("selectedCourtName", newCourtName);

        setError(null);
      } catch (error) {
        console.error("Ошибка при получении данных суда:", error);
        setError(error instanceof Error ? error.message : "Неизвестная ошибка");
        if (courtId) {
          setCourtNameId(courtId);
          setCourtName(storedCourtName || "Неизвестный суд (данные недоступны)");
          localStorage.setItem("courtNameId", courtId);
          localStorage.setItem("courtName", storedCourtName || "Неизвестный суд (данные недоступны)");
        }
      } finally {
        setIsLoading(false);
        setIsDataLoading(false);
      }
    };

    loadCourtData();
  }, [
    courtId,
    courtName,
    setCourtName,
    courtNameId,
    setCourtNameId,
    setSurveyData,
    setIsLoading,
  ]);

  if (isDataLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-3 mt-4">
        <Breadcrumb
          regionName={getTranslation("HeaderNavFour", language)}
          courtName={courtName}
          onCourtBackClick={handleBackClick}
          showHome={false}
        />
        <h2 className="text-3xl font-bold mb-4 mt-4 DistrictEvaluationsCourtName">{courtName || "Ошибка"}</h2>
        <div className="text-red-500">Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-3 mt-4">
      <Breadcrumb
        regionName={getTranslation("HeaderNavFour", language)}
        courtName={courtName}
        onCourtBackClick={handleBackClick}
        showHome={false}
      />
      <h2 className="text-3xl font-bold mb-4 mt-4 DistrictEvaluationsCourtName">{courtName}</h2>
      <Dates />
      <Evaluations courtNameId={courtNameId} />
    </div>
  );
};

export default CourtRatingPage;