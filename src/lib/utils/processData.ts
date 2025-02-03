import { Question } from '@/lib/utils/Dates';

interface QuestionResponse {
  question: number;
  selected_option: {
    id: number;
    text_ru: string;
    text_kg: string;
  } | null;
  custom_answer: string | null;
}

export function processFirstQuestion(responses: QuestionResponse[]) {
  const validResponses = responses.filter(r => 
    r.selected_option !== null && r.custom_answer !== "Необязательный вопрос"
  );

  // Группируем ответы по вариантам
  const grouped = validResponses.reduce((acc, response) => {
    const optionText = response.selected_option!.text_ru;
    acc[optionText] = (acc[optionText] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Сортируем данные по количеству (опционально)
  const sortedEntries = Object.entries(grouped).sort((a, b) => b[1] - a[1]);

  return {
    labels: sortedEntries.map(([label]) => label),
    datasets: [{
      data: sortedEntries.map(([_, value]) => value),
      backgroundColor: 'rgb(54, 162, 235)',
      barThickness: 20,
      datalabels: {
        color: "#FFFFFF",
        formatter: (value: number): string => `${value}`,
      },
      label: ''
    }]
  };
}

export function processSecondQuestion(responses: QuestionResponse[]) {
  // Фильтруем ответы только для второго вопроса и убираем null значения
  const validResponses = responses.filter(r => r.selected_option !== null);
  const totalResponses = validResponses.length;

  // Группируем ответы по вариантам
  const grouped = validResponses.reduce((acc, response) => {
    const optionText = response.selected_option!.text_ru;
    acc[optionText] = (acc[optionText] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Преобразуем в проценты
  const labels = Object.keys(grouped);
  const data = labels.map(label => 
    Math.round((grouped[label] / totalResponses) * 100)
  );

  return {
    labels,
    datasets: [{
      data,
      backgroundColor: [
        'rgb(54, 162, 235)',
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',   // оранжевый
        'rgb(153, 102, 255)',
      ],
      datalabels: {
        color: "#FFFFFF",
        display: true,
        formatter: (value: number): string => value + '%',
      }
    }]
  };
}

export function processThirdQuestion(responses: QuestionResponse[]) {
  // Фильтруем ответы только для третьего вопроса и убираем null значения
  const validResponses = responses.filter(r => r.selected_option !== null);
  const totalResponses = validResponses.length;

  // Группируем ответы по вариантам
  const grouped = validResponses.reduce((acc, response) => {
    const optionText = response.selected_option!.text_ru;
    acc[optionText] = (acc[optionText] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Преобразуем в проценты
  const labels = Object.keys(grouped);
  const data = labels.map(label => 
    Math.round((grouped[label] / totalResponses) * 100)
  );

  return {
    labels,
    datasets: [{
      data,
      backgroundColor: [
        'rgb(255, 99, 132)',  // Жензина
        'rgb(51, 153, 255)',  // Мужчина
      ],
      datalabels: {
        color: "#FFFFFF",
        display: true,
        formatter: (value: number): string => value + '%',
      }
    }]
  };
}

export function processFifthQuestion(responses: QuestionResponse[]) {
  // Фильтруем ответы только для пятого вопроса и убираем null значения
  const validResponses = responses.filter(r => r.selected_option !== null);
  const totalResponses = validResponses.length;

  // Группируем ответы по вариантам
  const grouped = validResponses.reduce((acc, response) => {
    const optionText = response.selected_option!.text_ru;
    acc[optionText] = (acc[optionText] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Преобразуем в проценты
  const labels = Object.keys(grouped);
  const data = labels.map(label => 
    Math.round((grouped[label] / totalResponses) * 100)
  );

  return {
    labels,
    datasets: [{
      data,
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
}

export function processAudioVideoQuestion(questions: Question[]) {
  const question = questions.find(q => q.id === 13);
  
  if (question && question.question_responses) {
    const validResponses = question.question_responses.filter(
      r => r.selected_option !== null
    );
    
    const totalResponses = validResponses.length;
    
    const grouped = validResponses.reduce((acc: {[key: string]: number}, response) => {
      const optionText = response.selected_option!.text_ru;
      acc[optionText] = (acc[optionText] || 0) + 1;
      return acc;
    }, {});

    const percentages = Object.entries(grouped).reduce((acc: {[key: string]: number}, [key, value]) => {
      acc[key] = Math.round((value / totalResponses) * 100);
      return acc;
    }, {});

    return {
      labels: Object.keys(grouped),
      datasets: [{
        data: Object.values(percentages),
        backgroundColor: [
          'rgb(54, 162, 235)',  // Blue
          'rgb(255, 99, 132)',  // Red
          'rgb(255, 159, 64)',   // Orange
          'rgb(153, 102, 255)', // фиолетовый
        ]
      }]
    };
  }

  return {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
    }]
  };
}

export function processJudgeRatings(questions: Question[]): { [key: string]: number } {
  // Маппинг ID вопросов к их заголовкам
  const questionTitles: { [key: number]: string } = {
    11: "Разъяснение прав и обязанности в судебном процессе",
    12: "Контроль судьи за порядком в зале суда",
    14: "Проявление уважения к участникам судебного процесса",
    17: "Общая оценка работы судьи"
  };

  // Инициализируем объект для хранения сумм и количества ответов
  const ratingSums: { [key: string]: { sum: number; count: number } } = {};
  
  // Инициализируем все заголовки с нулевыми значениями
  Object.values(questionTitles).forEach(title => {
    ratingSums[title] = { sum: 0, count: 0 };
  });

  // Обрабатываем каждый вопрос
  questions.forEach(question => {
    if (questionTitles[question.id]) {
      const title = questionTitles[question.id];
      
      question.question_responses.forEach(response => {
        if (response.selected_option && response.selected_option.text_ru) {
          const rating = Number(response.selected_option.text_ru);
          if (!isNaN(rating) && rating >= 1 && rating <= 5) {
            ratingSums[title].sum += rating;
            ratingSums[title].count += 1;
          }
        }
      });
    }
  });

  // Вычисляем средние значения
  const averageRatings: { [key: string]: number } = {};
  
  Object.entries(ratingSums).forEach(([title, { sum, count }]) => {
    averageRatings[title] = count > 0 ? Number((sum / count).toFixed(1)) : 0;
  });

  return averageRatings;
}

export function processStaffRatings(questions: Question[]): { [key: string]: number } {
  // Маппинг ID вопросов к их заголовкам
  const questionTitles: { [key: number]: string } = {
    7: "Отношение сотрудников",
    9: "Предоставление всей необходимой информации"
  };

  // Инициализируем объект для хранения сумм и количества ответов
  const ratingSums: { [key: string]: { sum: number; count: number } } = {};
  
  // Инициализируем все заголовки с нулевыми значениями
  Object.values(questionTitles).forEach(title => {
    ratingSums[title] = { sum: 0, count: 0 };
  });

  // Обрабатываем каждый вопрос
  questions.forEach(question => {
    if (questionTitles[question.id]) {
      const title = questionTitles[question.id];
      
      question.question_responses.forEach(response => {
        if (response.selected_option && response.selected_option.text_ru) {
          const rating = Number(response.selected_option.text_ru);
          if (!isNaN(rating) && rating >= 1 && rating <= 5) {
            ratingSums[title].sum += rating;
            ratingSums[title].count += 1;
          }
        }
      });
    }
  });

  // Вычисляем средние значения
  const averageRatings: { [key: string]: number } = {};
  Object.entries(ratingSums).forEach(([title, { sum, count }]) => {
    averageRatings[title] = count > 0 ? Number((sum / count).toFixed(1)) : 0;
  });

  return averageRatings;
}

export function processProcessRatings(questions: Question[]): { [key: string]: number } {
  // Маппинг ID вопросов к их заголовкам
  const questionTitles: { [key: number]: string } = {
    10: "Оценка судебного процесса"
  };

  // Инициализируем объект для хранения сумм и количества ответов
  const ratingSums: { [key: string]: { sum: number; count: number } } = {};
  
  // Инициализируем все заголовки с нулевыми значениями
  Object.values(questionTitles).forEach(title => {
    ratingSums[title] = { sum: 0, count: 0 };
  });

  // Обрабатываем каждый вопрос
  questions.forEach(question => {
    if (questionTitles[question.id]) {
      const title = questionTitles[question.id];
      
      question.question_responses.forEach(response => {
        if (response.selected_option && response.selected_option.text_ru) {
          const rating = Number(response.selected_option.text_ru);
          if (!isNaN(rating) && rating >= 1 && rating <= 5) {
            ratingSums[title].sum += rating;
            ratingSums[title].count += 1;
          }
        }
      });
    }
  });

  // Вычисляем средние значения
  const averageRatings: { [key: string]: number } = {};
  Object.entries(ratingSums).forEach(([title, { sum, count }]) => {
    averageRatings[title] = count > 0 ? Number((sum / count).toFixed(1)) : 0;
  });

  return averageRatings;
}

export function processOfficeRatings(questions: Question[]): { [key: string]: number } {
  // Маппинг ID вопросов к их заголовкам
  const questionTitles: { [key: number]: string } = {
    8: "Предоставление всей необходимой информации"
  };

  // Инициализируем объект для хранения сумм и количества ответов
  const ratingSums: { [key: string]: { sum: number; count: number } } = {};
  
  // Инициализируем все заголовки с нулевыми значениями
  Object.values(questionTitles).forEach(title => {
    ratingSums[title] = { sum: 0, count: 0 };
  });

  // Обрабатываем каждый вопрос
  questions.forEach(question => {
    if (questionTitles[question.id]) {
      const title = questionTitles[question.id];
      
      question.question_responses.forEach(response => {
        if (response.selected_option && response.selected_option.text_ru) {
          const rating = Number(response.selected_option.text_ru);
          if (!isNaN(rating) && rating >= 1 && rating <= 5) {
            ratingSums[title].sum += rating;
            ratingSums[title].count += 1;
          }
        }
      });
    }
  });

  // Вычисляем средние значения
  const averageRatings: { [key: string]: number } = {};
  Object.entries(ratingSums).forEach(([title, { sum, count }]) => {
    averageRatings[title] = count > 0 ? Number((sum / count).toFixed(1)) : 0;
  });

  return averageRatings;
} 

export function processAccessibilityRatings(questions: Question[]): { [key: string]: number } {
  // Маппинг ID вопросов к их заголовкам
  const questionTitles: { [key: number]: string } = {
    6: "Доступность здания суда для людей с инвалидностью и маломобильных категорий"
  };

  // Инициализируем объект для хранения сумм и количества ответов
  const ratingSums: { [key: string]: { sum: number; count: number } } = {};
  
  // Инициализируем все заголовки с нулевыми значениями
  Object.values(questionTitles).forEach(title => {
    ratingSums[title] = { sum: 0, count: 0 };
  });

  // Обрабатываем каждый вопрос
  questions.forEach(question => {
    if (questionTitles[question.id]) {
      const title = questionTitles[question.id];
      
      question.question_responses.forEach(response => {
        if (response.selected_option && response.selected_option.text_ru) {
          const rating = Number(response.selected_option.text_ru);
          if (!isNaN(rating) && rating >= 1 && rating <= 5) {
            ratingSums[title].sum += rating;
            ratingSums[title].count += 1;
          }
        }
      });
    }
  });

  // Вычисляем средние значения
  const averageRatings: { [key: string]: number } = {};
  Object.entries(ratingSums).forEach(([title, { sum, count }]) => {
    averageRatings[title] = count > 0 ? Number((sum / count).toFixed(1)) : 0;
  });

  return averageRatings;
}

export function processStartTimeQuestion(questions: Question[]) {
  // Ищем вопрос 16
  const question = questions.find(q => q.id === 16);
  
  if (question && question.question_responses) {
    // Фильтруем валидные ответы
    const validResponses = question.question_responses.filter(
      (r: QuestionResponse) => r.selected_option !== null
    );
    
    const totalResponses = validResponses.length;
    
    if (totalResponses === 0) {
      return getEmptyStartTimeData();
    }

    // Группируем ответы
    const grouped = validResponses.reduce((acc: {[key: string]: number}, response) => {
      const optionText = response.selected_option!.text_ru;
      acc[optionText] = (acc[optionText] || 0) + 1;
      return acc;
    }, {});

    // Преобразуем в проценты и фильтруем нулевые значения
    const percentages = Object.entries(grouped).reduce((acc: {[key: string]: number}, [key, value]) => {
      const percentage = Math.round((value / totalResponses) * 100);
      if (percentage > 0) {
        acc[key] = percentage;
      }
      return acc;
    }, {});

    // Получаем только ненулевые значения
    const labels = Object.keys(percentages);
    const data = labels.map(label => percentages[label]);
    const colors = labels.map((_, index) => [
      'rgb(54, 162, 235)',  // синий
      'rgb(255, 99, 132)',  // красный
      'rgb(255, 159, 64)',   // оранжевый
      'rgb(153, 102, 255)', // фиолетовый
    ][index]);

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: colors
      }]
    };
  }

  return getEmptyStartTimeData();
}

function getEmptyStartTimeData() {
  return {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
    }]
  };
}

export function processDisrespectQuestion(questions: Question[]): {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string;
    barThickness: number;
    datalabels: {
      color: string;
      align: string;
      anchor: string;
      offset: number;
      formatter: (value: number) => string;
      font: {
        size: number;
        weight: string;
      };
    };
  }[];
} {
  const question = questions.find(q => q.id === 15);
  
  if (!question || !question.question_responses) {
    return {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: "rgb(139, 69, 19)",
        barThickness: 20,
        datalabels: {
          color: "gray",
          align: "end",
          anchor: "end",
          offset: 4,
          formatter: (value: number): string => `${value}`,
          font: {
            size: 14,
            weight: "bold"
          }
        }
      }]
    };
  }

  // Фильтруем валидные ответы
  const validResponses = question.question_responses.filter(
    r => r.selected_option !== null
  );
  
  // Группируем ответы
  const grouped = validResponses.reduce((acc: {[key: string]: number}, response) => {
    const optionText = response.selected_option!.text_ru;
    acc[optionText] = (acc[optionText] || 0) + 1;
    return acc;
  }, {});

  // Сортируем по количеству ответов (от большего к меньшему)
  const sortedEntries = Object.entries(grouped)
    .sort((a, b) => b[1] - a[1]);

  return {
    labels: sortedEntries.map(([label]) => label),
    datasets: [{
      data: sortedEntries.map(([_, value]) => value),
      backgroundColor: "rgb(139, 69, 19)",
      barThickness: 20,
      datalabels: {
        color: "gray",
        align: "end",
        anchor: "end",
        offset: 4,
        formatter: (value: number): string => {
          const percentage = ((value / 100) * 100).toFixed(1);
          return `${value} (${percentage}%)`;
        },
        font: {
          size: 14,
          weight: "bold"
        }
      }
    }]
  };
} 