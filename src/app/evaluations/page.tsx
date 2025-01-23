'use client';
import React, { useState } from 'react';
import { Radar, Bar, Pie, Line } from 'react-chartjs-2';
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

export default function EvaluationResults() {
  const [demographicsView, setDemographicsView] = useState('пол');

  // Данные для радарной диаграммы
  const radarData = {
    labels: ['Судья', 'Секретарь, помощник', 'Канцелярия', 'Процесс', 'Пристав', 'Здание'],
    datasets: [
      {
        label: 'Ноокенский суд',
        data: [4.8, 4.6, 4.3, 4.5, 4.7, 4.4],
        fill: true,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 2,
      },
      {
        label: 'Средние оценки по республике',
        data: [4.5, 4.2, 4.0, 4.3, 4.4, 4.1],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      }
    ]
  };

  // Обновленные цвета для диаграмм
  const chartColors = {
    blue: 'rgb(54, 162, 235)',
    red: 'rgb(255, 99, 132)',
    green: 'rgb(75, 192, 192)',
    purple: 'rgb(153, 102, 255)',
    yellow: 'rgb(255, 206, 86)',
  };

  // Общие настройки для всех диаграмм
  const commonOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        align: 'start' as const,
        labels: {
          padding: 20,
          boxWidth: 15,
          font: {
            size: 12
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  // Данные для круговой диаграммы категорий
  const categoryData = {
    labels: [
      'Сторона по делу (истец, потерпевший)',
      'Сторона по делу (ответчик, обвиняемый)',
      'Свидетель',
      'Посетитель'
    ],
    datasets: [{
      data: [25, 25, 25, 25],
      backgroundColor: [
        'rgb(54, 162, 235)',
        'rgb(255, 99, 132)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
      ],
      datalabels: {
        color: "#FFFFFF",
        display: true,
        formatter: (value: number): string => value + '%',
      }
    }]
  };
  const categoryDataCircle = {
    labels: [
      'Сторона по делу (истец, потерпевший)',
      'Сторона по делу (ответчик, обвиняемый)',
      'Свидетель',
      'Посетитель'
    ],
    datasets: [{
      data: [25, 25, 25, 25],
      backgroundColor: [
        'rgb(54, 162, 235)',
        'rgb(255, 99, 132)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
      ]
    }]
  };
  // Данные для демографических показателей
  const genderData = {
    labels: ['Женский', 'Мужской'],
    datasets: [{
      data: [37.5, 62.5],
      backgroundColor: [
        'rgb(255, 99, 132)', // Розовый для женского
        'rgb(54, 162, 235)'  // Синий для мужского
      ],
      datalabels: {
        color: "#FFFFFF",
        formatter: (value: number): string => value + '%',
      }
    }]
  };

  // Обновленные данные для торнадо-диаграммы
  const ageGenderData = {
    labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
    datasets: [
      {
        label: 'Мужчины',
        data: [-35, -28, -20, -10, -5, -2],
        backgroundColor: 'rgb(54, 162, 235)', // Синий для женщин
        stack: 'Stack 0',
        datalabels: {
          color: "#FFFFFF",
          formatter: (value: number): string => value + '%',
        }
      },
      {
        label: 'Женщины',
        data: [30, 25, 18, 12, 8, 4],
        backgroundColor: 'rgb(255, 192, 203)', // Светло-розовый для мужчин
        stack: 'Stack 0',
        datalabels: {
          color: "#FFFFFF",
          formatter: (value: number): string => value + '%',
        }
      },
    ]

  };

  // Обновленные опции для торнадо-диаграммы
  const ageGenderOptions = {
    ...commonOptions,
    indexAxis: 'y' as const,
    scales: {
      x: {
        type: 'linear' as const,
        stacked: true,
        ticks: {
          callback: (value: number): number => Math.abs(value),
          display: false
        },
        grid: {
          display: true,
          drawBorder: false,
        }
      },
      y: {
        stacked: true,
        grid: {
          display: true,
          drawBorder: false,
        }
      }
    },
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        callbacks: {
          label: (context: any): string => {
            const value = Math.abs(context.raw);
            return `${context.dataset.label}: ${value}%`;
          }
        }
      }
    }
  };

  // Обновленные данные для возрастной диаграммы
  const ageData = {
    labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
    datasets: [{
      label: 'Количество человек',
      data: [65, 53, 38, 22, 13, 6],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.3,
      fill: true
    }]
  };

  // Обновленные опции для возрастной диаграммы
  const ageOptions = {
    ...commonOptions,
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: false,
        },
        ticks: {
          callback: function(value: number): string {
            return `${value}%`;
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        }
      }
    },
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        callbacks: {
          label: (context: any): string => `${context.raw}%`
        }
      }
    }
  };

  // Замечания и предложения
  const comments = [
    { id: 1, text: 'Туалет не работает' },
    { id: 2, text: 'Кресел нет' },
    { id: 3, text: 'Вежливые сотрудники' },
    { id: 4, text: 'Нет парковки' },
    { id: 5, text: 'Работают очень медленно' },
  ];

  // Обновленные данные для источников трафика
  const trafficSourceData = {
    labels: [
      'Стенды с qr кодом',
      'Через официальный сайт ВС',
      'Через портал "Цифрового правосудия КР"',
      'Через WhatsАpp',
      'Через независимых юристов',
      'Через мероприятия',
      'Через сотрудников суда',
      'Другое'
    ],
    datasets: [{
      data: [1000, 800, 600, 400, 300, 200, 100, 100],
      backgroundColor: 'rgb(54, 162, 235)',
      barThickness: 20,
      datalabels: {
        color: "#FFFFFF",
        formatter: (value: number): string => `${value}`
      },
      label: ''
    }]
  };

  const trafficSourceOptions = {
    ...commonOptions,
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false // Полностью скрываем легенду
      }
    }
  };

  const caseTypesData = {
    labels: ['Уголовные', 'Гражданские', 'Административные', 'Иные'],
    datasets: [{
      data: [25, 25, 25, 25],
      backgroundColor: [
        'rgb(54, 162, 235)',  // синий
        'rgb(255, 99, 132)',  // красный
        'rgb(75, 192, 192)',  // зеленый
        'rgb(153, 102, 255)', // фиолетовый
      ],
      datalabels: {
        color: "#FFFFFF",
        display: true,
        formatter: (value: number): string => value + '%',
      }
    }]
  };

  const disrespectData = {
    labels: [
      'Сарказм и насмешки',
      'Не давали выступить',
      'Перебивали речи',
      'Игнорирование',
      'Грубость'
    ],
    datasets: [{
      data: [4, 3, 1, 2, 3],
      backgroundColor: 'rgb(139, 69, 19)',
      barThickness: 20,
      datalabels: {
        color: "gray",
        align: 'end' as const,
        anchor: 'end' as const,
        offset: 4,
        formatter: (value: number, context: any): string => {
          const dataset = context.dataset;
          const sum = dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / sum) * 100).toFixed(1);
          return `${value} (${percentage}%)`;
        },
        font: {
          size: 14,
          weight: 'bold'
        }
      }
    }]
  };

  const disrespectOptions = {
    ...commonOptions,
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false
        },
        ticks: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    },
    layout: {
      padding: {
        right: 80
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  // Компонент для прогресс-бара
  const ProgressBar = ({ value }: { value: number }) => {
    const getColor = (v: number) => {
      if (v <= 1) return '#FF4B4B';
      if (v <= 2) return '#FF9F40';
      if (v <= 3) return '#FFE600';
      if (v <= 4) return '#A8E05F';
      return '#4BCE97';
    };

    return (
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${(value / 5) * 100}%`,
            backgroundColor: getColor(value)
          }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="max-w-[1440px] mx-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Общие показатели */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Общие показатели</h2>
                <span className="text-gray-600">Количество ответов: 999</span>
              </div>
            </div>
            <div className="p-6">
              <div className="h-[400px]">
                <Radar data={radarData} options={commonOptions} />
              </div>
            </div>
          </div>

          {/* Замечания и предложения */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Замечания и предложения</h2>
                <span className="text-gray-600">Количество ответов: 999</span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 p-3 border rounded hover:bg-gray-50">
                    <span className="text-gray-500 min-w-[24px]">{comment.id}</span>
                    <span>{comment.text}</span>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Все замечания и предложения
              </button>
            </div>
          </div>

          {/* Категории респондентов */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-medium">Категории респондентов</h2>
            </div>
            <div className="p-6">
              <div className="h-[300px]">
                <Pie data={categoryData} options={commonOptions} />
              </div>
            </div>
          </div>

          {/* Демографические показатели */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-medium text-start">Демографические показатели</h2>
            </div>
            <div className="p-6 flex flex-col items-center">
              <div className="flex justify-center gap-4 mb-6 w-full">
                {['Пол', 'Пол и возраст', 'Возраст'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-6 py-2 rounded-lg transition-colors ${demographicsView === tab.toLowerCase()
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    onClick={() => setDemographicsView(tab.toLowerCase())}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="h-[300px] w-full flex justify-center items-center">
                {demographicsView === 'пол' && (
                  <Pie
                    data={genderData}
                    options={{
                      ...commonOptions,
                      plugins: {
                        ...commonOptions.plugins,
                        legend: {
                          position: 'bottom',
                          align: 'center',
                          labels: {
                            padding: 20,
                            boxWidth: 15,
                            font: { size: 12 },
                            usePointStyle: true
                          }
                        },
                        datalabels: {
                          color: '#FFFFFF',
                          font: { size: 16, weight: 'bold' },
                          formatter: (value) => value + '%'
                        }
                      },
                      layout: {
                        padding: {
                          bottom: 20
                        }
                      }
                    }}
                  />
                )}
                {demographicsView === 'пол и возраст' && (
                  <Bar 
                    data={ageGenderData} 
                    options={{
                      indexAxis: 'y',
                      scales: {
                        x: {
                          type: 'linear' as const,
                          stacked: true,
                          ticks: {
                            callback: function(this: any, value: string | number) {
                              return Number(value);
                            },
                            display: false
                          },
                          grid: {
                            display: false,
                            drawBorder: false
                          }
                        },
                        y: {
                          stacked: true,
                          grid: {
                            display: false,
                            drawOnChartArea: false
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'bottom' as const
                        }
                      },
                      maintainAspectRatio: false
                    }}
                  />
                )}
                {demographicsView === 'возраст' && (
                  <Line 
                    data={ageData} 
                    options={{
                      scales: {
                        y: {
                          type: 'linear' as const,
                          beginAtZero: true,
                          grid: {
                            display: false,
                            drawOnChartArea: false
                          },
                          ticks: {
                            callback: function(this: any, value: string | number) {
                              return value.toString();
                            }
                          }
                        },
                        x: {
                          grid: {
                            display: false,
                            borderWidth: 0
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'bottom' as const
                        }
                      },
                      maintainAspectRatio: false
                    }}
                  />  
                )}
              </div>
            </div>
          </div>

          {/* Источники трафика */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-medium">Источник трафика</h2>
            </div>
            <div className="p-6">
              <div className="h-[300px]">
                <Bar data={trafficSourceData} options={trafficSourceOptions} />
              </div>
            </div>
          </div>

          {/* Категории судебных дел */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-medium">Категории судебных дел</h2>
            </div>
            <div className="p-6">
              <div className="h-[300px]">
                <Pie data={caseTypesData} options={commonOptions} />
              </div>
            </div>
          </div>

          {/* Оценки судьи */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-medium">Оценки судьи</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Разъяснение прав и обязанности в судебном процессе</span>
                  <span>3.0</span>
                </div>
                <ProgressBar value={3.0} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Проявление уважения к участникам судебного процесса</span>
                  <span>3.5</span>
                </div>
                <ProgressBar value={3.5} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Контроль судьи за порядком в зале суда</span>
                  <span>2.0</span>
                </div>
                <ProgressBar value={2.0} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Разъяснение судебного решение</span>
                  <span>1.0</span>
                </div>
                <ProgressBar value={1.0} />
              </div>
            </div>
          </div>

          {/* Проявления неуважения */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Проявление неуважения</h2>
                <span className="text-gray-600">Кол-во записей: 888</span>
              </div>
            </div>
            <div className="p-6">
              <div className="h-[300px]">
                <Bar 
                  data={{
                    ...disrespectData,
                    datasets: disrespectData.datasets.map(dataset => ({
                      ...dataset,
                      datalabels: {
                        ...dataset.datalabels,
                        font: {
                          ...dataset.datalabels.font,
                          weight: 'bold' // Исправляем тип с string на допустимое значение
                        }
                      }
                    }))
                  }} 
                  options={disrespectOptions}
                />
              </div>
            </div>
          </div>
          {/* Оценки сотрудников */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-medium">Оценки сотрудников</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Сотрудник 1</span>
                  <span>3.0</span>
                </div>
                <ProgressBar value={3.0} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Сотрудник 2</span>
                  <span>3.5</span>
                </div>
                <ProgressBar value={3.5} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Сотрудник 3</span>
                  <span>2.0</span>
                </div>
                <ProgressBar value={2.0} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Сотрудник 4</span>
                  <span>2.0</span>
                </div>
                <ProgressBar value={2.0} />
              </div>
            </div>
          </div>

          {/* Оценки процесса */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-medium">Оценки процесса</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Скорость судебного процесса</span>
                  <span>3.0</span>
                </div>
                <ProgressBar value={3.0} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Соблюдение сроков судебного процесса</span>
                  <span>3.5</span>
                </div>
                <ProgressBar value={3.5} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Соблюдение процессуальных норм</span>
                  <span>2.0</span>
                </div>
                <ProgressBar value={2.0} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Соблюдение законов и постановлений</span>
                  <span>2.0</span>
                </div>
                <ProgressBar value={2.0} />
              </div>
            </div>
          </div>
          {/* Начало заседания в назначенное время */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-medium">Начало заседания в назначенное время</h2>
            </div>
            <div className="p-6">
              <div className="h-[300px] w-[400px] mx-auto">
                <Pie
                  data={{
                    labels: ['Да', 'Нет', 'Не знаю/Не уверен(а)'],
                    datasets: [{
                      data: [25, 37.5, 37.5],
                      backgroundColor: [
                        'rgb(54, 162, 235)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)'
                      ]
                    }]
                  }}
                  options={{
                    ...commonOptions,
                    maintainAspectRatio: false,
                    plugins: {
                      datalabels: {
                        color: '#FFFFFF',
                        font: {
                          size: 16,
                          weight: 'bold'
                        },
                        formatter: (value) => value + '%'
                      },
                      legend: {
                        position: 'right',
                        align: 'center',
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                          font: { size: 14 }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
          {/* Использование средств аудио и видеофиксации */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-medium">Использование средств аудио и видеофиксации судебного заседания по уголовным делам</h2>
            </div>
            <div className="p-6">
              <div className="h-[300px] w-[400px] mx-auto">
                <Pie
                  data={{
                    labels: ['Да', 'Нет', 'Не знаю/Не уверен(а)'],
                    datasets: [{
                      data: [25, 37.5, 37.5],
                      backgroundColor: [
                        'rgb(54, 162, 235)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)'
                      ]
                    }]
                  }}
                  options={{
                    ...commonOptions,
                    maintainAspectRatio: false,
                    plugins: {
                      datalabels: {
                        color: '#FFFFFF',
                        font: {
                          size: 16,
                          weight: 'bold'
                        },
                        formatter: (value) => value + '%'
                      },
                      legend: {
                        position: 'right',
                        align: 'center',
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                          font: { size: 14 }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>


          {/* Оценки канцелярии */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-medium">Оценки канцелярии</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Взаимодействие с судебной канцелярией</span>
                  <span>3.0</span>
                </div>
                <ProgressBar value={3.0} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Предоставление всей необходимой информации</span>
                  <span>4.1</span>
                </div>
                <ProgressBar value={4.1} />
              </div>
            </div>
          </div>

          {/* Оценки доступности */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-medium">Оценки доступности здания</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Доступность здания суда для людей с инвалидностью и маломобильных категорий</span>
                  <span>3.0</span>
                </div>
                <ProgressBar value={3.0} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Оцените удобство и комфорт зала суда</span>
                  <span>4.1</span>
                </div>
                <ProgressBar value={4.1} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Навигация внутри здания суда</span>
                  <span>3.5</span>
                </div>
                <ProgressBar value={3.5} />
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}