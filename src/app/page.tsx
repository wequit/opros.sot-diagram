'use client';
import React, { useState, useCallback } from 'react';
import EvaluationQuestions from '@/app/Evaluations/page';

interface DateRange {
  startDate: string;
  endDate: string;
  year: string;
}

export default function Home() {
  const [activeMonth, setActiveMonth] = useState<number>(0);
  const [activeQuarter, setActiveQuarter] = useState<number>(0);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '2025-01-01',
    endDate: '2025-01-15',
    year: '2025'
  });

  const months = [
    'янв.', 'фев.', 'мар.', 'апр.', 'май', 'июн.',
    'июл.', 'авг.', 'сен.', 'окт.', 'ноя.', 'дек.'
  ];
  const quarters = ['I', 'II', 'III', 'IV'];

  const handleDateChange = useCallback((field: keyof DateRange, value: string) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <div className="space-y-6">
    <h1 className="text-2xl font-semibold text-gray-800">
      Оценка деятельности районного суда за период
    </h1>

    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-gray-600">С</span>
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) => handleDateChange('startDate', e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-600">По</span>
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) => handleDateChange('endDate', e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
        />
      </div>

      <input
        type="text"
        value={dateRange.year}
        onChange={(e) => handleDateChange('year', e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1.5 w-20 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
        placeholder="Год"
      />
    </div>

    <div className="flex w-full gap-0.5">
      {quarters.map((quarter, index) => (
        <button
          key={quarter}
          onClick={() => setActiveQuarter(index)}
          className={`month-button flex-1 ${
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
          className={`month-button flex-1 ${
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
