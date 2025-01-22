'use client';
import React, { useState } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
} from 'chart.js';
import { Radar, Bar, Pie } from 'react-chartjs-2';
import { Box, Tab, Tabs } from '@mui/material';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  ChartDataLabels
);

interface RatingScaleProps {
  title: string;
  value: number;
}

// Единый компонент RatingScale для всех табов с цветными шкалами
const RatingScale = ({ value }: { value: number }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-[300px]">
        <div className="h-[16px] flex overflow-hidden">
          <div className="w-1/5 bg-[#FF8080]" />
          <div className="w-1/5 bg-[#FFB366]" />
          <div className="w-1/5 bg-[#FFE066]" />
          <div className="w-1/5 bg-[#80CC80]" />
          <div className="w-1/5 bg-[#47B347]" />
        </div>
        <div 
          className="absolute top-[-3px] bottom-[-3px] w-1.5 bg-[#2C3E50] shadow-[0_0_6px_rgba(44,62,80,0.6)]"
          style={{ 
            left: `${(value / 5) * 100}%`,
            transform: 'translateX(-50%)'
          }}
        />
      </div>
      <span className="text-lg font-bold">{value.toFixed(1)}</span>
    </div>
  );
};

// Компонент для строки с рейтингом
const RatingRow = ({ title, value }: { title: string, value: number }) => {
  return (
    <div className="flex items-center gap-8 mb-6">
      <div className="w-[400px]">
        <span className="text-base">{title}</span>
      </div>
      <RatingScale value={value} />
    </div>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

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

  // Опции для радарного графика
  const radarOptions = {
    scales: {
      r: {
        min: 0,
        max: 5,
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      datalabels: {
        color: '#FFFFFF',
        formatter: (value: number) => `${value}%`,
        anchor: 'center' as const,
        align: 'center' as const
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
    labels: [
      'Самостоятельно отсканировал QR-код',
      'Через сотрудников суда',
      'Через независимых юристов',
      'Через мероприятия (театр, кино и т.д.)',
      'Через соц. сети (WhatsApp и т.д.)'
    ],
    datasets: [
      {
        data: [40, 30, 15, 10, 5],
        backgroundColor: '#74C0FC',
        barThickness: 25,
      }
    ]
  };

  // Данные для круговой диаграммы пола
  const genderData = {
    labels: ['Мужской', 'Женский'],
    datasets: [{
      data: [60, 40],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)', // синий для мужского
        'rgba(255, 182, 193, 0.8)', // розовый для женского
      ]
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
  const demographicData = {
    labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
    datasets: [
      {
        label: 'Женщины',
        data: [-350, -280, -200, -100, -50, -20], // Абсолютные значения вместо процентов
        backgroundColor: '#74C0FC',
        barThickness: 25,
      },
      {
        label: 'Мужчины',
        data: [300, 250, 180, 120, 80, 40], // Абсолютные значения вместо процентов
        backgroundColor: '#FFB0C1',
        barThickness: 25,
      }
    ]
  };

  // Опции для круговой диаграммы
  const pieOptions = {
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        enabled: false
      },
      datalabels: {
        color: '#FFFFFF',
        font: {
          weight: 'bold' as const,
          size: 14
        },
        formatter: (value: number) => `${value}%`,
        anchor: 'center' as const,
        align: 'center' as const,
        offset: 0,
        padding: 0
      }
    },
    maintainAspectRatio: false,
    layout: {
      padding: 0
    }
  } as const;

  // Для диаграммы-торнадо
  const tornadoOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      datalabels: {
        color: '#000000',
        anchor: 'end' as const,
        align: 'end' as const,
        formatter: (value: number) => Math.abs(value), // Просто число
        font: {
          family: "'SF Pro Display', 'Inter', sans-serif",
          size: 13
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          color: '#E2E8F0'
        },
        ticks: {
          display: false // Убираем метки на оси X
        }
      },
      y: {
        stacked: true,
        grid: {
          display: false
        }
      }
    },
    maintainAspectRatio: false
  };

  // Для горизонтальных диаграмм (2 и 3 фото)
  const barOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        color: '#000000',
        anchor: 'end' as const,
        align: 'end' as const,
        formatter: (value: number) => value // Показываем просто количество голосов
      },
      title: {
        display: true,
        text: 'Количество голосов: 999',
        position: 'bottom' as const,
        padding: {
          top: 20,
          bottom: 0
        },
        font: {
          size: 13,
          family: "'SF Pro Display', 'Inter', sans-serif",
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: {
          display: false
        },
        ticks: {
          display: false // Убираем проценты
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  } as const;

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
      value: 3.0
    },
    {
      title: "Обеспечению равных условий для сторон в процессе",
      value: 4.1
    },
    {
      title: "Проявление уважения к участникам процесса",
      value: 3.5
    },
    {
      title: "Контроль за порядком в зале суда",
      value: 2.0
    },
    {
      title: "Разъяснение судебного решения",
      value: 2.0
    }
  ];

  // Данные для оценок помощника и секретаря
  const assistantRatings = [
    {
      title: "Вежливость при общении",
      value: 3.8
    },
    {
      title: "Доступность информации о процессе",
      value: 3.2
    },
    {
      title: "Своевременность оформления документов",
      value: 4.0
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
      value: 3.0
    },
    {
      title: "Оцените удобство и комфорт зала суда",
      value: 4.1
    },
    {
      title: "Навигация внутри здания суда",
      value: 3.5
    }
  ];

  // Данные для оценок судебных приставов
  const bailiffRatings = [
    {
      title: "Профессионализм судебных приставов",
      value: 3.0
    },
    {
      title: "Уровень безопасности в здании суда, на процессах",
      value: 4.1
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

  // Компонент для отображения цветной шкалы рейтинга
  const RatingScale = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center gap-3">
        <div className="w-[200px] h-[6px] rounded-full overflow-hidden bg-[#E9ECEF]">
          <div 
            className="h-full rounded-full" 
            style={{
              width: `${(rating / 5) * 100}%`,
              background: 'linear-gradient(90deg, #FF4D4D 0%, #FFC107 50%, #4CAF50 100%)'
            }}
          />
        </div>
        <span className="text-[16px] font-medium ml-2">{rating.toFixed(1)}</span>
      </div>
    );
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

            <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
              <h3 className="text-xl font-semibold text-primary mb-4">Источник трафика</h3>
              <div className="h-72">
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
                {activeTab === 'gender' && <Pie data={genderData} options={{
                  plugins: {
                    legend: {
                      position: 'right' as const,
                      labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                          size: 12
                        }
                      }
                    },
                    tooltip: {
                      enabled: true
                    },
                    datalabels: {
                      color: '#fff',
                      font: {
                        weight: 'bold',
                        size: 12
                      }
                    }
                  },
                  maintainAspectRatio: false,
                  layout: {
                    padding: 20
                  }
                }} />}
                {activeTab === 'genderAge' && <Bar data={demographicData} options={tornadoOptions} />}
                {activeTab === 'age' && <Bar data={ageData} options={{
                  plugins: {
                    legend: {
                      display: false
                    }
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
                        callback: function(value: any) {
                          return value + '%';
                        }
                      },
                      grid: {
                        display: false
                      }
                    }
                  },
                  maintainAspectRatio: false
                }} />}
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
                  <RatingScale value={item.value} />
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
              {assistantRatings.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="flex-1 text-[14px] text-[#212529]">{item.title}</span>
                  <RatingScale value={item.value} />
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
                  <RatingScale value={item.value} />
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
            <h2 className="text-xl font-bold text-[#212529] mb-4">Оценки доступности</h2>
            <div className="space-y-5">
              {accessibilityRatings.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="flex-1 text-[14px] text-[#212529]">{item.title}</span>
                  <RatingScale value={item.value} />
                </div>
              ))}
            </div>
          </div>

          {/* Оценки судебных приставов */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#212529] mb-4">Оценки судебных приставов</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="space-y-5">
                {bailiffRatings.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="flex-1 text-[14px] text-[#212529]">{item.title}</span>
                    <RatingScale rating={item.rating} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationResults;