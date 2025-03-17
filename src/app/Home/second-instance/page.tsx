"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/api/login";
import { getAssessmentData } from "@/lib/api/login";
import CourtTableLayout from "@/lib/utils/CourtTable/CourtTableRegion";

interface CourtData {
  court_id: number;
  court: string;
  overall_assessment: number;
  total_survey_responses: number;
  assessment: { aspect: string; court_avg: number }[];
}

interface OblastData {
  id: number;
  name: string;
  ratings: number[];
  coordinates: [number, number];
  overall: number;
  totalAssessments: number;
  courtId: number;
}

export default function SecondInstancePage() {
  const [regionCourts, setRegionCourts] = useState<CourtData[]>([]);
  const [oblastData, setOblastData] = useState<OblastData[]>([]); // Данные для карты
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie("access_token");
        if (!token) throw new Error("Token is null");

        // Загружаем данные для карты (одинаковые для обеих страниц)
        const assessmentData = await getAssessmentData();
        const processedRegions = assessmentData.regions.map((region: any) => ({
          id: region.region_id,
          name: region.region_name,
          overall: region.overall_region_assessment,
          totalAssessments: region.total_assessments,
          coordinates: [0, 0], // Замените на реальные координаты
          courtId: region.region_id,
          ratings: [
            region.average_scores["Судья"] || 0,
            region.average_scores["Сотрудники"] || 0,
            region.average_scores["Процесс"] || 0,
            region.average_scores["Канцелярия"] || 0,
            region.average_scores["Здание"] || 0,
          ],
        }));
        setOblastData(processedRegions);

        // Загружаем данные для таблицы судов
        const response = await fetch("https://opros.sot.kg:443/api/v1/assessment/region_courts/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          if (response.status === 401) router.push("/login");
          throw new Error(`Ошибка: ${response.status}`);
        }
        const data = await response.json();
        setRegionCourts(data);
      } catch (error) {
        console.error("Ошибка:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [router]);

  return <CourtTableLayout tableData={regionCourts} oblastData={oblastData} isLoading={isLoading} activeTab="courts" />;
}