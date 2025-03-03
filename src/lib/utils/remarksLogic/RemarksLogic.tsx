"use client";
import React, { useState, useEffect } from "react";
import { useRemarks } from "@/components/RemarksApi";
import { getCookie } from "@/lib/login";
import { ArrowLeft, FileSearch } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
const CommentModal = ({
  isOpen,
  onClose,
  onSubmit,
  selectedComment,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
  selectedComment: string;
}) => {
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (isOpen) setComment("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(comment);
    setComment("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">Добавить комментарий</h3>
        <p className="text-gray-600 mb-4">Замечание: {selectedComment}</p>
        <textarea
          className="w-full border rounded p-2 mb-4"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Введите ваш комментарий..."
        />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
            Отмена
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSubmit}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default function RemarksPage() {
  const { remarks, isLoading, error } = useRemarks();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [localRemarks, setLocalRemarks] = useState<any[]>([]);
  const itemsPerPage = 35;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (remarks) {
      setLocalRemarks(remarks);
    }
  }, [remarks]);

  const handleCommentSubmit = async (comment: string) => {
    try {
      const token = getCookie("access_token");
      const response = await fetch(
        "https://opros.sot.kg/api/v1/comments/respond/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question_response: selectedItem.id,
            reply_to_comment: comment,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Ошибка при добавлении комментария"
        );
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

  const handleCommentClick = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <p className="text-center text-gray-700">Загрузка данных...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Ошибка: {error}</p>;
  }

  return (
    <div className=" mx-auto p-4">
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
        <div className=" mx-auto px-4 py-6">
          {/* Заголовок и кнопка "Назад" */}
          <div className="flex  sm:flex-row items-center justify-between mb-6 gap-4 sm:gap-0">
            <h1 className="text-2xl max-sm:text-xl font-bold text-gray-800 tracking-tight text-center sm:text-left RemarksText">
              Замечания и предложения
            </h1>
            <button
              onClick={() => router.back()}
              className="max-sm:px-2 max-sm:py-2  flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              <ArrowLeft size={18} />
              Назад
            </button>
          </div>

          {/* Таблица для десктопов, карточки для мобильных */}
          <div className="shadow-lg rounded-xl border border-gray-200 bg-white">
            {/* Таблица для десктопов */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                      №
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Суд
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Комментарии / Меры
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Автор
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Замечания
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {getCurrentPageData().map((item, index) => {
                    const absoluteIndex =
                      localRemarks.length -
                      (currentPage - 1) * itemsPerPage -
                      index;
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="py-4 px-4 text-sm text-gray-700 text-center">
                          {absoluteIndex}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900">
                          {item.court || "Не указано"}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          {item.custom_answer || "—"}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          {item.author || "—"}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          {item.reply_to_comment || "—"}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleCommentClick(item)}
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
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

            {/* Карточки для мобильных */}
            <div className="block sm:hidden p-4 space-y-4">
              {getCurrentPageData().map((item, index) => {
                const absoluteIndex =
                  localRemarks.length -
                  (currentPage - 1) * itemsPerPage -
                  index;
                return (
                  <div
                    key={item.id}
                    className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-semibold text-gray-800">
                        № {absoluteIndex}
                      </span>
                      <button
                        onClick={() => handleCommentClick(item)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                      >
                        Комментировать
                      </button>
                    </div>
                    <div className="mt-2 space-y-2">
                      <p className="text-xs text-gray-700">
                        <span className="font-medium">Суд:</span>{" "}
                        {item.court || "Не указано"}
                      </p>
                      <p className="text-xs text-gray-700">
                        <span className="font-medium">Автор:</span>{" "}
                        {item.author || "—"}
                      </p>
                      <p className="text-xs text-gray-700">
                        <span className="font-medium">Замечания:</span>{" "}
                        {item.reply_to_comment || "—"}
                      </p>
                      {/* Акцент на комментарии */}
                      <p className="text-sm text-gray-900 bg-gray-100 p-2 rounded-md">
                        <span className="font-medium text-gray-800">
                          Комментарии:
                        </span>{" "}
                        {item.custom_answer || "—"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Пагинация */}
          <div className="flex justify-center items-center mt-6 gap-2 sm:gap-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 transition-colors duration-200 text-sm"
            >
              Назад
            </button>
            <span className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm text-sm">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-200 text-sm"
            >
              Вперед
            </button>
          </div>

          <CommentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCommentSubmit}
            selectedComment={selectedItem?.custom_answer || ""}
          />
        </div>
      )}
    </div>
  );
}
