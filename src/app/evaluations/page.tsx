"use client";
import React, { useState, useEffect } from "react";
import { Radar, Bar, Pie, Line } from "react-chartjs-2";
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
  ChartData,
  ChartDataset,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import type { Context as DataLabelsContext } from 'chartjs-plugin-datalabels';
import { useSurveyData } from "@/lib/context/SurveyContext";
import {
  processSecondQuestion,
  processThirdQuestion,
  processFirstQuestion,
  processJudgeRatings,
  processFifthQuestion,
  processStaffRatings,
  processAudioVideoQuestion,
  processProcessRatings,
  processAccessibilityRatings,
  processOfficeRatings,
  processStartTimeQuestion,
} from "@/lib/utils/processData";
import { Question } from '@/lib/context/SurveyContext';

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

// Определяем отдельные интерфейсы для каждого типа графика
interface PieChartData extends ChartData<'pie', number[], string> {
  datasets: (ChartDataset<'pie', number[]> & {
    datalabels?: {
      color: string;
      display?: boolean;
      formatter: (value: number, context: DataLabelsContext) => string;
      font?: {
        size?: number;
        weight?: string | number;
      };
    };
  })[];
}

interface BarChartData extends ChartData<'bar', number[], string> {
  datasets: (ChartDataset<'bar', number[]> & {
    datalabels?: {
      color: string;
      display?: boolean;
      formatter: (value: number, context: DataLabelsContext) => string;
      align?: 'end';
      anchor?: 'end';
      offset?: number;
      font?: {
        size?: number;
        weight?: string | number;
      };
    };
  })[];
}

export default function Evaluations() {
  const { surveyData } = useSurveyData();
  const [demographicsView, setDemographicsView] = useState("пол");
  const [categoryData, setCategoryData] = useState<PieChartData>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "rgb(54, 162, 235)",
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
        ],
      },
    ],
  });
  const [genderData, setGenderData] = useState<PieChartData>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "rgb(54, 162, 235)",
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
        ],
      },
    ],
  });
  const [trafficSourceData, setTrafficSourceData] = useState<BarChartData>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: "rgb(54, 162, 235)",
        barThickness: 20,
        datalabels: {
          color: "#FFFFFF",
          formatter: (value: number): string => `${value}`,
        },
        label: "",
      },
    ],
  });
  const [caseTypesData, setCaseTypesData] = useState<PieChartData>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "rgb(54, 162, 235)",
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
        ],
        datalabels: {
          color: "#FFFFFF",
          display: true,
          formatter: (value: number): string => value + "%",
        },
      },
    ],
  });

  const [audioVideoData, setAudioVideoData] = useState({
    labels: ["Да", "Нет", "Не знаю/Не уверен(а)"],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [
          "rgb(54, 162, 235)",
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
        ],
      },
    ],
  });
  const [judgeRatings, setJudgeRatings] = useState<{ [key: string]: number }>(
    {}
  );
  const [staffRatings, setStaffRatings] = useState<{ [key: string]: number }>(
    {}
  );
  const [processRatings, setProcessRatings] = useState<{
    [key: string]: number;
  }>({});
  const [accessibilityRatings, setAccessibilityRatings] = useState<{[key: string]: number}>({});
  const [officeRatings, setOfficeRatings] = useState<{[key: string]: number}>({});
  const [startTimeData, setStartTimeData] = useState(processStartTimeQuestion(surveyData?.questions || []));

  const [radarData, setRadarData] = useState({
    labels: [
      "Судья",
      "Секретарь, помощник",
      "Канцелярия",
      "Процесс",
      "Пристав",
      "Здание",
    ],
    datasets: [
      {
        label: "Ноокенский суд",
        data: [0, 0, 0, 0, 0, 0],
        fill: true,
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 2,
      },
      {
        label: "Средние оценки по республике",
        data: [4.5, 4.2, 4.0, 4.3, 4.4, 4.1],
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
    ],
  });

  const [totalResponses, setTotalResponses] = useState<number>(0);

  useEffect(() => {
    if (surveyData && surveyData.questions && surveyData.questions[1]) {
      const processedData = processSecondQuestion(
        surveyData.questions[1].question_responses
      );
      setCategoryData(processedData);
    }
    if (surveyData && surveyData.questions && surveyData.questions[2]) {
      console.log(
        "Данные 3-го вопроса:",
        surveyData.questions[2].question_responses
      );
      const processedData = processThirdQuestion(
        surveyData.questions[2].question_responses
      );
      console.log("Обработанные данные:", processedData);
      setGenderData(processedData);
    }
    if (surveyData && surveyData.questions && surveyData.questions[0]) {
      console.log(
        "Данные 1-го вопроса:",
        surveyData.questions[0].question_responses
      );
      const processedData = processFirstQuestion(
        surveyData.questions[0].question_responses
      );
      console.log("Обработанные данные:", processedData);
      setTrafficSourceData(processedData);
    }
    if (surveyData && surveyData.questions && surveyData.questions[4]) {
      console.log(
        "Данные 5-го вопроса:",
        surveyData.questions[4].question_responses
      );
      const processedData = processFifthQuestion(
        surveyData.questions[4].question_responses
      );
      console.log("Обработанные данные:", processedData);
      setCaseTypesData(processedData);
    }
    if (surveyData?.questions) {
      // Функция для получения среднего значения из массива
      const getAverageFromData = (data: number[]) => {
        const sum = data.reduce((a: number, b: number) => a + b, 0);
        if (sum === null || sum === undefined) return 0;
        return Number((sum / data.length).toFixed(1));
      };

      // Получаем данные для каждой категории используя существующие функции
      const judgeData = processJudgeRatings(surveyData.questions);
      const staffData = processStaffRatings(surveyData.questions);
      const processData = processProcessRatings(surveyData.questions);
      const officeData = processOfficeRatings(surveyData.questions);
      const accessibilityData = processAccessibilityRatings(surveyData.questions);

      // Рассчитываем средние значения
      const currentCourtAverages = {
        judge: getAverageFromData(Object.values(judgeData)),
        secretary: getAverageFromData(Object.values(staffData)),
        office: getAverageFromData(Object.values(officeData)),
        process: getAverageFromData(Object.values(processData)),
        bailiff: 0, // Если есть отдельная функция для пристава
        building: getAverageFromData(Object.values(accessibilityData))
      };

      console.log('Final averages:', currentCourtAverages);

      setRadarData({
        labels: [
          "Судья",
          "Секретарь, помощник",
          "Канцелярия",
          "Процесс",
          "Пристав",
          "Здание",
        ],
        datasets: [
          {
            label: "Ноокенский суд",
            data: [
              currentCourtAverages.judge || 0,
              currentCourtAverages.secretary || 0,
              currentCourtAverages.office || 0,
              currentCourtAverages.process || 0,
              currentCourtAverages.bailiff || 0,
              currentCourtAverages.building || 0
            ],
            fill: true,
            backgroundColor: "rgba(255, 206, 86, 0.2)",
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 2,
          },
          {
            label: "Средние оценки по республике",
            data: [4.5, 4.2, 4.0, 4.3, 4.4, 4.1], // Временные данные
            fill: true,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
          },
        ],
      });

      const ratings = processJudgeRatings(surveyData.questions);
      setJudgeRatings(ratings);
      const staffRatings = processStaffRatings(surveyData.questions); 
      setStaffRatings(staffRatings);
      const processRatings = processProcessRatings(surveyData.questions);
      setProcessRatings(processRatings);
      const audioVideoData = processAudioVideoQuestion(surveyData.questions);
      setAudioVideoData(audioVideoData);
      const officeRatings = processOfficeRatings(surveyData.questions);
      setOfficeRatings(officeRatings);
      const accessibilityRatings = processAccessibilityRatings(surveyData.questions);
      setAccessibilityRatings(accessibilityRatings);
      const startTimeData = processStartTimeQuestion(surveyData.questions);
      setStartTimeData(startTimeData);
    }
    if (surveyData?.total_responses) {
      setTotalResponses(surveyData.total_responses);
    }
  }, [surveyData]);

  // Общие настройки для всех диаграмм
  const commonOptions = {
    plugins: {
      legend: {
        position: "bottom" as const,
        align: "start" as const,
        labels: {
          padding: 20,
          boxWidth: 15,
          font: {
            size: 12,
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  // Обновленные данные для торнадо-диаграммы
  const ageGenderData = {
    labels: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
    datasets: [
      {
        label: "Мужчины",
        data: [-35, -28, -20, -10, -5, -2],
        backgroundColor: "rgb(54, 162, 235)",
        stack: "Stack 0",
        datalabels: {
          color: "#FFFFFF",
          formatter: (value: number): string => `${Math.abs(value)}%`,
        },
      },
      {
        label: "Женщины",
        data: [30, 25, 18, 12, 8, 4],
        backgroundColor: "rgb(255, 192, 203)",
        stack: "Stack 0",
        datalabels: {
          color: "#FFFFFF",
          formatter: (value: number): string => `${value}%`,
        },
      },
    ],
  };

  // Обновленные данные для возрастной диаграммы
  const ageData = {
    labels: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
    datasets: [
      {
        label: "Количество человек",
        data: [65, 53, 38, 22, 13, 6],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Замечания и предложения
  const comments = [
    { id: 1, text: "Туалет не работает" },
    { id: 2, text: "Кресел нет" },
    { id: 3, text: "Вежливые сотрудники" },
    { id: 4, text: "Нет парковки" },
    { id: 5, text: "Работают очень медленно" },
  ];

  // Обновленные данные для источников трафика
  const trafficSourceOptions = {
    indexAxis: "y" as const,
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: true,
        },
        suggestedMax:
          Math.max(...(trafficSourceData.datasets[0]?.data || [0])) + 1,
        ticks: {
          stepSize: 1,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          padding: 1,
          align: "center" as const,
          font: {
            size: 11,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 1,
      },
    },
  };

  const disrespectData = {
    labels: [
      "Сарказм и насмешки",
      "Не давали выступить",
      "Перебивали речи",
      "Игнорирование",
      "Грубость",
    ],
    datasets: [
      {
        data: [4, 3, 1, 2, 3],
        backgroundColor: "rgb(139, 69, 19)",
        barThickness: 20,
        datalabels: {
          color: "gray",
          align: "end" as const,
          anchor: "end" as const,
          offset: 4,
          formatter: (value: number, context: DataLabelsContext): string => {
            const dataset = context.dataset;
            const data = dataset.data as (number | null)[];
            const sum = data
              .filter((value): value is number => 
                value !== null && !isNaN(value)
              )
              .reduce((a, b) => a + b, 0);
            const percentage = sum > 0 ? ((value / sum) * 100).toFixed(1) : '0.0';
            return `${value} (${percentage}%)`;
          },
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    ],
  };

  const disrespectOptions = {
    ...commonOptions,
    indexAxis: "y" as const,
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    layout: {
      padding: {
        right: 80,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Компонент для прогресс-бара
  const ProgressBar = ({ value }: { value: number }) => {
    const getColor = (v: number) => {
      if (v <= 1) return "#EF4444"; // Красный (более глубокий)
      if (v <= 2) return "#F97316"; // Оранжевый (более насыщенный)
      if (v <= 3) return "#FACC15"; // Желтый (более теплый)
      if (v <= 4) return "#84CC16"; // Светло-зеленый (более свежий)
      return "#22C55E"; // Зеленый (более яркий)
    };

    return (
      <div className="w-full h-6 bg-gray-200 rounded-lg overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${(value / 5) * 100}%`,
            backgroundColor: getColor(value),
          }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="max-w-[1440px] mx-auto p-4">
        {surveyData ? (
          <div className="grid grid-cols-2 gap-4">
            {/* Общие показатели */}
            <div className="bg-white rounded-lg shadow-xl">
              <div className="px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium">Общие показатели</h2>
                  <span className="text-gray-600">
                    Количество ответов: {totalResponses}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="h-[400px]">
                  <Radar data={radarData} options={commonOptions} />
                </div>
              </div>
            </div>

            {/* Замечания и предложения */}
            <div className="bg-white rounded-lg shadow-xl">
              <div className="px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium">
                    Замечания и предложения
                  </h2>
                  <span className="text-gray-600">Количество ответов: 999</span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-4 p-3 border rounded hover:bg-gray-50"
                    >
                      <span className="text-gray-500 min-w-[24px]">
                        {comment.id}
                      </span>
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
            <div className="bg-white rounded-lg shadow-xl">
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
            <div className="bg-white rounded-lg shadow-xl">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-medium text-start">
                  Демографические показатели
                </h2>
              </div>
              <div className="p-6 flex flex-col items-center">
                <div className="flex justify-center gap-4 mb-6 w-full">
                  {["Пол", "Пол и возраст", "Возраст"].map((tab) => (
                    <button
                      key={tab}
                      className={`px-6 py-2 rounded-lg transition-colors ${
                        demographicsView === tab.toLowerCase()
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() => setDemographicsView(tab.toLowerCase())}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="h-[300px] w-full flex justify-center items-center">
                  {demographicsView === "пол" && (
                    <Pie
                      data={genderData}
                      options={{
                        ...commonOptions,
                        plugins: {
                          ...commonOptions.plugins,
                          legend: {
                            position: "bottom",
                            align: "center",
                            labels: {
                              padding: 20,
                              boxWidth: 15,
                              font: { size: 12 },
                              usePointStyle: true,
                            },
                          },
                          datalabels: {
                            color: "#FFFFFF",
                            font: { size: 16, weight: "bold" },
                            formatter: (value) => value + "%",
                          },
                        },
                        layout: {
                          padding: {
                            bottom: 20,
                          },
                        },
                      }}
                    />
                  )}
                  {demographicsView === "пол и возраст" && (
                    <Bar
                      data={ageGenderData}
                      options={{
                        indexAxis: "y",
                        scales: {
                          x: {
                            type: "linear" as const,
                            stacked: true,
                            ticks: {
                              callback: function (
                                value: string | number
                              ) {
                                return Number(value);
                              },
                              display: false,
                            },
                            grid: {
                              display: false,
                            },
                          },
                          y: {
                            stacked: true,
                            grid: {
                              display: false,
                              drawOnChartArea: false,
                            },
                          },
                        },
                        plugins: {
                          legend: {
                            position: "bottom" as const,
                          },
                        },
                        maintainAspectRatio: false,
                      }}
                    />
                  )}
                  {demographicsView === "возраст" && (
                    <Line
                      data={ageData}
                      options={{
                        scales: {
                          y: {
                            type: "linear" as const,
                            beginAtZero: true,
                            grid: {
                              display: false,
                              drawOnChartArea: false,
                            },
                            ticks: {
                              callback: function (
                                value: string | number
                              ) {
                                return value.toString();
                              },
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                          },
                        },
                        plugins: {
                          legend: {
                            position: "bottom" as const,
                          },
                        },
                        maintainAspectRatio: false,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Источники трафика */}
            <div className="bg-white rounded-lg shadow-xl">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-medium">Источник трафика</h2>
              </div>
              <div className="p-6">
                <div className="h-[300px]">
                  <Bar
                    data={trafficSourceData}
                    options={trafficSourceOptions}
                  />
                </div>
              </div>
            </div>

            {/* Категории судебных дел */}
            <div className="bg-white rounded-lg shadow-xl">
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
            <div className="bg-white rounded-lg shadow-xl">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-medium ">Оценки судьи</h2>
              </div>
              <div className="p-6 space-y-6">
                {Object.entries(judgeRatings).map(([title, rating]) => (
                  <div key={title} className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">{title}</span>
                      <span className="font-bold">{rating}</span>
                    </div>
                    <ProgressBar value={rating} />
                  </div>
                ))}
              </div>
            </div>

            {/* Проявления неуважения */}
            <div className="bg-white rounded-lg shadow-xl">
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
                      datasets: disrespectData.datasets.map((dataset) => ({
                        ...dataset,
                        datalabels: {
                          ...dataset.datalabels,
                          font: {
                            ...dataset.datalabels.font,
                            weight: "bold", // Исправляем тип с string на допустимое значение
                          },
                        },
                      })),
                    }}
                    options={disrespectOptions}
                  />
                </div>
              </div>
            </div>
            {/* Оценки сотрудников */}
            <div className="bg-white rounded-lg shadow-xl">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-medium">Оценки сотрудников</h2>
              </div>
              <div className="p-6 space-y-6">
                {Object.entries(staffRatings).map(([title, rating]) => (
                  <div key={title} className="space-y-2 mb-12">
                    <div className="flex justify-between">
                      <span>{title}</span>
                      <span className="font-bold">{rating}</span>
                    </div>
                    <ProgressBar value={rating} />
                  </div>
                ))}
              </div>
            </div>

            {/* Оценки процесса */}
            <div className="bg-white rounded-lg shadow-xl">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-medium">Оценки процесса</h2>
              </div>
              <div className="p-6 space-y-6">
                {Object.entries(processRatings).map(([title, rating]) => (
                  <div key={title} className="space-y-2">
                    <div className="flex justify-between">
                      <span>{title}</span>
                      <span className="font-bold">{rating}</span>
                    </div>
                    <ProgressBar value={rating} />
                  </div>
                ))}
              </div>
            </div>

            {/* Использование средств аудио и видеофиксации */}
            <div className="bg-white rounded-lg shadow-xl">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-medium">
                  Использование средств аудио и видеофиксации судебного
                  заседания по уголовным делам
                </h2>
              </div>
              <div className="p-6">
                <div className="h-[300px] w-[400px] mx-auto">
                  <Pie
                    data={audioVideoData}
                    options={{
                      ...commonOptions,
                      maintainAspectRatio: false,
                      plugins: {
                        datalabels: {
                          color: "#FFFFFF",
                          font: {
                            size: 16,
                            weight: "bold",
                          },
                          formatter: (value) => value + "%",
                        },
                        legend: {
                          position: "right",
                          align: "center",
                          labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: { size: 14 },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Начало заседания в назначенное время */}
            <div className="bg-white rounded-lg shadow-xl">
              <div className="px-6 py-4 border-b min-h-[90px]">
                <h2 className="text-xl font-medium">
                  Начало заседания в назначенное время
                </h2>
              </div>
              <div className="p-6">
                <div className="h-[300px] w-[300px] mx-auto">
                  <Pie
                    data={startTimeData}
                    options={{
                      ...commonOptions,
                      maintainAspectRatio: false,
                      plugins: {
                        datalabels: {
                          color: "#FFFFFF",
                          font: {
                            size: 16,
                            weight: "bold",
                          },
                          formatter: (value) => value + "%",
                        },
                        legend: {
                          position: "right",
                          align: "center",
                          labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: { size: 14 },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-medium">
                Оценки канцелярии
                </h2>
              </div>
              <div className="p-6 space-y-6">
                {Object.entries(officeRatings).map(([title, rating]) => (
                  <div key={title} className="space-y-2">
                    <div className="flex justify-between">
                      <span>{title}</span>
                      <span className="font-bold">{rating}</span>
                    </div>
                    <ProgressBar value={rating} />
                  </div>
                ))}
              </div>
            </div>

            {/* Оценки доступности */}
            <div className="bg-white rounded-lg shadow-xl">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-medium">
                  Оценки доступности здания
                </h2>
              </div>
              <div className="p-6 space-y-6">
                {Object.entries(accessibilityRatings).map(([title, rating]) => (
                  <div key={title} className="space-y-2">
                    <div className="flex justify-between">
                      <span>{title}</span>
                      <span className="font-bold">{rating}</span>
                    </div>
                    <ProgressBar value={rating} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen">
            <p>Загрузка данных...</p>
          </div>
        )}
      </div>
    </div>
  );
}