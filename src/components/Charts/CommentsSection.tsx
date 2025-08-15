import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getCookie } from "@/lib/api/login";

interface CommentsSectionProps {
  comments: { text: string }[];
  totalResponsesAnswer: number;
  remarksPath: string;
}

export default function CommentsSection({
  comments,
  totalResponsesAnswer,
  remarksPath,
}: CommentsSectionProps) {
  const { language, getTranslation } = useLanguage();
  const [lastComments, setLastComments] = useState<{ text: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = getCookie("access_token");
        const response = await fetch("https://opros.sot.kg/api/v1/comments/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Извлекаем все answers из групп
          const allAnswers: any[] = [];
          if (Array.isArray(data)) {
            data.forEach((group: any) => {
              if (group.answers && Array.isArray(group.answers)) {
                allAnswers.push(...group.answers);
              }
            });
          }
          
          // Фильтруем и берем последние 5 комментариев
          const filtered = allAnswers
            .filter((item: any) => 
              item && 
              item.custom_answer && 
              item.custom_answer.trim() !== "" && 
              item.custom_answer !== "Необязательный вопрос"
            )
            .slice(-5) // последние 5
            .reverse() // новые сверху
            .map((item: any) => ({ text: item.custom_answer }));
          
          setLastComments(filtered);
        }
      } catch (error) {
        console.error("Ошибка загрузки комментариев:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const displayedComments = lastComments;

  return (
    <div className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 flex flex-col justify-between h-full">
      <div className="px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium DiagrammTwo">
            {getTranslation("DiagrammTwo", language)}
          </h2>
          <span className="text-gray-600 DiagrammTwoTotal">
            {getTranslation("DiagrammTwoTotal", language)}{" "}
            {totalResponsesAnswer}
          </span>
        </div>
      </div>
      <div className="p-6 flex-1 DiagrammTwoComments">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 text-sm mt-2">Загрузка комментариев...</p>
          </div>
        ) : displayedComments.length > 0 ? (
          <div className="space-y-3">
            {displayedComments.map((comment, index) => {
              const rowNumber = index + 1;
              return (
                <div
                  key={index}
                  className="flex gap-4 p-3 border rounded bg-gray-50"
                >
                  <div>{rowNumber}</div>
                  <span>{comment.text}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
            <p className="text-gray-700 text-base sm:text-sm font-medium text-center">
              Нет доступных комментариев.
            </p>
            <p className="text-gray-500 text-xs sm:text-xs text-center mt-1 sm:mt-2">
              Пока что комментарии отсутствуют.
            </p>
          </div>
        )}
      </div>
      <div className="px-6 pb-6">
        <Link href={remarksPath}>
          <button className="mt-4 w-full py-3 text-white rounded-lg bg-green-600 hover:shadow-2xl transition-all duration-200 DiagrammTwoCommentsBtn">
            {getTranslation("DiagrammTwoButton", language)}
          </button>
        </Link>
      </div>
    </div>
  );
}
