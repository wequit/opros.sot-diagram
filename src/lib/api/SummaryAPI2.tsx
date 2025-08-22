"use client";

import { useEffect, useState, useCallback } from "react";
import { getColumnRegionData } from "@/lib/api/charts/charts";
import { useChartData } from "@/context/ChartDataContext";
import { useDateParams } from "@/context/DateParamsContext";

export default function SummaryAPI2() {
  const [error, setError] = useState<string | null>(null);
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
    try {
      setIsLoading(true);

      const column = await getColumnRegionData(dateParams);
      setColumnData(column);

      const totalObj = Array.isArray(column)
        ? column.find((item: any) => typeof item === "object" && item && "total_responses" in item)
        : undefined;
      setSurveyResponsesCount(totalObj?.total_responses || 0);

      const questions = Array.isArray(column)
        ? column.filter((q: any) => q && typeof q === "object" && "question_id" in q)
        : [];

      setCircleData(null);
      setBarData(questions);
      setRadarData(null as any);
      setProgressData(null as any);
      setGenderAgeData(null as any);

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
      console.error("Ошибка при получении данных:", err);
    } finally {
      setIsLoading(false);
    }
  }, [dateParams, setBarData, setCircleData, setColumnData, setGenderAgeData, setIsLoading, setProgressData, setRadarData, setSurveyResponsesCount]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) {
    return null;
  }

  return null;
}