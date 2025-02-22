"use client";
import { getCookie, getCurrentUser } from "@/api/login";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

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

  const fetchRemarks = async () => {
    try {
      setIsLoading(true);
      const token = getCookie("access_token");

      // Получаем текущего пользователя
      const user = await getCurrentUser();
      const userCourt = user.court; // Предполагаем, что у user есть поле court

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

      const filteredData = data
        .filter((item: Remark) => {
          // Проверка роли пользователя
          if (user.role === "Председатель 3 инстанции" && pathname === "/") {
            // Для председателя 3 инстанции — показываем все ответы, кроме пустых и "Необязательный вопрос"
            return item.custom_answer !== null && item.custom_answer !== "Необязательный вопрос";
          } else {
            // Для остальных пользователей — только их суд + ответы, кроме пустых и "Необязательный вопрос"
            return (
              item.court === userCourt &&
              item.custom_answer !== null &&
              item.custom_answer !== "Необязательный вопрос"
            );
          }
        })
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
  }, []);

  return { remarks, isLoading, error, fetchRemarks };
}
