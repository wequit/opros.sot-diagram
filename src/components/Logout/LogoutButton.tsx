'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LogoutModal from './LogoutModal';
import { FiLogOut } from 'react-icons/fi';
import { getTranslation, useSurveyData } from '@/context/SurveyContext';
import { useAuth } from '../../context/AuthContext';

const LogoutButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { language } = useSurveyData();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setIsModalOpen(false);
    
    // Используем полный путь, чтобы обойти любые префиксы маршрутов
    window.location.href = "/results/login";
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
      >
        <FiLogOut className="w-5 h-5" />
        <span className='HeaderNavExitText'>{getTranslation("HeaderNavExit", language)}</span>
      </button>

      {isModalOpen && (
        <LogoutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
};

export default LogoutButton;
