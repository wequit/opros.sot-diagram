'use client';
import  { useEffect, useState } from 'react';
import { ApiClient } from '@/lib/api/apiClient';
import { useSurveyData } from '@/lib/context/SurveyContext';

export default function DataFetcher() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setSurveyData } = useSurveyData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiClient = new ApiClient({
          baseURL: 'https://opros.sot.kg',
          endpoint: '/api/v1/results/'
        });

        const response = await apiClient.fetchData();
        setSurveyData(response);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setSurveyData]);

  if (isLoading) {
    return null;
  }

  if (error) {
    return null;
  }

  return null;
} 