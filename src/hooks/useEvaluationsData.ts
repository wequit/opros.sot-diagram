"use client";
import { useState, useEffect } from "react";
import { useSurveyData } from "@/context/SurveyContext";
import { useRemarks } from "@/components/RemarksApi";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import {
  processSecondQuestion,
  processThirdQuestion,
  processFirstQuestion,
  processFifthQuestion,
  processProgressRatings,
  processStaffRatings,
  processProcessRatings,
  processAccessibilityRatings,
  processOfficeRatings,
  processAudioVideoQuestion,
  processStartTimeQuestion,
  processDisrespectQuestion,
  processAgeData,
  processAgeGenderData,
} from "@/lib/utils/processData";
import { ChartData } from "chart.js";
import {
  getRadarRepublicData,
  getCircleRepublicData,
  getCircleCourtData,
  getBarRepublicData,
  getRadarCourtData,
  getProgressRepublicData,
  getColumnRepublicData,
  getBarCourtData,
  getProgressCourtData,
  getColumnCourtData,
} from "@/lib/api/charts";

export default function useEvaluationData(
  selectedCourtName?: string,
  courtName?: string
) {
  const { surveyData, language, totalResponses, isLoading, selectedCourtId } =
    useSurveyData();
  const { remarks } = useRemarks();
  const { user } = useAuth();
  const pathname = usePathname();

  const [progressData, setProgressData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [
      {
        label: "Средний балл",
        data: [],
        backgroundColor: [
          "#4CAF50",
          "#FFC107",
          "#2196F3",
          "#F44336",
          "#9C27B0",
          "#FF5722",
          "#607D8B",
          "#00BCD4",
        ],
      },
    ],
  });
  const [categoryData, setCategoryData] = useState<ChartData<"pie">>({
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  });
  const [genderData, setGenderData] = useState<ChartData<"pie">>({
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  });
  const [trafficSourceData, setTrafficSourceData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  });
  const [caseTypesData, setCaseTypesData] = useState<ChartData<"pie">>({
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  });
  const [audioVideoData, setAudioVideoData] = useState<ChartData<"pie">>({
    labels: ["Да", "Нет", "Не знаю", "Другое:"],
    datasets: [{ data: [0, 0, 0, 0], backgroundColor: [] }],
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
  const [accessibilityRatings, setAccessibilityRatings] = useState<{
    [key: string]: number;
  }>({});
  const [officeRatings, setOfficeRatings] = useState<{ [key: string]: number }>(
    {}
  );
  const [startTimeData, setStartTimeData] = useState<ChartData<"pie">>({
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  });
  const [radarData, setRadarData] = useState<ChartData<"radar">>({
    labels: ["Судья", "Сотрудники", "Канцелярия", "Процесс", "Здание"],
    datasets: [
      {
        label: "Средние оценки по республике",
        data: [0, 0, 0, 0, 0],
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  });
  const [totalResponsesAnswer, setTotalResponsesAnswer] = useState<number>(0);
  const [disrespectData, setDisrespectData] = useState<any>({
    labels: [],
    datasets: [
      { data: [], backgroundColor: "rgb(139, 69, 19)", barThickness: 20 },
    ],
  });
  const [ageData, setAgeData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  });
  const [ageGenderData, setAgeGenderData] = useState<ChartData<"bar">>({
    labels: ["18-29", "30-44", "45-59", "60 +"],
    datasets: [
      {
        label: "Мужской",
        data: [0, 0, 0, 0],
        backgroundColor: "rgb(51, 153, 255)",
      },
      {
        label: "Женский",
        data: [0, 0, 0, 0],
        backgroundColor: "rgb(255, 99, 132)",
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Круговые диаграммы
        let circleData;
        if (selectedCourtId) {
          circleData = surveyData?.circle || (await getCircleCourtData(selectedCourtId.toString()));
        } else {
          circleData = await getCircleRepublicData();
        }
        if (circleData) {
          circleData.forEach((question: any) => {
            const labels = question.options.map((option: any) => option.answer_option_ru);
            const data = question.options.map((option: any) => parseFloat(option.percentage.replace("%", "")));
            switch (question.question_id) {
              case 2:
                setCategoryData({
                  labels,
                  datasets: [
                    {
                      data,
                      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
                    },
                  ],
                });
                break;
              case 3:
                setGenderData({
                  labels,
                  datasets: [{ data, backgroundColor: ["#FF6384", "#36A2EB"] }],
                });
                break;
              case 5:
                setCaseTypesData({
                  labels,
                  datasets: [
                    {
                      data,
                      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
                    },
                  ],
                });
                break;
              case 13:
                setAudioVideoData({
                  labels,
                  datasets: [
                    {
                      data,
                      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#9966FF"],
                    },
                  ],
                });
                break;
              case 16:
                setStartTimeData({
                  labels,
                  datasets: [
                    {
                      data,
                      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                    },
                  ],
                });
                break;
            }
          });
        }
  
        // Радарная диаграмма
        let radarSource;
        if (selectedCourtId) {
          radarSource = surveyData?.radar || (await getRadarCourtData(selectedCourtId.toString()));
        } else {
          radarSource = await getRadarRepublicData();
        }
        if (radarSource && radarSource.data) {
          const radarLabels = ["Судья", "Сотрудники", "Канцелярия", "Процесс", "Здание"];
          const allCourtsAvg = radarLabels.map((label) => {
            const item = radarSource.data.find((data: any) => data.aspect_ru === label);
            return item ? item.all_courts_avg : 0;
          });
          setRadarData({
            labels: radarLabels,
            datasets: [
              {
                label: selectedCourtId
                  ? `Средние оценки для суда ${selectedCourtName || courtName || "неизвестно"}`
                  : "Средние оценки по республике",
                data: allCourtsAvg,
                fill: true,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
              },
            ],
          });
        }
  
        // Столбчатые данные
        let barData;
        if (selectedCourtId) {
          barData = surveyData?.bar || (await getBarCourtData(selectedCourtId.toString()));
        } else {
          barData = await getBarRepublicData();
        }
        if (barData) {
          barData.forEach((question: any) => {
            const labels = question.options.map((option: any) => option.answer_option_ru);
            const data = question.options.map((option: any) => option.count);
            switch (question.question_id) {
              case 1:
                setTrafficSourceData({
                  labels,
                  datasets: [
                    {
                      data,
                      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#4CAF50", "#9C27B0"],
                    },
                  ],
                });
                break;
              case 4:
                setAgeData({
                  labels,
                  datasets: [
                    {
                      label: "Возраст",
                      data,
                      backgroundColor: ["#5B9BD5", "#C000C0", "#FFC000", "#3CB371"],
                    },
                  ],
                });
                break;
            }
          });
  
          const ageQuestion = barData.find((q: any) => q.question_id === 4);
          const genderQuestion = circleData.find((q: any) => q.question_id === 3);
  
          if (ageQuestion && genderQuestion) {
            const ageLabels = ageQuestion.options.map((opt: any) => opt.answer_option_ru);
            const ageCounts = ageQuestion.options.map((opt: any) => opt.count);
            const totalResponses = ageCounts.reduce((sum: number, count: number) => sum + count, 0);
            const agePercentages = ageCounts.map((count: number) => (count / totalResponses) * 100);
  
            const femalePercentage = parseFloat(
              genderQuestion.options.find((opt: any) => opt.answer_option_ru === "Женский").percentage.replace("%", "")
            );
            const malePercentage = parseFloat(
              genderQuestion.options.find((opt: any) => opt.answer_option_ru === "Мужской").percentage.replace("%", "")
            );
  
            const maleData = agePercentages.map((percent: number) => -(percent * malePercentage) / 100);
            const femaleData = agePercentages.map((percent: number) => (percent * femalePercentage) / 100);
  
            setAgeGenderData({
              labels: ageLabels,
              datasets: [
                {
                  label: "Мужской",
                  data: maleData,
                  backgroundColor: "#36A2EB",
                },
                {
                  label: "Женский",
                  data: femaleData,
                  backgroundColor: "#FF6384",
                },
              ],
            });
          }
        }
  
        // Данные прогресса
        let progressData;
        if (selectedCourtId) {
          progressData = surveyData?.progress || (await getProgressCourtData(selectedCourtId.toString()));
        } else {
          progressData = await getProgressRepublicData();
        }
        if (progressData) {
          const judgeQuestions = [11, 12, 14, 17];
          const staffQuestions = [7, 9];
          const officeQuestions = [8];
          const accessibilityQuestions = [6];
  
          const judgeRatingsData: { [key: string]: number } = {};
          const staffRatingsData: { [key: string]: number } = {};
          const officeRatingsData: { [key: string]: number } = {};
          const accessibilityRatingsData: { [key: string]: number } = {};
          const processRatingsData: { [key: string]: number } = {};
  
          progressData.forEach((item: any) => {
            const questionText = item.question_text_ru.replace(/^\d+\.\s*/, '');
            const score = item.average_score;
  
            if (judgeQuestions.includes(item.question_id)) {
              judgeRatingsData[questionText] = score;
            } else if (staffQuestions.includes(item.question_id)) {
              staffRatingsData[questionText] = score;
            } else if (officeQuestions.includes(item.question_id)) {
              officeRatingsData[questionText] = score;
            } else if (accessibilityQuestions.includes(item.question_id)) {
              accessibilityRatingsData[questionText] = score;
            }
          });
  
          setJudgeRatings(judgeRatingsData);
          setStaffRatings(staffRatingsData);
          setOfficeRatings(officeRatingsData);
          setAccessibilityRatings(accessibilityRatingsData);
          setProcessRatings(processRatingsData);
        }
  
        // Данные колонн (DisrespectChart)
        let columnData;
        if (selectedCourtId) {
          columnData = surveyData?.column || (await getColumnCourtData(selectedCourtId.toString()));
        } else {
          columnData = await getColumnRepublicData();
        }
        if (columnData) {
          const disrespectQuestion = columnData.find((q: any) => q.question_id === 15);
          if (disrespectQuestion) {
            const labels = disrespectQuestion.options.map((option: any) => option.answer_option_ru);
            const data = disrespectQuestion.options.map((option: any) => option.count);
            setDisrespectData({
              labels,
              datasets: [
                {
                  data,
                  backgroundColor: ["#4682B4", "#8B008B", "#DAA520", "#2E8B57"],
                  barThickness: 20,
                },
              ],
            });
          }
        }
  
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setCategoryData({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
        setGenderData({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
        setTrafficSourceData({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
        setCaseTypesData({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
        setAudioVideoData({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
        setRadarData({ labels: [], datasets: [] });
        setAgeData({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
        setAgeGenderData({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
        setJudgeRatings({});
        setStaffRatings({});
        setProcessRatings({});
        setOfficeRatings({});
        setAccessibilityRatings({});
        setDisrespectData({ labels: [], datasets: [{ data: [], backgroundColor: [], barThickness: 20 }] });
      }
    };
  
    fetchData();
  }, [selectedCourtId, selectedCourtName, courtName]);

  const comments =
    remarks
      ?.slice()
      .reverse()
      .slice(0, 5)
      .map((remark) => ({
        text: remark.custom_answer || "Нет текста",
      })) || [];

  return {
    categoryData,
    genderData,
    trafficSourceData,
    caseTypesData,
    audioVideoData,
    judgeRatings,
    staffRatings,
    processRatings,
    accessibilityRatings,
    officeRatings,
    startTimeData,
    radarData,
    totalResponses,
    totalResponsesAnswer,
    disrespectData,
    ageData,
    ageGenderData,
    comments,
    isLoading,
  };
}
