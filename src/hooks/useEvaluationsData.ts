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

export default function useEvaluationData(selectedCourtName?: string, courtName?: string) {
  const { surveyData, language, totalResponses, isLoading } = useSurveyData();
  const { remarks } = useRemarks();
  const { user } = useAuth();
  const pathname = usePathname();

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
  const [judgeRatings, setJudgeRatings] = useState<{ [key: string]: number }>({});
  const [staffRatings, setStaffRatings] = useState<{ [key: string]: number }>({});
  const [processRatings, setProcessRatings] = useState<{ [key: string]: number }>({});
  const [accessibilityRatings, setAccessibilityRatings] = useState<{ [key: string]: number }>({});
  const [officeRatings, setOfficeRatings] = useState<{ [key: string]: number }>({});
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
    datasets: [{ data: [], backgroundColor: "rgb(139, 69, 19)", barThickness: 20 }],
  });
  const [ageData, setAgeData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  });
  const [ageGenderData, setAgeGenderData] = useState<ChartData<"bar">>({
    labels: ["18-29", "30-44", "45-59", "60 +"],
    datasets: [
      { label: "Мужской", data: [0, 0, 0, 0], backgroundColor: "rgb(51, 153, 255)" },
      { label: "Женский", data: [0, 0, 0, 0], backgroundColor: "rgb(255, 99, 132)" },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (surveyData && surveyData.questions && surveyData.questions.length > 0) {
          setCategoryData(processSecondQuestion(surveyData.questions[1]?.question_responses || [], language));
          setGenderData(processThirdQuestion(surveyData.questions[2]?.question_responses || [], language));
          setAgeGenderData(processAgeGenderData(
            surveyData.questions[2]?.question_responses || [],
            surveyData.questions[3]?.question_responses || []
          ));
          setTrafficSourceData(processFirstQuestion(surveyData.questions[0]?.question_responses || [], language));
          setCaseTypesData(processFifthQuestion(surveyData.questions[4]?.question_responses || [], language));
          setJudgeRatings(processProgressRatings(surveyData.questions, language));
          setStaffRatings(processStaffRatings(surveyData.questions, language));
          setProcessRatings(processProcessRatings(surveyData.questions, language));
          setOfficeRatings(processOfficeRatings(surveyData.questions, language));
          setAccessibilityRatings(processAccessibilityRatings(surveyData.questions, language));
          setAudioVideoData(processAudioVideoQuestion(surveyData.questions, language));
          setStartTimeData(processStartTimeQuestion(surveyData.questions, language));
          setDisrespectData(processDisrespectQuestion(surveyData.questions, language));

          const ageQuestion = surveyData.questions.find((q) => q.id === 4);
          if (ageQuestion) {
            setAgeData(processAgeData(ageQuestion.question_responses || []));
          }

          // Запрашиваем данные радара через наш API-роут
          const response = await fetch("/api/radar");
          if (!response.ok) {
            throw new Error("Ошибка при получении данных радара");
          }
          const republicData = await response.json();

          // Определяем порядок меток
          const radarLabels = ["Судья", "Сотрудники", "Канцелярия", "Процесс", "Здание"];
          // Преобразуем данные в массив значений в правильном порядке
          const allCourtsAvg = radarLabels.map(label => {
            const item = republicData.find((data: any) => data.aspect === label);
            return item ? item.all_courts_avg : 0;
          });

          // Устанавливаем данные для радара
          setRadarData({
            labels: radarLabels,
            datasets: [
              {
                label: "Средние оценки по республике",
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
        } else {
          // Обработка случая, когда данных нет
          setCategoryData({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
          setGenderData({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
          setAgeGenderData({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
          setTrafficSourceData({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
          setCaseTypesData({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
          setJudgeRatings({});
          setStaffRatings({});
          setProcessRatings({});
          setOfficeRatings({});
          setAccessibilityRatings({});
          setAudioVideoData({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
          setStartTimeData({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
          setDisrespectData({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
          setAgeData({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
          setRadarData({
            labels: ["Судья", "Сотрудники", "Канцелярия", "Процесс", "Здание"],
            datasets: [],
          });
        }

        if (remarks) {
          setTotalResponsesAnswer(remarks.length);
        }
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, [surveyData, language, user, selectedCourtName, courtName, pathname, remarks]);

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