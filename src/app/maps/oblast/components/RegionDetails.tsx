import { getCookie } from "@/api/login";
import { useSurveyData } from "@/context/SurveyContext";
import React, { useState } from "react";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";

function RegionDetails({ regionName }: { regionName: string | null }) {
  const {
    selectedRegion,
    setSelectedRegion,
    setSurveyData,
    setIsLoading,
    selectedCourtName,
    setSelectedCourtName,
    selectedCourtId,
    setSelectedCourtId,
  } = useSurveyData();

  const handleCourtClick = async (courtId: number, courtName: string) => {
    setSelectedCourtId(courtId);
    localStorage.setItem("selectedCourtId", courtId.toString());
    localStorage.setItem("selectedCourtName", courtName);
    setSelectedCourtName(courtName);

    try {
      const token = getCookie("access_token");
      if (!token) throw new Error("Token is null");

      const response = await fetch(
        `https://opros.sot.kg/api/v1/results/${courtId}/?year=2025`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Ошибка HTTP: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setSurveyData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Ошибка при получении данных суда:", error);
    }
  };

  const handleCourtBackClick = () => {
    setSelectedCourtId(null);
    setSelectedCourtName(null);
  };

  const handleRegionBackClick = () => {
    setSelectedRegion(null);
  };

  return (
    <>
      {selectedCourtId ? (
        <div className="mt-8">
          <Breadcrumb
            regionName={regionName}
            courtName={selectedCourtName}
            onCourtBackClick={handleCourtBackClick} 
            onRegionBackClick={handleRegionBackClick} 
          />
          <h2 className="text-3xl font-bold mb-4 mt-4">{selectedCourtName}</h2>
          
          <div className="space-y-6">
            <Dates />
            <Evaluations selectedCourtId={selectedCourtId} />
          </div>
        </div>
      ) : (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-[1250px] mx-auto px-4 py-4">
            <div className="flex flex-col">
              <Breadcrumb
                regionName={regionName}
                onRegionBackClick={handleRegionBackClick} // Только возврат к списку регионов
              />
              <h2 className="text-xl font-medium mt-4">
                {regionName ? regionName : "Выберите регион"}
              </h2>

              

              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
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
                        <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">
                          Общая оценка
                        </th>
                        <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">
                          Здание
                        </th>
                        <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">
                          Канцелярия
                        </th>
                        <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">
                          Процесс
                        </th>
                        <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">
                          Сотрудники
                        </th>
                        <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">
                          Судья
                        </th>
                        <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">
                          Количество отзывов
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRegion?.map((court, index) => (
                        <tr
                          key={court.name}
                          className="cursor-pointer hover:bg-gray-100"
                        >
                          <td className="px-3 py-2.5 text-center text-xs text-gray-600">
                            {index + 1}
                          </td>
                          <td
                            className="px-3 py-2.5 text-left text-xs text-gray-600 cursor-pointer hover:text-blue-500"
                            onClick={() =>
                              handleCourtClick(court.id, court.name)
                            }
                          >
                            {court.name}
                          </td>
                          <td className="px-3 py-2.5 text-center text-xs text-gray-600">
                            {court.overall}
                          </td>
                          {court.ratings.map((rating: number, idx: number) => (
                            <td
                              key={idx}
                              className="px-3 py-2.5 text-center text-xs text-gray-600"
                            >
                              {rating}
                            </td>
                          ))}
                          <td className="px-3 py-2.5 text-center text-xs text-gray-600">
                            {court.totalAssessments}
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
}

export default RegionDetails;