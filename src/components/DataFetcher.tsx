'use client';
import { useEffect, useState, useCallback } from 'react';
import { ApiClient } from '@/api/apiClient';
import { useSurveyData } from '@/context/SurveyContext';

export const apiClient = new ApiClient({
  baseURL: 'https://opros.sot.kg',
  endpoint: '/api/v1/results/'
});

// Выносим функцию fetchDataWithParams за пределы компонента
export const fetchDataWithParams = async (params = {}) => {
  try {
    const response = await apiClient.fetchData(params);
    return response;
  } catch (err) {
    console.error('Ошибка при получении данных:', err);
    throw err;
  }
};

export default function DataFetcher() {
  const [error, setError] = useState<string | null>(null);
  const { setSurveyData, setIsLoading } = useSurveyData();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchDataWithParams({ year: '2025' });
      setSurveyData(response);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  }, [setSurveyData, setIsLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) {
    return null;
  }

  return null;
} 