import { Question } from '@/components/Dates/Dates';
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
  answer?: string | undefined;
}

export function processFirstQuestion(
  responses: QuestionResponse[],
  language: "ru" | "ky"
) {
  // Определяем категории в зависимости от языка
  const allCategories =
    language === "ru"
      ? [
          "Стенды с qr кодом",
          "Через официальный сайт ВС",
          "Через портал “Цифрового правосудия КР”",
          "Через WhatsАpp",
          "Через независимых юристов",
          "Через мероприятия, соцролики и соцсети.",
          "Через сотрудников суда",
          "Другое:"
        ]
      : [
          "QR коддуу стенддерден",                   // Пример перевода для "Стенды с qr кодом"
          "Жогорку Соттун расмий сайты аркылуу",                  // "Через официальный сайт ВС"
          "Кыргыз Республикасынын Санариптик Адилеттиги порталынан",            // "Через портал “Цифрового правосудия КР”" (подберите корректное название)
          "WhatsApp аркылуу",                         // "Через WhatsАpp"
          "Көз карандысыз юристтер аркылуу",          // "Через независимых юристов"
          "Соцроликтер жана соцтармактар аркылуу.", // "Через мероприятия, соцролики и соцсети."
          "Сот кызматкерлери аркылуу",         // "Через сотрудников суда"
          "Башка:"                                    // "Другое:"
        ];

  // Фильтруем ответы, исключая null и "Необязательный вопрос"
  const validResponses = responses.filter(
    r => r.selected_option !== null && r.custom_answer !== "Необязательный вопрос"
  );
  const totalResponses = validResponses.length;

  // Группируем ответы по выбранному варианту
  const grouped = validResponses.reduce((acc, response) => {
    const optionText =
      language === "ru"
        ? response.selected_option!.text_ru
        : response.selected_option!.text_kg;
    acc[optionText] = (acc[optionText] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Формируем массив данных для всех категорий
  const labels = allCategories;
  const data = labels.map(label => grouped[label] ? grouped[label] : 0);

  // Опционально: сортируем данные по количеству (если нужно)
  const sortedEntries = labels
    .map((label, index) => [label, data[index]] as [string, number])
    .sort((a, b) => b[1] - a[1]);

  return {
    labels: sortedEntries.map(([label]) => label),
    datasets: [
      {
        data: sortedEntries.map(([_, value]) => value),
        backgroundColor: [
          'rgb(54, 162, 235)',
          'rgb(255, 99, 132)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(231, 76, 60)',
          'rgb(142, 68, 173)'
        ],
        barThickness: 20,
        datalabels: {
          color: "#FFFFFF",
          formatter: (value: number): string => `${value}`
        },
        label: ""
      }
    ]
  };
}

export function processSecondQuestion(
  responses: QuestionResponse[],
  language: "ru" | "ky"
) {
  // Определяем категории в зависимости от языка
  const allCategories =
    language === "ru"
      ? [
          "Сторона по делу (истец, ответчик, потерпевший, обвиняемый)",
          "Адвокат или представитель стороны",
          "Свидетель",
          "Посетитель (родственник, друг, сосед, коллега одной из сторон и др.)"
        ]
      : [
          "Иш боюнча тарап (доогер, жоопкер, жабырлануучу, айыпталуучу)",
          "Адвокат же тараптын өкүлү",
          "Күбө",
          "Келүүчү (тууганы, досу, кошунасы, бир тараптын кесиптеши ж.б.)"
        ];

  // Фильтруем ответы (отбрасываем те, у которых selected_option равен null)
  const validResponses = responses.filter(r => r.selected_option !== null);
  const totalResponses = validResponses.length;

  // Группируем ответы по выбранному варианту
  const grouped = validResponses.reduce((acc, response) => {
    const optionText =
      language === "ru"
        ? response.selected_option!.text_ru
        : response.selected_option!.text_kg;
    acc[optionText] = (acc[optionText] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Формируем массив данных
  const labels = allCategories;
  const data = labels.map(label =>
    grouped[label] ? Math.round((grouped[label] / totalResponses) * 100) : null
  );

  return {
    labels,
    datasets: [
      {
        data: data.map(value => (value !== null ? value : NaN)), // NaN не будет отображаться в диаграмме
        backgroundColor: [
          'rgb(54, 162, 235)',
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(153, 102, 255)'
        ],
        datalabels: {
          color: "#FFFFFF",
          display: true,
          formatter: (value: number): string => (isNaN(value) ? "" : `${value}%`) // Убираем 0%
        }
      }
    ]
  };
}

export function processThirdQuestion(
  responses: QuestionResponse[],
  language: "ru" | "ky"
) {
  // Определяем категории в зависимости от языка
  const allCategories =
    language === "ru" ? ["Женский", "Мужской"] : ["Аял", "Эркек"];

  // Фильтруем только ответы, где выбран вариант
  const validResponses = responses.filter((r) => r.selected_option !== null);
  const totalResponses = validResponses.length;

  // Группируем ответы по выбранным вариантам
  const grouped = validResponses.reduce((acc, response) => {
    const optionText =
      language === "ru"
        ? response.selected_option!.text_ru
        : response.selected_option!.text_kg;
    acc[optionText] = (acc[optionText] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Формируем массив данных для всех категорий (если в группе нет — ставим NaN)
  const labels = allCategories;
  const data = labels.map((label) =>
    grouped[label] ? Math.round((grouped[label] / totalResponses) * 100) : NaN
  );

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          "rgb(255, 99, 132)", // Цвет для первой категории (Женский/Аял)
          "rgb(51, 153, 255)", // Цвет для второй категории (Мужской/Эркек)
        ],
        datalabels: {
          color: "#FFFFFF",
          display: true,
          formatter: (value: number): string => (isNaN(value) ? "" : `${value}%`),
        },
      },
    ],
  };
}

export function processFifthQuestion(
  responses: QuestionResponse[],
  language: "ru" | "ky"
) {
  const allCategories =
    language === "ru"
      ? ["Гражданские", "Уголовные", "Административные", "Другое :"]
      : ["Жарандык", "Кылмыш", "Административдик", "Башка:"];

  const validResponses = responses.filter((r) => r.selected_option !== null);
  const totalResponses = validResponses.length;

  const grouped = validResponses.reduce((acc, response) => {
    const optionText =
      language === "ru"
        ? response.selected_option!.text_ru
        : response.selected_option!.text_kg;
    acc[optionText] = (acc[optionText] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = allCategories.map((label) => {
    const count = grouped[label] || 0;
    return totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0; // Оставляем 0
  });

  return {
    labels: allCategories,
    datasets: [
      {
        data, // Оставляем 0, но скрываем его отображение в процентах
        backgroundColor: [
          "rgb(54, 162, 235)",
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
        ],
        datalabels: {
          color: "#FFFFFF",
          formatter: (value: number): string => (value === 0 ? "" : `${value}%`), // Скрываем 0%
        },
        label: "",
      },
    ],
  };
}

export function processAudioVideoQuestion(
  questions: Question[],
  language: "ru" | "ky"
) {
  const question = questions.find(q => q.id === 13);

  if (question && question.question_responses) {
    const allCategories = language === "ru"
      ? ["Да", "Нет", "Не знаю/Не уверен(а)", "Другое:"]
      : ["Ооба", "Жок", "Билбейм/Белгисиз", "Башка:"];

    const validResponses = question.question_responses.filter(
      r => r.selected_option !== null
    );
    const totalResponses = validResponses.length;

    const grouped = validResponses.reduce((acc: Record<string, number>, response) => {
      const optionText = language === "ru"
        ? response.selected_option!.text_ru
        : response.selected_option!.text_kg;
      acc[optionText] = (acc[optionText] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const data = allCategories.map(category => {
      const count = grouped[category] || 0;
      return totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
    });

    return {
      labels: allCategories,
      datasets: [{
        data,
        backgroundColor: [
          'rgb(54, 162, 235)',  // для "Да" или "Ооба"
          'rgb(255, 99, 132)',  // для "Нет" или "Жок"
          'rgb(255, 159, 64)',  // для "Не знаю/Не уверен(а)" или "Билбейм/Белгисиз"
          'rgb(153, 102, 255)'  // для "Другое:" или "Башка:"
        ],
        datalabels: {
          color: "#FFFFFF",
          formatter: (value: number): string => (value === 0 ? "" : `${value}%`), // Скрываем 0%
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

export function processProgressRatings(
  questions: Question[],
  language: "ru" | "ky"
): { [key: string]: number } {
  // Задаем заголовки вопросов в зависимости от языка
  const questionTitles: { [key: number]: string } =
    language === "ru"
      ? {
          11: "Разъяснение прав и обязанности в судебном процессе",
          12: "Контроль судьи за порядком в зале суда",
          14: "Проявление уважения к участникам судебного процесса",
          17: "Общая оценка работы судьи",
        }
      : {
          11: "Сот процессинде укуктарды жана милдеттерди түшүндүрүү",
          12: "Сот залындагы тартипке судьянын көзөмөлү",
          14: "Сот процессинин катышуучуларына урмат көрсөтүү",
          17: "Судьянын ишине жалпы баа берүү",
        };

  // Инициализируем объект для хранения сумм и количества ответов
  const ratingSums: { [key: string]: { sum: number; count: number } } = {};
  Object.values(questionTitles).forEach((title) => {
    ratingSums[title] = { sum: 0, count: 0 };
  });

  // Обрабатываем каждый вопрос
  questions.forEach((question) => {
    if (questionTitles[question.id]) {
      const title = questionTitles[question.id];
      question.question_responses.forEach((response) => {
        if (response.selected_option) {
          // Выбираем текст ответа в зависимости от языка
          const ratingStr =
            language === "ru"
              ? response.selected_option!.text_ru
              : response.selected_option!.text_kg;
          const rating = Number(ratingStr);
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

export function processStaffRatings(
  questions: Question[],
  language: "ru" | "ky"
): { [key: string]: number } {
  // Задаём заголовки вопросов в зависимости от языка
  const questionTitles: { [key: number]: string } =
    language === "ru"
      ? {
          7: "Отношение сотрудников",
          9: "Предоставление всей необходимой информации"
        }
      : {
          7: "Кызматкерлердин мамилеси",
          9: "Бардык керектүү маалыматтарды берүү"
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
        if (response.selected_option) {
          const ratingStr =
            language === "ru"
              ? response.selected_option.text_ru
              : response.selected_option.text_kg;
          const rating = Number(ratingStr);
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

export function processProcessRatings(
  questions: Question[],
  language: "ru" | "ky"
): { [key: string]: number } {
  // Определяем заголовки вопросов в зависимости от языка
  const questionTitles: { [key: number]: string } =
    language === "ru"
      ? { 10: "Оценка судебного процесса" }
      : { 10: "Сот процессине баа берүү" }; // Пример перевода для кыргызского

  // Инициализируем объект для хранения сумм и количества ответов
  const ratingSums: { [key: string]: { sum: number; count: number } } = {};
  Object.values(questionTitles).forEach(title => {
    ratingSums[title] = { sum: 0, count: 0 };
  });

  // Обрабатываем каждый вопрос
  questions.forEach(question => {
    if (questionTitles[question.id]) {
      const title = questionTitles[question.id];
      question.question_responses.forEach(response => {
        if (response.selected_option) {
          const ratingStr =
            language === "ru"
              ? response.selected_option.text_ru
              : response.selected_option.text_kg;
          const rating = Number(ratingStr);
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

export function processOfficeRatings(
  questions: Question[],
  language: "ru" | "ky"
): { [key: string]: number } {
  // Определяем заголовки вопросов в зависимости от языка
  const questionTitles: { [key: number]: string } =
    language === "ru"
      ? { 8: "Предоставление всей необходимой информации" }
      : { 8: "Бардык керектүү маалыматтарды берүү" }; 

  // Инициализируем объект для хранения сумм и количества ответов
  const ratingSums: { [key: string]: { sum: number; count: number } } = {};
  Object.values(questionTitles).forEach(title => {
    ratingSums[title] = { sum: 0, count: 0 };
  });

  // Обрабатываем каждый вопрос
  questions.forEach(question => {
    if (questionTitles[question.id]) {
      const title = questionTitles[question.id];
      question.question_responses.forEach(response => {
        if (response.selected_option) {
          const ratingStr =
            language === "ru"
              ? response.selected_option.text_ru
              : response.selected_option.text_kg;
          const rating = Number(ratingStr);
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

export function processAccessibilityRatings(
  questions: Question[],
  language: "ru" | "ky"
): { [key: string]: number } {
  // Определяем заголовки вопросов в зависимости от языка
  const questionTitles: { [key: number]: string } =
    language === "ru"
      ? { 6: "Доступность здания суда для людей с инвалидностью и маломобильных категорий" }
      : { 6: "Майыптыгы бар жана аз кыймылдуу категориядагы адамдар үчүн сот имаратынын жеткиликтүүлүгү" }; // Пример перевода на кыргызский

  // Инициализируем объект для хранения сумм и количества ответов
  const ratingSums: { [key: string]: { sum: number; count: number } } = {};
  Object.values(questionTitles).forEach(title => {
    ratingSums[title] = { sum: 0, count: 0 };
  });

  // Обрабатываем каждый вопрос
  questions.forEach(question => {
    if (questionTitles[question.id]) {
      const title = questionTitles[question.id];
      question.question_responses.forEach(response => {
        if (response.selected_option) {
          const ratingStr =
            language === "ru"
              ? response.selected_option.text_ru
              : response.selected_option.text_kg;
          const rating = Number(ratingStr);
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

export function processStartTimeQuestion(
  questions: Question[],
  language: "ru" | "ky"
) {
  const question = questions.find(q => q.id === 16);

  if (question && question.question_responses) {
    const allCategories =
      language === "ru"
        ? ["Да", "Нет", "Другое:"]
        : ["Ооба", "Жок", "Башка:"];

    const validResponses = question.question_responses.filter(
      (r: QuestionResponse) => r.selected_option !== null
    );

    const totalResponses = validResponses.length;

    if (totalResponses === 0) {
      return getEmptyStartTimeData();
    }

    const grouped = validResponses.reduce((acc: Record<string, number>, response) => {
      const optionText =
        language === "ru"
          ? response.selected_option!.text_ru
          : response.selected_option!.text_kg;
      acc[optionText] = (acc[optionText] || 0) + 1;
      return acc;
    }, {});

    const data = allCategories.map(category => {
      const count = grouped[category] || 0;
      return totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
    });

    const colors = [
      "rgb(54, 162, 235)", // Да / Ооба — синий
      "rgb(255, 99, 132)", // Нет / Жок — красный
      "rgb(153, 102, 255)" // Другое / Башка — фиолетовый
    ];

    return {
      labels: allCategories,
      datasets: [
        {
          data,
          backgroundColor: colors,
          datalabels: {
            color: "#FFFFFF",
            formatter: (value: number): string => (value === 0 ? "" : `${value}%`), // Скрываем 0%
          }
        }
      ]
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

export function processDisrespectQuestion(
  questions: Question[],
  language: "ru" | "ky"
) {
  const question = questions.find(q => q.id === 15);

  if (question && question.question_responses) {
    const allCategories =
      language === "ru"
        ? ["Грубость", "Игнорирование", "Не давали выступить", "Другое"]
        : ["Оройлук", "Кайдыгерлик", "Сөз бербей коюу", "Башка:"];

    const validResponses = question.question_responses.filter(
      r => r.multiple_selected_options?.length
    );

    const grouped = validResponses.reduce(
      (acc: Record<string, number>, response) => {
        response.multiple_selected_options!.forEach((option: { id: number; text_ru: string; text_kg: string }) => {
          const optionText = language === "ru" ? option.text_ru : option.text_kg;
          acc[optionText] = (acc[optionText] || 0) + 1;
        });
        return acc;
      },
      {}
    );

    const totalResponses = Object.values(grouped).reduce(
      (sum, count) => sum + count,
      0
    );

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
      datasets: [
        {
          data: data.map(d => d.count),
          backgroundColor: "rgb(54, 162, 235)",
          barThickness: 20,
          datalabels: {
            color: "#FFFFFF",
            align: "end",
            anchor: "start",
            offset: 10,
            formatter: (value: number, context: any): string => {
              const percentage = data[context.dataIndex].percentage;
              return `${value} (${percentage}%)`;
            },
            font: {
              size: 12,
              weight: "bold",
            },
          },
        },
      ],
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

    responses.forEach(response => {
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

 export function processAgeGenderData(
  genderResponses: QuestionResponse[],
  ageResponses: QuestionResponse[]
) {
  // Статичные возрастные группы
  const ageGroups = ["18-29", "30-44", "45-59", "60+"];

  // Структура для хранения данных
  const groupedData: Record<string, { Мужской: number; Женский: number }> = {
    "18-29": { Мужской: 0, Женский: 0 },
    "30-44": { Мужской: 0, Женский: 0 },
    "45-59": { Мужской: 0, Женский: 0 },
    "60+": { Мужской: 0, Женский: 0 },
  };

  for (let i = 0; i < genderResponses.length; i++) {
    const gender = genderResponses[i]?.selected_option?.text_ru;
    let age = ageResponses[i]?.selected_option?.text_ru;
    
    if (age) {
      // Нормализуем возраст: убираем пробелы и заменяем en‑dash на дефис
      age = age.replace(/–/g, "-").replace(/\s/g, "");
    }

    console.log(`Индекс ${i}: нормализованный возраст: "${age}", пол: "${gender}"`);

    if (gender && age && ageGroups.includes(age)) {
      groupedData[age][gender as 'Мужской' | 'Женский']++;
    }
  }

  console.log("Grouped Data:", groupedData);

  // Вычисляем процентное соотношение
  const maleData = ageGroups.map((age) => {
    const total = groupedData[age]["Мужской"] + groupedData[age]["Женский"];
    return total > 0 ? -Math.round((groupedData[age]["Мужской"] / total) * 100) : 0;
  });
  const femaleData = ageGroups.map((age) => {
    const total = groupedData[age]["Мужской"] + groupedData[age]["Женский"];
    return total > 0 ? Math.round((groupedData[age]["Женский"] / total) * 100) : 0;
  });

  return {
    labels: ageGroups, // Статичные возрастные группы
    datasets: [
      {
        label: "Мужской",
        data: maleData, // Отрицательные проценты для торнадо-диаграммы
        backgroundColor: "rgb(51, 153, 255)",
      },
      {
        label: "Женский",
        data: femaleData,
        backgroundColor: "rgb(255, 99, 132)",
      },
    ],
  };
}
