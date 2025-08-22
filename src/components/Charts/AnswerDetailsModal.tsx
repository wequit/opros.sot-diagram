'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';
import { getAnswerCourtsData } from '@/lib/api/charts/charts';
import { useLanguage } from '@/context/LanguageContext';

interface AnswerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  answerId: number;
  answerText: string;
  count: number;
  percentage: string;
}

interface CourtData {
  court_id: number;
  court_name: string;
  region_name: string;
  total_selected: number;
}

const AnswerDetailsModal: React.FC<AnswerDetailsModalProps> = ({
  isOpen,
  onClose,
  answerId,
  answerText,
  count,
  percentage
}) => {
  const [courtsData, setCourtsData] = useState<CourtData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language, getTranslation } = useLanguage();

  useEffect(() => {
    if (isOpen && answerId) {
      fetchCourtsData();
    }
  }, [isOpen, answerId]);

  const fetchCourtsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAnswerCourtsData(answerId);
      setCourtsData(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке данных');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      } else {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
      }}
    >
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999999,
        }}
        onClick={onClose}
      />
      
      <div 
        style={{
          position: 'relative',
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          zIndex: 1000000,
        }}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Суды по данному ответу
            </h2>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="border-t border-gray-200 pt-4">
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600">Загрузка данных...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-2">Ошибка загрузки данных</p>
              <p className="text-sm text-gray-600">{error}</p>
              <button
                onClick={fetchCourtsData}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Попробовать снова
              </button>
            </div>
          ) : courtsData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Нет данных о судах для этого ответа</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-96">
              <div className="grid grid-cols-1 gap-3">
                {courtsData.map((court) => (
                  <div 
                    key={court.court_id} 
                    className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-1">
                          {court.court_name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {court.region_name}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-bold text-blue-600">
                          {court.total_selected}
                        </p>
                        <p className="text-xs text-gray-500">
                          ответов
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AnswerDetailsModal;
