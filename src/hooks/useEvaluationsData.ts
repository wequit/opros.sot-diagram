"use client";
import { useChartData } from "@/context/ChartDataContext";

export type Option = {
  text_ru: string;
  percentage?: string;
  count?: number;
};

export type Question = {
  question_id: number;
  question_text_ru: string;
  options: Option[];
};

export function getPieData(question: Question) {
  return {
    labels: question.options.map((opt: Option) => opt.text_ru),
    datasets: [
      {
        data: question.options.map((opt: Option) => {
          if (opt.percentage) {
            return parseFloat(opt.percentage.replace("%", ""));
          }
          return opt.count || 0;
        }),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#8B0000", "#008000"
        ],
      },
    ],
  };
}

export function getBarData(question: Question) {
  return {
    labels: question.options.map((opt: Option) => opt.text_ru),
    datasets: [
      {
        data: question.options.map((opt: Option) => opt.count || parseFloat(opt.percentage?.replace("%", "") || "0")),
        backgroundColor: [
          "#5B9BD5", "#C000C0", "#FFC000", "#3CB371", "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"
        ],
      },
    ],
  };
}

export default function useEvaluationData() {
  const {
    circleData,
    barData,
    isLoading,
    surveyResponsesCount,
  } = useChartData();

  const barQuestions = (barData || []);
  const circleQuestions = (circleData || []);

  const uniqueQuestions = [
    ...barQuestions,
    ...circleQuestions,
  ].filter(
    (q, idx, arr) => arr.findIndex((qq) => qq.question_id === q.question_id) === idx
  );

  const questionsById = Object.fromEntries([
    ...barQuestions.map(q => [q.question_id, { ...q, _type: 'bar' }]),
    ...circleQuestions.map(q => [q.question_id, { ...q, _type: 'pie' }]),
  ]);

  return {
    circleData,
    barData,
    isLoading,
    totalResponses: surveyResponsesCount,
    uniqueQuestions,
    questionsById,
  };
}