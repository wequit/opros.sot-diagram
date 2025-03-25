"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getTranslation, useSurveyData } from "@/context/SurveyContext";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";
import { useAuth } from "@/context/AuthContext";
import { getCookie } from "@/lib/api/login";

const SecondInstanceDashboard = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useSurveyData();
  const [currentView, setCurrentView] = useState<'summary' | 'ratings' | 'court'>('summary');
  const { user } = useAuth();
  const [userRegion, setUserRegion] = useState<string | null>(null);
  const [regionalCourtId, setRegionalCourtId] = useState<number | null>(null);

  const fetchRegionalCourtId = async (regionName: string) => {
    try {
      const response = await fetch(
        `https://opros.sot.kg/api/v1/courts/region/${encodeURIComponent(regionName)}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch courts");
      
      const data = await response.json();
      // Находим областной суд
      const regionalCourt = data.courts.find((court: any) => 
        court.name.includes("областной суд")
      );
      if (regionalCourt) {
        setRegionalCourtId(regionalCourt.id);
      }
    } catch (error) {
      console.error("Error fetching regional court:", error);
    }
  };

  useEffect(() => {
    if (user?.role === "Председатель 2 инстанции") {
      const regionName = user.court.split(" ")[0];
      setUserRegion(regionName);
      fetchRegionalCourtId(regionName);
    }
  }, [user]);

  useEffect(() => {
    if (pathname.includes('/summary')) {
      setCurrentView('summary');
    } else if (pathname.includes('/ratings')) {
      setCurrentView('ratings');
      // Исправляем путь перенаправления
      router.push('/results/Home/summary/ratings');
    } else if (pathname.includes('/court/')) {
      setCurrentView('court');
    }
  }, [pathname]);

  const renderContent = () => {
    switch (currentView) {
      case 'summary':
        return (
          <div className="space-y-6">
            <Breadcrumb
              regionName={userRegion || ""}
              showHome={false}
            />
            <Dates />
            <Evaluations 
              selectedCourtId={null}
              courtNameId={userRegion}
            />
          </div>
        );

      case 'court':
        return (
          <div className="space-y-6">
            <Breadcrumb
              regionName={userRegion || ""}
              showHome={false}
            />
            <Dates />
            <Evaluations 
              selectedCourtId={regionalCourtId}
              courtNameId={userRegion}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {renderContent()}
    </div>
  );
};

export default SecondInstanceDashboard; 