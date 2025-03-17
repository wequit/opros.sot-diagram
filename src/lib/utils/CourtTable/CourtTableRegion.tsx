"use client";

import { useState, useEffect } from "react";
import { FaSort, FaSortUp, FaSortDown, FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Map from "../../../lib/utils/Maps/Map_oblast";
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

interface CourtTableLayoutProps {
  tableData: CourtData[];
  oblastData: OblastData[]; // Добавляем данные для карты
  isLoading: boolean;
  activeTab: "courts" | "regions";
}

export default function CourtTableLayout({ tableData, oblastData, isLoading, activeTab }: CourtTableLayoutProps) {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const router = useRouter();

  const handleTabClick = (tab: "courts" | "regions") => {
    if (tab === "courts") {
      router.push("/Home/second-instance/");
    } else {
      router.push("/Home/second-instance/regions");
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : sortDirection === "desc" ? null : "asc");
      if (sortDirection === "desc") setSortField(null);
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <FaSort className="ml-1 inline-block" />;
    if (sortDirection === "asc") return <FaSortUp className="ml-1 inline-block text-blue-600" />;
    return <FaSortDown className="ml-1 inline-block text-blue-600" />;
  };

  const sortedData = [...tableData].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;
    let aValue: number, bValue: number;
    switch (sortField) {
      case "judge":
        aValue = a.assessment.find((item) => item.aspect === "Судья")?.court_avg || 0;
        bValue = b.assessment.find((item) => item.aspect === "Судья")?.court_avg || 0;
        break;
      case "staff":
        aValue = a.assessment.find((item) => item.aspect === "Сотрудники")?.court_avg || 0;
        bValue = b.assessment.find((item) => item.aspect === "Сотрудники")?.court_avg || 0;
        break;
      case "process":
        aValue = a.assessment.find((item) => item.aspect === "Процесс")?.court_avg || 0;
        bValue = b.assessment.find((item) => item.aspect === "Процесс")?.court_avg || 0;
        break;
      case "office":
        aValue = a.assessment.find((item) => item.aspect === "Канцелярия")?.court_avg || 0;
        bValue = b.assessment.find((item) => item.aspect === "Канцелярия")?.court_avg || 0;
        break;
      case "accessibility":
        aValue = a.assessment.find((item) => item.aspect === "Здание")?.court_avg || 0;
        bValue = b.assessment.find((item) => item.aspect === "Здание")?.court_avg || 0;
        break;
      case "count":
        aValue = a.total_survey_responses;
        bValue = b.total_survey_responses;
        break;
      case "overall":
        aValue = a.overall_assessment;
        bValue = b.overall_assessment;
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

  return (
    <div className="max-w-[1250px] mx-auto w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 my-8">
      <div className="mb-4 flex justify-between items-center">
        <Breadcrumb
          regionName={null}
          onRegionBackClick={() => router.push("/Home/first-instance/")}
          showHome={true}
          headerKey="BreadCrumb_RegionName"
        />
        <div>
          <div className="flex gap-4 mt-2">
            <button
              className={`py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "courts" ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => handleTabClick("courts")}
            >
              По судам
            </button>
            <button
              className={`py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "regions" ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => handleTabClick("regions")}
            >
              По областям
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-100">
        <Map oblastData={oblastData} /> {/* Используем преобразованные данные */}
      </div>

      {isLoading ? (
        <div className="text-center py-4">Загрузка данных...</div>
      ) : sortedData.length === 0 ? (
        <div className="text-center py-4">Нет данных для отображения</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Таблица для десктопа */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">№</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">Название суда</th>
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer" onClick={() => handleSort("overall")}>
                    <div className="flex items-center justify-between px-2">
                      <span>Общая оценка</span>
                      {getSortIcon("overall")}
                    </div>
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer" onClick={() => handleSort("judge")}>
                    <div className="flex items-center justify-between px-2">
                      <span>Судья</span>
                      {getSortIcon("judge")}
                    </div>
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer" onClick={() => handleSort("staff")}>
                    <div className="flex items-center justify-between px-2">
                      <span>Сотрудники</span>
                      {getSortIcon("staff")}
                    </div>
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer" onClick={() => handleSort("process")}>
                    <div className="flex items-center justify-between px-2">
                      <span>Процесс</span>
                      {getSortIcon("process")}
                    </div>
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer" onClick={() => handleSort("office")}>
                    <div className="flex items-center justify-between px-2">
                      <span>Канцелярия</span>
                      {getSortIcon("office")}
                    </div>
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer" onClick={() => handleSort("accessibility")}>
                    <div className="flex items-center justify-between px-2">
                      <span>Здание</span>
                      {getSortIcon("accessibility")}
                    </div>
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">Кол-во отзывов</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((court) => (
                  <tr key={court.court_id} className="hover:bg-gray-50/50 border-b border-gray-200">
                    <td className="px-3 py-2.5 text-sm text-gray-900 text-center border-r border-gray-200">{court.court_id}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-900 border-r border-gray-200">{court.court}</td>
                    <td className={`px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200 ${getRatingColor(court.overall_assessment)}`}>
                      {court.overall_assessment.toFixed(1)}
                    </td>
                    <td className={`px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200 ${getRatingColor(court.assessment.find(item => item.aspect === "Судья")?.court_avg || 0)}`}>
                      {(court.assessment.find(item => item.aspect === "Судья")?.court_avg || 0).toFixed(1)}
                    </td>
                    <td className={`px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200 ${getRatingColor(court.assessment.find(item => item.aspect === "Сотрудники")?.court_avg || 0)}`}>
                      {(court.assessment.find(item => item.aspect === "Сотрудники")?.court_avg || 0).toFixed(1)}
                    </td>
                    <td className={`px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200 ${getRatingColor(court.assessment.find(item => item.aspect === "Процесс")?.court_avg || 0)}`}>
                      {(court.assessment.find(item => item.aspect === "Процесс")?.court_avg || 0).toFixed(1)}
                    </td>
                    <td className={`px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200 ${getRatingColor(court.assessment.find(item => item.aspect === "Канцелярия")?.court_avg || 0)}`}>
                      {(court.assessment.find(item => item.aspect === "Канцелярия")?.court_avg || 0).toFixed(1)}
                    </td>
                    <td className={`px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200 ${getRatingColor(court.assessment.find(item => item.aspect === "Здание")?.court_avg || 0)}`}>
                      {(court.assessment.find(item => item.aspect === "Здание")?.court_avg || 0).toFixed(1)}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200">{court.total_survey_responses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Карточки для мобильных */}
          <div className="block sm:hidden p-3">
            {sortedData.map((court) => (
              <div key={court.court_id} className="mb-3 p-3 border border-gray-100 rounded-lg bg-white duration-200">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-semibold text-gray-800 truncate">{court.court_id}. {court.court}</div>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400 text-sm" />
                    <span className="text-sm font-medium text-gray-700">{court.overall_assessment.toFixed(1)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-1"><span className="font-medium">Судья:</span><span>{(court.assessment.find(item => item.aspect === "Судья")?.court_avg || 0).toFixed(1)}</span></div>
                  <div className="flex items-center gap-1"><span className="font-medium">Сотрудники:</span><span>{(court.assessment.find(item => item.aspect === "Сотрудники")?.court_avg || 0).toFixed(1)}</span></div>
                  <div className="flex items-center gap-1"><span className="font-medium">Процесс:</span><span>{(court.assessment.find(item => item.aspect === "Процесс")?.court_avg || 0).toFixed(1)}</span></div>
                  <div className="flex items-center gap-1"><span className="font-medium">Канцелярия:</span><span>{(court.assessment.find(item => item.aspect === "Канцелярия")?.court_avg || 0).toFixed(1)}</span></div>
                  <div className="flex items-center gap-1"><span className="font-medium">Здание:</span><span>{(court.assessment.find(item => item.aspect === "Здание")?.court_avg || 0).toFixed(1)}</span></div>
                  <div className="flex items-center gap-1"><span className="font-medium">Отзывы:</span><span>{court.total_survey_responses}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}