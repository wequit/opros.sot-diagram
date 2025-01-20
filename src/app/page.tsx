'use client';
import React, { useState, useCallback } from 'react';
import EvaluationQuestions from '@/app/evaluations/page';

// ... остальные импорты и интерфейсы ...

export default function Home() {
  const [activeMonth, setActiveMonth] = useState<number>(0);
  const [activeQuarter, setActiveQuarter] = useState<number>(0);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '2025-01-01',
    endDate: '2025-01-15',
    year: '2025'
  });

  const months: string[] = [
    'янв.', 'фев.', 'мар.', 'апр.', 'май', 'июн.',
    'июл.', 'авг.', 'сен.', 'окт.', 'ноя.', 'дек.'
  ];

  const quarters = ['I', 'II', 'III', 'IV'];

  // ... handleDateChange функция ...

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Оценка деятельности районного суда за период
      </h1>

      {/* Инпуты дат и года */}
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* ... существующие инпуты ... */}
      </div>

      {/* Объединенные кнопки кварталов и месяцев */}
      <div className="flex">
        {quarters.map((quarter, index) => (
          <button
            key={quarter}
            onClick={() => setActiveQuarter(index)}
            className={`month-button ${
              activeQuarter === index ? 'active' : ''
            }`}
          >
            {quarter}
          </button>
        ))}
        {months.map((month, index) => (
          <button
            key={month}
            onClick={() => setActiveMonth(index)}
            className={`month-button ${
              activeMonth === index ? 'active' : ''
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      <EvaluationQuestions />
    </div>
  );
}
