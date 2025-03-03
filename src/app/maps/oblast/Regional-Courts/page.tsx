"use client";

import Map from "../components/Map_oblast";
import { useState, useEffect } from "react";
import { FaSort, FaSortUp, FaSortDown, FaStar } from "react-icons/fa";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getAssessmentData, getCookie } from "@/lib/login";
import { useSurveyData } from "@/context/SurveyContext";
import RegionDetails from "../components/RegionDetails";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";

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

export default function RegionalCourts() {
  const [regions, setRegions] = useState<OblastData[]>([]);
  const [regionName, setRegionName] = useState<string | null>(null);
  const { selectedRegion, setSelectedRegion } = useSurveyData();

  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
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

  const getRatingColor = (rating: number) => {
    if (rating === 0) return "bg-gray-100";
    if (rating <= 2) return "bg-red-100";
    if (rating <= 3.5) return "bg-yellow-100";
    return "bg-green-100";
  };

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
      setSelectedRegion(updatedRegions);
      setRegionName(court.name);
    } catch (error) {
      console.error("Ошибка при получении данных для региона:", error);
    }
  };

  const handleRegionBackClick = () => {
    setSelectedRegion(null);
  };

  return (
    <div className="max-w-[1250px] mx-auto w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 my-8 Oblast">
      {!selectedRegion ? (
        <>
          <div className="mb-4 flex justify-between items-center">
            <Breadcrumb
              regionName={null}
              onRegionBackClick={handleRegionBackClick}
              showHome={true}
              headerKey="HeaderNavThree"
            />
            <h2 className="text-2xl font-bold RegionName">
              Оценки по областям
            </h2>
          </div>

          {/* Условный рендеринг таблицы */}
          <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-100">
            <Map oblastData={regions} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Таблица для десктопа (≥ 640px) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">
                      №
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">
                      Наименование области
                    </th>
                    <th
                      className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                      onClick={() => handleSort("overall")}
                    >
                      <div className="flex items-center justify-between px-2">
                        <span>Общая оценка</span>
                        {getSortIcon("overall")}
                      </div>
                    </th>
                    <th
                      className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                      onClick={() => handleSort("judge")}
                    >
                      <div className="flex items-center justify-between px-2">
                        <span>Здание</span>
                        {getSortIcon("judge")}
                      </div>
                    </th>
                    <th
                      className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                      onClick={() => handleSort("process")}
                    >
                      <div className="flex items-center justify-between px-2">
                        <span>Канцелярия</span>
                        {getSortIcon("process")}
                      </div>
                    </th>
                    <th
                      className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                      onClick={() => handleSort("staff")}
                    >
                      <div className="flex items-center justify-between px-2">
                        <span>Процесс</span>
                        {getSortIcon("staff")}
                      </div>
                    </th>
                    <th
                      className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                      onClick={() => handleSort("office")}
                    >
                      <div className="flex items-center justify-between px-2">
                        <span>Сотрудники</span>
                        {getSortIcon("office")}
                      </div>
                    </th>
                    <th
                      className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                      onClick={() => handleSort("accessibility")}
                    >
                      <div className="flex items-center justify-between px-2">
                        <span>Судья</span>
                        {getSortIcon("accessibility")}
                      </div>
                    </th>
                    <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">
                      Количество отзывов
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((oblast) => (
                    <tr
                      key={oblast.id}
                      className="hover:bg-gray-50/50 border-b border-gray-200"
                    >
                      <td className="px-3 py-2.5 text-sm text-gray-900 text-center border-r border-gray-200">
                        {oblast.id}
                      </td>
                      <td
                        className="px-3 py-2.5 text-sm text-gray-900 border-r border-gray-200 cursor-pointer hover:text-blue-600"
                        onClick={() => handleCourtClick(oblast)}
                      >
                        {oblast.name}
                      </td>
                      <td
                        className={`px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200 ${getRatingColor(
                          oblast.overall
                        )}`}
                      >
                        {oblast.overall.toFixed(1)}
                      </td>
                      <td
                        className={`px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200 ${getRatingColor(
                          oblast.ratings[0]
                        )}`}
                      >
                        {oblast.ratings[0].toFixed(1)}
                      </td>
                      <td
                        className={`px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200 ${getRatingColor(
                          oblast.ratings[1]
                        )}`}
                      >
                        {oblast.ratings[1].toFixed(1)}
                      </td>
                      <td
                        className={`px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200 ${getRatingColor(
                          oblast.ratings[2]
                        )}`}
                      >
                        {oblast.ratings[2].toFixed(1)}
                      </td>
                      <td
                        className={`px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200 ${getRatingColor(
                          oblast.ratings[3]
                        )}`}
                      >
                        {oblast.ratings[3].toFixed(1)}
                      </td>
                      <td
                        className={`px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200 ${getRatingColor(
                          oblast.ratings[4]
                        )}`}
                      >
                        {oblast.ratings[4].toFixed(1)}
                      </td>
                      <td className="px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200">
                        {oblast.totalAssessments}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Карточки для мобильных (< 640px) */}
            <div className="block sm:hidden p-3">
              {sortedData.map((oblast) => (
                <div
                  key={oblast.id}
                  className="mb-3 p-3 border border-gray-100 rounded-lg bg-white duration-200 cursor-pointer"
                  onClick={() => handleCourtClick(oblast)}
                >
                  {/* Заголовок карточки */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-semibold text-gray-800 hover:text-blue-600 truncate">
                      {oblast.id}. {oblast.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-sm font-medium text-gray-700">
                        {oblast.overall.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Данные в виде минималистичной сетки */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Здание:</span>
                      <span>{oblast.ratings[0].toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Канцелярия:</span>
                      <span>{oblast.ratings[1].toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Процесс:</span>
                      <span>{oblast.ratings[2].toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Сотрудники:</span>
                      <span>{oblast.ratings[3].toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Судья:</span>
                      <span>{oblast.ratings[4].toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Отзывы:</span>
                      <span>{oblast.totalAssessments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <RegionDetails regionName={regionName} regions={regions} />
      )}
    </div>
  );
}
