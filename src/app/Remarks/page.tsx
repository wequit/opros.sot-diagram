//Страница "Замечания и предложения"

'use client';
import Data from '@/lib/utils/Data';
import React, { useState, useEffect, useMemo } from 'react';

type DataItem = {
  id: number;
  comment: string;
  action: string;
};

export default function SuggestionsPage() {
  const [data, setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visibleActions, setVisibleActions] = useState<{ [key: number]: boolean }>({});

  const itemsPerPage = 35;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = useMemo(
    () => data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [data, currentPage, itemsPerPage],
  );

  useEffect(() => {
    fetch('/data.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных');
        }
        return response.json();
      })
      .then((data: DataItem[]) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const toggleActionVisibility = (id: number) => {
    setVisibleActions((prev) => {
      const newVisibleActions = { ...prev, [id]: !prev[id] };
      Object.keys(newVisibleActions).forEach((key) => {
        if (parseInt(key) !== id) {
          newVisibleActions[parseInt(key)] = false;
        }
      });
      return newVisibleActions;
    });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (!(event.target as HTMLElement).closest('.action-menu')) {
      setVisibleActions({});
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <p className="text-center text-gray-700">Загрузка данных...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Ошибка: {error}</p>;
  }
  return (
    <>
    <h2 className="text-2xl font-semibold text-gray-800 ">Замечания и предложения</h2>
    <Data />
    <div className="p-4 mt-4 ">
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase">
              <th className="border border-gray-300 px-2 py-2 text-center">№</th>
              <th className="border border-gray-300 px-2 py-2">Замечания</th>
              <th className="border border-gray-300 px-2 py-2">Комментарии/Принятые меры</th>
              <th className="border border-gray-300 px-2 py-2 text-center">Действия</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50 even:bg-gray-50">
                <td className="border border-gray-300 px-2 py-2 text-center">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="border border-gray-300 px-2 py-2">{item.comment}</td>
                <td className="border border-gray-300 px-2 py-2">{item.action}</td>
                <td className="border border-gray-300 px-2 py-2 text-center">
                  <div className="relative action-menu">
                    <button
                      className="p-2 bg-gray-200 rounded focus:outline-none focus:ring md:hidden"
                      onClick={() => toggleActionVisibility(item.id)}
                      aria-label="Открыть меню действий">
                      <span className="text-xl">⋮</span>
                    </button>

                    <button
                      className="text-blue-500 hover:underline hidden md:inline"
                      onClick={() => alert('Комментировать')}>
                      Комментировать
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-4 gap-2 flex-wrap">
        <button
          className="px-3 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Назад">
          Назад
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={`page-${index + 1}`}
            className={`px-3 py-1 rounded ${currentPage === index + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            onClick={() => handlePageChange(index + 1)}
            aria-label={`Страница ${index + 1}`}>
            {index + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Вперед">
          Вперед
        </button>
      </div>
    </div>
    </>
  );
}
