'use client';
import { getCookie } from '@/api/login';
import { useState, useEffect } from 'react';

export interface Remark {
  id: number;
  custom_answer: string | null;
  reply_to_comment: string | null;
  comment_created_at: string;
  author?: string;
  question_id?: number;
  court: string
}

export interface AddCommentParams {
  question_response: number;
  reply_to_comment: string;
}

export function useRemarks() {
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  const fetchRemarks = async () => {
    try {
      const token = getCookie('access_token');

      const response = await fetch('https://opros.sot.kg/api/v1/comments/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка при получении данных');
        
      }
      
      const data = await response.json();

      const filteredData = data.filter((item: Remark) => 
        item.question_id === 17 || 
        (item.custom_answer !== null && item.custom_answer !== "Необязательный вопрос")
      ).map((item: Remark) => ({
        id: item.id,
        custom_answer: item.custom_answer,
        reply_to_comment: item.reply_to_comment,
        comment_created_at: item.comment_created_at,
        author: item.author,
        question_id: item.question_id,
        court: item.court
      }));

      setRemarks(filteredData);
    } catch (err) {
      console.error('Ошибка при получении данных:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRemarks();
  }, []);

  return { remarks, isLoading, error, fetchRemarks };
} 