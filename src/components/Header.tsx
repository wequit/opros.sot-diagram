// src/components/Header.tsx
import React from 'react';
import Image from 'next/image';

const Header: React.FC = () => {
  return (
    <header className="h-12 flex items-center px-4" style={{ backgroundColor: '#AFF4C6' }}>
      <Image src="/logo.png" alt="Лого" width={40} height={40} />
      <span className="ml-auto text-black">Кыр/Рус</span>
      <span className="ml-auto text-black">Председатель районного суда: Асанов Асан Асанович</span>
    </header>
  );
};

export default Header;
