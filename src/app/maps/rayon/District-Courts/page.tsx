'use client';

import Link from 'next/link';
import Map from '../components/Map_rayon';
import { useState, useEffect } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { getRayonAssessmentData } from "@/api/login";
import Evaluations from "@/components/Evaluations/page";
import { useSurveyData } from '@/context/SurveyContext';
import { getCookie } from '@/api/login';
import Dates from '@/lib/utils/Dates';
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

// Добавляем тип для направления сортировки
type SortDirection = 'asc' | 'desc' | null;

// Обновляем тип для полей сортировки
type SortField = 'number' | 'overall' | 'judge' | 'process' | 'staff' | 'office' | 'building' | 'count' | 'name' | null;

// Улучшенная функция рендеринга ячеек
const renderTableCell = (value: number) => {
  if (value === undefined || value === null) return '-';
  if (value === 0) return '0';
  return value.toFixed(1);
};

// Добавляем обработку ошибок в трансформацию данных
const transformApiData = (apiData: any): Court[] => {
  if (!apiData?.rayon_courts) {
    console.error('Invalid API data format');
    return [];
  }

  return apiData.rayon_courts.map((court: any) => {
    try {
      const assessmentMap = court.assessment.reduce((acc: any, curr: Assessment) => {
        if (!curr.aspect || typeof curr.court_avg !== 'number') {
          console.warn(`Invalid assessment data for court ${court.court_id}`);
          return acc;
        }

        const key = curr.aspect.toLowerCase() === 'здание' ? 'building' :
                   curr.aspect.toLowerCase() === 'канцелярия' ? 'office' :
                   curr.aspect.toLowerCase() === 'процесс' ? 'process' :
                   curr.aspect.toLowerCase() === 'сотрудники' ? 'staff' :
                   curr.aspect.toLowerCase() === 'судья' ? 'judge' : '';
        
        if (key) acc[key] = curr.court_avg;
        return acc;
      }, {});

      return {
        id: court.court_id,
        name: court.court || 'Неизвестный суд',
        instance: court.instantiation || 'Не указано',
        overall_assessment: court.overall_assessment || 0,
        assessment: {
          judge: assessmentMap.judge || 0,
          process: assessmentMap.process || 0,
          staff: assessmentMap.staff || 0,
          office: assessmentMap.office || 0,
          building: assessmentMap.building || 0
        },
        total_survey_responses: court.total_survey_responses || 0
      };
    } catch (error) {
      console.error(`Error transforming court data for ID ${court.court_id}:`, error);
      return null;
    }
  }).filter(Boolean);
};

export default function Courts() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const { setCourtName, setSurveyData, setIsLoading } = useSurveyData();
  const [showEvaluations, setShowEvaluations] = useState(false);

  const token = getCookie('access_token');

  // Функция для получения цвета оценки
  const getRatingColor = (rating: number) => {
    if (rating === 0) return 'bg-gray-100';
    if (rating <= 2) return 'bg-red-100';
    if (rating <= 3.5) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  // Обработчик клика по названию суда
  const handleCourtClick = async (court: Court) => {
    try {
      setIsLoading(true);
      setCourtName(court.name);
      // Сохраняем название суда в localStorage
      localStorage.setItem('selectedCourtName', court.name);
      
      const response = await fetch(`https://opros.sot.kg/api/v1/results/${court.id}/?year=2025`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setSurveyData(data);
      setShowEvaluations(true);
    } catch (error) {
      console.error('Error fetching court details:', error);
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
        console.error('Error fetching courts:', error);
      }
    };

    fetchCourts();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <FaSort className="ml-1 inline-block" />;
    if (sortDirection === 'asc') return <FaSortUp className="ml-1 inline-block text-blue-600" />;
    return <FaSortDown className="ml-1 inline-block text-blue-600" />;
  };

  const sortedCourts = [...courts].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let aValue: any, bValue: any;

    switch (sortField) {
      case 'overall':
        aValue = a.overall_assessment;
        bValue = b.overall_assessment;
        break;
      case 'judge':
        aValue = a.assessment.judge;
        bValue = b.assessment.judge;
        break;
      case 'process':
        aValue = a.assessment.process;
        bValue = b.assessment.process;
        break;
      case 'staff':
        aValue = a.assessment.staff;
        bValue = b.assessment.staff;
        break;
      case 'office':
        aValue = a.assessment.office;
        bValue = b.assessment.office;
        break;
      case 'building':
        aValue = a.assessment.building;
        bValue = b.assessment.building;
        break;
      case 'count':
        aValue = a.total_survey_responses;
        bValue = b.total_survey_responses;
        break;
      default:
        return 0;
    }

    if (aValue === 0) aValue = -Infinity;
    if (bValue === 0) bValue = -Infinity;

    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return (
    <>
      {showEvaluations ? (
        <>
          <Dates />
          <div className="w-[55rem] ml-4 mb-4">
            <div className="bg-[#F8F9FF] border-l-[6px] border-[#2563EB] rounded-lg shadow-sm">
              <div className="px-5 py-4 flex items-center">
                <svg className="w-7 h-7 text-[#2563EB]" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 8.2V9h18V8.2L12 2zm0 2.03l5.74 3.93H6.26L12 4.03zM4 10v9h2v-9H4zm14 0v9h2v-9h-2zM8 10v9h8v-9H8zm2 2h4v5h-4v-5z" 
                    fill="currentColor"/>
                </svg>
                <h2 className="ml-3 text-[1.15rem] font-semibold text-gray-800">
                  {courts.find(court => court.name === localStorage.getItem('selectedCourtName'))?.name}
                </h2>
              </div>
            </div>
          </div>
          <Evaluations />
        </>
      ) : (
        
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Районные суды</h2>
          <Map selectedRayon={null} onSelectRayon={() => {}} courts={courts}/>
          <table className="min-w-full border-collapse border border-gray-300 mt-8">
            <thead className="bg-gray-100 select-none">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-center font-bold text-base whitespace-nowrap">
                  №
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center font-bold text-base whitespace-nowrap">
                  Наименование суда
                </th>
                <th 
                  className="border border-gray-300 px-4 py-2 text-center font-bold text-base whitespace-nowrap cursor-pointer"
                  onClick={() => handleSort('overall')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Общая оценка
                    {getSortIcon('overall')}
                  </div>
                </th>
                <th 
                  className="border border-gray-300 px-4 py-2 text-center font-bold text-base whitespace-nowrap cursor-pointer"
                  onClick={() => handleSort('judge')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Судья
                    {getSortIcon('judge')}
                  </div>
                </th>
                <th 
                  className="border border-gray-300 px-4 py-2 text-center font-bold text-base whitespace-nowrap cursor-pointer"
                  onClick={() => handleSort('process')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Процесс
                    {getSortIcon('process')}
                  </div>
                </th>
                <th 
                  className="border border-gray-300 px-4 py-2 text-center font-bold text-base whitespace-nowrap cursor-pointer"
                  onClick={() => handleSort('staff')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Сотрудники
                    {getSortIcon('staff')}
                  </div>
                </th>
                <th 
                  className="border border-gray-300 px-4 py-2 text-center font-bold text-base whitespace-nowrap cursor-pointer"
                  onClick={() => handleSort('office')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Канцелярия
                    {getSortIcon('office')}
                  </div>
                </th>
                <th 
                  className="border border-gray-300 px-4 py-2 text-center font-bold text-base whitespace-nowrap cursor-pointer"
                  onClick={() => handleSort('building')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Здание
                    {getSortIcon('building')}
                  </div>
                </th>
                <th 
                  className="border border-gray-300 px-4 py-2 text-center font-bold text-base whitespace-nowrap cursor-pointer"
                  onClick={() => handleSort('count')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Кол-во оценок
                    {getSortIcon('count')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedCourts.map((court, index) => (
                <tr key={court.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                  <td 
                    className="border border-gray-300 px-4 py-2 cursor-pointer text-blue-600 hover:text-blue-800 hover:underline text-center"
                    onClick={() => handleCourtClick(court)}
                  >
                    {court.name}
                  </td>
                  <td className={`border border-gray-300 px-4 py-2 ${getRatingColor(court.overall_assessment)}`}>
                    {renderTableCell(court.overall_assessment)}
                  </td>
                  <td className={`border border-gray-300 px-4 py-2 ${getRatingColor(court.assessment.judge)}`}>
                    {renderTableCell(court.assessment.judge)}
                  </td>
                  <td className={`border border-gray-300 px-4 py-2 ${getRatingColor(court.assessment.process)}`}>
                    {renderTableCell(court.assessment.process)}
                  </td>
                  <td className={`border border-gray-300 px-4 py-2 ${getRatingColor(court.assessment.staff)}`}>
                    {renderTableCell(court.assessment.staff)}
                  </td>
                  <td className={`border border-gray-300 px-4 py-2 ${getRatingColor(court.assessment.office)}`}>
                    {renderTableCell(court.assessment.office)}
                  </td>
                  <td className={`border border-gray-300 px-4 py-2 ${getRatingColor(court.assessment.building)}`}>
                    {renderTableCell(court.assessment.building)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {court.total_survey_responses}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
