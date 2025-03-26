"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { fetchDataWithParams } from "@/components/DataFetcher";
import { useSurveyData, getTranslation } from "@/context/SurveyContext";
import { usePathname } from "next/navigation";

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

interface SelectedOption {
  id: number;
  text_ru: string;
  text_kg: string;
}

interface QuestionResponse {
  multiple_selected_options?: any;
  question: number;
  selected_option: SelectedOption | null;
  custom_answer: string | null;
  gender: string;
}

export interface Question {
  id: number;
  text: string;
  question_responses: QuestionResponse[];
}

export default function Dates() {
  const [activePeriod, setActivePeriod] = useState<number | null>(null);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    year: "2025",
  });
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);

  // Функции для преобразования формата даты
  const formatDateToDisplay = (isoDate: string): string => {
    // Преобразование из YYYY-MM-DD в DD.MM.YY
    const parts = isoDate.split("-");
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}.${parts[1]}.${parts[0].slice(2)}`;
  };

  const formatDateToISO = (displayDate: string): string => {
    // Преобразование из DD.MM.YY в YYYY-MM-DD
    const parts = displayDate.split(".");
    if (parts.length !== 3) return displayDate;
    
    let year = parts[2];
    if (year.length === 2) {
      year = `20${year}`; // Предполагаем, что все года будут в диапазоне 2000-2099
    }
    
    return `${year}-${parts[1]}-${parts[0]}`;
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    
    // Добавляем обработчик клика для закрытия выпадающих меню
    const handleClickOutside = (event: MouseEvent) => {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setShowYearDropdown(false);
      }
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setShowMonthDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { setSurveyData, selectedCourtId, courtNameId, language } = useSurveyData();
  const pathname = usePathname();

  const years = Array.from({ length: 11 }, (_, i) => (2025 + i).toString());

  const handleYearSelect = async (selectedYear: string) => {
    setDateRange((prev) => ({
      ...prev,
      startDate: `${selectedYear}-01-01`,
      endDate: `${selectedYear}-12-31`,
      year: selectedYear,
    }));

    setShowYearDropdown(false);
    setActivePeriod(null);

    try {
      let courtId: number | null = null;

      if (
        pathname === "/Home/second-instance/regions" &&
        selectedCourtId
      ) {
        courtId = selectedCourtId;
      } else if (
        pathname === "/maps/rayon/District-Courts" &&
        courtNameId
      ) {
        const numericCourtId = courtNameId ? parseInt(courtNameId, 10) : null;
        courtId = numericCourtId;
      } else if (pathname === "/maps/General") {
        courtId = 65;
      } else if (pathname === "/") {
        courtId = null; 
      }

      const params = { year: selectedYear };
      const response = await fetchDataWithParams(courtId, params);
      setSurveyData(response);
    } catch (error) {
      console.error("Ошибка при получении данных за год:", error);
    }
  };

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

        let lastDay;
        switch (month) {
          case "02": // Февраль
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
        let params: { year?: string; quarter?: number; month?: number } = {
          year: dateRange.year,
        };
        if (period.type === "quarter") {
          params.quarter = Math.floor(period.id) + 1;
        } else if (period.type === "month") {
          params.month = period.id - 3;
        }

        let courtId: number | null = null;

        if (
          pathname === "/Home/second-instance/regions" &&
          selectedCourtId
        ) {
          courtId = selectedCourtId;
        } else if (
          pathname === "/maps/rayon/District-Courts" &&
          courtNameId
        ) {
          const numericCourtId = courtNameId ? parseInt(courtNameId, 10) : null;
          courtId = numericCourtId;
        } else if (pathname === "/maps/General") {
          courtId = 65;
        } else if (pathname === "") {
          courtId = null; 
        }

        const response = await fetchDataWithParams(courtId, params);
        setSurveyData({ ...response })
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    },
    [dateRange.year, setSurveyData, pathname, selectedCourtId, courtNameId]
  );

  const handleDateChange = useCallback(
    async (field: keyof DateRange, value: string) => {
      // Преобразуем введённое значение в формат ISO для внутреннего использования
      const isoValue = formatDateToISO(value);
      
      setDateRange((prev) => ({ ...prev, [field]: isoValue }));
      try {
        const params = {
          startDate: field === "startDate" ? isoValue : dateRange.startDate,
          endDate: field === "endDate" ? isoValue : dateRange.endDate,
        };

        let courtId: number | null = null;

        if (
          pathname === "/Home/second-instance/regions" &&
          selectedCourtId
        ) {
          courtId = selectedCourtId;
        } else if (
          pathname === "/maps/rayon/District-Courts" &&
          courtNameId
        ) {
          const numericCourtId = courtNameId ? parseInt(courtNameId, 10) : null;
          courtId = numericCourtId;
        } else if (pathname === "/maps/General") {
          courtId = 65;
        } else if (pathname === "/") {
          courtId = null;
        }

        const response = await fetchDataWithParams(courtId, params);
        setSurveyData(response);
      } catch (error) {
        console.error("Ошибка при изменении даты:", error);
      }
    },
    [dateRange.startDate, dateRange.endDate, setSurveyData, pathname, selectedCourtId, courtNameId]
  );

  // Полные названия месяцев
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  
  // Короткие названия месяцев с заглавной буквы
  const monthLabels = [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
  ];

  const handleMonthSelect = (monthIndex: number) => {
    const period = periods.find(p => p.id === monthIndex + 4);
    if (period) {
      handlePeriodClick(period);
      setSelectedMonth(monthLabels[monthIndex]);
    }
    setShowMonthDropdown(false);
  };

  // Функция сброса фильтров
  const handleReset = async () => {
    const currentYear = new Date().getFullYear().toString();
    
    setActivePeriod(null);
    setSelectedMonth(null);
    setDateRange({
      startDate: `${currentYear}-01-01`,
      endDate: `${currentYear}-12-31`,
      year: currentYear,
    });

    try {
      let courtId: number | null = null;

      if (pathname === "/Home/second-instance/regions" && selectedCourtId) {
        courtId = selectedCourtId;
      } else if (pathname === "/maps/rayon/District-Courts" && courtNameId) {
        const numericCourtId = courtNameId ? parseInt(courtNameId, 10) : null;
        courtId = numericCourtId;
      } else if (pathname === "/maps/General") {
        courtId = 65;
      } else if (pathname === "/") {
        courtId = null;
      }

      const params = { year: currentYear };
      const response = await fetchDataWithParams(courtId, params);
      setSurveyData(response);
    } catch (error) {
      console.error("Ошибка при сбросе фильтров:", error);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-700 to-indigo-400 p-4 rounded-2xl mb-4 shadow-lg">
      <div className="flex flex-wrap items-center gap-3">
        {/* Ввод диапазона дат */}
        <div className="flex items-center bg-white rounded-xl shadow-sm p-2 border-b-2 border-indigo-100">
          <div className="flex items-center gap-2 ml-3">
            <span className="font-medium text-gray-700">С</span>
            <input
              type="text"
              value={formatDateToDisplay(dateRange.startDate)}
              onChange={(e) => handleDateChange("startDate", e.target.value)}
              className="border-0 focus:ring-0 text-gray-600 font-medium w-20 text-center"
            />
          </div>
          <div className="w-px h-6 bg-gray-200 mx-1"></div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">По</span>
            <input
              type="text"
              value={formatDateToDisplay(dateRange.endDate)}
              onChange={(e) => handleDateChange("endDate", e.target.value)}
              className="border-0 focus:ring-0 text-gray-600 font-medium w-20 text-center"
            />
          </div>
        </div>
        
        {/* Выбор года */}
        <div className="relative" ref={yearDropdownRef}>
          <button
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="bg-white px-4 py-2 rounded-xl font-medium text-gray-700 hover:bg-blue-50 transition-all duration-200 flex items-center gap-2 shadow-sm border-b-2 border-indigo-100"
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
          {showYearDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg z-30 w-full border border-indigo-50">
              {years.map((year, index) => (
                <>
                  <button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className={`w-full px-4 py-2 text-center hover:bg-blue-50 transition-colors ${
                      dateRange.year === year ? "bg-blue-100 font-medium" : ""
                    }`}
                  >
                    {year}
                  </button>
                  {index < years.length - 1 && (
                    <div className="w-full h-px bg-indigo-50"></div>
                  )}
                </>
              ))}
            </div>
          )}
        </div>
        
        {/* Кварталы */}
        <div className="flex items-center gap-2">
          {periods.slice(0, 4).map((period) => (
            <button
              key={period.id}
              onClick={() => {
                handlePeriodClick(period);
                setSelectedMonth(null);
              }}
              className={
                "px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm " +
                (activePeriod === period.id && !selectedMonth
                  ? "bg-indigo-900 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-blue-50 border-b-2 border-indigo-100")
              }
            >
              {period.label}
            </button>
          ))}
        </div>
        
        {/* Выбор месяца */}
        <div className="relative" ref={monthDropdownRef}>
          <button
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            className={
              "px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-sm " +
              (selectedMonth
                ? "bg-indigo-900 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-blue-50 border-b-2 border-indigo-100")
            }
          >
            {selectedMonth || "Месяц"}
            <svg
              className={`w-4 h-4 transition-transform ${
                showMonthDropdown ? "rotate-180" : ""
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
          
          {showMonthDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg z-30 w-36 border border-indigo-50">
              {monthNames.map((month, index) => (
                <>
                  <button
                    key={index}
                    onClick={() => handleMonthSelect(index)}
                    className={`w-full px-4 py-2 text-center hover:bg-blue-50 transition-colors ${
                      selectedMonth === monthLabels[index] ? "bg-blue-100 font-medium" : ""
                    }`}
                  >
                    {month}
                  </button>
                  {index < monthNames.length - 1 && (
                    <div className="w-full h-px bg-indigo-50"></div>
                  )}
                </>
              ))}
            </div>
          )}
        </div>
        
        {/* Кнопка сброса */}
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl font-medium transition-all duration-200 bg-white text-gray-700 hover:bg-blue-50 flex items-center gap-2 shadow-sm border-b-2 border-red-100 hover:border-red-200"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Сбросить
        </button>
      </div>
    </div>
  );
}