'use client';
import Map from './components/Map_oblast';
import { useState } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'; // Иконки для сортировки

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'overall' | 'judge' | 'process' | 'staff' | 'office' | 'accessibility' | 'count' | null;

// Определяем интерфейс для данных области
interface OblastData {
  id: number;
  name: string;
  ratings: number[];
  coordinates: [number, number];
}

export default function OblastPage() {
  const [selectedOblast, setSelectedOblast] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Определяем данные областей
  const oblastData: OblastData[] = [
    { 
      id: 1, 
      name: 'Верховный суд Кыргызской Республики', 
      ratings: [4.8, 4.7, 4.6, 4.8, 4.7, 4.9, 180],
      coordinates: [74.60, 42.85] as [number, number]
    },
    { 
      id: 2, 
      name: 'Суды Таласской области', 
      ratings: [3.5, 2.5, 2.1, 1.3, 2.5, 2.1, 888],
      coordinates: [72.00, 42.50] as [number, number]
    },
    { id: 3, name: 'Суды Чуйской области', ratings: [3.5, 2.5, 2.1, 1.3, 2.5, 2.1, 433], 
      coordinates: [74.05, 42.65] },
    { id: 4, name: 'Суды Ошской области', ratings: [3.5, 2.5, 2.1, 1.3, 2.5, 2.1, 403], 
      coordinates: [73.60, 40.50] },
    { id: 5, name: 'Суды Жалал-Абадской области', ratings: [4.3, 3.8, 3.9, 4.0, 4.1, 4.2, 555], 
      coordinates: [73.00, 41.50] },
    { id: 6, name: 'Суды Нарынской области', ratings: [4.1, 3.7, 3.8, 3.9, 4.0, 4.1, 444], 
      coordinates: [75.68, 41.43] },
    { id: 7, name: 'Суды Баткенской области', ratings: [3.3, 3.7, 3.8, 3.9, 4.0, 4.1, 333], 
      coordinates: [70.00, 39.90] },
    { id: 8, name: 'Суды Иссык-Кульской области', ratings: [3.3, 3.7, 3.8, 3.9, 4.0, 4.1, 333], 
      coordinates: [78.70, 42.20] },
      { 
        id: 9, 
        name: 'Ош', 
        ratings: [4.8, 4.7, 4.6, 4.8, 4.7, 4.9, 180],
        coordinates: [74.60, 42.85] as [number, number]
      },
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc');
      if (sortDirection === 'desc') setSortField(null);
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

  const sortedData = [...oblastData].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;
    
    const getValueByField = (item: OblastData) => {
      const index = {
        'overall': 0,
        'judge': 1,
        'process': 2,
        'staff': 3,
        'office': 4,
        'accessibility': 5,
        'count': 6
      }[sortField];
      return item.ratings[index];
    };

    const aValue = getValueByField(a);
    const bValue = getValueByField(b);
    
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-medium">Оценки по областям</h2>
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
          <Map selectedOblast={selectedOblast} oblastData={oblastData} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">№</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">
                    Наименование области
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer">
                    <div className="flex items-center justify-between px-2">
                      <span>Общая оценка</span>
                      <span onClick={() => handleSort('overall')}>{getSortIcon('overall')}</span>
                    </div>
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer">
                    <div className="flex items-center justify-between px-2">
                      <span>Судья</span>
                      <span onClick={() => handleSort('judge')}>{getSortIcon('judge')}</span>
                    </div>
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer">
                    <div className="flex items-center justify-between px-2">
                      <span>Процесс</span>
                      <span onClick={() => handleSort('process')}>{getSortIcon('process')}</span>
                    </div>
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer">
                    <div className="flex items-center justify-between px-2">
                      <span>Сотрудники</span>
                      <span onClick={() => handleSort('staff')}>{getSortIcon('staff')}</span>
                    </div>
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer">
                    <div className="flex items-center justify-between px-2">
                      <span>Канцелярия</span>
                      <span onClick={() => handleSort('office')}>{getSortIcon('office')}</span>
                    </div>
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer">
                    <div className="flex items-center justify-between px-2">
                      <span>Доступность</span>
                      <span onClick={() => handleSort('accessibility')}>{getSortIcon('accessibility')}</span>
                    </div>
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between px-2">
                      <span>Кол-во оценок</span>
                      <span onClick={() => handleSort('count')}>{getSortIcon('count')}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((oblast) => (
                  <tr key={oblast.id} className="hover:bg-gray-50/50 border-b border-gray-200">
                    <td className="px-3 py-2.5 text-sm text-gray-900 text-center border-r border-gray-200">{oblast.id}</td>
                    <td 
                      className="px-3 py-2.5 text-sm text-gray-900 border-r border-gray-200 cursor-pointer hover:text-blue-600"
                      onClick={() => setSelectedOblast(oblast.name)}
                    >
                      {oblast.name}
                    </td>
                    {oblast.ratings.map((rating: number, index: number) => (
                      <td key={index} className="px-3 py-2.5 text-sm text-gray-600 text-center border-r border-gray-200">
                        {rating}
                      </td>
                    ))}
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