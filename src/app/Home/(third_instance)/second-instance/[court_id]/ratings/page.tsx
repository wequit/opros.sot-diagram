"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";
import { SurveyData, useSurveyData } from "@/context/SurveyContext";
import CourtDataFetcher from "@/lib/api/CourtAPI"; // Импортируем новый компонент

const CourtRatingPage = () => {
  const params = useParams();
  const courtId = params?.court_id as string;

  const {
    selectedCourtId,
    selectedCourtName,
    setSelectedCourtId,
    setSelectedCourtName,
    setSurveyData,
    regionName,
    setRegionName,
    isLoading,
  } = useSurveyData();

  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const loadCourtData = async () => {
      const storedRegionName = localStorage.getItem("regionName");
      if (storedRegionName && !regionName) {
        setRegionName(storedRegionName);
      }

      if (!courtId) {
        setIsDataLoading(false);
        return;
      }

      const storedCourtId = localStorage.getItem("selectedCourtId");
      const storedCourtName = localStorage.getItem("selectedCourtName");

      if (courtId === storedCourtId && storedCourtName && selectedCourtId) {
        setIsDataLoading(false);
        return;
      }

      // Устанавливаем courtId и courtName после загрузки данных в CourtDataFetcher
      setSelectedCourtId(Number(courtId));
      setSelectedCourtName(storedCourtName || "Неизвестный суд");
      localStorage.setItem("selectedCourtId", courtId);
      localStorage.setItem("selectedCourtName", storedCourtName || "Неизвестный суд");

      setIsDataLoading(false);
    };

    loadCourtData();
  }, [courtId, regionName, setRegionName, setSelectedCourtId, setSelectedCourtName]);

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
        <CourtDataFetcher courtId={courtId} /> {/* Передаем динамический courtId */}
        {isLoading ? <div>Loading data...</div> : <Evaluations selectedCourtId={selectedCourtId} />}
      </div>
    </div>
  );
};

export default CourtRatingPage;