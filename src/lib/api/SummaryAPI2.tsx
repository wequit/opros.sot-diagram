"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getCircleRegionData,
  getRadarRegionData,
  getBarRegionData,
  getProgressRegionData,
  getColumnRegionData,
} from "@/lib/api/charts/charts";
import { useChartData } from "@/context/ChartDataContext";
import { useDateParams } from "@/context/DateParamsContext";

export default function SummaryAPI2() {
  const [error, setError] = useState<string | null>(null);
  const { setSurveyData, setIsLoading, setSurveyResponsesCount } = useChartData();
  const {  dateParams } = useDateParams();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true); // Устанавливаем isLoading в true
      console.time("Fetch Region Data");

      const promises = [
        getCircleRegionData(dateParams),
        getRadarRegionData(dateParams),
        getBarRegionData(dateParams),
        getProgressRegionData(dateParams),
        getColumnRegionData(dateParams),
      ];

      const [circleData, radarData, barData, progressData, columnData] = await Promise.all(promises);

      const surveyData = {
        circle: circleData,
        radar: radarData,
        bar: barData,
        progress: progressData,
        column: columnData,
      };

      setSurveyData(surveyData);
      setSurveyResponsesCount(radarData.survey_responses_count || 0);
      setError(null);
      console.timeEnd("Fetch Region Data");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
      console.error("Ошибка при получении данных:", err);
    } finally {
      setIsLoading(false); // Сбрасываем isLoading после завершения запросов
    }
  }, [setSurveyData, setIsLoading, dateParams, setSurveyResponsesCount]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) {
    return null;
  }

  return null;
}