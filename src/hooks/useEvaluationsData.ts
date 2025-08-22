"use client";
import { useChartData } from "@/context/ChartDataContext";

export type Option = {
  answer_option_id: number;
  text_ru: string;
  text_kg: string;
  count: number;
  percentage: string;
};

export type Question = {
  question_id: number;
  question_text_ru: string;
  question_text_kg: string;
  options: Option[];
  _type?: 'bar' | 'pie';
};



// Функция для создания детерминированного псевдослучайного числа на основе seed
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Функция для перемешивания массива с фиксированным seed
function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomValue = seededRandom(seed + i);
    const j = Math.floor(randomValue * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateDistinctColors(count: number, questionId: number): string[] {
  const colors = [
    '#dc2626', // красный
    '#059669', // зеленый
    '#d97706', // оранжевый
    '#7c3aed', // фиолетовый
    '#0891b2', // голубой
    '#be185d', // малиновый
    '#65a30d', // лайм
    '#0d9488', // бирюзовый
  ];
  
  const shuffledColors = shuffleWithSeed(colors, questionId);
  
  if (count > shuffledColors.length) {
    for (let i = shuffledColors.length; i < count; i++) {
      const hue = ((questionId + i) * 137.5) % 360; 
      const saturation = 70 + (i % 3) * 10; 
      const lightness = 35 + (i % 4) * 5;   
      shuffledColors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
  }
  
  return shuffledColors.slice(0, count);
}

export function getBarData(question: Question) {
  const backgroundColor = generateDistinctColors(question.options.length, question.question_id);
  
  return {
    labels: question.options.map((opt: Option) => opt.text_ru),
    datasets: [
      {
        label: 'Количество ответов',
        data: question.options.map((opt: Option) => opt.count),
        backgroundColor,
        percentages: question.options.map((opt: Option) => opt.percentage),
      },
    ],
  };
}

const sections = [
  {
    title: "Раздел 1. ИНФОРМАЦИЯ О РЕСПОНДЕНТЕ",
    questionIds: [1, 2, 3, 4]
  },
  {
    title: "Раздел 2. ДОСТУП К ПРАВОСУДИЮ", 
    questionIds: [5, 6]
  },
  {
    title: "Раздел 3. СОТРУДНИКИ СУДА",
    questionIds: [7, 8]
  },
  {
    title: "Раздел 4. РАБОТА СУДЕЙ",
    questionIds: [9, 10, 11, 12, 13]
  },
  {
    title: "Раздел 5. УСЛОВИЯ В ЗДАНИИ СУДА",
    questionIds: [14, 15, 17]
  },
  {
    title: "Раздел 6. ОБЩАЯ ОЦЕНКА",
    questionIds: [18, 19, 20]
  }
];

const textQuestionIds = [6, 13, 20];

export default function useEvaluationData() {
  const {
    circleData,
    barData,
    isLoading,
    surveyResponsesCount,
  } = useChartData();

  const barQuestions = (barData || []);

  const questionsById = Object.fromEntries(
    barQuestions.map(q => [q.question_id, { ...q, _type: 'bar' }])
  );

  return {
    circleData,
    barData,
    isLoading,
    totalResponses: surveyResponsesCount,
    questionsById,
    sections,
    textQuestionIds,
  };
}