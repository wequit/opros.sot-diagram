"use client";
import React, { useCallback, useState } from "react";
import { fetchDataWithParams } from "@/components/DataFetcher";
import { useSurveyData } from "@/context/SurveyContext";

interface DateRange {
  startDate: string;
  endDate: string;
  year: string;
}

interface Period {
  id: number;
  type: "quarter" | "month";
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
  multiple_selected_options?: any;
  question: number;
  selected_option: SelectedOption | null;
  custom_answer: string | null;
  gender: string;
}

// Define the structure of a question
export interface Question {
  id: number;
  text: string;
  question_responses: QuestionResponse[];
}

export default function Dates() {
  const [activePeriod, setActivePeriod] = useState<number | null>(null);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    year: "2025",
  });
  const { setSurveyData } = useSurveyData();

  //Год
  const years = Array.from({ length: 11 }, (_, i) => (2025 + i).toString());

  const handleYearSelect = async (selectedYear: string) => {
    // Обновляем все даты для выбранного года
    setDateRange((prev) => ({
      ...prev,
      startDate: `${selectedYear}-01-01`, // Первый день года
      endDate: `${selectedYear}-12-31`, // Последний день года
      year: selectedYear,
    }));

    setShowYearDropdown(false);
    setActivePeriod(null);

    try {
      const response = await fetchDataWithParams({ year: selectedYear });
      setSurveyData(response);
    } catch (error) {
      console.error("Ошибка при получении данных за год:", error);
    }
  };

  // Объединяем кварталы и месяцы в один массив
  const periods: Period[] = [
    { id: 0, type: "quarter", label: "I" },
    { id: 1, type: "quarter", label: "II" },
    { id: 2, type: "quarter", label: "III" },
    { id: 3, type: "quarter", label: "IV" },
    { id: 4, type: "month", label: "янв" },
    { id: 5, type: "month", label: "фев" },
    { id: 6, type: "month", label: "мар" },
    { id: 7, type: "month", label: "апр" },
    { id: 8, type: "month", label: "май" },
    { id: 9, type: "month", label: "июн" },
    { id: 10, type: "month", label: "июл" },
    { id: 11, type: "month", label: "авг" },
    { id: 12, type: "month", label: "сен" },
    { id: 13, type: "month", label: "окт" },
    { id: 14, type: "month", label: "ноя" },
    { id: 15, type: "month", label: "дек" },
  ];

  const handlePeriodClick = useCallback(
    async (period: Period) => {
      setActivePeriod(period.id);

      // Определяем даты для каждого периода
      let newStartDate = dateRange.startDate;
      let newEndDate = dateRange.endDate;

      if (period.type === "quarter") {
        const quarter = Math.floor(period.id) + 1;
        switch (quarter) {
          case 1:
            newStartDate = `${dateRange.year}-01-01`;
            newEndDate = `${dateRange.year}-03-31`;
            break;
          case 2:
            newStartDate = `${dateRange.year}-04-01`;
            newEndDate = `${dateRange.year}-06-30`;
            break;
          case 3:
            newStartDate = `${dateRange.year}-07-01`;
            newEndDate = `${dateRange.year}-09-30`;
            break;
          case 4:
            newStartDate = `${dateRange.year}-10-01`;
            newEndDate = `${dateRange.year}-12-31`;
            break;
        }
      } else if (period.type === "month") {
        const month = (period.id - 3).toString().padStart(2, "0");
        newStartDate = `${dateRange.year}-${month}-01`;

        // Определяем последний день месяца
        let lastDay;
        switch (month) {
          case "02": // Февраль
            // Проверка на високосный год
            const isLeapYear =
              Number(dateRange.year) % 4 === 0 &&
              (Number(dateRange.year) % 100 !== 0 ||
                Number(dateRange.year) % 400 === 0);
            lastDay = isLeapYear ? 29 : 28;
            break;
          case "04": // Апрель
          case "06": // Июнь
          case "09": // Сентябрь
          case "11": // Ноябрь
            lastDay = 30;
            break;
          default:
            lastDay = 31;
        }
        newEndDate = `${dateRange.year}-${month}-${lastDay}`;
      }

      setDateRange((prev) => ({
        ...prev,
        startDate: newStartDate,
        endDate: newEndDate,
      }));

      try {
        let response;
        if (period.type === "quarter") {
          const quarter = Math.floor(period.id) + 1;
          response = await fetchDataWithParams({
            year: dateRange.year,
            quarter,
          });
        } else if (period.type === "month") {
          const month = period.id - 3;
          response = await fetchDataWithParams({ year: dateRange.year, month });
        }
        setSurveyData(response);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    },
    [dateRange.year, setSurveyData]
  );

  const handleDateChange = useCallback(
    async (field: keyof DateRange, value: string) => {
      setDateRange((prev) => ({ ...prev, [field]: value }));
      try {
        const response = await fetchDataWithParams({
          startDate: field === "startDate" ? value : dateRange.startDate,
          endDate: field === "endDate" ? value : dateRange.endDate,
        });
        setSurveyData(response);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    },
    [dateRange.startDate, dateRange.endDate, setSurveyData]
  );

  return (
    <div className="w-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] p-5 rounded-2xl shadow-lg mb-8">
      {/* Верхняя секция */}
      <div className="flex items-center gap-4 mb-6">
        {/* Даты */}
        <div className="bg-white/15 backdrop-blur-sm rounded-xl flex items-center p-3 hover:bg-white/20 transition-all group border border-white/10 shadow-sm min-w-[380px]">
          <div className="flex items-center flex-1">
            <span className="text-sm font-semibold text-white/90 px-3 group-hover:text-white font-inter">С</span>
            <input
              type="text"
              value={formatDate(dateRange.startDate)}
              className="w-28 bg-transparent border-0 focus:ring-0 text-white font-medium text-sm p-1 font-inter"
              readOnly
            />
          </div>
          <div className="w-px h-5 bg-white/20 mx-2"></div>
          <div className="flex items-center flex-1">
            <span className="text-sm font-semibold text-white/90 px-3 group-hover:text-white font-inter">По</span>
            <input
              type="text"
              value={formatDate(dateRange.endDate)}
              className="w-28 bg-transparent border-0 focus:ring-0 text-white font-medium text-sm p-1 font-inter"
              readOnly
            />
          </div>
        </div>

        {/* Год */}
        <div className="relative">
          <button
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="bg-white/15 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold text-white hover:bg-white/25 
              transition-all duration-200 flex items-center gap-2 text-sm group border border-white/10 shadow-sm min-w-[130px] font-inter"
          >
            <span className="group-hover:transform group-hover:scale-105 transition-transform">{dateRange.year}</span>
            <svg className={`w-4 h-4 transition-all duration-300 ${showYearDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          {showYearDropdown && (
            <div className="absolute mt-2 bg-[#4F46E5] rounded-xl shadow-lg z-30 max-h-60 overflow-y-auto w-full 
              border border-white/20 animate-fadeIn">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className="w-full px-6 py-3 text-left text-white hover:bg-white/20 text-sm transition-all
                    first:rounded-t-xl last:rounded-b-xl font-inter font-medium hover:pl-8 duration-200"
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Кварталы */}
        <div className="flex gap-3">
          {periods.slice(0, 4).map((period) => (
            <button
              key={period.id}
              onClick={() => handlePeriodClick(period)}
              className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 min-w-[140px] font-inter
                ${activePeriod === period.id
                  ? "bg-indigo-500 text-white shadow-lg scale-105 hover:bg-indigo-600 border border-indigo-400"
                  : "bg-white/10 text-white hover:bg-white/20 active:bg-white/25 backdrop-blur-sm hover:scale-105 border border-white/10"
                }
                transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm`}
            >
              {period.label} квартал
            </button>
          ))}
        </div>
      </div>

      {/* Месяцы */}
      <div className="grid grid-cols-12 gap-3">
        {periods.slice(4).map((period) => (
          <button
            key={period.id}
            onClick={() => handlePeriodClick(period)}
            className={`py-3 rounded-xl text-sm font-semibold transition-all duration-300 font-inter
              ${activePeriod === period.id
                ? "bg-indigo-500 text-white shadow-lg scale-105 hover:bg-indigo-600 border border-indigo-400"
                : "bg-white/10 text-white hover:bg-white/20 active:bg-white/25 backdrop-blur-sm hover:scale-105 border border-white/10"
              }
              transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm`}
          >
            <span className="relative z-10">{period.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Функция форматирования даты из YYYY-MM-DD в DD.MM.YYYY
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  // Убедимся, что все компоненты существуют
  if (!year || !month || !day) return '';
  // Форматируем дату в DD.MM.YYYY
  return `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`;
};