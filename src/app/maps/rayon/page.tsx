import Map from './components/Map_rayon';
import Dates from '@/lib/utils/Dates';

export default function RayonPage() {
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
                    Наименование суда
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 w-[20%]">
                    Инстанция
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 w-[7%]">
                    Общая оценка
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 w-[7%]">
                    Судья
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 w-[7%]">
                    Процесс
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 w-[7%]">
                    Сотрудники
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 w-[7%]">
                    Канцелярия
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 w-[7%]">
                    Доступность
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 w-[7%]">
                    Кол-во оценок
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, name: 'Верховный суд Кыргызской Республики', instance: '3-я инстанция (кассационная)', ratings: [4.5, 4.2, 4.3, 4.4, 4.6, 4.7, 150] },
                  { id: 2, name: 'Таласский областной суд', instance: '2-я интанция (апелляционная)', ratings: [4.3, 4.1, 4.2, 4.3, 4.4, 4.5, 120] },
                  { id: 3, name: 'Таласский районный суд', instance: '1-я интанция (местный)', ratings: [4.2, 4.0, 4.1, 4.2, 4.3, 4.4, 100] },
                  { id: 4, name: 'Бакай-Атинский районный суд', instance: '1-я интанция (местный)', ratings: [4.1, 3.9, 4.0, 4.1, 4.2, 4.3, 90] },
                  { id: 5, name: 'Кара-Буринский районный суд', instance: '1-я интанция (местный)', ratings: [4.0, 3.8, 3.9, 4.0, 4.1, 4.2, 80] },
                  { id: 6, name: 'Манасский районный суд', instance: '1-я интанция (местный)', ratings: [3.9, 3.7, 3.8, 3.9, 4.0, 4.1, 70] }
                ].map((court) => (
                  <tr key={court.id} className="hover:bg-gray-50/50 border-b border-gray-200">
                    <td className="px-3 py-2.5 text-sm text-gray-900 text-center border-r border-gray-200">{court.id}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-900 border-r border-gray-200">{court.name}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 border-r border-gray-200">{court.instance}</td>
                    {court.ratings.map((rating, index) => (
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
