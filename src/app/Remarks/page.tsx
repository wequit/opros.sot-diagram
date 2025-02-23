"use client";
import React, { useState, useEffect } from "react";
import { useRemarks } from "@/components/RemarksApi";
import { filterRemarks } from "@/types/filterRemarks"; // путь к файлу filterRemarks.ts
import { getCookie, getCurrentUser } from "@/api/login";
import { ArrowLeft, FileSearch } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSurveyData } from "@/context/SurveyContext";

export default function RemarksPage() {
  const { remarks, isLoading, error } = useRemarks();
  const pathname = usePathname();
  const { selectedCourtName } = useSurveyData();
  const [localRemarks, setLocalRemarks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const itemsPerPage = 35;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Получаем данные пользователя, если они не приходят через контекст
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  // Дополнительная фильтрация на странице RemarksPage
  useEffect(() => {
    if (remarks.length > 0 && user) {
      const filtered = filterRemarks(remarks, user, pathname, selectedCourtName);
      setLocalRemarks(filtered);
      console.log("Filtered remarks:", filtered);
    }
  }, [remarks, user, pathname, selectedCourtName]);

  const handleCommentClick = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCommentSubmit = async (comment: string) => {
    try {
      const token = getCookie("access_token");
      const response = await fetch("https://opros.sot.kg/api/v1/comments/respond/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question_response: selectedItem.id,
          reply_to_comment: comment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Ошибка при добавлении комментария");
      }

      setLocalRemarks((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? { ...item, reply_to_comment: comment }
            : item
        )
      );

      setIsModalOpen(false);
    } catch (error) {
      console.error("Ошибка при добавлении комментария:", error);
      alert("Ошибка при добавлении комментария");
    }
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return localRemarks.slice().reverse().slice(startIndex, endIndex);
  };

  if (isLoading) {
    return <p className="text-center text-gray-700">Загрузка данных...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Ошибка: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      {localRemarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="animate-bounce mb-4">
            <FileSearch size={64} className="text-gray-400" />
          </div>
          <p className="text-gray-700 text-xl font-semibold mb-2">
            Нет доступных замечаний
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Для вашего суда пока не поступило ни одного замечания.
          </p>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-600 transition"
          >
            <ArrowLeft size={18} />
            Вернуться на главную
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Замечания и предложения</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 w-16">№</th>
                  <th className="border p-2">СУД</th>
                  <th className="border p-2">КОММЕНТАРИИ/ПРИНЯТЫЕ МЕРЫ</th>
                  <th className="border p-2">ЗАМЕЧАНИЯ</th>
                  <th className="border p-2">ДЕЙСТВИЯ</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageData().map((item, index) => {
                  const absoluteIndex =
                    localRemarks.length - (currentPage - 1) * itemsPerPage - index;
                  return (
                    <tr key={item.id}>
                      <td className="border p-2 text-center">{absoluteIndex}</td>
                      <td className="border p-2">{item.court || "Не указано"}</td>
                      <td className="border p-2">{item.custom_answer || ""}</td>
                      <td className="border p-2">{item.reply_to_comment || ""}</td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => handleCommentClick(item)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Комментировать
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded bg-white disabled:bg-gray-100"
            >
              Назад
            </button>
            <span className="px-3 py-1 border rounded bg-blue-500 text-white">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 border rounded bg-white"
            >
              Вперед
            </button>
          </div>

          {/* <CommentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCommentSubmit}
            selectedComment={selectedItem?.custom_answer || ""}
          /> */}
        </>
      )}
    </div>
  );
}
