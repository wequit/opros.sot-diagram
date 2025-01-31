"use client";
import React from 'react';
import Link from 'next/link';
import { MdAssessment, MdFeedback, MdClose, MdMap } from 'react-icons/md';
import { useAuth } from "@/lib/utils/AuthContext";
import { usePathname } from "next/navigation";

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();

  // Не показываем сайдбар на странице логина
  if (!isAuthenticated || pathname === '/login') {
    return null;
  }

  const isActivePath = (path: string) => pathname === path;

  return (
    <div className="h-full flex flex-col ">
      {/* Шапка сайдбара */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Меню</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
        >
          <MdClose className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Навигация */}
      <nav className="flex flex-col p-4 space-y-2">
        <Link 
          href="/" 
          onClick={onClose}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
            ${isActivePath('/') 
              ? 'bg-green-50 text-green-700 font-medium shadow-sm' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }
          `}
        >
          <MdAssessment className="w-6 h-6" />
          <span>Оценки по судам</span>
        </Link>

        <Link 
          href="/Remarks" 
          onClick={onClose}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
            ${isActivePath('/Remarks') 
              ? 'bg-green-50 text-green-700 font-medium shadow-sm' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }
          `}
        >
          <MdFeedback className="w-6 h-6" />
          <span>Замечания и предложения</span>
        </Link>

        {user?.role !== "Председатель 2 инстанции" && user?.role !== "Председатель 1 инстанции" ? (
          <>
          <Link 
          href="/maps/oblast" 
          onClick={onClose}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
            ${isActivePath('/maps/oblast') 
              ? 'bg-green-50 text-green-700 font-medium shadow-sm' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }
          `}
        >
        <MdMap className="w-6 h-6" />
          <span>Оценка по областям</span>
        </Link>

        <Link 
          href="/maps/rayon" 
          onClick={onClose}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
            ${isActivePath('/maps/rayon') 
              ? 'bg-green-50 text-green-700 font-medium shadow-sm' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }
          `}
        >
          <MdMap className="w-6 h-6" />
          <span>Оценка по судам</span>
        </Link>
        </>
        ): (
          ''
        )}
      </nav>
    </div>
  );
} 