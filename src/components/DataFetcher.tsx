"use client";
import { useEffect, useState, useCallback } from "react";
import { ApiClient } from "@/api/apiClient";
import { useSurveyData } from "@/context/SurveyContext";

export const apiClient = new ApiClient({
  baseURL: "https://opros.sot.kg",
  endpoint: "/api/v1/results/",
});

// Выносим функцию fetchDataWithParams за пределы компонента
export const fetchDataWithParams = async (courtId: number | string | null, params = {}) => {
  try {
    const response = await apiClient.fetchData(courtId, params);
    return response;
  } catch (err) {
    console.error('Ошибка при получении данных:', err);
    throw err;
  }
};

export default function DataFetcher() {
  const [error, setError] = useState<string | null>(null);
  const { setSurveyData, setIsLoading, selectedCourtId } = useSurveyData();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Передаём selectedCourtId как первый аргумент (courtId) и параметры как второй
      const response = await fetchDataWithParams(selectedCourtId, { year: "2025" });
      setSurveyData(response);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  }, [setSurveyData, setIsLoading, selectedCourtId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) {
    return null;
  }

  return null;
}