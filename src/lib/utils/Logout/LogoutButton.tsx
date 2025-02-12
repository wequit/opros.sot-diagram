import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LogoutModal from './LogoutModal';
import { FiLogOut } from 'react-icons/fi';

const LogoutButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // Здесь можно добавить логику выхода (очистка токенов, состояния и т.д.)
    localStorage.removeItem('token'); // Пример очистки токена
    router.push('/login'); // Перенаправление на страницу входа
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
      >
        <FiLogOut className="w-5 h-5" />
        <span>Выйти</span>
      </button>

      <LogoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default LogoutButton; 