import { Question } from '@/lib/utils/Dates';
interface QuestionResponse {
  question: number;
  selected_option: {
    id: number;
    text_ru: string;
    text_kg: string;
  } | null;
  multiple_selected_options?: {
    id: number;
    text_ru: string;
    text_kg: string;
  }[];
  custom_answer: string | null;
}



export function processFirstQuestion(responses: QuestionResponse[]) {
  // Определяем все возможные ответы для первого вопроса
  const allCategories = [
    "Стенды с qr кодом",
    "Через официальный сайт ВС",
    "Через портал “Цифрового правосудия КР”",
    "Через WhatsАpp",
    "Через независимых юристов",
    "Через мероприятия, соцролики и соцсети.",
    "Через сотрудников суда",
    "Другое:"
  ];

  // Фильтруем ответы, исключая null и необязательные ответы
  const validResponses = responses.filter(r => 
    r.selected_option !== null && r.custom_answer !== "Необязательный вопрос"
  );

  // Группируем ответы по вариантам
  const grouped = validResponses.reduce((acc, response) => {
    const optionText = response.selected_option!.text_ru;
    acc[optionText] = (acc[optionText] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Инициализируем массив данных с нулями для всех категорий
  const labels = allCategories;
  const data = labels.map(label => {
    const count = grouped[label] || 0; // Если категории нет в grouped, ставим 0
    return count;
  });

  // Сортируем по количеству (опционально)
  const sortedEntries = labels
    .map((label, index) => [label, data[index]] as [string, number])
    .sort((a, b) => b[1] - a[1]);

  return {
    labels: sortedEntries.map(([label]) => label),
    datasets: [{
      data: sortedEntries.map(([_, value]) => value),
      backgroundColor: [
        'rgb(54, 162, 235)', // Стенды с qr кодом
        'rgb(255, 99, 132)', // Через официальный сайт ВС
        'rgb(75, 192, 192)', // Через портал "Цифрового правосудия КР"
        'rgb(153, 102, 255)', // Через WhatsАpp
        'rgb(255, 159, 64)', // Через независимых юристов
        'rgb(255, 205, 86)', // Через мероприятия, соцролики и соцсети
        'rgb(231, 76, 60)', // Через сотрудников суда
        'rgb(142, 68, 173)', // Другое
      ],
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
  const allCategories = [
    "Сторона по делу (истец, ответчик, потерпевший, обвиняемый)",
    "Адвокат или представитель стороны",
    "Свидетель",
    "Посетитель (родственник, друг, сосед, коллега одной из сторон и др.)"
  ];

  const validResponses = responses.filter(r => r.selected_option !== null);
  const totalResponses = validResponses.length;

  // Группируем ответы по вариантам
  const grouped = validResponses.reduce((acc, response) => {
    const optionText = response.selected_option!.text_ru;
    acc[optionText] = (acc[optionText] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Создаем массив данных с учетом всех категорий
  const labels = allCategories;
  const data = labels.map(label => 
    grouped[label] ? Math.round((grouped[label] / totalResponses) * 100) : 0
  );

  return {
    labels,
    datasets: [{
      data,
      backgroundColor: [
        'rgb(54, 162, 235)',
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',   // оранжевый
        'rgb(153, 102, 255)'
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
  // Задаем заранее категории
  const allCategories = ["Женский", "Мужской"];

  // Фильтруем только ответы, где выбран вариант
  const validResponses = responses.filter(r => r.selected_option !== null);
  const totalResponses = validResponses.length;

  // Группируем ответы по выбранным вариантам
  const grouped = validResponses.reduce((acc, response) => {
    const optionText = response.selected_option!.text_ru;
    acc[optionText] = (acc[optionText] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Инициализируем массив данных с нулями для всех категорий
  const labels = allCategories;
  const data = labels.map(label => {
    // Если категория есть в grouped, то берем ее процентное соотношение
    // Если нет, то ставим 0
    const count = grouped[label] || 0;
    return totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
  });

  return {
    labels,
    datasets: [{
      data,
      backgroundColor: [
        'rgb(255, 99, 132)',  // Женщина
        'rgb(51, 153, 255)'   // Мужчина
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
  // Все возможные ответы для пятого вопроса
  const allCategories = [
    "Гражданские",
    "Уголовные",
    "Административные",
    "Другое :"
  ];

  // Фильтруем ответы, исключая null значения
  const validResponses = responses.filter(r => r.selected_option !== null);
  const totalResponses = validResponses.length; // Общее количество ответов

  // Группируем ответы по вариантам
  const grouped = validResponses.reduce((acc, response) => {
    const optionText = response.selected_option!.text_ru;
    acc[optionText] = (acc[optionText] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Инициализируем массив данных с нулями для всех категорий
  const labels = allCategories;
  const data = labels.map(label => {
    const count = grouped[label] || 0; // Если категории нет в grouped, ставим 0
    // Рассчитываем процент для каждого варианта
    const percentage = totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
    return percentage;
  });

  // Сортируем данные по процентам
  const sortedEntries = labels
    .map((label, index) => [label, data[index]] as [string, number])
    .sort((a, b) => b[1] - a[1]);

  return {
    labels: sortedEntries.map(([label]) => label),
    datasets: [{
      data: sortedEntries.map(([_, value]) => value),
      backgroundColor: [
        'rgb(54, 162, 235)', // Гражданские
        'rgb(255, 99, 132)', // Уголовные
        'rgb(75, 192, 192)', // Административные
        'rgb(153, 102, 255)', // Другое
      ],
      datalabels: {
        color: "#FFFFFF",
        formatter: (value: number): string => `${value}%`, // Показываем проценты
      },
      label: ''
    }]
  };
}



export function processAudioVideoQuestion(questions: Question[]) {
  const question = questions.find(q => q.id === 13);

  if (question && question.question_responses) {
    // Все возможные ответы для вопроса
    const allCategories = [
      "Да",
      "Нет",
      "Не знаю/Не уверен(а)",
      "Другое:"
    ];

    const validResponses = question.question_responses.filter(
      r => r.selected_option !== null
    );

    const totalResponses = validResponses.length;

    // Группируем ответы по вариантам
    const grouped = validResponses.reduce((acc: Record<string, number>, response) => {
      const optionText = response.selected_option!.text_ru;
      acc[optionText] = (acc[optionText] || 0) + 1;
      return acc;
    }, {});

    // Рассчитываем проценты и приводим порядок категорий к allCategories
    const data = allCategories.map(category => {
      const count = grouped[category] || 0;
      return totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
    });

    return {
      labels: allCategories,
      datasets: [{
        data,
        backgroundColor: [
          'rgb(54, 162, 235)',  // Да - Blue
          'rgb(255, 99, 132)',  // Нет - Red
          'rgb(255, 159, 64)',  // Не знаю/Не уверен(а) - Orange
          'rgb(153, 102, 255)'  // Другое - Purple
        ],
        datalabels: {
          color: "#FFFFFF",
          formatter: (value: number): string => `${value}%`,
        }
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
  const question = questions.find(q => q.id === 16);

  if (question && question.question_responses) {
    const allCategories = ["Да", "Нет", "Другое:"];
    
    // Фильтруем валидные ответы
    const validResponses = question.question_responses.filter(
      (r: QuestionResponse) => r.selected_option !== null
    );
    
    const totalResponses = validResponses.length;
    
    if (totalResponses === 0) {
      return getEmptyStartTimeData();
    }

    // Группируем ответы
    const grouped = validResponses.reduce((acc: Record<string, number>, response) => {
      const optionText = response.selected_option!.text_ru;
      acc[optionText] = (acc[optionText] || 0) + 1;
      return acc;
    }, {});

    // Рассчитываем проценты для каждой категории
    const data = allCategories.map(category => {
      const count = grouped[category] || 0;
      return Math.round((count / totalResponses) * 100);
    });

    // Цвета для каждой категории
    const colors = [
      'rgb(54, 162, 235)',  // Да — синий
      'rgb(255, 99, 132)',  // Нет — красный
      'rgb(153, 102, 255)'  // Другое — фиолетовый
    ];

    return {
      labels: allCategories,
      datasets: [{
        data,
        backgroundColor: colors,
        datalabels: {
          color: "#FFFFFF",
          formatter: (value: number): string => `${value}%`,
        }
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

export function processDisrespectQuestion(questions: Question[]) {
  const question = questions.find(q => q.id === 15); // Предполагаем, что id вопроса 17

  if (question && question.question_responses) {
    const allCategories = ["Грубость", "Игнорирование", "Не давали выступить", "Другое"];

    const validResponses = question.question_responses.filter(r => r.multiple_selected_options?.length);

    const grouped = validResponses.reduce((acc: Record<string, number>, response) => {
      response.multiple_selected_options!.forEach((option: { id: number; text_ru: string; text_kg: string })=> {
        const optionText = option.text_ru;
        acc[optionText] = (acc[optionText] || 0) + 1;
      });
      return acc;
    }, {});

    const totalResponses = Object.values(grouped).reduce((sum, count) => sum + count, 0);

    if (totalResponses === 0) {
      return getEmptyDisrespectData();
    }

    const data = allCategories.map(category => {
      const count = grouped[category] || 0;
      const percentage = Math.round((count / totalResponses) * 100);
      return { count, percentage };
    });

    return {
      labels: allCategories,
      datasets: [{
        data: data.map(d => d.count),
        backgroundColor: 'rgb(54, 162, 235)',
        barThickness: 20,
        datalabels: {
          color: "#FFFFFF",
          align: "end", // Выравнивание по правому краю
          anchor: "start", // Подпись будет отображаться справа
          offset: 10, // Расстояние от линии диаграммы
          formatter: (value: number, context: any): string => {
            const percentage = data[context.dataIndex].percentage;
            return `${value} (${percentage}%)`;
          },
          font: {
            size: 12,
            weight: "bold"
          }
        }
      }]
    };
  }

  return getEmptyDisrespectData();
}

function getEmptyDisrespectData() {
  return {
    labels: ["Грубость", "Игнорирование", "Не давали выступить", "Другое :"],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: 'rgb(200, 200, 200)',
      barThickness: 20,
      datalabels: {
        color: "#000000",
        align: "end",
        anchor: "start",
        offset: 10,
        formatter: () => "0 (0%)",
        font: {
          size: 12,
          weight: "bold"
        }
      }
    }]
  };
}

export function processAgeData(responses: QuestionResponse[]) {
  const ageGroups = ["18–29", "30–44", "45–59", "60+"];
  const ageCounts = new Array(ageGroups.length).fill(0);

  responses.forEach((response) => {
    if (response.selected_option) {
      const ageGroupIndex = response.selected_option.id - 13; // Измените 13 на минимальный id для возрастных групп
      if (ageGroupIndex >= 0 && ageGroupIndex < ageCounts.length) {
        ageCounts[ageGroupIndex]++;
      }
    }
  });

  return {
    labels: ageGroups,
    datasets: [
      {
        label: "", // Пустая строка убирает "undefined" в легенде
        data: ageCounts,
        backgroundColor: [
          "rgb(54, 162, 235)",
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
        ],
        datalabels: {
          color: "#FFFFFF",
          formatter: (value: number): string => `${value}`,
        },
      },
    ],
  };
}

export function processAgeGenderData(genderResponses: QuestionResponse[]) {
  const ageGroups = ["18–24", "25–34", "35–44", "45–54", "55–64", "65+"];
  const genderCounts = {
    male: new Array(ageGroups.length).fill(0),
    female: new Array(ageGroups.length).fill(0),
  };

  const totalResponses = genderResponses.length;

  // Подсчет по возрастным группам
  genderResponses.forEach((genderResponse) => {
    const gender = genderResponse.selected_option?.text_ru === "Мужчина" ? "male" : "female";
    const ageGroupIndex = Math.floor(Math.random() * ageGroups.length); // Замените на реальную логику для определения возраста

    if (genderCounts[gender]) {
      genderCounts[gender][ageGroupIndex]++;
    }
  });

  // Преобразуем количество в проценты
  const malePercentages = genderCounts.male.map(count => totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0);
  const femalePercentages = genderCounts.female.map(count => totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0);

  return {
    labels: ageGroups,
    datasets: [
      {
        label: "Мужчины",
        data: malePercentages.map(value => -value), // Отрицательные значения для отображения слева
        backgroundColor: "rgb(54, 162, 235)",
      },
      {
        label: "Женщины",
        data: femalePercentages,
        backgroundColor: "rgb(255, 192, 203)",
      },
    ],
  };
}
