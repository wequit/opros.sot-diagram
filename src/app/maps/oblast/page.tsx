import Map from './components/Map_oblast';
import Dates from '@/lib/utils/Dates';

export default function OblastPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="mb-4">
          <Dates />
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-100">
          <Map />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th scope="col" className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 w-[4%]">№</th>
                  <th scope="col" className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 w-[25%]">
                    Наименование области
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 w-[10%]">
                    Общая оценка
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 w-[10%]">
                    Судья
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 w-[10%]">
                    Процесс
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 w-[10%]">
                    Сотрудники
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 w-[10%]">
                    Канцелярия
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 w-[10%]">
                    Доступность
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 w-[10%]">
                    Кол-во оценок
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, name: 'г. Бишкек', ratings: [5.0, 3.3, 3.1, 4.1, 3.3, 3.1, 999] },
                  { id: 3, name: 'Чуйская область', ratings: [4.2, 4.3, 2.2, 3.2, 4.3, 2.2, 777] },
                  { id: 2, name: 'Таласская область', ratings: [3.5, 2.5, 2.1, 1.3, 2.5, 2.1, 888] },
                  { id: 4, name: 'Иссык-Кульская область', ratings: [4.3, 3.9, 4.0, 4.1, 4.2, 4.3, 666] },
                  { id: 5, name: 'Нарынская область', ratings: [4.3, 3.8, 3.9, 4.0, 4.1, 4.2, 555] },
                  { id: 6, name: 'Джалал-Абадская область', ratings: [4.1, 3.7, 3.8, 3.9, 4.0, 4.1, 444] },
                  { id: 7, name: 'Баткенская область', ratings: [3.3, 3.7, 3.8, 3.9, 4.0, 4.1, 333] }
                ].map((oblast) => (
                  <tr key={oblast.id} className="hover:bg-gray-50/50 border-b border-gray-200">
                    <td className="px-3 py-2.5 text-sm text-gray-900 text-center border-r border-gray-200">{oblast.id}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-900 border-r border-gray-200">{oblast.name}</td>
                    {oblast.ratings.map((rating, index) => (
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