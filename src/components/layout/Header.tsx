'use client';
import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/utils/AuthContext';

const HEADER_BG_COLOR = '#AFF4C6';

interface LanguageToggleProps {
  onClick: () => void;
  isKyrgyz: boolean;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ onClick, isKyrgyz }) => (
  <button 
    onClick={onClick}
    className="px-2 py-1 rounded hover:bg-green-200 transition-colors"
  >
    {isKyrgyz ? 'Рус' : 'Кыр'}
  </button>
);

const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isKyrgyz, setIsKyrgyz] = React.useState(false);

  return (
    <header className="h-12 flex items-center justify-between px-4 shadow-sm" style={{ backgroundColor: HEADER_BG_COLOR }}>
      <div className="flex items-center gap-2">
        <Image 
          src="/logo.png" 
          alt="Логотип" 
          width={40} 
          height={40}
          className="rounded-full"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <LanguageToggle 
          onClick={() => setIsKyrgyz(!isKyrgyz)} 
          isKyrgyz={isKyrgyz}
        />
        <span className="text-black font-medium">
          Председатель районного суда: Асанов Асан Асанович
        </span>
        {isAuthenticated && (
          <button
            // onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Выйти
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
