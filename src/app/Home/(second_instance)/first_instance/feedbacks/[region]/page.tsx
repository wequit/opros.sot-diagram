"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCookie } from "@/lib/api/login";
import { getTranslation, useSurveyData } from "@/context/SurveyContext";
import Dates from "@/components/Dates/Dates";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";
import RemarksPage from "@/lib/utils/remarksLogic/RemarksLogic";
import SkeletonLoader from "@/lib/utils/SkeletonLoader/SkeletonLoader";

export default function RegionFeedbacksPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [regionName, setRegionName] = useState("");
  const params = useParams();
  const regionSlug = params?.region as string;
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
          const userRegionName = getRegionFromCourt(data.court);
          const userRegionSlug = getRegionSlugFromName(userRegionName);
          
          // Перенаправление, если пользователь пытается просмотреть замечания не своего региона
          if (userRegionSlug !== regionSlug) {
            router.push(`/Home/first_instance/feedbacks/${userRegionSlug}`);
            return;
          }
          
          setRegionName(userRegionName);
          
          // Очищаем предыдущие настройки в localStorage
          localStorage.removeItem("selectedCourtId");
          localStorage.removeItem("selectedCourtName");
          
          // Устанавливаем режим просмотра как "регион"
          localStorage.setItem("currentRegion", userRegionName);
          localStorage.setItem("regionSlug", regionSlug);
          localStorage.setItem("viewMode", "region");
        } else {
          // Перенаправить, если нет прав
          router.push('/Home/summary/ratings');
        }
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [regionSlug, router]);

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

  const getRegionSlugFromName = (regionName: string): string => {
    const slugMap: { [key: string]: string } = {
      "Таласская область": "Talas",
      "Иссык-Кульская область": "Issyk-Kyl",
      "Нарынская область": "Naryn",
      "Баткенская область": "Batken",
      "Чуйская область": "Chyi",
      "Ошская область": "Osh",
      "Жалал-Абадская область": "Djalal-Abad",
      "город Бишкек": "Bishkek",
    };
    return slugMap[regionName] || "";
  };

  if (loading) {
    return (
      <div className="max-w-[1250px] mx-auto px-4 py-4">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="max-w-[1250px] mx-auto px-4 py-4 pb-10">
      <div className="flex flex-col">
        <div className="mt-4">
          <RemarksPage />
        </div>
      </div>
    </div>
  );
} 