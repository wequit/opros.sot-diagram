import Map from './components/Map_rayon';
import Dates from '@/lib/utils/Dates';

export const courts = [
  { id: 1, name: 'Верховный суд Кыргызской Республики', instance: '3-я инстанция (кассационная)', 
    ratings: [4.8, 4.7, 4.6, 4.8, 4.7, 4.9, 180] },

  // Чуйская область
  { id: 2, name: 'Аламудунский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.2, 3.8, 4.1, 4.3, 4.0, 4.2, 95] },
  { id: 3, name: 'Сокулукский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.9, 4.1, 3.8, 4.0, 4.2, 3.9, 88] },
  { id: 4, name: 'Московский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.7, 4.2, 3.9, 4.1, 4.0, 76] },
  { id: 5, name: 'Жайылский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.8, 4.0, 3.9, 4.1, 3.8, 4.2, 82] },
  { id: 6, name: 'Панфиловский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 3.9, 4.1, 3.8, 4.0, 3.9, 71] },
  { id: 7, name: 'Кеминский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.7, 4.1, 3.8, 4.0, 3.9, 4.1, 68] },
  { id: 8, name: 'Ысык-Атинский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.8, 4.0, 4.2, 3.9, 4.0, 92] },
  { id: 9, name: 'Чуйский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.9, 4.0, 3.8, 4.1, 4.0, 3.9, 87] },

  // Иссык-Кульская область
  { id: 10, name: 'Ак-Суйский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 3.9, 4.1, 3.8, 4.0, 3.9, 77] },
  { id: 11, name: 'Джети-Огузский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.8, 4.1, 3.9, 4.0, 3.8, 4.1, 81] },
  { id: 12, name: 'Тонский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.9, 3.8, 4.0, 3.9, 4.1, 3.8, 72] },
  { id: 13, name: 'Тюпский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.9, 3.8, 4.0, 3.9, 4.1, 69] },
  { id: 14, name: 'Иссык-Кульский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 4.1, 3.9, 4.0, 3.8, 4.2, 83] },

  // Нарынская область
  { id: 15, name: 'Ак-Талинский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.8, 4.0, 3.9, 4.1, 3.8, 4.0, 71] },
  { id: 16, name: 'Ат-Башинский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.8, 4.0, 3.9, 4.1, 3.8, 74] },
  { id: 17, name: 'Жумгальский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.9, 4.1, 3.8, 4.0, 3.9, 4.1, 67] },
  { id: 18, name: 'Кочкорский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 3.9, 4.1, 3.8, 4.0, 3.9, 73] },
  { id: 19, name: 'Нарынский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.8, 4.1, 3.9, 4.0, 3.8, 4.1, 78] },

  // Таласская область
  { id: 20, name: 'Таласский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.9, 4.0, 4.2, 4.1, 4.3, 75] },
  { id: 21, name: 'Бакай-Атинский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 3.8, 4.1, 4.2, 4.0, 4.2, 70] },
  { id: 22, name: 'Кара-Буринский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.9, 3.7, 4.1, 4.0, 4.2, 4.1, 65] },
  { id: 23, name: 'Манасский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 3.8, 4.2, 4.1, 4.0, 4.2, 70] },

  // Ошская область
  { id: 24, name: 'Алайский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 3.8, 4.1, 4.2, 4.0, 4.2, 75] },
  { id: 25, name: 'Араванский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.9, 4.0, 4.2, 4.1, 4.3, 80] },
  { id: 26, name: 'Кара-Кулджинский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.9, 3.7, 4.1, 4.0, 4.2, 4.1, 70] },
  { id: 27, name: 'Кара-Сууский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.2, 4.0, 4.1, 4.3, 4.2, 4.0, 85] },
  { id: 28, name: 'Ноокатский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.9, 4.0, 4.2, 4.1, 4.3, 80] },
  { id: 29, name: 'Узгенский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 3.8, 4.2, 4.1, 4.0, 4.2, 75] },
  { id: 30, name: 'Чон-Алайский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.9, 3.7, 4.1, 4.0, 4.2, 4.1, 65] },

  // Джалал-Абадская область
  { id: 31, name: 'Аксыйский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 3.8, 4.1, 4.2, 4.0, 4.2, 75] },
  { id: 32, name: 'Ала-Букинский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.9, 4.0, 4.2, 4.1, 4.3, 70] },
  { id: 33, name: 'Базар-Коргонский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 3.8, 4.2, 4.1, 4.0, 4.2, 80] },
  { id: 34, name: 'Ноокенский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.9, 3.7, 4.1, 4.0, 4.2, 4.1, 75] },
  { id: 35, name: 'Сузакский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.2, 4.0, 4.1, 4.3, 4.2, 4.0, 85] },
  { id: 36, name: 'Тогуз-Тороуский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 3.8, 4.1, 4.2, 4.0, 4.2, 65] },
  { id: 37, name: 'Токтогульский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.9, 4.0, 4.2, 4.1, 4.3, 70] },
  { id: 38, name: 'Чаткальский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.9, 3.7, 4.1, 4.0, 4.2, 4.1, 60] },
  
  // Баткенская область
  { id: 39, name: 'Баткенский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 3.8, 4.1, 4.2, 4.0, 4.2, 75] },
  { id: 40, name: 'Кадамжайский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.9, 4.0, 4.2, 4.1, 4.3, 70] },
  { id: 41, name: 'Лейлекский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 3.8, 4.2, 4.1, 4.0, 4.2, 65] },

  
  // Города республиканского значения
  { id: 42, name: 'Ленинский районный суд г. Бишкек', instance: '1-я инстанция (местный)',
    ratings: [4.2, 4.0, 4.1, 4.3, 4.2, 4.4, 120] },
  { id: 43, name: 'Октябрьский районный суд г. Бишкек', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.9, 4.0, 4.2, 4.1, 4.3, 110] },
  { id: 44, name: 'Первомайский районный суд г. Бишкек', instance: '1-я инстанция (местный)',
    ratings: [4.2, 4.0, 4.1, 4.3, 4.2, 4.4, 115] },
  { id: 45, name: 'Свердловский районный суд г. Бишкек', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.9, 4.0, 4.2, 4.1, 4.3, 105] },

  // Межрайонные суды
  { id: 46, name: 'Бишкекский межрайонный суд', instance: '1-я инстанция (местный)',
    ratings: [4.2, 4.0, 4.1, 4.3, 4.2, 4.4, 120] },
  { id: 47, name: 'Баткенский межрайонный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.9, 4.0, 4.2, 4.1, 4.3, 110] },
  { id: 48, name: 'Таласский межрайонный суд', instance: '1-я инстанция (местный)',
    ratings: [4.2, 4.0, 4.1, 4.3, 4.2, 4.4, 115] },
  { id: 49, name: 'Нарынский межрайонный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.9, 4.0, 4.2, 4.1, 4.3, 105] },
  { id: 50, name: 'Ошский межрайонный суд', instance: '1-я инстанция (местный)',
    ratings: [4.2, 4.0, 4.1, 4.3, 4.2, 4.4, 120] },
  { id: 51, name: 'Жалал-Абадский межрайонный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.9, 4.0, 4.2, 4.1, 4.3, 110] },
  { id: 52, name: 'Иссык-Кульский межрайонный суд', instance: '1-я инстанция (местный)',
    ratings: [4.2, 4.0, 4.1, 4.3, 4.2, 4.4, 115] },
  { id: 53, name: 'Чуйский межрайонный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.9, 4.0, 4.2, 4.1, 4.3, 105] },
];

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
                {courts.map((court) => (
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
