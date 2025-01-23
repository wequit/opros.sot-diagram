//Страница "Замечания и предложения"

'use client';
import Data from '@/lib/utils/Data';
import React, { useState, useEffect, useMemo } from 'react';
import { useComments } from '@/components/CommentsApi';

type DataItem = {
  id: number;
  comment: string;
  action: string;
};

// Добавляем компонент модального окна
const CommentModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  selectedComment 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (comment: string) => void;
  selectedComment: string;
}) => {
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

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
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => {
              onSubmit(comment);
              onClose();
            }}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

// Компонент модального окна подтверждения удаления
const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Подтверждение удаления</h3>
        <p className="text-gray-600 mb-6">
          Вы уверены, что хотите удалить этот комментарий?
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default function RemarksPage() {
  const { comments, isLoading, error, addComment, deleteComment } = useComments();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visibleActions, setVisibleActions] = useState<{ [key: number]: boolean }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [localComments, setLocalComments] = useState<{ [key: number]: string }>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const itemsPerPage = 35;
  const totalPages = Math.ceil(comments.length / itemsPerPage);

  const currentData = useMemo(
    () => comments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [comments, currentPage, itemsPerPage],
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const toggleActionVisibility = (id: number) => {
    setVisibleActions((prev) => {
      const newVisibleActions = { ...prev, [id]: !prev[id] };
      Object.keys(newVisibleActions).forEach((key) => {
        if (parseInt(key) !== id) {
          newVisibleActions[parseInt(key)] = false;
        }
      });
      return newVisibleActions;
    });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (!(event.target as HTMLElement).closest('.action-menu')) {
      setVisibleActions({});
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCommentClick = (item: DataItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCommentSubmit = async (comment: string) => {
    if (!selectedItem) return;

    try {
      const response = await addComment({
        question_response: selectedItem.id,
        reply_to_comment: comment
      });

      // Обновляем локальное состояние комментариев
      setLocalComments(prev => ({
        ...prev,
        [selectedItem.id]: comment
      }));

      // Закрываем модальное окно
      setIsModalOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error('Ошибка при добавлении комментария:', err);
    }
  };

  const handleDeleteClick = (itemId: number) => {
    setCommentToDelete(itemId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (commentToDelete !== null) {
      try {
        await deleteComment(commentToDelete);
        setCommentToDelete(null);
      } catch (err) {
        console.error('Error deleting comment:', err);
      }
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-700">Загрузка данных...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Ошибка: {error}</p>;
  }

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800">Замечания и предложения</h2>
      <Data />
      <div className="p-4 mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase">
                <th className="border border-gray-300 px-2 py-2 text-center">№</th>
                <th className="border border-gray-300 px-2 py-2">Замечания</th>
                <th className="border border-gray-300 px-2 py-2">Комментарии/Принятые меры</th>
                <th className="border border-gray-300 px-2 py-2 text-center">Действия</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => {
                const itemKey = item.id !== undefined ? item.id : index;
                const hasComment = localComments[itemKey] || item.action;
                
                return (
                  <tr key={`row-${itemKey}`} className="hover:bg-gray-50 even:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">{item.comment}</td>
                    <td className="border border-gray-300 px-2 py-2">
                      {hasComment && (
                        <div className="flex justify-between items-center">
                          <span>{localComments[itemKey] || item.action}</span>
                          <button
                            onClick={() => handleDeleteClick(itemKey)}
                            className="text-red-500 hover:text-red-700 ml-2"
                            title="Удалить комментарий"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <div className="relative action-menu">
                        <button
                          key={`menu-${itemKey}`}
                          className="p-2 bg-gray-200 rounded focus:outline-none focus:ring md:hidden"
                          onClick={() => toggleActionVisibility(itemKey)}
                          aria-label="Открыть меню действий">
                          <span className="text-xl">⋮</span>
                        </button>

                        <button
                          key={`comment-${itemKey}`}
                          className="text-blue-500 hover:underline hidden md:inline"
                          onClick={() => handleCommentClick(item)}>
                          Комментировать
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center items-center mt-4 gap-2 flex-wrap">
          <button
            key="prev"
            className="px-3 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Назад">
            Назад
          </button>
          
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={`page-${index}`}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => handlePageChange(index + 1)}
              aria-label={`Страница ${index + 1}`}>
              {index + 1}
            </button>
          ))}
          
          <button
            key="next"
            className="px-3 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Вперед">
            Вперед
          </button>
        </div>
      </div>

      <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCommentSubmit}
        selectedComment={selectedItem?.comment || ''}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
