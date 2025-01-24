import { Question } from '@/lib/utils/Data';

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
  // Фильтруем только валидные ответы
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
          'rgb(255, 159, 64)'   // Orange
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

export function processJudgeRatings(questions:Question[]) {
  // Номера вопросов, которые нас интересуют
  const questionIds = [11, 14, 12, 17];
  
  // Объект для хранения средних оценок
  const averageRatings: { [key: string]: number } = {};
  
  // Названия вопросов на русском
  const questionTitles: { [key: number]: string } = {
    11: "Разъяснение прав и обязанности в судебном процессе",
    12: "Проявление уважения к участникам судебного процесса",
    14: "Контроль судьи за порядком в зале суда",
    17: "Общая оценка работы судьи"
  };

  // Обрабатываем каждый вопрос
  questionIds.forEach(qId => {
    const question = questions.find(q => q.id === qId);
    if (question && question.question_responses) {
      // Фильтруем валидные ответы
      const validResponses = question.question_responses.filter(
        (r: any) => r.selected_option && r.selected_option.text_kg
      );

      if (validResponses.length > 0) {
        // Вычисляем среднюю оценку
        const sum = validResponses.reduce((acc: number, r: any) => {
          return acc + Number(r.selected_option.text_kg);
        }, 0);
        
        averageRatings[questionTitles[qId]] = Number((sum / validResponses.length).toFixed(1));
      }
    }
  });

  return averageRatings;
}

export function processStaffRatings(questions:Question[]) {
  const questionIds = [7, 9];
  const averageRatings: { [key: string]: number } = {};
  
  const questionTitles: { [key: number]: string } = {
    7: "Отношение сотрудников",
    9: "Предоставление всей необходимой информации"
  };

  questionIds.forEach(qId => {
    const question = questions.find(q => q.id === qId);
    if (question && question.question_responses) {
      const validResponses = question.question_responses.filter(
        (r: any) => r.selected_option && r.selected_option.text_kg
      );

      if (validResponses.length > 0) {
        const sum = validResponses.reduce((acc: number, r: any) => {
          return acc + Number(r.selected_option.text_kg);
        }, 0);
        
        averageRatings[questionTitles[qId]] = Number((sum / validResponses.length).toFixed(1));
      }
    }
  });

  return averageRatings;
} 

export function processProcessRatings(questions: Question[]) {
  // Ищем вопрос 10
  const question = questions.find(q => q.id === 10);
  const averageRating: { [key: string]: number } = {};
  
  if (question && question.question_responses) {
    // Фильтруем валидные ответы
    const validResponses = question.question_responses.filter(
      (r: any) => r.selected_option && r.selected_option.text_kg
    );

    if (validResponses.length > 0) {
      // Вычисляем среднюю оценку
      const sum = validResponses.reduce((acc: number, r: any) => {
        return acc + Number(r.selected_option.text_kg);
      }, 0);
      
      averageRating["Оценка судебного процесса"] = Number((sum / validResponses.length).toFixed(1));
    }
  }

  return averageRating;
} 

export function processOfficeRatings(questions: Question[]) {
  // Ищем вопрос 8
  const question = questions.find(q => q.id === 8);
  const averageRatings: { [key: string]: number } = {};

  if (question && question.question_responses) {
    // Фильтруем валидные ответы
    const validResponses = question.question_responses.filter(
      (r: any) => r.selected_option && r.selected_option.text_kg
    );

    if (validResponses.length > 0) {
      // Вычисляем среднюю оценку
      const sum = validResponses.reduce((acc: number, r: any) => {
        return acc + Number(r.selected_option.text_kg);
      }, 0);
      
      averageRatings["Предоставление всей необходимой информации"] = 
        Number((sum / validResponses.length).toFixed(1));
    }
  }

  return averageRatings;
} 

export function processAccessibilityRatings(questions:Question[]) {
  // Ищем вопрос 6
  const question = questions.find(q => q.id === 6);
  const averageRatings: { [key: string]: number } = {};

  if (question && question.question_responses) {
    // Фильтруем валидные ответы и проверяем, что text_kg это число
    const validResponses = question.question_responses.filter(
      (r: any) => r.selected_option && 
                  r.selected_option.text_kg && 
                  !isNaN(parseInt(r.selected_option.text_kg))
    );

    if (validResponses.length > 0) {
      // Вычисляем среднюю оценку
      const sum = validResponses.reduce((acc: number, r: any) => {
        const value = parseInt(r.selected_option.text_kg);
        return acc + value;
      }, 0);
      
      const average = Number((sum / validResponses.length).toFixed(1));
      
      if (!isNaN(average)) {
        averageRatings["Доступность здания суда для людей с инвалидностью и маломобильных категорий"] = average;
      } else {
        averageRatings["Доступность здания суда для людей с инвалидностью и маломобильных категорий"] = 0;
      }
    }
  }

  // Если нет данных, возвращаем 0
  if (Object.keys(averageRatings).length === 0) {
    averageRatings["Доступность здания суда для людей с инвалидностью и маломобильных категорий"] = 0;
  }

  return averageRatings;
} 

export function processStartTimeQuestion(questions: Question[]) {
  // Ищем вопрос 16
  const question = questions.find(q => q.id === 16);
  
  if (question && question.question_responses) {
    // Фильтруем валидные ответы
    const validResponses = question.question_responses.filter(
      (r: any) => r.selected_option !== null
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
      'rgb(255, 159, 64)'   // оранжевый
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
