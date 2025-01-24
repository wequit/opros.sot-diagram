import React from 'react';
import Link from 'next/link';
import { MdAssessment, MdFeedback } from 'react-icons/md';
import { usePathname } from 'next/navigation';

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const isActivePath = (path: string) => pathname === path;

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 py-6 px-4">
      <nav className="flex flex-col gap-2">
        <Link 
          href="/" 
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
            ${isActivePath('/') 
              ? 'bg-green-50 text-green-700 font-medium shadow-sm' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }
          `}
        >
          <MdAssessment className="w-6 h-6" />
          <span className="text-sm">Оценки</span>
        </Link>

        <Link 
          href="/Remarks" 
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
            ${isActivePath('/Remarks') 
              ? 'bg-green-50 text-green-700 font-medium shadow-sm' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }
          `}
        >
          <MdFeedback className="w-7 h-7" />
          <span className="text-sm">Замечания и предложения</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar; 