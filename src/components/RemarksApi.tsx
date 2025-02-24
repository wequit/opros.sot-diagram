"use client";
import { getCookie, getCurrentUser } from "@/api/login";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSurveyData } from "@/context/SurveyContext";
import { filterRemarks } from "@/types/filterRemarks"; 

export interface Remark {
  id: number;
  custom_answer: string | null;
  reply_to_comment: string | null;
  comment_created_at: string;
  author?: string;
  question_id?: number;
  court: string;
}

export interface AddCommentParams {
  question_response: number;
  reply_to_comment: string;
}

export function useRemarks() {
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const { selectedCourt, courtName, selectedCourtName } = useSurveyData();

  const fetchRemarks = async () => {
    // Получаем selectedCourtId из localStorage, если его нет, используем 0
    const storedCourtId = localStorage.getItem("selectedCourtId");
    const courtId = storedCourtId ? parseInt(storedCourtId, 10) : null;

    if (!courtId) {
      return;
    }

    
    try {
      setIsLoading(true);
      const token = getCookie("access_token");

      // Получаем текущего пользователя 
      const user = await getCurrentUser();

      const response = await fetch("https://opros.sot.kg/api/v1/comments/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Ошибка при получении данных");
      }

      const data = await response.json();

      // Используем функцию filterRemarks для фильтрации данных
      const filteredData = filterRemarks(data, user, pathname, selectedCourtName, courtId)
        .map((item: Remark) => ({
          id: item.id,
          custom_answer: item.custom_answer,
          reply_to_comment: item.reply_to_comment,
          comment_created_at: item.comment_created_at,
          author: item.author,
          question_id: item.question_id,
          court: item.court,
        }));
      
      setRemarks(filteredData);
    } catch (err) {
      console.error("Ошибка при получении данных:", err);
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRemarks();
  }, [selectedCourt, courtName, selectedCourtName]); // Обновляем данные при изменении selectedCourt или courtName

  return { remarks, isLoading, error, fetchRemarks };
}
