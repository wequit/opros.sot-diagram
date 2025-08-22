"use client";

import { useEffect, useState, useCallback } from "react";
import { getCookie } from "@/lib/api/login";
import { getColumnCourtData } from "@/lib/api/charts/charts";
import { useChartData } from "@/context/ChartDataContext";
import { useDateParams } from "@/context/DateParamsContext";

interface CourtApiProps {
  courtId?: string;
}

export default function CourtApi({ courtId }: CourtApiProps) {
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
  const effectiveCourtId = courtId || "65";

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      const token = getCookie("access_token");
      if (!token) throw new Error("Token is null");

      // Загружаем только column для суда
      const columnData = await getColumnCourtData(effectiveCourtId, dateParams);

      setColumnData(columnData || null);

      // total_responses может быть отдельным объектом
      const totalObj = Array.isArray(columnData)
        ? columnData.find((item: any) => typeof item === "object" && item && "total_responses" in item)
        : undefined;
      if (totalObj?.total_responses) {
        setSurveyResponsesCount(totalObj.total_responses);
      } else if (Array.isArray(columnData)) {
        const q1 = columnData.find((q: any) => q && q.question_id === 1);
        const sum = q1?.options?.reduce((acc: number, opt: any) => acc + (opt?.count || 0), 0) || 0;
        setSurveyResponsesCount(sum);
      } else {
        setSurveyResponsesCount(0);
      }

      const questions = Array.isArray(columnData)
        ? columnData.filter((q: any) => q && typeof q === "object" && "question_id" in q)
        : [];

      setCircleData(null);
      setBarData(questions || null);

      setRadarData(null as any);
      setProgressData(null as any);
      setGenderAgeData(null as any);

      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Произошла ошибка";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [
    effectiveCourtId,
    dateParams,
    setCircleData,
    setRadarData,
    setBarData,
    setProgressData,
    setColumnData,
    setIsLoading,
    setSurveyResponsesCount,
    setGenderAgeData,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) {
    return <div className="text-red-500">Ошибка: {error}</div>;
  }

  return null;
}