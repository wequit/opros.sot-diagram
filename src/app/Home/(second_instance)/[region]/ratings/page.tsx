"use client";

import React, { useEffect, useState } from "react";
import { getCookie } from "@/lib/api/login";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";
import { useSurveyData } from "@/context/SurveyContext";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";
import SkeletonLoader from "@/lib/utils/SkeletonLoader/SkeletonLoader";

export default function RegionalCourtPage() {
  const { setCourtName, setSurveyData, setIsLoading } = useSurveyData();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [regionName, setRegionName] = useState("");
  const params = useParams();
  const region = params?.region as string;
  const router = useRouter();
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("https://opros.sot.kg/api/v1/current_user/", {
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        });
        const data = await response.json();
        setCurrentUser(data);
        
        if (data.role === "Председатель 2 инстанции") {
          const courtName = data.court;
          const regionSlug = getRegionSlug(courtName);
          
          // Проверяем, соответствует ли текущий регион пользователя запрошенному URL
          if (regionSlug !== region) {
            router.push(`/Home/${regionSlug}/ratings`);
            return;
          }
          
          setCourtName(courtName);
          await fetchResults(getCourtId(courtName));
        } else {
          // Перенаправляем, если у пользователя нет прав
          router.push('/Home/summary/ratings');
        }
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [region, router, setCourtName]);

  const fetchResults = async (courtId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://opros.sot.kg/api/v1/results/${courtId}/?year=2025`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка получения результатов");
      }

      const results = await response.json();
      setSurveyData(results);
    } catch (error) {
      console.error("Ошибка при получении результатов:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRegionSlug = (courtName: string): string => {
    const regionMap: { [key: string]: string } = {
      "Таласский областной суд": "Talas",
      "Иссык-кульский областной суд": "Issyk-Kyl",
      "Нарынский областной суд": "Naryn",
      "Баткенский областной суд": "Batken",
      "Чуйский областной суд": "Chyi",
      "Ошский областной суд": "Osh",
      "Жалал-Абадский областной суд": "Djalal-Abad",
      "Бишкекский городской суд": "Bishkek",
    };

    return regionMap[courtName] || "court-id";
  };

  const getCourtId = (courtName: string): number => {
    const courtIdMap: { [key: string]: number } = {
      "Таласский областной суд": 46,
      "Иссык-кульский областной суд": 13,
      "Нарынский областной суд": 24,
      "Баткенский областной суд": 6,
      "Чуйский областной суд": 50,
      "Ошский областной суд": 35,
      "Жалал-Абадский областной суд": 19,
      "Бишкекский городской суд": 11,
    };

    return courtIdMap[courtName] || 0;
  };

  const getRegionFromCourt = (courtName: string): string => {
    const regionMap: { [key: string]: string } = {
      "Таласский областной суд": "Таласская область",
      "Иссык-кульский областной суд": "Иссык-Кульская область",
      "Нарынский областной суд": "Нарынская область",
      "Баткенский областной суд": "Баткенская область",
      "Чуйский областной суд": "Чуйская область",
      "Ошский областной суд": "Ошская область",
      "Жалал-Абадский областной суд": "Жалал-Абадская область",
      "Бишкекский городской суд": "город Бишкек",
    };
    return regionMap[courtName] || "";
  };

  if (loading) {
    return (
      <div className="max-w-[1250px] mx-auto px-4 py-4">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="max-w-[1250px] mx-auto px-4 py-4">
      <div className="mb-4">
        <Breadcrumb 
          courtName={currentUser?.court}
          showHome={true}
          headerKey="BreadCrumb_RegionName"
          onRegionBackClick={() => router.push('/Home/first_instance/ratings')}
        />
      </div>
      <Dates />
      <Evaluations />
    </div>
  );
} 