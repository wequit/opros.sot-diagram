"use client";

import React, { useEffect, useState } from "react";
import Evaluations from "@/components/Evaluations/page";
import Dates from "@/components/Dates/Dates";
import { getCookie, getAssessmentData } from "@/lib/api/login";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";
import { useRouter } from "next/navigation";
import SkeletonLoader from "@/lib/utils/SkeletonLoader/SkeletonLoader";

export default function SecondInstanceSummaryPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRegion, setUserRegion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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
          const regionName = getRegionFromCourt(data.court);
          setUserRegion(regionName);
        }
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const getRegionFromCourt = (courtName: string): string => {
    const regionMap: { [key: string]: string } = {
      "Таласский областной суд": "Таласская область",
      "Иссык-Кульский областной суд": "Иссык-Кульская область",
      "Нарынский областной суд": "Нарынская область",
      "Баткенский областной суд": "Баткенская область",
      "Чуйский областной суд": "Чуйская область",
      "Ошский областной суд": "Ошская область",
      "Жалал-Абадский областной суд": "Жалал-Абадская область",
      "Бишкекский городской суд": "Город Бишкек",
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
          showHome={true}
          regionName={userRegion || "Общий свод"}
          headerKey="BreadCrumb_RegionName"
          onRegionBackClick={() => router.push('/Home/first_instance/ratings')}
        />
      </div>
      <Dates />
      <Evaluations />
    </div>
  );
}