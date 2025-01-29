"use client";
import React, { useCallback, useState } from "react";
import { fetchDataWithParams } from "@/components/DataFetcher";
import { useSurveyData } from "@/lib/context/SurveyContext";

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

export default function Dates() {
  const [activePeriod, setActivePeriod] = useState<number | null>(null);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "2025-01-01",
    endDate: "2025-31-12",
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
    <div className="bg-gradient-to-r from-blue-700 to-indigo-300 p-6 rounded-2xl">
      {/* Даты */}
      <div className="flex flex-wrap gap-6 mb-6">
        <div className="flex items-center bg-white rounded-xl shadow-sm p-2">
          <div className="flex items-center gap-3">
            <span className=" font-medium px-2">С</span>
            <input
              type="text"
              value={dateRange.startDate}
              onChange={(e) => handleDateChange("startDate", e.target.value)}
              className="border-0 focus:ring-0 text-gray-600 font-medium w-24"
            />
          </div>
          <div className="w-px h-6 bg-gray-200 mx-2"></div>
          <div className="flex items-center gap-3">
            <span className=" font-medium px-2">По</span>
            <input
              type="text"
              value={dateRange.endDate}
              onChange={(e) => handleDateChange("endDate", e.target.value)}
              className="border-0 focus:ring-0 text-gray-600 font-medium w-24"
            />
          </div>
        </div>
        {/* Выбор года */}
        <div className="relative">
          <button
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="bg-white px-4 py-2 rounded-xl font-medium text-gray-600 hover:bg-blue-50 transition-all duration-200 flex items-center gap-2"
          >
            {dateRange.year}
            <svg
              className={`w-4 h-4 transition-transform ${
                showYearDropdown ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Выпадающий список с годами */}
          {showYearDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className={`w-full px-6 py-2 text-left hover:bg-blue-50 transition-colors
                                    ${
                                      dateRange.year === year
                                        ? "bg-blue-100"
                                        : ""
                                    }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Кварталы */}
        <div className="flex flex-wrap gap-2">
          {periods.slice(0, 4).map((period) => (
            <button
              key={period.id}
              onClick={() => handlePeriodClick(period)}
              className={
                "px-5 py-2 rounded-xl font-medium transition-all duration-200 " +
                (activePeriod === period.id
                  ? "bg-indigo-950 text-white shadow-lg shadow-blue-900 scale-105"
                  : "bg-white text-black hover:bg-[#003494] hover:text-white ")
              }
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Периоды */}
      <div className="space-y-4">
        {/* Месяцы */}
        <div className="flex flex-wrap gap-2">
          {periods.slice(4).map((period) => (
            <button
              key={period.id}
              onClick={() => handlePeriodClick(period)}
              className={
                "px-4 py-2 rounded-xl font-medium transition-all duration-200 " +
                (activePeriod === period.id
                  ? "bg-indigo-950 text-white shadow-lg shadow-blue-900    scale-105"
                  : "bg-white text-black hover:bg-[#003494]  hover:text-white ")
              }
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
