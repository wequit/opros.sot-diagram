"use client";
import { useEffect, useState, useCallback } from "react";
import { useSurveyData } from "@/context/SurveyContext";
import {
  getCircleRepublicData,
  getRadarRepublicData,
  getBarRepublicData,
  getProgressRepublicData,
  getColumnRepublicData,
} from "@/lib/api/charts";

export default function SummaryAPI() {
  const [error, setError] = useState<string | null>(null);
  const { setSurveyData, setIsLoading, dateParams, setSurveyResponsesCount } = useSurveyData();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      console.time("Fetch Republic Data");

      const promises = [
        getCircleRepublicData(dateParams),
        getRadarRepublicData(dateParams),
        getBarRepublicData(dateParams),
        getProgressRepublicData(dateParams),
        getColumnRepublicData(dateParams),
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
      console.timeEnd("Fetch Republic Data");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
      console.error("Ошибка при получении данных:", err);
    } finally {
      setIsLoading(false);
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