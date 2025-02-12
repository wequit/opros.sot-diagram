'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/utils/AuthContext';
import ChuyMap from '../components/ChuyMap';
import { CourtData } from '../types';
import { getCookie } from '@/api/login';

// Полный список судов Чуйской области
const chuyCourtData: CourtData[] = [
  {
    id: 1,
    name: "Чуйский областной суд",
    instance: "2-я инстанция (апелляционная)",
    building_rating: 0,
    overall_assessment: 0,
    judge_rating: 0,
    process_rating: 0,
    staff_rating: 0,
    office_rating: 0,
    accessibility_rating: 0,
    total_responses: 0
  },
  {
    id: 2,
    name: "Аламудунский районный суд",
    instance: "1-я инстанция (местный)",
    building_rating: 0,
    overall_assessment: 0,
    judge_rating: 0,
    process_rating: 0,
    staff_rating: 0,
    office_rating: 0,
    accessibility_rating: 0,
    total_responses: 0
  },
  {
    id: 3,
    name: "Сокулукский районный суд",
    instance: "1-я инстанция (местный)",
    building_rating: 0,
    overall_assessment: 0,
    judge_rating: 0,
    process_rating: 0,
    staff_rating: 0,
    office_rating: 0,
    accessibility_rating: 0,
    total_responses: 0
  },
  {
    id: 4,
    name: "Московский районный суд",
    instance: "1-я инстанция (местный)",
    building_rating: 0,
    overall_assessment: 0,
    judge_rating: 0,
    process_rating: 0,
    staff_rating: 0,
    office_rating: 0,
    accessibility_rating: 0,
    total_responses: 0
  },
  {
    id: 5,
    name: "Жайылский районный суд",
    instance: "1-я инстанция (местный)",
    building_rating: 0,
    overall_assessment: 0,
    judge_rating: 0,
    process_rating: 0,
    staff_rating: 0,
    office_rating: 0,
    accessibility_rating: 0,
    total_responses: 0
  },
  {
    id: 6,
    name: "Панфиловский районный суд",
    instance: "1-я инстанция (местный)",
    building_rating: 0,
    overall_assessment: 0,
    judge_rating: 0,
    process_rating: 0,
    staff_rating: 0,
    office_rating: 0,
    accessibility_rating: 0,
    total_responses: 0
  },
  {
    id: 7,
    name: "Ысык-Атинский районный суд",
    instance: "1-я инстанция (местный)",
    building_rating: 0,
    overall_assessment: 0,
    judge_rating: 0,
    process_rating: 0,
    staff_rating: 0,
    office_rating: 0,
    accessibility_rating: 0,
    total_responses: 0
  },
  {
    id: 8,
    name: "Кеминский районный суд",
    instance: "1-я инстанция (местный)",
    building_rating: 0,
    overall_assessment: 0,
    judge_rating: 0,
    process_rating: 0,
    staff_rating: 0,
    office_rating: 0,
    accessibility_rating: 0,
    total_responses: 0
  },
  {
    id: 9,
    name: "Чуй-Токмокский районный суд",
    instance: "1-я инстанция (местный)",
    building_rating: 0,
    overall_assessment: 0,
    judge_rating: 0,
    process_rating: 0,
    staff_rating: 0,
    office_rating: 0,
    accessibility_rating: 0,
    total_responses: 0
  }
];

export default function ChuyPage() {
  const [courtData, setCourtData] = useState<CourtData[]>(chuyCourtData);
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourtData = async () => {
      try {
        const response = await fetch('https://opros.sot.kg/api/v1/courts/chuy', {
          headers: {
            'Authorization': `Bearer ${getCookie('access_token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch court data');
        }

        const data = await response.json();
        if (data.courts && data.courts.length > 0) {
          setCourtData(data.courts);
        }
      } catch (error) {
        console.error('Error fetching court data:', error);
      }
    };

    if (user?.role === '2') {
      fetchCourtData();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 py-6">
        <h1 className="text-2xl font-normal mb-6">Суды Чуйской области</h1>
        
        {/* Карта */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
          <ChuyMap />
        </div>

        {/* Таблица */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Наименование суда</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Инстанция</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Общая оценка</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Судья</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Процесс</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сотрудники</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Канцелярия</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Доступность</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courtData.map((court, index) => (
                  <tr 
                    key={court.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{court.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{court.instance}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{court.overall_assessment}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{court.judge_rating}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{court.process_rating}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{court.staff_rating}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{court.office_rating}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{court.accessibility_rating}</td>
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
