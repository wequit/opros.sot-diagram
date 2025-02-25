"use client";
import Map from "../components/Map_oblast";
import { useState, useEffect } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getAssessmentData, getCookie } from "@/api/login";
import { useSurveyData } from "@/context/SurveyContext";
import RegionDetails from "../components/RegionDetails";

type SortDirection = "asc" | "desc" | null;
type SortField =
  | "overall"
  | "judge"
  | "process"
  | "staff"
  | "office"
  | "accessibility"
  | "count"
  | null;

interface OblastData {
  id: number;
  name: string;
  ratings: number[];
  coordinates: [number, number];
  overall: number;
  totalAssessments: number;
  courtId: number;
}

interface Region {
  region_id: number;
  region_name: string;
  average_scores: { [key: string]: number };
  overall_region_assessment: number;
  total_assessments: number;
}

// Добавляем функцию для определения цвета фона ячейки
const getRatingColor = (rating: number) => {
  if (rating === 0) return 'bg-gray-100';
  if (rating <= 2) return 'bg-red-100';
  if (rating <= 3.5) return 'bg-yellow-100';
  return 'bg-green-100';
};

export default function RegionalCourts() {
  const [regions, setRegions] = useState<OblastData[]>([]);
  const [regionName, setRegionName] = useState<string | null>(null);
  const { selectedRegion, setSelectedRegion } = useSurveyData();

  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie("access_token");
        if (!token) throw new Error("Token is null");
        const data = await getAssessmentData();
        const processedRegions = data.regions.map((region: Region) => ({
          id: region.region_id,
          name: region.region_name,
          overall: region.overall_region_assessment,
          totalAssessments: region.total_assessments,
          coordinates: [0, 0],
          courtId: region.region_id,
          ratings: [
            region.average_scores["Судья"] || 0,
            region.average_scores["Сотрудники"] || 0,
            region.average_scores["Процесс"] || 0,
            region.average_scores["Канцелярия"] || 0,
            region.average_scores["Здание"] || 0,
          ],
        }));
        setRegions(processedRegions);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
          ? null
          : "asc"
      );
      if (sortDirection === "desc") {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <FaSort className="ml-1 inline-block" />;
    if (sortDirection === "asc")
      return <FaSortUp className="ml-1 inline-block text-blue-600" />;
    return <FaSortDown className="ml-1 inline-block text-blue-600" />;
  };

  const sortedData = [...regions].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;
    let aValue: number, bValue: number;
    switch (sortField) {
      case "judge":
        aValue = a.ratings[0]; // Судья
        bValue = b.ratings[0];
        break;
      case "staff":
        aValue = a.ratings[1]; // Сотрудники
        bValue = b.ratings[1];
        break;
      case "process":
        aValue = a.ratings[2]; // Процесс
        bValue = b.ratings[2];
        break;
      case "office":
        aValue = a.ratings[3]; // Канцелярия
        bValue = b.ratings[3];
        break;
      case "accessibility":
        aValue = a.ratings[4]; // Здание
        bValue = b.ratings[4];
        break;
      case "count":
        aValue = a.totalAssessments;
        bValue = b.totalAssessments;
        break;
      case "overall":
        aValue = a.overall;
        bValue = b.overall;
        break;
      default:
        return 0;
    }
    return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
  });

  const handleCourtClick = async (court: OblastData) => {
    try {
      const token = getCookie("access_token");
      if (!token) throw new Error("Token is null");
  
      const response = await fetch(
        `https://opros.sot.kg/api/v1/assessment/region/${court.id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 401) {
        console.warn("Токен устарел, выполняем выход...");
        router.push("/login");
        return;
      }
  
      if (!response.ok) {
        router.push("/login");
        throw new Error(`Ошибка TP: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
  
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Данные по региону отсутствуют или неверного формата.");
      }
  
      // Маппируем данные
      const updatedRegions = data.map((courtData: any) => ({
        id: courtData.court_id,
        name: courtData.court,
        overall: courtData.overall_assessment,
        ratings: courtData.assessment.map((item: any) => item.court_avg),
        totalAssessments: courtData.total_survey_responses,
        coordinates: [courtData.latitude, courtData.longitude], // добавляем координаты
      }));
  
      // Обновляем `selectedRegion`
      setSelectedRegion(updatedRegions.map(region => ({
        ...region,
        coordinates: region.coordinates as [number, number] // приводим координаты к типу [number, number]
      })));
      setRegionName(court.name);
    } catch (error) {
      console.error("Ошибка при получении данных для региона:", error);
    }
  };
  
  
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-[1250px] mx-auto">
        {!selectedRegion ? (
          <>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Оценки по областям</h2>
              <div className="flex space-x-4">
                <Link
                  href="/maps/oblast/Regional-Courts"
                  className={`px-4 py-2 rounded-md font-medium transition duration-200 ${
                    pathname === "/maps/oblast/Regional-Courts"
                      ? "bg-blue-100/40 text-blue-600"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  Средние оценки по областям
                </Link>
                <Link
                  href="/remarks"
                  className={`px-4 py-2 rounded-md font-medium transition duration-200 ${
                    pathname === "/remarks"
                      ? "bg-blue-100/40 text-blue-600"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  Замечания и предложения
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-100">
              <Map oblastData={regions} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-center font-bold text-sm text-gray-600">
                        №
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-bold text-sm text-gray-600">
                        Наименование области
                      </th>
                      <th 
                        onClick={() => handleSort("overall")}
                        className="border border-gray-300 px-4 py-2 text-center font-bold text-sm text-gray-600 cursor-pointer"
                      >
                        <div className="flex items-center justify-center">
                          Общая оценка
                          {getSortIcon("overall")}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort("accessibility")}
                        className="border border-gray-300 px-4 py-2 text-center font-bold text-sm text-gray-600 cursor-pointer"
                      >
                        <div className="flex items-center justify-center">
                          Судья
                          {getSortIcon("accessibility")}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort("judge")}
                        className="border border-gray-300 px-4 py-2 text-center font-bold text-sm text-gray-600 cursor-pointer"
                      >
                        <div className="flex items-center justify-center">
                          Здание
                          {getSortIcon("judge")}
                        </div>
                      </th>
                      
                      <th
                        onClick={() => handleSort("staff")}
                        className="border border-gray-300 px-4 py-2 text-center font-bold text-sm text-gray-600 cursor-pointer"
                      >
                        <div className="flex items-center justify-center">
                          Процесс
                          {getSortIcon("staff")}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort("office")}
                        className="border border-gray-300 px-4 py-2 text-center font-bold text-sm text-gray-600 cursor-pointer"
                      >
                        <div className="flex items-center justify-center">
                          Сотрудники
                          {getSortIcon("office")}
                        </div>
                      </th>
                      
                      <th className="border border-gray-300 px-4 py-2 text-center font-bold text-sm text-gray-600">
                        Количество отзывов
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((region, index) => (
                      <tr key={region.id} className="hover:bg-gray-50 transition-colors">
                        <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-600">
                          {index + 1}
                        </td>
                        <td
                          onClick={() => handleCourtClick(region)}
                          className="border border-gray-300 px-4 py-2 text-sm text-gray-800 hover:text-blue-600 cursor-pointer"
                        >
                          {region.name}
                        </td>
                        <td className={`border border-gray-300 px-4 py-2 text-center text-sm ${getRatingColor(region.overall)}`}>
                          {region.overall.toFixed(1)}
                        </td>
                        <td className={`border border-gray-300 px-4 py-2 text-center text-sm ${getRatingColor(region.ratings[0])}`}>
                          {region.ratings[0].toFixed(1)}
                        </td>
                        <td className={`border border-gray-300 px-4 py-2 text-center text-sm ${getRatingColor(region.ratings[1])}`}>
                          {region.ratings[1].toFixed(1)}
                        </td>
                        <td className={`border border-gray-300 px-4 py-2 text-center text-sm ${getRatingColor(region.ratings[2])}`}>
                          {region.ratings[2].toFixed(1)}
                        </td>
                        <td className={`border border-gray-300 px-4 py-2 text-center text-sm ${getRatingColor(region.ratings[3])}`}>
                          {region.ratings[3].toFixed(1)}
                        </td>
                        <td className={`border border-gray-300 px-4 py-2 text-center text-sm ${getRatingColor(region.ratings[4])}`}>
                          {region.ratings[4].toFixed(1)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-600">
                          {region.totalAssessments}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <RegionDetails regionName={regionName} />
        )}
      </div>
    </div>
  );
}
