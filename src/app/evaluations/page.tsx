'use client';
import React, { useState } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Radar, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface RatingScaleProps {
  value: number;
  votes: number;
}

const RatingScale = ({ value, votes }: RatingScaleProps) => {
  const safeValue = value || 0;
  const indicatorPosition = (safeValue / 5) * 100;

  return (
    <div className="relative w-full">
      <div className="h-4 flex rounded-full overflow-hidden">
        <div className="w-1/5 bg-[#FF8B8B]" />
        <div className="w-1/5 bg-[#FFB088]" />
        <div className="w-1/5 bg-[#FFE183]" />
        <div className="w-1/5 bg-[#B8E986]" />
        <div className="w-1/5 bg-[#7BC86C]" />
      </div>
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-black"
        style={{ left: `${indicatorPosition}%` }}
      />
    </div>
  );
};

const EvaluationResults = () => {
  const [activeTab, setActiveTab] = useState('gender');
  
  // Данные для радарной диаграммы
  const radarData = {
    labels: ['Судья', 'Секретарь, помощник', 'Канцелярия', 'Процесс', 'Пристав', 'Здание'],
    datasets: [
      {
        label: 'Ноокенский суд',
        data: [4.5, 4.2, 3.8, 4.0, 3.9, 3.7],
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 2,
      },
      {
        label: 'Средние оценки по республике',
        data: [4.2, 3.9, 3.5, 3.8, 3.6, 3.4],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      }
    ]
  };

  // Опции для радарной диаграммы
  const radarOptions = {
    scales: {
      r: {
        min: 0,
        max: 5,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      }
    }
  };

  // Данные для категорий респондентов
  const respondentData = {
    labels: [
      'Сторона по делу (истец)',
      'Сторона по делу (ответчик)',
      'Свидетель',
      'Посетитель',
    ],
    datasets: [{
      data: [25, 25, 25, 25],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
      ],
      datalabels: {
        display: true
      }
    }]
  };

  // Данные для источников трафика
  const trafficData = {
    labels: ['Cross-network', 'Paid Search', 'Display', 'Direct', 'Organic Search', 'Organic Social'],
    datasets: [{
      data: [4000, 3000, 2000, 1000, 500, 100],
      backgroundColor: 'rgba(54, 162, 235, 0.8)',
    }]
  };

  // Данные для круговой диаграммы пола
  const genderData = {
    labels: ['Женский', 'Мужской'],
    datasets: [{
      data: [37.5, 62.5],
      backgroundColor: [
        'rgba(83, 166, 250, 1)',
        'rgba(255, 145, 159, 1)',
      ],
      datalabels: {
        display: true
      }
    }]
  };

  // Данные для круговой диаграммы аудио/видео фиксации
  const recordingData = {
    labels: ['Да', 'Нет', 'Не знаю/Не уверен(а)'],
    datasets: [{
      data: [25, 37.5, 37.5],
      backgroundColor: [
        'rgba(13, 110, 253, 1)',
        'rgba(220, 53, 69, 1)',
        'rgba(255, 153, 0, 1)'
      ],
      datalabels: {
        display: true
      }
    }]
  };

  // Данные для возрастной диаграммы
  const ageData = {
    labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
    datasets: [{
      data: [35, 28, 20, 10, 5, 2],
      backgroundColor: 'rgba(13, 110, 253, 1)',
      borderColor: 'rgba(13, 110, 253, 1)',
      borderWidth: 1,
    }]
  };

  // Данные для торнадо диаграммы (пол и возраст)
  const genderAgeData = {
    labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
    datasets: [
      {
        label: 'Женщины',
        data: [-35, -28, -20, -10, -5, -2],
        backgroundColor: 'rgba(83, 166, 250, 1)',
        borderColor: 'rgba(83, 166, 250, 1)',
        borderWidth: 1,
      },
      {
        label: 'Мужчины',
        data: [30, 25, 18, 12, 8, 4],
        backgroundColor: 'rgba(255, 145, 159, 1)',
        borderColor: 'rgba(255, 145, 159, 1)',
        borderWidth: 1,
      }
    ]
  };

  // Общие опции для круговых диаграмм
  const pieOptions = {
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        enabled: true
      },
      datalabels: {
        color: '#000000',
        font: {
          weight: 'bold',
          size: 13
        },
        formatter: (value: number, context: any) => {
          const label = context.chart.data.labels[context.dataIndex];
          return [label, value + '%'];
        },
        anchor: 'center',
        align: 'center',
        display: true,
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 4,
        padding: 4
      }
    },
    maintainAspectRatio: false,
    layout: {
      padding: 20
    }
  };

  // Общие опции для столбчатых диаграмм
  const barOptions = {
    indexAxis: 'y' as const,
    plugins: { 
      legend: { display: false }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value: number) => `${value}%`,
          font: {
            size: 12
          }
        }
      },
      y: {
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  // Опции для возрастной диаграммы
  const ageOptions = {
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `${Math.abs(value)}%`
        },
        grid: {
          display: false
        }
      }
    },
    maintainAspectRatio: false
  };

  // Опции для торнадо диаграммы
  const genderAgeOptions = {
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: (value: number) => `${Math.abs(value)}%`
        }
      },
      y: {
        stacked: true
      }
    },
    maintainAspectRatio: false
  };

  // Данные для замечаний
  const suggestions = [
    { id: 1, text: 'Туалет не работает' },
    { id: 2, text: 'Кресел нет' },
    { id: 3, text: 'Вежливые сотрудники' },
    { id: 4, text: 'Нет парковки' },
    { id: 5, text: 'Работают очень медленно' },
  ];

  // Данные для оценок судьи
  const judgeRatings = [
    {
      title: "Разъяснение прав и обязанностей в судебном процессе",
      value: 3.0,
      votes: 999
    },
    {
      title: "Обеспечению равных условий для сторон в процессе",
      value: 4.1,
      votes: 999
    },
    {
      title: "Проявление уважения к участникам судебного процесса",
      value: 3.5,
      votes: 999
    },
    {
      title: "Контроль судьи за порядком в зале суда",
      value: 2.0,
      votes: 999
    },
    {
      title: "Разъяснение судебного решение",
      value: 2.0,
      votes: 999
    }
  ];

  // Данные для оценок помощника и секретаря
  const secretaryRatings = [
    {
      title: "Вежливость при общении",
      value: 3.8,
      votes: 999
    },
    {
      title: "Доступность информации о процессе",
      value: 3.2,
      votes: 999
    },
    {
      title: "Своевременность оформления документов",
      value: 4.0,
      votes: 999
    }
  ];

  // Обновленные данные для оценок канцелярии
  const officeRatings = [
    {
      title: "Взаимодействие с судебной канцелярией",
      value: 3.0,
      votes: 999
    },
    {
      title: "Предоставление всей необходимой информации",
      value: 4.1,
      votes: 999
    }
  ];

  // Данные для оценок доступности
  const accessibilityRatings = [
    {
      title: "Доступность здания суда для людей с инвалидностью и маломобильных категорий",
      value: 0.0,
      votes: 999
    },
    {
      title: "Оцените удобство и комфорт зала суда",
      value: 0.0,
      votes: 999
    },
    {
      title: "Навигация внутри здания суда",
      value: 0.0,
      votes: 999
    }
  ];

  // Данные для оценок судебных приставов
  const bailiffRatings = [
    {
      title: "Профессионализм судебных приставов",
      value: 0.0,
      votes: 999
    },
    {
      title: "Уровень безопасности в здании суда, на процессах",
      value: 0.0,
      votes: 999
    }
  ];

  // Данные для графика помощника/секретаря
  const secretaryBarData = {
    labels: [
      'Грубость',
      'Игнорирование',
      'Перебивали речи',
      'Не давали выступить',
      'Сарказм и насмешки'
    ],
    datasets: [{
      data: [50, 33.3, 16.7, 50, 66.7],
      backgroundColor: 'rgba(121, 82, 179, 0.8)',
    }]
  };

  // Данные для графика канцелярии
  const officeBarData = {
    labels: [
      'Грубость',
      'Игнорирование',
      'Перебивали речи',
      'Не давали выступить',
      'Сарказм и насмешки'
    ],
    datasets: [{
      data: [45, 30, 20, 55, 60],
      backgroundColor: 'rgba(121, 82, 179, 0.8)',
    }]
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Общие показатели */}
      <div className="max-w-[1440px] mx-auto mt-6">
        <h2 className="text-xl font-bold text-[#212529] mb-4">Общие показатели</h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Левая колонка */}
          <div className="space-y-6">
            <div>
              <div className="bg-[#F8F9FA] px-4 py-3 rounded-t-lg">
                <h2 className="text-[16px] font-medium text-[#212529]">Общие показатели</h2>
                <span className="text-[14px] text-[#6C757D]">Количество ответов: 999</span>
              </div>
              <div className="bg-white p-6 rounded-b-lg shadow-sm">
                <div className="h-[400px]">
                  <Radar data={radarData} options={radarOptions} />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-[16px] font-medium text-[#212529] mb-6">
                Категории респондентов
              </h3>
              <div className="h-64">
                <Pie data={respondentData} options={pieOptions} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-[16px] font-medium text-[#212529] mb-6">
                Источник трафика
              </h3>
              <div className="h-64">
                <Bar data={trafficData} options={barOptions} />
              </div>
            </div>
          </div>

          {/* Правая колонка */}
          <div className="space-y-6">
            <div>
              <div className="bg-[#F8F9FA] px-4 py-3 rounded-t-lg">
                <h2 className="text-[16px] font-medium text-[#212529]">
                  Замечания и предложения
                </h2>
                <span className="text-[14px] text-[#6C757D]">Количество ответов: 999</span>
              </div>
              <div className="bg-white p-6 rounded-b-lg shadow-sm">
                <div className="divide-y divide-[#DEE2E6]">
                  {suggestions.map((item) => (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <span className="text-[#6C757D]">{item.id}</span>
                        <span className="text-[#212529]">{item.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-6 w-full bg-[#D1E7DD] text-[#0F5132] py-2 px-4 rounded hover:bg-[#B7DBCB] transition-colors">
                  Все замечания и преложения
                </button>
              </div>
            </div>

            {/* Демографические показатели */}
            <div className="bg-white rounded-lg shadow-sm">
              <h3 className="px-6 py-4 text-[16px] font-medium text-[#212529] border-b border-[#DEE2E6]">
                Демографические показатели
              </h3>
              <div className="flex border-b border-[#DEE2E6]">
                <button 
                  className={`flex-1 px-6 py-2 text-[14px] ${activeTab === 'gender' ? 'bg-[#E7F1FF] text-[#0D6EFD]' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('gender')}
                >
                  Пол
                </button>
                <button 
                  className={`flex-1 px-6 py-2 text-[14px] ${activeTab === 'genderAge' ? 'bg-[#E7F1FF] text-[#0D6EFD]' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('genderAge')}
                >
                  Пол и возраст
                </button>
                <button 
                  className={`flex-1 px-6 py-2 text-[14px] ${activeTab === 'age' ? 'bg-[#E7F1FF] text-[#0D6EFD]' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('age')}
                >
                  Возраст
                </button>
              </div>
              <div className="p-6 h-[300px]">
                {activeTab === 'gender' && <Pie data={genderData} options={pieOptions} />}
                {activeTab === 'genderAge' && <Bar data={genderAgeData} options={genderAgeOptions} />}
                {activeTab === 'age' && <Bar data={ageData} options={ageOptions} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Оценки судьи */}
      <div className="max-w-[1440px] mx-auto mt-6">
        <h2 className="text-xl font-bold text-[#212529] mb-4">Оценки судьи</h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Оценки судьи */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="space-y-5">
              {judgeRatings.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="flex-1 text-[14px] text-[#212529]">{item.title}</span>
                  <RatingScale value={item.value} votes={item.votes} />
                </div>
              ))}
            </div>
          </div>

          {/* Проявление неуважения */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">
              Проявление неуважения. Кол-во записей: 888
            </h3>
            <div className="h-64">
              <Bar
                data={{
                  labels: [
                    'Грубость',
                    'Игнорирование',
                    'Перебивали речи',
                    'Не давали выступить',
                    'Сарказм и насмешки'
                  ],
                  datasets: [{
                    data: [50, 33.3, 16.7, 50, 66.7],
                    backgroundColor: 'rgba(121, 82, 179, 0.8)',
                  }]
                }}
                options={{
                  indexAxis: 'y',
                  plugins: { legend: { display: false } },
                  scales: {
                    x: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: value => `${value}%`
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Оценки помощника и секретаря */}
      <div className="max-w-[1440px] mx-auto mt-6">
        <h2 className="text-xl font-bold text-[#212529] mb-4">Оценки помощника и секретаря</h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Левая колонка с оценками */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="space-y-5">
              {secretaryRatings.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="flex-1 text-[14px] text-[#212529]">{item.title}</span>
                  <RatingScale value={item.value} votes={item.votes} />
                </div>
              ))}
            </div>
          </div>
          {/* Правая колонка с круговой диаграммой */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">
              Использование средств аудио и видеофиксации судебного заседания по уголовным делам
            </h3>
            <div className="h-64">
              <Pie data={recordingData} options={pieOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Оценки канцелярии */}
      <div className="max-w-[1440px] mx-auto mt-6">
        <h2 className="text-xl font-bold text-[#212529] mb-4">Оценки канцелярии</h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Левая колонка с оценками */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="space-y-5">
              {officeRatings.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="flex-1 text-[14px] text-[#212529]">{item.title}</span>
                  <RatingScale value={item.value} votes={item.votes} />
                </div>
              ))}
            </div>
          </div>
          {/* Правая колонка с графиком */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">
              Проявление неуважения. Кол-во записей: 888
            </h3>
            <div className="h-64">
              <Bar
                data={{
                  labels: [
                    'Грубость',
                    'Игнорирование',
                    'Перебивали речи',
                    'Не давали выступить',
                    'Сарказм и насмешки'
                  ],
                  datasets: [{
                    data: [50, 33.3, 16.7, 50, 66.7],
                    backgroundColor: 'rgba(121, 85, 72, 0.8)', // коричневый цвет
                    borderColor: 'rgba(121, 85, 72, 1)',
                    borderWidth: 1
                  }]
                }}
                options={{
                  indexAxis: 'y',
                  plugins: { legend: { display: false } },
                  scales: {
                    x: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: value => `${value}%`
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Оценки доступности и судебных приставов */}
      <div className="max-w-[1440px] mx-auto mt-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Оценки доступности */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Оценки доступности</h2>
            
            <div className="space-y-8">
              <div>
                <div className="mb-4">Доступность здания суда для людей с инвалидностью и маломобильных категорий</div>
                <RatingScale value={3.0} votes={999} />
              </div>
              
              <div>
                <div className="mb-4">Оцените удобство и комфорт зала суда</div>
                <RatingScale value={4.1} votes={999} />
              </div>
              
              <div>
                <div className="mb-4">Навигация внутри здания суда</div>
                <RatingScale value={3.5} votes={999} />
              </div>
            </div>
          </div>

          {/* Оценки судебных приставов */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Оценки судебных приставов</h2>
            
            <div className="space-y-8">
              <div>
                <div className="mb-4">Профессионализм судебных приставов</div>
                <RatingScale value={3.0} votes={999} />
              </div>
              
              <div>
                <div className="mb-4">Уровень безопасности в здании суда, на процессах</div>
                <RatingScale value={4.1} votes={999} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationResults;