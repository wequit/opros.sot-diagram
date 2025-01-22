import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-56 bg-green-50 p-4 shadow-sm">
      <nav className="flex flex-col gap-2">
        <Link 
          href="/" 
          className="py-2 px-4 text-left bg-white rounded-md mb-2 hover:bg-gray-50 transition-colors duration-200 font-medium"
        >
          Оценки
        </Link>
        <Link 
          href="/suggestions" 
          className="py-2 px-4 text-left bg-white rounded-md mb-2 hover:bg-gray-50 transition-colors duration-200 font-medium"
        >
          Замечания и предложения
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar; 