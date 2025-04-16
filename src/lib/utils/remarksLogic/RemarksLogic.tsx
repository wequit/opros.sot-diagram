"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRemarks } from "@/components/RemarksApi";
import { getCookie } from "@/lib/api/login";
import { ArrowLeft, FileSearch, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";


export default function RemarksPage() {
  const { remarks, isLoading, error } = useRemarks();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [localRemarks, setLocalRemarks] = useState<any[]>([]);
  const [courtColumnWidth, setCourtColumnWidth] = useState<number>(250); 
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const resizingRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);
  
  const itemsPerPage = 9;
  const router = useRouter();
  const pathname = usePathname();
  const {language, getTranslation} = useLanguage();

  const startResize = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = courtColumnWidth;
    if (typeof document !== 'undefined') {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', stopResize);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const diff = e.clientX - startXRef.current;
    const newWidth = Math.max(150, startWidthRef.current + diff); 
    setCourtColumnWidth(newWidth);
  };

  const stopResize = () => {
    setIsResizing(false);
    if (typeof document !== 'undefined') {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopResize);
    }
  };

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
          <h3 className="text-lg font-semibold mb-4">{getTranslation("RemarksLogic_ModalTitle", language)}</h3>
          <p className="text-gray-600 mb-4">{getTranslation("RemarksLogic_ModalMessage", language)} {selectedComment}</p>
          <textarea
            className="w-full border rounded p-2 mb-4"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={getTranslation("RemarksLogic_ModalPlaceholder", language)}
          />
          <div className="flex justify-end gap-2">
            <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
              {getTranslation("RemarksLogic_ModalClose", language)}
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleSubmit}
            >
              {getTranslation("RemarksLogic_ModalButton", language)}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ViewMessageModal = ({
    isOpen,
    onClose,
    message,
  }: {
    isOpen: boolean;
    onClose: () => void;
    message: string;
  }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg">
          <h3 className="text-lg font-semibold mb-4">{getTranslation("RemarksLogic_ViewMessageTitle", language)}</h3>
          <div className="border rounded p-4 mb-4 bg-gray-50 max-h-60 overflow-auto">
            <p className="text-gray-700 whitespace-pre-wrap">{message || "—"}</p>
          </div>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={onClose}
            >
              {getTranslation("RemarksLogic_ModalClose", language)}
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    try {
      if (remarks) {
        setLocalRemarks(remarks);
      }
    } catch (error) {
      console.error("Ошибка при обработке данных замечаний:", error);
      setLocalRemarks([]); 
    }
  }, [remarks]);

  useEffect(() => {
    if (localRemarks.length === 0 && !isLoading) {
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [localRemarks, isLoading]);

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
          errorData.detail || getTranslation("RemarksLogic_Error_Adding", language)
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
      alert(getTranslation("RemarksLogic_Error_Adding", language));
    }
  };

  const getCurrentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return localRemarks.slice().reverse().slice(startIndex, endIndex);
  }, [localRemarks, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(localRemarks.length / itemsPerPage);
  }, [localRemarks.length, itemsPerPage]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPaginationNumbers = () => {
    let pages = [];
    const maxButtons = 5;
    
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push(null);
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push(null);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(null);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(null);
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const paginationNumbers = useMemo(() => {
    return getPaginationNumbers();
  }, [currentPage, totalPages]);

  const handleMessageClick = (item: any) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleCommentClick = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <p className="text-center text-gray-700">{getTranslation("RemarksLogic_Loading", language)}</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{getTranslation("RemarksLogic_Error", language)}: {error}</p>;
  }

  return (
    <>
      {localRemarks.length === 0 ? (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center max-w-3xl w-full mx-auto">
            {/* Анимированная иконка */}
            <div className="animate-bounce mb-8">
              <FileSearch size={72} className="text-blue-500" />
            </div>
            
            {/* Заголовок */}
            <p className="text-gray-800 text-3xl font-bold mb-4 text-center">
              {getTranslation("RemarksLogic_NoRemarks", language)}
            </p>
            
            {/* Текст */}
            <p className="text-gray-600 text-lg mb-10 text-center max-w-lg">
              {getTranslation("RemarksLogic_NoRemarksMessage", language)}
            </p>
            
            {/* Кнопка */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-3 px-8 py-3 bg-blue-500 text-white text-base font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>{getTranslation("RemarksLogic_Back", language)}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 mx-auto">
          {/* Заголовок и кнопка "Назад" */}
          <div className="flex sm:flex-row items-center justify-between mb-6 gap-4 sm:gap-0">
            <h1 className="text-2xl max-sm:text-xl font-bold text-gray-800 tracking-tight text-center sm:text-left RemarksText">
              {getTranslation("RemarksLogic_Remarks", language)}
            </h1>
            <button
              onClick={() => router.back()}
              className="max-sm:px-2 max-sm:py-2 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              <ArrowLeft size={18} />
              {getTranslation("RemarksLogic_Back", language)}
            </button>
          </div>

          {/* Контейнер с фиксированной высотой и шириной 100% */}
          <div className="bg-white shadow-md rounded-lg w-full overflow-hidden">
            {/* Контейнер с горизонтальной прокруткой */}
            <div className="w-full overflow-x-auto">
              <table className="w-full table-fixed border-collapse">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th scope="col" className="w-16 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      №
                    </th>
                    <th scope="col" style={{ width: `${courtColumnWidth}px` }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative border-r border-gray-200">
                      {getTranslation("RemarksLogic_Court", language)}
                      {/* Ручка для изменения размера столбца */}
                      <div 
                        ref={resizingRef}
                        className="absolute right-0 top-0 bottom-0 w-2 bg-transparent hover:bg-blue-300 cursor-col-resize"
                        onMouseDown={startResize}
                      ></div>
                    </th>
                    <th scope="col" className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      {getTranslation("RemarksLogic_Message", language)}
                    </th>
                    <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      {getTranslation("RemarksLogic_Chairman", language)}
                    </th>
                    <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      {getTranslation("RemarksLogic_Reply", language)}
                    </th>
                    <th scope="col" className="w-1/6 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {getTranslation("RemarksLogic_Actions", language)}
                    </th>
                  </tr>
                </thead>
                <tbody className="min-h-[320px]">
                  {getCurrentPageData.map((item: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50 h-16 border-b border-gray-100">
                      <td className="px-6 py-4 text-sm text-gray-700 text-center border-r border-gray-200">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200" style={{ width: `${courtColumnWidth}px` }}>
                        <div className="whitespace-normal break-words" title={item.court || "Не указано"}>
                          {item.court || "Не указано"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200">
                        <div 
                          className="line-clamp-2 h-10 overflow-hidden cursor-pointer hover:text-blue-600 transition-colors" 
                          title={item.custom_answer || "—"}
                          onClick={() => handleMessageClick(item)}
                        >
                          {item.custom_answer || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-center border-r border-gray-200">
                        <div className="truncate" title={item.author || "—"}>
                          {item.author || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-center border-r border-gray-200">
                        <div className="truncate" title={item.reply_to_comment || "—"}>
                          {item.reply_to_comment || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleCommentClick(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                        >
                          {getTranslation("RemarksLogic_Comment", language)}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Пагинация */}
          {localRemarks.length > itemsPerPage ? (
            <div className="flex justify-center items-center mt-6 gap-2 sm:gap-3">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 transition-colors duration-200 text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm text-sm">
                {currentPage}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-200 text-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : null}

          <CommentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCommentSubmit}
            selectedComment={selectedItem?.custom_answer || ""}
          />

          <ViewMessageModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            message={selectedItem?.custom_answer || ""}
          />
        </div>
      )}
    </>
  );
}
