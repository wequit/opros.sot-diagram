"use client";
import { useState, useEffect } from "react";
import { useSurveyData } from "@/context/SurveyContext";
import { useRemarks } from "@/components/RemarksApi";
import { ChartData } from "chart.js";

export default function useEvaluationData(
  selectedCourtName?: string,
  courtName?: string
) {
  const {
    surveyData,
    language,
    surveyResponsesCount,
    isLoading,
    selectedCourtId,
    dateParams,
  } = useSurveyData();
  const { remarks } = useRemarks();

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
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
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
    labels: [],
    datasets: [
      {
        label: "Средние оценки по республике",
        data: [],
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
    if (!surveyData) return;

    try {
      const circleData = surveyData.circle;
      if (circleData) {
        circleData.forEach((question: any) => {
          const labels =
            question.options?.map((option: any) =>
              language === "ru" ? option.text_ru : option.text_kg
            ) || [];
          const rawData =
            question.options?.map((option: any) => {
              const percentage = option.percentage?.replace("%", "") || "0";
              const value = parseFloat(percentage);
              return isNaN(value) ? 0 : value;
            }) || [];
          const filteredData = rawData.map((value) =>
            value === 0 ? null : value
          );

          switch (question.question_id) {
            case 2:
              setCategoryData({
                labels,
                datasets: [
                  {
                    data: filteredData,
                    backgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56",
                      "#4BC0C0",
                    ],
                  },
                ],
              });
              break;
            case 3:
              setGenderData({
                labels,
                datasets: [
                  {
                    data: filteredData,
                    backgroundColor: ["#FF6384", "#36A2EB"],
                  },
                ],
              });
              break;
            case 5:
              setCaseTypesData({
                labels,
                datasets: [
                  {
                    data: filteredData,
                    backgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56",
                      "#4BC0C0",
                    ],
                  },
                ],
              });
              break;
            case 13:
              setAudioVideoData({
                labels,
                datasets: [
                  {
                    data: filteredData,
                    backgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56",
                      "#9966FF",
                    ],
                  },
                ],
              });
              break;
            case 16:
              setStartTimeData({
                labels,
                datasets: [
                  {
                    data: filteredData,
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                  },
                ],
              });
              break;
          }
        });
      } else {
      }

      const radarSource = surveyData.radar;
      if (radarSource && radarSource.data && radarSource.data.length > 0) {
        const radarLabels = radarSource.data.map((item: any) =>
          language === "ru" ? item.aspect_ru : item.aspect_kg
        );
        const allCourtsAvg = radarSource.data.map(
          (item: any) => item.all_courts_avg || 0
        );

        const radarLabel = selectedCourtId
          ? `Средние оценки для суда ${
              selectedCourtName || courtName || "неизвестно"
            }`
          : "Средние оценки по республике";
        setRadarData({
          labels: radarLabels,
          datasets: [
            {
              label: radarLabel,
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
      }

      const barData = surveyData.bar;
      if (barData && barData.length > 0) {
        barData.forEach((question: any) => {
          const labels =
            question.options?.map((option: any) =>
              language === "ru" ? option.text_ru : option.text_kg
            ) || [];
          const rawData =
            question.options?.map((option: any) => option.count || 0) || [];
          const filteredData = rawData.map((value) =>
            value === 0 ? null : value
          );

          switch (question.question_id) {
            case 1:
              setTrafficSourceData({
                labels,
                datasets: [
                  {
                    data: filteredData,
                    backgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56",
                      "#4BC0C0",
                      "#9966FF",
                      "#FF9F40",
                      "#4CAF50",
                      "#9C27B0",
                    ],
                  },
                ],
              });
              break;
            case 4:
              setAgeData({
                labels,
                datasets: [
                  {
                    label: language === "ru" ? "Возраст" : "Жаш",
                    data: filteredData,
                    backgroundColor: [
                      "#5B9BD5",
                      "#C000C0",
                      "#FFC000",
                      "#3CB371",
                    ],
                  },
                ],
              });
              break;
          }
        });

        const ageQuestion = barData.find((q: any) => q.question_id === 4);
        const genderQuestion =
          circleData && circleData.find((q: any) => q.question_id === 3);

        if (ageQuestion && genderQuestion) {
          const ageLabels = ageQuestion.options.map((opt: any) => opt.text_ru);
          const ageCounts = ageQuestion.options.map((opt: any) => opt.count);
          const totalResponses = ageCounts.reduce(
            (sum: number, count: number) => sum + count,
            0
          );
          const agePercentages = ageCounts.map(
            (count: number) => (count / totalResponses) * 100
          );

          const femalePercentage = parseFloat(
            genderQuestion.options
              .find((opt: any) => opt.text_ru === "Женский")
              ?.percentage?.replace("%", "") || "0"
          );
          const malePercentage = parseFloat(
            genderQuestion.options
              .find((opt: any) => opt.text_ru === "Мужской")
              ?.percentage?.replace("%", "") || "0"
          );

          const maleData = agePercentages.map(
            (percent: number) => -(percent * malePercentage) / 100
          );
          const femaleData = agePercentages.map(
            (percent: number) => (percent * femalePercentage) / 100
          );

          setAgeGenderData({
            labels: ageLabels,
            datasets: [
              {
                label: language === "ru" ? "Мужской" : "Эркек",
                data: maleData,
                backgroundColor: "#36A2EB",
              },
              {
                label: language === "ru" ? "Женский" : "Аял",
                data: femaleData,
                backgroundColor: "#FF6384",
              },
            ],
          });
        }
      } else {
      }

      const progressData = surveyData.progress;
      console.log("progressData:", progressData);
      if (progressData && progressData.length > 0) {
        const judgeQuestions = [11, 12, 14, 17];
        const staffQuestions = [7, 9];
        const officeQuestions = [8];
        const accessibilityQuestions = [6];
        // Добавим вопросы, которые относятся к processRatings
        const processQuestions = [10]; // Например, вопрос 10: "На понятном ли языке проводился судебный процесс?"

        const judgeRatingsData: { [key: string]: number } = {};
        const staffRatingsData: { [key: string]: number } = {};
        const officeRatingsData: { [key: string]: number } = {};
        const accessibilityRatingsData: { [key: string]: number } = {};
        const processRatingsData: { [key: string]: number } = {};

        progressData.forEach((item: any) => {
          const questionText =
            (language === "ru"
              ? item.question_text_ru
              : item.question_text_kg
            )?.replace(/^\d+\.\s*/, "") || "Не указано";
          const score = item.average_score || 0;

          if (judgeQuestions.includes(item.question_id)) {
            judgeRatingsData[questionText] = score;
          } else if (staffQuestions.includes(item.question_id)) {
            staffRatingsData[questionText] = score;
          } else if (officeQuestions.includes(item.question_id)) {
            officeRatingsData[questionText] = score;
          } else if (accessibilityQuestions.includes(item.question_id)) {
            accessibilityRatingsData[questionText] = score;
          } else if (processQuestions.includes(item.question_id)) {
            processRatingsData[questionText] = score;
          }
        });

        setJudgeRatings(judgeRatingsData);
        setStaffRatings(staffRatingsData);
        setOfficeRatings(officeRatingsData);
        setAccessibilityRatings(accessibilityRatingsData);
        setProcessRatings(processRatingsData);

        // Для отладки: проверим, что processRatings заполняется
        console.log("processRatingsData:", processRatingsData);
      } else {
        console.log("No progress data available");
      }

      const columnData = surveyData.column;
      if (columnData && columnData.length > 0) {
        const disrespectQuestion = columnData.find(
          (q: any) => q.question_id === 15
        );
        if (disrespectQuestion) {
          const labels =
            disrespectQuestion.options?.map((option: any) =>
              language === "ru" ? option.text_ru : option.text_kg
            ) || [];
          const rawData =
            disrespectQuestion.options?.map(
              (option: any) => option.count || 0
            ) || [];
          const filteredData = rawData.map((value) =>
            value === 0 ? null : value
          );

          setDisrespectData({
            labels,
            datasets: [
              {
                data: filteredData,
                backgroundColor: ["#4682B4", "#8B008B", "#DAA520", "#2E8B57"],
                barThickness: 20,
              },
            ],
          });
        }
      } else {
        console.log("No column data available");
      }
    } catch (error) {
      console.error("Ошибка при обработке данных:", error);
      setCategoryData({
        labels: [],
        datasets: [{ data: [], backgroundColor: [] }],
      });
      setGenderData({
        labels: [],
        datasets: [{ data: [], backgroundColor: [] }],
      });
      setTrafficSourceData({
        labels: [],
        datasets: [{ data: [], backgroundColor: [] }],
      });
      setCaseTypesData({
        labels: [],
        datasets: [{ data: [], backgroundColor: [] }],
      });
      setAudioVideoData({
        labels: [],
        datasets: [{ data: [], backgroundColor: [] }],
      });
      setRadarData({ labels: [], datasets: [] });
      setAgeData({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
      setAgeGenderData({
        labels: [],
        datasets: [{ data: [], backgroundColor: [] }],
      });
      setJudgeRatings({});
      setStaffRatings({});
      setProcessRatings({});
      setOfficeRatings({});
      setAccessibilityRatings({});
      setDisrespectData({
        labels: [],
        datasets: [{ data: [], backgroundColor: [], barThickness: 20 }],
      });
    }
  }, [surveyData, selectedCourtId, selectedCourtName, courtName, language]);

  useEffect(() => {
    if (remarks) {
      setTotalResponsesAnswer(remarks.length);
    }
  }, [remarks]);

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
    totalResponses: surveyResponsesCount,
    totalResponsesAnswer,
    disrespectData,
    ageData,
    ageGenderData,
    comments,
    isLoading,
  };
}
