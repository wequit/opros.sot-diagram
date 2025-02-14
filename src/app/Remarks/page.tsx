"use client";
import React, { useState, useEffect } from "react";
import { useRemarks } from "@/components/RemarksApi";
import { getCookie } from "@/api/login";
import { ArrowLeft, FileSearch } from "lucide-react";
import Link from "next/link";
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
                    localRemarks.length -
                    (currentPage - 1) * itemsPerPage -
                    index;
                  return (
                    <tr key={item.id}>
                      <td className="border p-2 text-center">
                        {absoluteIndex}
                      </td>
                      <td className="border p-2">
                        {item.court || "Не указано"}
                      </td>
                      <td className="border p-2">{item.custom_answer || ""}</td>
                      <td className="border p-2">
                        {item.reply_to_comment || ""}
                      </td>
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

          <CommentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCommentSubmit}
            selectedComment={selectedItem?.custom_answer || ""}
          />
        </>
      )}
    </div>
  );
}
