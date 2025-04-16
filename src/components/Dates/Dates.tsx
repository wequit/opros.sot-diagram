"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDateParams } from "@/context/DateParamsContext";

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

export default function Dates() {
  const [activePeriod, setActivePeriod] = useState<number | null>(null);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    year: "2025",
  });
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);
  const [isDateSelectionComplete, setIsDateSelectionComplete] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  const calendarRef = useRef<HTMLDivElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLDivElement>(null);

  const { setDateParams } = useDateParams();

  const formatDateToDisplay = (isoDate: string): string => {
    const parts = isoDate.split("-");
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}.${parts[1]}.${parts[0].slice(2)}`;
  };

  const formatDateToISO = (displayDate: string): string => {
    const parts = displayDate.split(".");
    if (parts.length !== 3) return displayDate;
    let year = parts[2];
    if (year.length === 2) {
      year = `20${year}`;
    }
    return `${year}-${parts[1]}-${parts[0]}`;
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    const handleClickOutside = (event: MouseEvent) => {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setShowYearDropdown(false);
      }
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setShowMonthDropdown(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node) && !dateInputRef.current?.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const years = Array.from({ length: 11 }, (_, i) => (2025 + i).toString());

  const handleYearSelect = useCallback(
    (selectedYear: string) => {
      const newStartDate = `${selectedYear}-01-01`;
      const newEndDate = `${selectedYear}-12-31`;
      setDateRange((prev) => ({
        ...prev,
        startDate: newStartDate,
        endDate: newEndDate,
        year: selectedYear,
      }));
      setShowYearDropdown(false);
      setActivePeriod(null);
      setSelectedMonth(null);
      setIsDateSelectionComplete(false);

      setDateParams({ startDate: newStartDate, endDate: newEndDate });
    },
    [setDateParams]
  );

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
    (period: Period) => {
      setActivePeriod(period.id);
      setSelectedMonth(period.type === "month" ? period.label : null);
      setIsDateSelectionComplete(false);

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
          case "02":
            const isLeapYear =
              Number(dateRange.year) % 4 === 0 &&
              (Number(dateRange.year) % 100 !== 0 || Number(dateRange.year) % 400 === 0);
            lastDay = isLeapYear ? 29 : 28;
            break;
          case "04":
          case "06":
          case "09":
          case "11":
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

      setDateParams({ startDate: newStartDate, endDate: newEndDate });
    },
    [dateRange.year, setDateParams]
  );

  const handleDateSelect = useCallback(
    (selectedDate: string) => {
      const [selectedYear, selectedMonth] = selectedDate.split("-").map(Number);
      const [startYear, startMonth] = dateRange.startDate.split("-").map(Number);

      if (isSelectingStartDate) {
        setDateRange((prev) => ({
          ...prev,
          startDate: selectedDate,
          endDate: selectedDate,
          year: selectedYear.toString(),
        }));
        setIsSelectingStartDate(false);
        setIsDateSelectionComplete(false);
      } else {
        // Проверяем, что выбранная дата в том же месяце
        if (selectedYear === startYear && selectedMonth === startMonth) {
          if (selectedDate < dateRange.startDate) {
            setDateRange((prev) => ({
              ...prev,
              startDate: selectedDate,
              endDate: prev.startDate,
              year: selectedYear.toString(),
            }));
          } else {
            setDateRange((prev) => ({
              ...prev,
              endDate: selectedDate,
              year: selectedYear.toString(),
            }));
          }
          setIsSelectingStartDate(true);
          setIsDateSelectionComplete(true);
          setDateParams({ startDate: dateRange.startDate, endDate: selectedDate });
          setShowCalendar(false);
        }
      }

      setActivePeriod(null);
      setSelectedMonth(null);
    },
    [isSelectingStartDate, dateRange.startDate, setDateParams]
  );

  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const monthLabels = [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек",
  ];

  const handleMonthSelect = (monthIndex: number) => {
    const period = periods.find((p) => p.id === monthIndex + 4);
    if (period) {
      handlePeriodClick(period);
      setSelectedMonth(monthLabels[monthIndex]);
    }
    setShowMonthDropdown(false);
  };

  const handleReset = useCallback(() => {
    const currentYear = new Date().getFullYear().toString();
    const newStartDate = `${currentYear}-01-01`;
    const newEndDate = `${currentYear}-12-31`;

    setActivePeriod(null);
    setSelectedMonth(null);
    setDateRange({
      startDate: newStartDate,
      endDate: newEndDate,
      year: currentYear,
    });
    setIsDateSelectionComplete(false);
    setIsSelectingStartDate(true);

    setDateParams({ startDate: newStartDate, endDate: newEndDate });
  }, [setDateParams]);

  const generateCalendarDays = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay() || 7;

    const days = [];

    for (let i = 1; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    const start = new Date(dateRange.startDate).getTime();
    const end = new Date(dateRange.endDate).getTime();
    const currentMonthStr = `${year}-${(month + 1).toString().padStart(2, "0")}`;

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = `${year}-${(month + 1).toString().padStart(2, "0")}-${i.toString().padStart(2, "0")}`;
      const isSameMonth = currentDate.startsWith(currentMonthStr);
      const currentTime = new Date(currentDate).getTime();
      const isStart = currentDate === dateRange.startDate;
      const isEnd = currentDate === dateRange.endDate;
      const isInRange = currentTime >= start && currentTime <= end && !isStart && !isEnd;

      days.push(
        <button
          key={i}
          onClick={() => isSameMonth && handleDateSelect(currentDate)}
          className={`h-8 w-8 rounded flex items-center justify-center text-sm transition-all duration-200 relative
            ${isStart || isEnd
              ? "bg-blue-700 text-white font-medium"
              : isInRange && isSameMonth
                ? "bg-blue-200 text-gray-700"
                : isSameMonth
                  ? "hover:bg-blue-50 text-gray-700"
                  : "text-gray-300 cursor-not-allowed"
            }`}
        >
          {i}
          {(isStart || isEnd || (isInRange && isSameMonth)) && (
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-1 bg-red-500 opacity-50"></span>
          )}
        </button>
      );
    }

    return days;
  };

  const renderCalendar = () => {
    const [year, month] = dateRange.startDate.split("-").map(Number);
    const displayMonth = month - 1; // JavaScript месяцы: январь = 0, декабрь = 11

    const handleMonthChange = (increment: number) => {
      let newMonth = displayMonth + increment;
      let newYear = year;

      if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      } else if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      }

      const newDate = `${newYear}-${(newMonth + 1).toString().padStart(2, "0")}-01`;
      setDateRange((prev) => ({
        ...prev,
        startDate: newDate,
        endDate: newDate, // Сбрасываем endDate при смене месяца
        year: newYear.toString(),
      }));
      setIsSelectingStartDate(true);
      setIsDateSelectionComplete(false);
    };

    return (
      <div ref={calendarRef} className="p-3 bg-white rounded-md shadow-lg border border-gray-200 w-64">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => handleMonthChange(-1)}
            className="p-1 rounded hover:bg-blue-50 transition-colors"
          >
            <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="font-medium text-blue-800">
            {monthNames[displayMonth]} {year}
          </div>
          <button
            onClick={() => handleMonthChange(1)}
            className="p-1 rounded hover:bg-blue-50 transition-colors"
          >
            <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
            <div
              key={day}
              className="h-8 w-8 flex items-center justify-center text-xs text-blue-500 font-medium"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">{generateCalendarDays(year, displayMonth)}</div>
      </div>
    );
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-700 to-indigo-400 p-4 rounded-2xl mb-4 shadow-lg">
      <div className="flex flex-wrap items-center gap-3">
        {/* Ввод диапазона дат */}
        <div ref={dateInputRef} className="relative flex items-center bg-white rounded-xl shadow-sm p-2 border-b-2 border-indigo-100">          <div className="flex items-center gap-2 ml-3">
          <span
            className="font-medium text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors select-none"
            onClick={() => {
              setShowCalendar(!showCalendar);
              setIsSelectingStartDate(true);
            }}
          >
            С
          </span>
          <span
            onClick={() => {
              setShowCalendar(!showCalendar);
              setIsSelectingStartDate(true);
            }}
            className="border-0 focus:ring-0 text-gray-600 font-medium w-20 text-center cursor-pointer hover:text-indigo-600 transition-colors select-none"
          >
            {formatDateToDisplay(dateRange.startDate)}
          </span>
        </div>

          <div className="w-px h-6 bg-gray-200 mx-1"></div>

          <div className="flex items-center gap-2">
            <span
              className="font-medium text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors select-none"
              onClick={() => {
                setShowCalendar(!showCalendar);
                setIsSelectingStartDate(false);
              }}
            >
              По
            </span>
            <span
              onClick={() => {
                setShowCalendar(!showCalendar);
                setIsSelectingStartDate(false);
              }}
              className="border-0 focus:ring-0 text-gray-600 font-medium w-20 text-center cursor-pointer hover:text-indigo-600 transition-colors select-none"
            >
              {formatDateToDisplay(dateRange.endDate)}
            </span>
          </div>

          {showCalendar && (
            <div className="absolute top-full left-0 mt-2 z-40 animate-fade-in-down">
              {renderCalendar()}
            </div>
          )}
        </div>

        {/* Выбор года */}
        <div className="relative" ref={yearDropdownRef}>
          <button
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="bg-white px-4 py-2 rounded-xl font-medium text-gray-700 hover:bg-blue-50 transition-all duration-200 flex items-center gap-2 shadow-sm border-b-2 border-indigo-100"
          >
            {dateRange.year}
            <svg
              className={`w-4 h-4 transition-transform ${showYearDropdown ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showYearDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg z-30 w-full border border-indigo-50">
              {years.map((year, index) => (
                <>
                  <button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className={`w-full px-4 py-2 text-center hover:bg-blue-50 transition-colors ${dateRange.year === year ? "bg-blue-100 font-medium" : ""
                      }`}
                  >
                    {year}
                  </button>
                  {index < years.length - 1 && <div className="w-full h-px bg-indigo-50"></div>}
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
              onClick={() => handlePeriodClick(period)}
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
              className={`w-4 h-4 transition-transform ${showMonthDropdown ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showMonthDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg z-30 w-36 border border-indigo-50">
              {monthNames.map((month, index) => (
                <>
                  <button
                    key={index}
                    onClick={() => handleMonthSelect(index)}
                    className={`w-full px-4 py-2 text-center hover:bg-blue-50 transition-colors ${selectedMonth === monthLabels[index] ? "bg-blue-100 font-medium" : ""
                      }`}
                  >
                    {month}
                  </button>
                  {index < monthNames.length - 1 && <div className="w-full h-px bg-indigo-50"></div>}
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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