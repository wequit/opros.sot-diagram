"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/utils/AuthContext";
import { usePathname } from "next/navigation";
import { CgProfile } from "react-icons/cg";
import { HiMenuAlt2 } from "react-icons/hi";
import Sidebar from "./Sidebar";

interface LanguageToggleProps {
  onClick: () => void;
  isKyrgyz: boolean;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({
  onClick,
  isKyrgyz,
}) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 rounded-full bg-green-50 hover:bg-green-100 
    transition-all duration-300 text-green-700 font-medium text-sm"
  >
    {isKyrgyz ? "Рус" : "Кыр"}
  </button>
);

const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [isKyrgyz, setIsKyrgyz] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0); // Если страница прокручена вниз, включаем sticky
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Не показываем хедер на странице логина
  if (!isAuthenticated || pathname === "/login") {
    return null;
  }

  return (
    <>
      <header
        className={`${
          isSticky
            ? "fixed top-0 left-0 right-0 z-40 backdrop-blur-lg bg-white/40 border-b border-gray-200 shadow-md"
            : "relative bg-slate-100"
        } h-16 flex items-center justify-between px-6 transition-all duration-300`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            <HiMenuAlt2 className="w-6 h-6 text-gray-600" />
          </button>
          
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Логотип"
              width={50}
              height={50}
              className="rounded-full shadow-sm"
            />
            <span className="text-lg font-semibold text-black uppercase">
              Ноокенский районный суд
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <LanguageToggle
            onClick={() => setIsKyrgyz(!isKyrgyz)}
            isKyrgyz={isKyrgyz}
          />

          <div
            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50/70 
                          shadow-sm backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <CgProfile className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Асанов Асан Асанович
              </span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
          </div>
        </div>
      </header>

      {/* Оверлей для затемнения фона */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Боковое меню */}
      <div
        className={`fixed top-0 left-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
    </>
  );
};

export default Header;
