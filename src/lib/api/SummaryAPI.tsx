"use client";

import { useEffect, useCallback } from "react";
import { getColumnRepublicData } from "@/lib/api/charts/charts";
import { useChartData } from "@/context/ChartDataContext";
import { useDateParams } from "@/context/DateParamsContext";

export default function SummaryAPI() {
  const {
    setCircleData,
    setRadarData,
    setBarData,
    setProgressData,
    setColumnData,
    setIsLoading,
    setSurveyResponsesCount,
    setGenderAgeData,
  } = useChartData();

  const { dateParams } = useDateParams();

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const column = await getColumnRepublicData(dateParams);
      setColumnData(column);

      const totalObj = Array.isArray(column)
        ? column.find((item: any) => typeof item === "object" && item && "total_responses" in item)
        : undefined;
      setSurveyResponsesCount(totalObj?.total_responses || 0);

      const questions = Array.isArray(column)
        ? column.filter((q: any) => q && typeof q === "object" && "question_id" in q)
        : [];

      // Все диаграммы теперь столбчатые
      setCircleData(null);
      setBarData(questions);
      setRadarData(null as any);
      setProgressData(null as any);
      setGenderAgeData(null as any);
    } catch (err) {
      console.error("Ошибка при получении данных:", err);
    } finally {
      setIsLoading(false);
    }
  }, [dateParams, setBarData, setCircleData, setColumnData, setGenderAgeData, setIsLoading, setProgressData, setRadarData, setSurveyResponsesCount]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return null;
}