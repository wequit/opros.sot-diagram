"use client";
import { useEffect, useState, useCallback } from "react";
import { ApiClient } from "@/lib/api/apiClient";
import { useSurveyData } from "@/context/SurveyContext";

export const apiClient = new ApiClient({
  baseURL: "https://opros.sot.kg",
  endpoint: "/api/v1/results/",
});

const cache: { [key: string]: any } = {};

export const fetchDataWithParams = async (courtId: number | string | null, params = {}) => {
  const cacheKey = `${courtId || "null"}-${JSON.stringify(params)}`;

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const response = await apiClient.fetchData(courtId, params);
    cache[cacheKey] = response;
    return response;
  } catch (err) {
    console.error("Ошибка при получении данных:", err);
    throw err;
  }
};

export default function DataFetcher() {
  const [error, setError] = useState<string | null>(null);
  const { setSurveyData, setIsLoading, selectedCourtId } = useSurveyData();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
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