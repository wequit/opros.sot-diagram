import React, { useEffect, useState } from "react";
import { getCookie } from "@/api/login";
import { getAssessmentData } from "@/api/login";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";
import { useSurveyData } from '@/context/SurveyContext';
// import DataFetcher from "@/components/DataFetcher";

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
  const { setCourtName, setSurveyData, setIsLoading , selectedCourt, setSelectedCourt} = useSurveyData();

  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        const token = getCookie('access_token');
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

  const fetchResults = async (courtId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://opros.sot.kg/api/v1/results/${courtId}/?year=2025`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getCookie('access_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка получения результатов');
      }

      const results = await response.json();
      setSurveyData(results);
      setIsLoading(false);
    } catch (error) {
      console.error('Ошибка при получении результатов:', error);
      setIsLoading(false);
    }
  };

  const handleCourtClick = (court: CourtData) => {
    setSelectedCourt(court);
    const foundCourt = assessmentData.find(item => item.court_id === court.court_id);
    if (foundCourt) {
      setCourtName(foundCourt.court);
      fetchResults(foundCourt.court_id); 
    }
  };

  const handleBackClick = () => {
    setSelectedCourt(null);
  };
  return (
    <>
    {selectedCourt ? (
       <div className="space-y-6">
        <button
            onClick={handleBackClick}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 mb-6 transition"
          >
            Назад к списку судов
          </button>
        <Dates />
        {/* <DataFetcher /> */}
        <Evaluations/>
      </div>
    ): (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-[1300px] mx-auto px-4 py-4">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">№</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Наименование суда</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Инстанция</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Общая оценка</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Судья</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Процесс</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Сотрудники</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Канцелярия</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Доступность</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Кол-во оценок</th>
            </tr>
          </thead>
          <tbody>
            {assessmentData.map((court, index) => (
              <tr key={court.court_id} className="hover:bg-gray-100 transition-colors duration-200" >
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2 cursor-pointer text-blue-600" onClick={() => handleCourtClick(court)}>{court.court}</td>
                <td className="border border-gray-300 px-4 py-2 w-36">{court.instantiation}</td>
                <td className="border border-gray-300 px-4 py-2">{court.overall_assessment}</td>
                <td className="border border-gray-300 px-4 py-2">{court.assessment.find(a => a.aspect === "Судья")?.court_avg || 0}</td>
                <td className="border border-gray-300 px-4 py-2">{court.assessment.find(a => a.aspect === "Процесс")?.court_avg || 0}</td>
                <td className="border border-gray-300 px-4 py-2">{court.assessment.find(a => a.aspect === "Сотрудники")?.court_avg || 0}</td>
                <td className="border border-gray-300 px-4 py-2">{court.assessment.find(a => a.aspect === "Канцелярия")?.court_avg || 0}</td>
                <td className="border border-gray-300 px-4 py-2">{court.assessment.find(a => a.aspect === "Доступность")?.court_avg || 0}</td>
                <td className="border border-gray-300 px-4 py-2">{court.total_survey_responses || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
    )}
    </>
  );
};

export default SecondInstance;