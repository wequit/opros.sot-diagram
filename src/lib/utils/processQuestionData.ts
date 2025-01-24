interface QuestionResponse {
  question: number;
  selected_option: {
    id: number;
    text_ru: string;
  } | null;
  custom_answer: string | null;
}

export function processSecondQuestion(responses: QuestionResponse[]) {
  // Фильтруем ответы только для второго вопроса
  const questionResponses = responses.filter(r => r.question === 2 && r.selected_option !== null);
  const totalResponses = questionResponses.length;

  // Группируем ответы по вариантам
  const grouped = questionResponses.reduce((acc, response) => {
    const optionText = response.selected_option!.text_ru;
    acc[optionText] = (acc[optionText] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Преобразуем в проценты и форматируем данные для диаграммы
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