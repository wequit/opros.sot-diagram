"use client";

import Map from "../components/Map_rayon";
import { useState, useEffect } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { fetchWithAuth, getRayonAssessmentData } from "@/api/login";
import Evaluations from "@/components/Evaluations/page";
import { getTranslation, useSurveyData } from "@/context/SurveyContext";
import { getCookie } from "@/api/login";
import Dates from "@/components/Dates/Dates";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";

// Типы для данных API
interface Assessment {
  aspect: string;
  court_avg: number;
}

interface Court {
  id: number;
  name: string;
  instance: string;
  overall_assessment: number;
  assessment: {
    judge: number;
    process: number;
    staff: number;
    office: number;
    building: number;
  };
  total_survey_responses: number;
}

type SortDirection = "asc" | "desc" | null;
type SortField =
  | "number"
  | "overall"
  | "judge"
  | "process"
  | "staff"
  | "office"
  | "building"
  | "count"
  | "name"
  | null;

const renderTableCell = (value: number) => {
  if (value === undefined || value === null) return "-";
  if (value === 0) return "0";
  return value.toFixed(1);
};

const transformApiData = (apiData: any): Court[] => {
  if (!apiData?.rayon_courts) {
    console.error("Invalid API data format");
    return [];
  }

  return apiData.rayon_courts
    .map((court: any) => {
      try {
        const assessmentMap = court.assessment.reduce(
          (acc: any, curr: Assessment) => {
            if (!curr.aspect || typeof curr.court_avg !== "number") {
              console.warn(
                `Invalid assessment data for court ${court.court_id}`
              );
              return acc;
            }

            const key =
              curr.aspect.toLowerCase() === "здание"
                ? "building"
                : curr.aspect.toLowerCase() === "канцелярия"
                ? "office"
                : curr.aspect.toLowerCase() === "процесс"
                ? "process"
                : curr.aspect.toLowerCase() === "сотрудники"
                ? "staff"
                : curr.aspect.toLowerCase() === "судья"
                ? "judge"
                : "";

            if (key) acc[key] = curr.court_avg;
            return acc;
          },
          {}
        );

        return {
          id: court.court_id,
          name: court.court || "Неизвестный суд",
          instance: court.instantiation || "Не указано",
          overall_assessment: court.overall_assessment || 0,
          assessment: {
            judge: assessmentMap.judge || 0,
            process: assessmentMap.process || 0,
            staff: assessmentMap.staff || 0,
            office: assessmentMap.office || 0,
            building: assessmentMap.building || 0,
          },
          total_survey_responses: court.total_survey_responses || 0,
        };
      } catch (error) {
        console.error(
          `Error transforming court data for ID ${court.court_id}:`,
          error
        );
        return null;
      }
    })
    .filter(Boolean);
};

export default function Courts() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const { setCourtName, setSurveyData, setIsLoading, courtName, language } =
    useSurveyData();
  const [showEvaluations, setShowEvaluations] = useState(false);

  const token = getCookie("access_token");

  const getRatingColor = (rating: number) => {
    if (rating === 0) return "bg-gray-100";
    if (rating <= 2) return "bg-red-100";
    if (rating <= 3.5) return "bg-yellow-100";
    return "bg-green-100";
  };

  const handleCourtClick = async (court: Court) => {
    try {
      setIsLoading(true);
      setCourtName(court.name);
      localStorage.setItem("selectedCourtName", court.name);

      const response = await fetch(
        `https://opros.sot.kg/api/v1/results/${court.id}/?year=2025`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setSurveyData(data);
      setShowEvaluations(true);
    } catch (error) {
      console.error("Error fetching court details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const data = await getRayonAssessmentData();
        const transformedCourts = transformApiData(data);
        setCourts(transformedCourts);
      } catch (error) {
        console.error("Error fetching courts:", error);
      }
    };

    fetchCourts();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
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

  const sortedCourts = [...courts].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let aValue: any, bValue: any;

    switch (sortField) {
      case "overall":
        aValue = a.overall_assessment;
        bValue = b.overall_assessment;
        break;
      case "judge":
        aValue = a.assessment.judge;
        bValue = b.assessment.judge;
        break;
      case "process":
        aValue = a.assessment.process;
        bValue = b.assessment.process;
        break;
      case "staff":
        aValue = a.assessment.staff;
        bValue = b.assessment.staff;
        break;
      case "office":
        aValue = a.assessment.office;
        bValue = b.assessment.office;
        break;
      case "building":
        aValue = a.assessment.building;
        bValue = b.assessment.building;
        break;
      case "count":
        aValue = a.total_survey_responses;
        bValue = b.total_survey_responses;
        break;
      default:
        return 0;
    }

    if (aValue === 0) aValue = -Infinity;
    if (bValue === 0) bValue = -Infinity;

    return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
  });

  const handleBackClick = () => {
    setShowEvaluations(false);
  };

  return (
    <>
      {showEvaluations ? (
        <div className="p-3 mt-4">
          <Breadcrumb
            regionName={getTranslation("HeaderNavFour", language)}
            courtName={courtName}
            onCourtBackClick={handleBackClick}
            showHome={false}  
          />
          <h2 className="text-3xl font-bold mb-4 mt-4">{courtName}</h2>
          <Dates />

          <Evaluations />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4 mt-2">Районные суды</h2>
          <div className="border border-gray-300">
            <Map
              selectedRayon={null}
              onSelectRayon={() => {}}
              courts={courts}
            />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-8">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">
                      №
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">
                      Наименование суда
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
                        <span>Судья</span>
                        {getSortIcon("judge")}
                      </div>
                    </th>
                    <th
                      className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                      onClick={() => handleSort("process")}
                    >
                      <div className="flex items-center justify-between px-2">
                        <span>Процесс</span>
                        {getSortIcon("process")}
                      </div>
                    </th>
                    <th
                      className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                      onClick={() => handleSort("staff")}
                    >
                      <div className="flex items-center justify-between px-2">
                        <span>Сотрудники</span>
                        {getSortIcon("staff")}
                      </div>
                    </th>
                    <th
                      className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                      onClick={() => handleSort("office")}
                    >
                      <div className="flex items-center justify-between px-2">
                        <span>Канцелярия</span>
                        {getSortIcon("office")}
                      </div>
                    </th>
                    <th
                      className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                      onClick={() => handleSort("building")}
                    >
                      <div className="flex items-center justify-between px-2">
                        <span>Здание</span>
                        {getSortIcon("building")}
                      </div>
                    </th>
                    <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">
                      Кол-во оценок
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCourts.map((court, index) => (
                    <tr
                      key={court.id}
                      className="hover:bg-gray-50/50 border-b border-gray-200"
                    >
                      <td className="px-3 py-2.5 text-sm text-gray-900 text-center border-r border-gray-200">
                        {index + 1}
                      </td>
                      <td
                        className="px-3 py-2.5 text-sm text-gray-900 border-r border-gray-200 cursor-pointer hover:text-blue-600"
                        onClick={() => handleCourtClick(court)}
                      >
                        {court.name}
                      </td>
                      <td
                        className={`px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200 ${getRatingColor(
                          court.overall_assessment
                        )}`}
                      >
                        {renderTableCell(court.overall_assessment)}
                      </td>
                      <td
                        className={`px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200 ${getRatingColor(
                          court.assessment.judge
                        )}`}
                      >
                        {renderTableCell(court.assessment.judge)}
                      </td>
                      <td
                        className={`px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200 ${getRatingColor(
                          court.assessment.process
                        )}`}
                      >
                        {renderTableCell(court.assessment.process)}
                      </td>
                      <td
                        className={`px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200 ${getRatingColor(
                          court.assessment.staff
                        )}`}
                      >
                        {renderTableCell(court.assessment.staff)}
                      </td>
                      <td
                        className={`px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200 ${getRatingColor(
                          court.assessment.office
                        )}`}
                      >
                        {renderTableCell(court.assessment.office)}
                      </td>
                      <td
                        className={`px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200 ${getRatingColor(
                          court.assessment.building
                        )}`}
                      >
                        {renderTableCell(court.assessment.building)}
                      </td>
                      <td className="px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200">
                        {court.total_survey_responses}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
