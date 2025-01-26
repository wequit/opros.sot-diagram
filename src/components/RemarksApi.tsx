'use client';
import { useState, useEffect } from 'react';

export interface Remark {
  id: number;
  custom_answer: string | null;
  reply_to_comment: string | null;
  comment_created_at: string;
  author?: string;
  question_id?: number;
}

export interface AddCommentParams {
  question_response: number;
  reply_to_comment: string;
}

export function useRemarks() {
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getToken = async () => {
    try {
      const response = await fetch('https://opros.sot.kg/api/v1/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'pred3',
          password: 'predsedatel'
        })
      });

      if (!response.ok) throw new Error('Ошибка авторизации');
      const data = await response.json();
      console.log('Ответ авторизации:', data); // Посмотрим, что приходит
      return data.access; // Пробуем использовать data.access вместо data.token
    } catch (err) {
      console.error('Ошибка получения токена:', err);
      throw err;
    }
  };

  const fetchRemarks = async () => {
    try {
      const token = await getToken();
      console.log('Полученный токен:', token); // Проверим токен

      const response = await fetch('https://opros.sot.kg/api/v1/comments/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Ошибка ответа:', errorData); // Логируем ошибку
        throw new Error(errorData.detail || 'Ошибка при получении данных');
      }
      
      const data = await response.json();
      console.log('Все данные:', data);

      const filteredData = data.filter((item: any) => 
        item.question_id === 17 || 
        (item.custom_answer !== null && item.custom_answer !== "Необязательный вопрос")
      ).map((item: any) => ({
        id: item.id,
        custom_answer: item.custom_answer,
        reply_to_comment: item.reply_to_comment,
        comment_created_at: item.comment_created_at,
        author: item.author,
        question_id: item.question_id
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