'use client';
import React from 'react';
import Image from 'next/image';
// import { useAuth } from '@/lib/utils/AuthContext';
import { CgProfile } from "react-icons/cg";


interface LanguageToggleProps {
  onClick: () => void;
  isKyrgyz: boolean;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ onClick, isKyrgyz }) => (
  <button 
    onClick={onClick}
    className="px-3 py-1.5 rounded-full bg-green-50 hover:bg-green-100 
    transition-all duration-300 text-green-700 font-medium text-sm"
  >
    {isKyrgyz ? 'Рус' : 'Кыр'}
  </button>
);

const Header: React.FC = () => {
  // const { isAuthenticated } = useAuth();
  const [isKyrgyz, setIsKyrgyz] = React.useState(false);

  return (
    <header className="h-16 flex items-center justify-between px-6 shadow-sm bg-white border-b border-gray-100">
      <div className="flex items-center gap-3">
        <Image 
          src="/logo.png" 
          alt="Логотип" 
          width={50} 
          height={50}
          className="rounded-full shadow-sm"
        />
        <span className="text-lg font-semibold text-gray-700">
          Ноокенский районный суд
        </span>
      </div>
      
      <div className="flex items-center gap-6">
        <LanguageToggle 
          onClick={() => setIsKyrgyz(!isKyrgyz)} 
          isKyrgyz={isKyrgyz}
        />

        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <CgProfile className="w-5 h-5 text-gray-600"/>
            <span className="text-sm font-medium text-gray-700">
              Асанов Асан Асанович
            </span>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          {/* <button
            // onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Выйти
          </button>
        )} */}
        </div>
      </div>
    </header>
  );
};

export default Header;
