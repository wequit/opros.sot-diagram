"use client";
import React, { useCallback, useEffect, useState } from "react";
import { fetchDataWithParams } from "@/components/DataFetcher";
import { useSurveyData } from "@/context/SurveyContext";
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

// Define the structure of a question's selected option
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
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    year: "2025",
  });
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { setSurveyData, selectedCourtId, courtNameId } = useSurveyData();
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
        pathname === "/maps/oblast/Regional-Courts" &&
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
        courtId = 65; // Статичный courtId для пути /maps/General
      } else if (pathname === "/") {
        courtId = null; // Для пути '/' не добавляем courtId
      }

      const params = { year: selectedYear };
      const response = await fetchDataWithParams(courtId, params);
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
          pathname === "/maps/oblast/Regional-Courts" &&
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
          courtId = 65; // Статичный courtId для пути /maps/General
        } else if (pathname === "") {
          courtId = null; // Для пути '/' не добавляем courtId
        }

        const response = await fetchDataWithParams(courtId, params);
        setSurveyData(response);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    },
    [dateRange.year, setSurveyData, pathname, selectedCourtId, courtNameId]
  );

  const handleDateChange = useCallback(
    async (field: keyof DateRange, value: string) => {
      setDateRange((prev) => ({ ...prev, [field]: value }));
      try {
        const params = {
          startDate: field === "startDate" ? value : dateRange.startDate,
          endDate: field === "endDate" ? value : dateRange.endDate,
        };

        let courtId: number | null = null;

        if (
          pathname === "/maps/oblast/Regional-Courts" &&
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
          courtId = 65; // Статичный courtId для пути /maps/General
        } else if (pathname === "/") {
          courtId = null; // Для пути '/' не добавляем courtId
        }

        const response = await fetchDataWithParams(courtId, params);
        setSurveyData(response);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    },
    [
      dateRange.startDate,
      dateRange.endDate,
      setSurveyData,
      pathname,
      selectedCourtId,
      courtNameId,
    ]
  );

  return (
    <div className="w-full bg-gradient-to-r from-blue-700 to-indigo-400 p-6 rounded-2xl mb-4">
      <div className="flex flex-wrap gap-6 mb-6 Dates max-[470px]:mb-4">
        <div className="flex items-center bg-white rounded-xl shadow-sm p-2">
          <div className="flex items-center gap-3">
            <span className="font-medium px-2">С</span>
            <input
              type="text"
              value={dateRange.startDate}
              onChange={(e) => handleDateChange("startDate", e.target.value)}
              className="border-0 focus:ring-0 text-gray-600 font-medium w-24 DatesInputText"
            />
          </div>
          <div className="w-px h-6 bg-gray-200 mx-2"></div>
          <div className="flex items-center gap-3">
            <span className="font-medium px-2">По</span>
            <input
              type="text"
              value={dateRange.endDate}
              onChange={(e) => handleDateChange("endDate", e.target.value)}
              className="border-0 focus:ring-0 text-gray-600 font-medium w-24 DatesInputText"
            />
          </div>
        </div>

        {windowWidth > 470 ? (
          <div className="relative">
            <button
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              className="bg-white px-4 py-2 rounded-xl font-medium text-gray-600 hover:bg-blue-50 transition-all duration-200 flex items-center gap-2"
            >
              {dateRange.year}{" "}
              {/* Отображает текущий год (по умолчанию 2025) */}
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
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className={`w-full px-6 py-2 text-left hover:bg-blue-50 transition-colors ${
                      dateRange.year === year ? "bg-blue-100 font-semibold" : ""
                    }`} // Подсвечивает 2025 по умолчанию
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex flex-wrap items-center gap-3 DatesQuarter_Month">
          <div className="flex flex-wrap gap-3 border-r border-white/20 pr-4 lg:border-none md:border-none lg:pr-0 max-[470px]:border-none max-[470px]:pr-0">
            {periods.slice(0, 4).map((period) => (
              <button
                key={period.id}
                onClick={() => handlePeriodClick(period)}
                className={
                  "px-5 py-2 rounded-xl font-medium transition-all duration-200 " +
                  (activePeriod === period.id
                    ? "bg-indigo-950 text-white shadow-lg shadow-blue-900 scale-105"
                    : "bg-white text-black hover:bg-[#003494] hover:text-white")
                }
              >
                {period.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {windowWidth < 640 ? (
              <div className="relative flex gap-3">
                {windowWidth < 470 ? 
                <div className="relative">
                <button
                  onClick={() => setShowYearDropdown(!showYearDropdown)}
                  className="bg-white px-4 py-2 rounded-xl font-medium text-gray-600 hover:bg-blue-50 transition-all duration-200 flex items-center gap-2"
                >
                  {dateRange.year}{" "}
                  {/* Отображает текущий год (по умолчанию 2025) */}
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
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto">
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => handleYearSelect(year)}
                        className={`w-full px-6 py-2 text-left hover:bg-blue-50 transition-colors ${
                          dateRange.year === year ? "bg-blue-100 font-semibold" : ""
                        }`} // Подсвечивает 2025 по умолчанию
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
                 : ""}

                <button
                  onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                  className="bg-white px-4 py-2 rounded-xl font-medium text-gray-600 hover:bg-blue-50 transition-all duration-200 flex items-center gap-2"
                >
                  Месяц
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
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto">
                    {periods.slice(4).map((period) => (
                      <button
                        key={period.id}
                        onClick={() => {
                          handlePeriodClick(period);
                          setShowMonthDropdown(false);
                        }}
                        className={`w-full px-6 py-2 text-left hover:bg-blue-50 transition-colors ${
                          activePeriod === period.id ? "bg-blue-100" : ""
                        }`}
                      >
                        {period.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {periods.slice(4).map((period) => (
                  <button
                    key={period.id}
                    onClick={() => handlePeriodClick(period)}
                    className={
                      "px-4 py-2 rounded-xl font-medium transition-all duration-200 " +
                      (windowWidth <= 1281 ? "w-16 text-center" : "") +
                      (activePeriod === period.id
                        ? " bg-indigo-950 text-white shadow-lg shadow-blue-900 scale-105"
                        : " bg-white text-black hover:bg-[#003494] hover:text-white")
                    }
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
