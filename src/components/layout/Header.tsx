"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/utils/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { CgProfile } from "react-icons/cg";
import { HiMenu, HiOutlineLogout } from "react-icons/hi";
import Sidebar from "./Sidebar";
import { GrLanguage } from "react-icons/gr";
import { useSurveyData } from "@/lib/context/SurveyContext";
import Link from "next/link";

interface LanguageToggleProps {
  onClick: () => void;
  isKyrgyz: boolean;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({
  onClick,
  isKyrgyz,
}) => (
  <div
    className="flex gap-2 items-center justify-center px-3 py-1.5 rounded-full bg-green-50 hover:bg-green-100 
  transition-all duration-300 text-green-700 font-medium text-sm"
  >
    <GrLanguage className="w-4 h-4 text-gray-600" />
    <button onClick={onClick}>{isKyrgyz ? "Рус" : "Кыр"}</button>
  </div>
);

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isKyrgyz, setIsKyrgyz] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { courtName } = useSurveyData();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isAuthenticated || pathname === "/login") {
    return null;
  }

  return (
    <>
      <header
        className={`${
          isSticky
            ? "fixed top-0 left-0 right-0 z-40 backdrop-blur-lg bg-white/40 border-b border-gray-200 shadow-md"
            : "relative bg-white"
        } h-16 flex items-center justify-between px-6 transition-all duration-300 ${
          isSidebarOpen ? "backdrop-blur-lg" : ""
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            <HiMenu className="w-6 h-6 text-gray-600" />
          </button>

          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Логотип"
              width={45}
              height={45}
              className="rounded-full shadow-sm"
            />

            {user?.role === "Председатель 3 инстанции" ? (
              <div className="flex space-x-4  p-2 rounded-lg">
              <Link
                href="/"
                className={`px-4 py-2 rounded-md font-medium transition duration-200
                  ${
                    pathname === "/"
                      ? "bg-blue-100/40 text-blue-600"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
              >
                Общий свод
              </Link>
            
              <Link
                href="/maps/oblast/Regional-Courts"
                className={`px-4 py-2 rounded-md font-medium transition duration-200
                  ${
                    pathname === "/maps/oblast/Regional-Courts"
                      ? "bg-green-100/40 text-green-600"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                  }`}
              >
                Областные суды
              </Link>
            
              <Link
                href="/maps/rayon/District-Courts"
                className={`px-4 py-2 rounded-md font-medium transition duration-200
                  ${
                    pathname === "/maps/rayon/District-Courts"
                      ? "bg-purple-100/40 text-purple-600"
                      : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                  }`}
              >
                Районные суды
              </Link>

              <Link
                href="/maps/General"
                className={`px-4 py-2 rounded-md font-medium transition duration-200
                  ${
                    pathname === "/maps/General"
                      ? "bg-purple-100/40 text-indigo-600"
                      : "text-gray-700 hover:bg-purple-50 hover:text-indigo-600"
                  }`}
              >
                Верховный суд
              </Link>
            </div>
            
            ) : (
              <span className="text-lg font-semibold text-black uppercase">
                {user?.role === "Председатель 2 инстанции"
                  ? courtName || user.court
                  : user
                  ? user.court
                  : "Загрузка..."}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageToggle
            onClick={() => setIsKyrgyz(!isKyrgyz)}
            isKyrgyz={isKyrgyz}
          />

          <div className="flex items-center gap-3 px-4 py-2 rounded-lg ">
            <div className="flex items-center gap-2">
              <CgProfile className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {user ? `${user.first_name} ${user.last_name}` : "Загрузка..."}
              </span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg  hover:bg-red-50 
                          transition-all duration-300 text-red-700 font-medium text-sm"
            >
              <HiOutlineLogout className="w-5 h-5" />
              Выйти
            </button>
          </div>
        </div>
      </header>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        style={{ zIndex: "70" }}
        className={`fixed top-0 left-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
    </>
  );
};

export default Header;
