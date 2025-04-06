"use client";
import { useEffect, useCallback } from "react";
import { useSurveyData } from "@/context/SurveyContext";
import {
  getCircleRepublicData,
  getRadarRepublicData,
  getBarRepublicData,
  getProgressRepublicData,
  getColumnRepublicData,
} from "@/lib/api/charts/charts";

export default function SummaryAPI() {
  const {
    setCircleData,
    setRadarData,
    setBarData,
    setProgressData,
    setColumnData,
    setIsLoading,
    dateParams,
    setSurveyResponsesCount,
  } = useSurveyData();

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      // Запускаем все запросы параллельно
      const circlePromise = getCircleRepublicData(dateParams).then(data => {
        setCircleData(data);
      });
      const radarPromise = getRadarRepublicData(dateParams).then(data => {
        setRadarData(data);
        setSurveyResponsesCount(data.survey_responses_count || 0);
      });
      const barPromise = getBarRepublicData(dateParams).then(data => {
        setBarData(data);
      });
      const progressPromise = getProgressRepublicData(dateParams).then(data => {
        setProgressData(data);
      });
      const columnPromise = getColumnRepublicData(dateParams).then(data => {
        setColumnData(data);
      });

      // Ждем завершения всех запросов только для сброса isLoading
      await Promise.all([circlePromise, radarPromise, barPromise, progressPromise, columnPromise]);
    } catch (err) {
      console.error("Ошибка при получении данных:", err);
    } finally {
      setIsLoading(false);
    }
  }, [dateParams, setCircleData, setRadarData, setBarData, setProgressData, setColumnData, setIsLoading, setSurveyResponsesCount]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return null;
}