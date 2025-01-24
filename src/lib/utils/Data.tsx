'use client';
import React, { useCallback, useState } from 'react';

interface DateRange {
    startDate: string;
    endDate: string;
    year: string;
}

interface Period {
    id: number;
    type: 'quarter' | 'month';
    label: string;
}

// Define the structure of a question's selected option
interface SelectedOption {
  id: number;
  text_ru: string;
  text_kg: string;
}

// Define the structure of a question response
interface QuestionResponse {
  question: number;
  selected_option: SelectedOption | null;
  custom_answer: string | null;
}

// Define the structure of a question
export interface Question {
  id: number;
  text: string;
  question_responses: QuestionResponse[];
}

export default function Data() {
    const [activePeriod, setActivePeriod] = useState<number>(0);
    const [dateRange, setDateRange] = useState<DateRange>({
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      year: '2025'
    });

    // Объединяем кварталы и месяцы в один массив
    const periods: Period[] = [
        { id: 0, type: 'quarter', label: 'I' },
        { id: 1, type: 'quarter', label: 'II' },
        { id: 2, type: 'quarter', label: 'III' },
        { id: 3, type: 'quarter', label: 'IV' },
        { id: 4, type: 'month', label: 'янв.' },
        { id: 5, type: 'month', label: 'фев.' },
        { id: 6, type: 'month', label: 'мар.' },
        { id: 7, type: 'month', label: 'апр.' },
        { id: 8, type: 'month', label: 'май' },
        { id: 9, type: 'month', label: 'июн.' },
        { id: 10, type: 'month', label: 'июл.' },
        { id: 11, type: 'month', label: 'авг.' },
        { id: 12, type: 'month', label: 'сен.' },
        { id: 13, type: 'month', label: 'окт.' },
        { id: 14, type: 'month', label: 'ноя.' },
        { id: 15, type: 'month', label: 'дек.' }
    ];
  
    const handleDateChange = useCallback((field: keyof DateRange, value: string) => {
      setDateRange(prev => ({ ...prev, [field]: value }));
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            {/* Верхняя строка с датами */}
            <div className="flex items-center gap-8 mb-6">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">С</span>
                    <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => handleDateChange('startDate', e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-200 
                                 focus:border-green-500 focus:ring-2 focus:ring-green-200 
                                 outline-none transition-all duration-200"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">По</span>
                    <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => handleDateChange('endDate', e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-200 
                                 focus:border-green-500 focus:ring-2 focus:ring-green-200 
                                 outline-none transition-all duration-200"
                    />
                </div>
            </div>

            {/* Объединенные кварталы и месяцы */}
            <div className="flex flex-wrap gap-2 w-full">
                {periods.map((period) => (
                    <button
                        key={period.id}
                        onClick={() => setActivePeriod(period.id)}
                        className={`
                            flex-1 min-w-[70px]
                            px-3 py-2 rounded-lg font-medium text-base
                            transition-all duration-200 border border-gray-200
                            ${activePeriod === period.id 
                                ? 'bg-[#2563EB] text-white shadow-sm' 
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }
                        `}
                    >
                        {period.label}
                    </button>
                ))}
            </div>
        </div>
    );
}