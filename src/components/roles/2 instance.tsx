"use client";

import React, { useEffect, useState } from "react";
import { getAssessmentData, getCookie } from "@/lib/api/login";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";
import RegionMap, { RegionData } from "@/components/Maps/RegionMap";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useCourt } from "@/context/CourtContext";
import { useChartData } from "@/context/ChartDataContext";

interface Assessment {
  aspect: string;
  court_avg: number;
  assessment_count: string;
}

interface CourtData {
  court_id: number;
  court: string;
  instantiation: string;
  overall_assessment: number;
  assessment: Assessment[];
  assessment_count: string;
  total_survey_responses: number;
}

const SecondInstance = () => {
  const [assessmentData, setAssessmentData] = useState<CourtData[]>([]);
  const { courtName, setCourtName, selectedCourt, setSelectedCourt } = useCourt();
  const { setSurveyData, setIsLoading } = useChartData();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRegion, setUserRegion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const {getTranslation, } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        const token = getCookie("access_token");
        if (!token) {
          throw new Error("Token is null");
        }
        const data = await getAssessmentData();
        setAssessmentData(data.courts);
      } catch (error) {
        console.error("Ошибка при получении данных оценки:", error);
      }
    };

    fetchAssessmentData();
  }, []);

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
      }
    };

    fetchCurrentUser();
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField("");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <FaSort className="ml-1 inline-block" />;
    if (sortDirection === "asc")
      return <FaSortUp className="ml-1 inline-block text-blue-600" />;
    return <FaSortDown className="ml-1 inline-block text-blue-600" />;
  };

  const getRatingColor = (rating: number): string => {
    if (rating === 0) return "bg-gray-100";
    if (rating < 2) return "bg-red-100";
    if (rating < 2.5) return "bg-red-100";
    if (rating < 3) return "bg-orange-100";
    if (rating < 3.5) return "bg-yellow-100";
    if (rating < 4) return "bg-emerald-100";
    return "bg-green-100";
  };

  const filteredCourts = assessmentData.filter(court =>
    court.court.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCourts = React.useMemo(() => {
    if (!sortField) return filteredCourts;
    
    return [...filteredCourts].sort((a, b) => {
      let valueA, valueB;
      
      switch (sortField) {
        case "overall":
          valueA = a.overall_assessment;
          valueB = b.overall_assessment;
          break;
        case "building":
          valueA = a.assessment.find((item) => item.aspect === "Здание")?.court_avg || 0;
          valueB = b.assessment.find((item) => item.aspect === "Здание")?.court_avg || 0;
          break;
        case "office":
          valueA = a.assessment.find((item) => item.aspect === "Канцелярия")?.court_avg || 0;
          valueB = b.assessment.find((item) => item.aspect === "Канцелярия")?.court_avg || 0;
          break;
        case "process":
          valueA = a.assessment.find((item) => item.aspect === "Процесс")?.court_avg || 0;
          valueB = b.assessment.find((item) => item.aspect === "Процесс")?.court_avg || 0;
          break;
        case "staff":
          valueA = a.assessment.find((item) => item.aspect === "Сотрудники")?.court_avg || 0;
          valueB = b.assessment.find((item) => item.aspect === "Сотрудники")?.court_avg || 0;
          break;
        case "judge":
          valueA = a.assessment.find((item) => item.aspect === "Судья")?.court_avg || 0;
          valueB = b.assessment.find((item) => item.aspect === "Судья")?.court_avg || 0;
          break;
        case "count":
          valueA = a.total_survey_responses;
          valueB = b.total_survey_responses;
          break;
        default:
          return 0;
      }
      
      if (sortDirection === "asc") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });
  }, [filteredCourts, sortField, sortDirection]);

  const fetchResults = async (courtId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://opros.sot.kg/api/v1/results/${courtId}/?year=2025`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка получения результатов");
      }

      const results = await response.json();
      setSurveyData(results);
      setIsLoading(false);
    } catch (error) {
      console.error("Ошибка при получении результатов:", error);
      setIsLoading(false);
    }
  };

  const handleCourtClick = (court: any) => {
    const courtId = court.court_id;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem("selectedCourtId", courtId.toString());
      localStorage.setItem("selectedCourtName", court.court);
    }
    
    router.push(`/Home/second-instance/court/${courtId}`);
  };

  const handleBackClick = () => {
    setSelectedCourt(null);
    setCourtName("");
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

    return regionMap[courtName] || "Кыргызская Республика";
  };

  const transformCourtData = (courts: CourtData[]): RegionData[] => {
    return courts.map((court) => ({
      id: court.court_id,
      name: court.court,
      overall: court.overall_assessment,
      ratings: court.assessment.map((a) => a.court_avg || 0),
      totalAssessments: court.total_survey_responses,
    }));
  };

  return (
    <>
      {selectedCourt ? (
        <div className="space-y-6 mt-4">
          <Breadcrumb
            regionName={userRegion || ""}
            courtName={selectedCourt.court}
            onCourtBackClick={handleBackClick}
            showHome={false}
          />
          <Dates />
          <Evaluations />
        </div>
      ) : (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-[1250px] mx-auto px-4 py-4">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold mb-6">{userRegion}</h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                <RegionMap
                  regionName={userRegion || ""}
                  selectedRegion={transformCourtData(assessmentData)}
                  onCourtClick={(courtId, courtName) => {
                    const court = assessmentData.find(c => c.court_id === courtId);
                    if (court) handleCourtClick(court);
                  }}
                />
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                  <div className="relative w-full max-w-[13rem] my-2 ml-4">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={getTranslation("Regional_Courts_Table_Search")}

                      className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 bg-white rounded-lg focus:outline-none transition-all duration-200 ease-in-out placeholder-gray-500"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">
                          №
                        </th>
                        <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 w-56 min-w-[14rem]">
                        {getTranslation("Regional_Courts_Table_NameRegion")}
                        </th>
                        <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">
                          Инстанция
                        </th>
                        <th 
                          className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                          onClick={() => handleSort("overall")}
                        >
                          <div className="flex items-center justify-between px-2">
                          {getTranslation("Regional_Courts_Table_Overall")}
                          {getSortIcon("overall")}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                          onClick={() => handleSort("judge")}
                        >
                          <div className="flex items-center justify-between px-2">
                          {getTranslation("Regional_Courts_Table_Judge")}
                            {getSortIcon("judge")}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                          onClick={() => handleSort("process")}
                        >
                          <div className="flex items-center justify-between px-2">
                          {getTranslation("Regional_Courts_Table_Procces")}
                            {getSortIcon("process")}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                          onClick={() => handleSort("staff")}
                        >
                          <div className="flex items-center justify-between px-2">
                          {getTranslation("Regional_Courts_Table_Staff")}
                            {getSortIcon("staff")}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                          onClick={() => handleSort("office")}
                        >
                          <div className="flex items-center justify-between px-2">
                          {getTranslation("Regional_Courts_Table_Chancellery")}
                            {getSortIcon("office")}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                          onClick={() => handleSort("building")}
                        >
                          <div className="flex items-center justify-between px-2">
                          {getTranslation("Regional_Courts_Table_Build")}
                            {getSortIcon("building")}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                          onClick={() => handleSort("count")}
                        >
                          <div className="flex items-center justify-between px-2">
                          {getTranslation("Regional_Courts_Table_Number of reviews")}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="min-h-[300px]">
                      {sortedCourts.map((court, index) => (
                        <tr
                          key={court.court_id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-600">
                            {index + 1}
                          </td>
                          <td
                            className="px-3 py-2.5 text-left text-xs text-gray-600 cursor-pointer hover:text-blue-500 w-56 min-w-[14rem]"
                            onClick={() => handleCourtClick(court)}
                          >
                            {court.court}
                          </td>
                          <td className="px-3 py-2.5 text-left text-xs text-gray-600 w-36">
                            {court.instantiation}
                          </td>
                          <td className={`border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 ${getRatingColor(court.overall_assessment)}`}>
                            {court.overall_assessment}
                          </td>
                          <td className={`border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 ${getRatingColor(court.assessment.find((a) => a.aspect === "Судья")?.court_avg || 0)}`}>
                            {court.assessment.find((a) => a.aspect === "Судья")?.court_avg || 0}
                          </td>
                          <td className={`border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 ${getRatingColor(court.assessment.find((a) => a.aspect === "Процесс")?.court_avg || 0)}`}>
                            {court.assessment.find((a) => a.aspect === "Процесс")?.court_avg || 0}
                          </td>
                          <td className={`border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 ${getRatingColor(court.assessment.find((a) => a.aspect === "Сотрудники")?.court_avg || 0)}`}>
                            {court.assessment.find((a) => a.aspect === "Сотрудники")?.court_avg || 0}
                          </td>
                          <td className={`border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 ${getRatingColor(court.assessment.find((a) => a.aspect === "Канцелярия")?.court_avg || 0)}`}>
                            {court.assessment.find((a) => a.aspect === "Канцелярия")?.court_avg || 0}
                          </td>
                          <td className={`border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 ${getRatingColor(court.assessment.find((a) => a.aspect === "Здание")?.court_avg || 0)}`}>
                            {court.assessment.find((a) => a.aspect === "Здание")?.court_avg || 0}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-600">
                            {court.total_survey_responses || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SecondInstance;