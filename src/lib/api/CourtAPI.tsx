"use client";
import { useEffect, useState, useCallback } from "react";
import { getCookie } from "@/lib/api/login";
import {
  getCircleCourtData,
  getRadarCourtData,
  getBarCourtData,
  getProgressCourtData,
  getColumnCourtData,
} from "@/lib/api/charts/charts";
import { useChartData } from "@/context/ChartDataContext";
import { useDateParams } from "@/context/DateParamsContext";

interface CourtApi {
  courtId?: string;
}

export default function CourtApi({ courtId }: CourtApi) {
  const [error, setError] = useState<string | null>(null);
  const { setSurveyData, setIsLoading, setSurveyResponsesCount } = useChartData();
  const {dateParams } = useDateParams();

  const effectiveCourtId = courtId || "65";

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      console.time("Fetch Court Data");

      const token = getCookie("access_token");
      if (!token) throw new Error("Token is null");

      const promises = [
        getCircleCourtData(effectiveCourtId, dateParams),
        getRadarCourtData(effectiveCourtId, dateParams),
        getBarCourtData(effectiveCourtId, dateParams),
        getProgressCourtData(effectiveCourtId, dateParams),
        getColumnCourtData(effectiveCourtId, dateParams),
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
      console.timeEnd("Fetch Court Data");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
      console.error("Ошибка при получении данных суда:", err);
    } finally {
      setIsLoading(false);
    }
  }, [setSurveyData, setIsLoading, effectiveCourtId, dateParams, setSurveyResponsesCount]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) {
    return null;
  }

  return null;
}