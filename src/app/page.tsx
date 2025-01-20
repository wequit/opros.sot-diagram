'use client';
import React, { useState } from 'react';
import EvaluationQuestions from '@/app/evaluations/page'; // Импорт компонента оценки

export default function Home() {
  // Состояния для выбранного месяца и квартала
  const [activeMonth, setActiveMonth] = useState<number | null>(0); // Январь по умолчанию
  const [activeQuarter, setActiveQuarter] = useState<number | null>(0); // I квартал по умолчанию

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Оценка деятельности районного суда за период</h1>

      {/* Период */}
      <div className="grid grid-cols-12 gap-2 items-center">
        <input
          type="date"
          className="col-span-3 border border-gray-300 rounded px-2 py-1"
          defaultValue="2025-01-01"
        />
        <span className="col-span-1 text-center">По</span>
        <input
          type="date"
          className="col-span-3 border border-gray-300 rounded px-2 py-1"
          defaultValue="2025-01-15"
        />
        <input
          type="number"
          className="col-span-2 border border-gray-300 rounded px-2 py-1"
          defaultValue="2025"
        />
      </div>

      {/* Кварталы */}
      <div className="mt-4 flex gap-2 justify-start">
        {['I', 'II', 'III', 'IV'].map((quarter, index) => (
          <button
            key={quarter}
            onClick={() => setActiveQuarter(index)} // Устанавливаем активный квартал
            className={`border border-gray-300 px-4 py-1 rounded ${
              activeQuarter === index ? 'bg-blue-100 border-blue-400' : 'bg-white'
            } hover:bg-gray-200`}>
            {quarter}
          </button>
        ))}
      </div>

      {/* Месяцы */}
      <div className="mt-4 grid grid-cols-12 gap-2">
        {[
          'янв.',
          'фев.',
          'мар.',
          'апр.',
          'май',
          'июн.',
          'июл.',
          'авг.',
          'сен.',
          'окт.',
          'ноя.',
          'дек.',
        ].map((month, index) => (
          <button
            key={index}
            onClick={() => setActiveMonth(index)} // Устанавливаем активный месяц
            className={`border border-gray-300 px-4 py-1 rounded ${
              activeMonth === index ? 'bg-blue-100 border-blue-400' : 'bg-white'
            } hover:bg-gray-200`}>
            {month}
          </button>
        ))}
      </div>

      {/* Добавьте компонент EvaluationQuestions */}
      <EvaluationQuestions />
    </div>
  );
}
