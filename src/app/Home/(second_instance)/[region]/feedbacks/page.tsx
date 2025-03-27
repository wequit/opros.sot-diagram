"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCookie } from "@/lib/api/login";
import { getTranslation, useSurveyData } from "@/context/SurveyContext";
import Dates from "@/components/Dates/Dates";
import RemarksPage from "@/lib/utils/remarksLogic/RemarksLogic";

export default function RegionalCourtFeedbacksPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const region = params?.region as string;
  const router = useRouter();
  const { language } = useSurveyData();
  
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
            router.push(`/Home/${regionSlug}/feedbacks`);
            return;
          }
          
          // Очищаем предыдущие настройки режима отображения
          localStorage.removeItem("regionSlug");
          
          // Сохраняем данные в localStorage для использования в RemarksApi
          localStorage.setItem("currentRegion", getRegionFromCourt(courtName));
          localStorage.setItem("courtName2", courtName);
          localStorage.setItem("viewMode", "court");
          localStorage.setItem("courtId", getCourtId(courtName).toString());
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
  }, [region, router]);

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
  
  const getRegionFromCourt = (courtName: string): string => {
    const regionMap: { [key: string]: string } = {
      "Таласский областной суд": "Таласская область",
      "Иссык-кульский областной суд": "Иссык-Кульская область",
      "Нарынский областной суд": "Нарынская область",
      "Баткенский областной суд": "Баткенская область",
      "Чуйский областной суд": "Чуйская область",
      "Ошский областной суд": "Ошская область",
      "Жалал-Абадский областной суд": "Жалал-Абадская область",
      "Бишкекский городской суд": "Город Бишкек",
    };
    return regionMap[courtName] || "";
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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  }

  return (
    <div className="max-w-[1250px] mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold mb-4">{getTranslation("RemarksLogic_Remarks", language)}</h1>
      <Dates />
      <RemarksPage />
    </div>
  );
} 