"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";
import { getCookie } from "@/lib/api/login";
import { SurveyData, useSurveyData } from "@/context/SurveyContext";
import {
  getRadarCourtData,
  getCircleCourtData,
  getBarCourtData,
  getProgressCourtData,
  getColumnCourtData,
} from "@/lib/api/charts";

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
    setRegionName,
  } = useSurveyData();

  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourtData = async () => {
      const storedRegionName = localStorage.getItem("regionName");
      if (storedRegionName && !regionName) {
        setRegionName(storedRegionName);
      }
    };

    loadCourtData();
  }, [courtId, regionName, setRegionName]);

  useEffect(() => {
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

        // Загружаем данные радара
        const radarResponse = await getRadarCourtData(courtId);
        if (!radarResponse.ok) {
          throw new Error(`Radar HTTP error: ${radarResponse.status} ${radarResponse.statusText}`);
        }
        const radarData = await radarResponse.json();

        // Загружаем данные круговых диаграмм
        const circleResponse = await getCircleCourtData(courtId);
        if (!circleResponse.ok) {
          throw new Error(`Circle HTTP error: ${circleResponse.status} ${circleResponse.statusText}`);
        }
        const circleData = await circleResponse.json();

        // Загружаем данные столбчатых диаграмм
        const barResponse = await getBarCourtData(courtId);
        if (!barResponse.ok) {
          throw new Error(`Bar HTTP error: ${barResponse.status} ${barResponse.statusText}`);
        }
        const barData = await barResponse.json();

        // Загружаем данные прогресса
        const progressResponse = await getProgressCourtData(courtId);
        if (!progressResponse.ok) {
          throw new Error(`Progress HTTP error: ${progressResponse.status} ${progressResponse.statusText}`);
        }
        const progressData = await progressResponse.json();

        // Загружаем данные колонн (DisrespectChart)
        const columnResponse = await getColumnCourtData(courtId);
        if (!columnResponse.ok) {
          throw new Error(`Column HTTP error: ${columnResponse.status} ${columnResponse.statusText}`);
        }
        const columnData = await columnResponse.json();

        const newCourtId = Number(courtId);
        const newCourtName = storedCourtName || radarData.court_name || "Неизвестный суд";

        // Объединяем данные для передачи в контекст
        const combinedData: SurveyData = {
          radar: radarData,
          circle: circleData,
          bar: barData,
          progress: progressData,
          column: columnData,
        };
        setSurveyData(combinedData);

        setSelectedCourtId(newCourtId);
        setSelectedCourtName(newCourtName);
        localStorage.setItem("selectedCourtId", courtId);
        localStorage.setItem("selectedCourtName", newCourtName);

        setError(null);
      } catch (error) {
        console.error("Ошибка при получении данных суда:", error);
        setError(error instanceof Error ? error.message : "Неизвестная ошибка");
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

  const breadcrumbSource = localStorage.getItem("breadcrumbSource");
  const headerKey = breadcrumbSource === "courts" ? "BreadCrumb_CourtName" : "BreadCrumb_RegionName";

  return (
    <div className="mt-8 max-w-[1250px] mx-auto px-4 py-4">
      <Breadcrumb
        regionName={regionName}
        courtName={selectedCourtName}
        onCourtBackClick={() => {
          setSelectedCourtId(null);
          setSelectedCourtName(null);
          setSurveyData(null);
          window.location.href = `/results/Home/second-instance/regions`;
        }}
        onRegionBackClick={() => {
          setSelectedCourtId(null);
          setSelectedCourtName(null);
          setSurveyData(null);
          window.location.href = "/results/Home/second-instance/regions";
        }}
        headerKey={headerKey}
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