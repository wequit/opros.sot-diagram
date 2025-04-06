"use client";
import { useParams } from "next/navigation";
import { getTranslation, useSurveyData } from "@/context/SurveyContext";
import { useEffect, useState } from "react";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";
import CourtDataFetcher from "@/lib/api/CourtAPI"; // Импортируем новый компонент

const CourtRatingPage = () => {
  const params = useParams();
  const courtId = params?.courtId as string; // Используем courtId из маршрута

  const {
    courtName,
    setCourtName,
    courtNameId,
    setCourtNameId,
    setIsLoading,
    language,
    surveyData,
  } = useSurveyData();

  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBackClick = () => {
    window.history.back(); // Возвращаемся на предыдущую страницу
  };

  useEffect(() => {
    const loadCourtMetadata = async () => {
      if (!courtId) {
        setError("ID суда не указан в URL");
        setIsDataLoading(false);
        return;
      }

      const storedCourtName = localStorage.getItem("courtName") || courtName;
      const storedCourtId = localStorage.getItem("courtNameId") || courtId;

      if (storedCourtId === courtId && storedCourtName && courtNameId) {
        setIsDataLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setIsDataLoading(true);

        // Данные уже загружаются через CourtDataFetcher, но мы можем использовать surveyData для получения имени суда
        const newCourtName = storedCourtName || surveyData?.radar?.court || "Неизвестный суд";

        setCourtName(newCourtName);
        setCourtNameId(courtId);
        localStorage.setItem("courtNameId", courtId);
        localStorage.setItem("courtName", newCourtName);
        localStorage.setItem("selectedCourtName", newCourtName);

        setError(null);
      } catch (error) {
        console.error("Ошибка при установке метаданных суда:", error);
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

    loadCourtMetadata();
  }, [
    courtId,
    courtName,
    setCourtName,
    courtNameId,
    setCourtNameId,
    setIsLoading,
    surveyData,
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
      <CourtDataFetcher courtId={courtId} /> {/* Передаем динамический courtId */}
      <Evaluations courtNameId={courtNameId} />
    </div>
  );
};

export default CourtRatingPage;