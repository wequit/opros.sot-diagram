"use client";

import { useParams, useRouter } from "next/navigation";
import { getTranslation, useSurveyData } from "@/context/SurveyContext";
import { useEffect, useState } from "react";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";
import { getCookie } from "@/lib/api/login";
import SkeletonLoader from "@/lib/utils/SkeletonLoader/SkeletonLoader";

const CourtDetailsPage = () => {
  const params = useParams();
  const courtId = params?.courtId as string;
  const router = useRouter();

  const {
    setCourtName,
    setCourtNameId,
    setSurveyData,
    setIsLoading,
    language,
  } = useSurveyData();

  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courtName, setLocalCourtName] = useState<string>("");
  const [userRegion, setUserRegion] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("https://opros.sot.kg/api/v1/current_user/", {
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        });
        const data = await response.json();
        
        if (data.role === "Председатель 2 инстанции") {
          const regionName = getRegionFromCourt(data.court);
          setUserRegion(regionName);
        }
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const getRegionFromCourt = (courtName: string): string => {
    const regionMap: { [key: string]: string } = {
      "Таласский областной суд": "Таласская область",
      "Иссык-кульский областной суд": "Иссык-Кульская область",
      "Нарынский областной суд": "Нарынская область",
      "Баткенский областной суд": "Баткенская область",
      "Чуйский областной суд": "Чуйская область",
      "Ошский областной суд": "Ошская область",
      "Жалал-Абадский областной суд": "Жалал-Абадская область",
      "Бишкекский городской суд": "Бишкек",
    };
    return regionMap[courtName] || "";
  };

  useEffect(() => {
    const loadCourtData = async () => {
      if (!courtId) {
        setError("ID суда не указан в URL");
        setIsDataLoading(false);
        return;
      }

      // Сохраняем ID суда в localStorage
      localStorage.setItem("selectedCourtId", courtId);
      
      try {
        setIsLoading(true);
        setIsDataLoading(true);

        const token = getCookie("access_token");
        if (!token) throw new Error("Токен не найден");

        console.log(`Запрос к API: https://opros.sot.kg/api/v1/results/${courtId}/?year=2025`);

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
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();
        setSurveyData(data);
        setCourtNameId(courtId);
        
        // Если в данных есть название суда, сохраняем его
        if (data.court_name) {
          setLocalCourtName(data.court_name);
          setCourtName(data.court_name);
          localStorage.setItem("selectedCourtName", data.court_name);
        }

        setError(null);
      } catch (error) {
        console.error("Ошибка при получении данных суда:", error);
        setError(error instanceof Error ? error.message : "Неизвестная ошибка");
      } finally {
        setIsLoading(false);
        setIsDataLoading(false);
      }
    };

    loadCourtData();
  }, [courtId, setCourtName, setCourtNameId, setSurveyData, setIsLoading, router]);

  const handleBackClick = () => {
    router.back();
  };

  if (isDataLoading) {
    return (
      <div className="max-w-[1250px] mx-auto px-4 py-4">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1250px] mx-auto px-4 py-4">
        <Breadcrumb
          regionName={userRegion || "Оценки по области"}
          courtName={courtName || "Ошибка"}
          onCourtBackClick={handleBackClick}
          showHome={true}
        />
        <h2 className="text-3xl font-bold mb-4 mt-4">{courtName || "Ошибка"}</h2>
        <div className="text-red-500">Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1250px] mx-auto px-4 py-4">
      <Breadcrumb
        regionName={userRegion || "Оценки по области"}
        courtName={courtName}
        onCourtBackClick={handleBackClick}
        showHome={true}
      />
      <h2 className="text-3xl font-bold mb-4 mt-4">{courtName}</h2>
      <Dates />
      <Evaluations courtNameId={courtId} />
    </div>
  );
};

export default CourtDetailsPage; 