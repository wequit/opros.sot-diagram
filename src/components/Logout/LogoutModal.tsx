'use client';
import { getTranslation, useSurveyData } from '@/context/SurveyContext';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const {  language  } = useSurveyData();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Добавляем стили для предотвращения скролла
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
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
      {/* Затемнение */}
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
      
      {/* Модальное окно */}
      <div 
        style={{
          position: 'relative',
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          width: '384px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          zIndex: 1000000,
        }}
      >
        <h2 className="text-xl font-semibold mb-4"> {getTranslation("LogoutModal_TextOne", language)}</h2>
        <p className="text-gray-600 mb-6">{getTranslation("LogoutModal_TextTwo", language)}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded transition-colors"
          >
           {getTranslation("LogoutModal_Cancel", language)}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
             {getTranslation("LogoutModal_Exit", language)}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default LogoutModal; 