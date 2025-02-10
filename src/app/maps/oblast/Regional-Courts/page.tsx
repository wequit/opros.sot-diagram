"use client";
import Map from "../components/Map_oblast";
import { useState, useEffect } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"; 
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAssessmentData, getCookie } from "@/api/login";

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

// Определяем интерфейс для данных области
interface OblastData {
  id: number;
  name: string;
  ratings: number[];
  coordinates: [number, number];
  overall: number;
  totalAssessments: number;
}

interface Region {
  region_id: number;
  region_name: string;
  average_scores: {
    [key: string]: number;
  };
  overall_region_assessment: number;
  total_assessments: number;
}

export default function RegionalCourts() {
  const [regions, setRegions] = useState<OblastData[]>([]); // Состояние для хранения данных о регионах
  const [selectedOblast, setSelectedOblast] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie('access_token');
        if (!token) {
          throw new Error("Token is null");
        }
        const data = await getAssessmentData();
        const processedRegions = data.regions.map((region: Region) => ({
          id: region.region_id,
          name: region.region_name,
          ratings: [
            region.average_scores["Здание"],
            region.average_scores["Канцелярия"],
            region.average_scores["Процесс"],
            region.average_scores["Сотрудники"],
            region.average_scores["Судья"],
          ],
          overall: region.overall_region_assessment,
          totalAssessments: region.total_assessments,
          coordinates: [0, 0],
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
      if (sortDirection === "desc") setSortField(null);
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

    let aValue, bValue;

    switch (sortField) {
      case 'judge':
        aValue = a.ratings[4]; // Индекс для судьи
        bValue = b.ratings[4];
        break;
      case 'count':
        aValue = a.totalAssessments;
        bValue = b.totalAssessments;
        break;
      case 'overall':
        aValue = a.overall;
        bValue = b.overall;
        break;
      // ... остальные случаи ...
      default:
        return 0;
    }

    if (aValue === undefined || bValue === undefined) return 0;
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-medium">Оценки по областям</h2>
          <div className="flex space-x-4">
            <Link
              href="/maps/oblast/Regional-Courts"
              className={`px-4 py-2 rounded-md font-medium transition duration-200
                  ${
                    pathname === "/maps/oblast/Regional-Courts"
                    ? "bg-blue-100/40 text-blue-600"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
            >
              Средние оценки по областям
            </Link>
            <Link href="/Remarks"  className={`px-4 py-2 rounded-md font-medium transition duration-200
                  ${
                    pathname === "/Remarks"
                    ? "bg-blue-100/40 text-blue-600"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
            >
              Замечания и предложения
            </Link>
          </div>
          {selectedOblast && (
            <button
              onClick={() => setSelectedOblast(null)}
              className="px-3 py-1 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Сбросить фильтр
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-100">
          <Map 
            selectedOblast={selectedOblast} 
            oblastData={regions} 
            onSelectOblast={setSelectedOblast}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
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
                  <th 
                    className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                    onClick={() => handleSort("count")} >
                    <div className="flex items-center justify-between px-2">
                      <span>Кол-во оценок</span>
                      {getSortIcon("count")}
                    </div>
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
                      onClick={() => setSelectedOblast(oblast.name)}
                    >
                      {oblast.name}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200">
                      {oblast.overall.toFixed(1)}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200">
                      {oblast.ratings[0].toFixed(1)}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200">
                      {oblast.ratings[1].toFixed(1)}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200">
                      {oblast.ratings[2].toFixed(1)}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200">
                      {oblast.ratings[3].toFixed(1)}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200">
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
        </div>
      </div>
    </div>
  );
}
