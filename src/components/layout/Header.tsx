"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { CgProfile } from "react-icons/cg";
import { HiMenu } from "react-icons/hi";
import Sidebar from "./Sidebar";
import { GrLanguage } from "react-icons/gr";
import { getTranslation, useSurveyData } from "@/context/SurveyContext";
import Link from "next/link";
import { LogoutButton } from "@/components/Logout";
import logo from '../../../public/logo.png';

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { courtName, language, toggleLanguage} = useSurveyData();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isAuthenticated || pathname === "/results/login") {
    return null;
  }

  return (
    <>
      <header
        className={`${isSticky
            ? "fixed top-0 left-0 right-0 z-40 backdrop-blur-lg bg-white/40 border-b border-gray-200 shadow-md"
            : "fixed top-0 left-0 right-0 bg-white w-full"
          } h-16 flex items-center justify-between px-6 transition-all duration-500 ${isSidebarOpen ? "backdrop-blur-lg" : ""
          }`}
      >
        <div className="flex items-center gap-4">
          {/* <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            <HiMenu className="w-6 h-6 text-gray-600" />
          </button> */}

          <div className="flex items-center gap-3">
            <Link href="/results">
              <Image
                src={logo}
                alt="Логотип"
                width={45}
                height={45}
                className="rounded-full shadow-sm"
              />
            </Link>

            {user?.role === "Председатель 3 инстанции" ? (
              <div className="flex space-x-4  p-2 rounded-lg">
                <Link
                  href="/results"
                  className={`px-4 py-2 rounded-md font-semibold transition duration-200 text-teal-900
                  ${
                    pathname === "/"
                      ? "bg-slate-200 text-blue-500"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {getTranslation("HeaderNavOne", language)}
                </Link>

                <Link
                  href="/results/maps/General"
                  className={`px-4 py-2 rounded-md font-semibold transition duration-200 text-teal-900
                  ${
                    pathname === "/maps/General"
                      ? "bg-slate-200 text-blue-500"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                   {getTranslation("HeaderNavTwo", language)}
                </Link>

                <Link
                  href="/results/maps/oblast/Regional-Courts"
                  className={`px-4 py-2 rounded-md font-semibold transition duration-200 text-teal-900
                  ${
                    pathname === "/results/maps/oblast/Regional-Courts"
                      ? "bg-slate-200 text-blue-500"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                   {getTranslation("HeaderNavThree", language)}
                </Link>

                <Link
                  href="/results/maps/rayon/District-Courts"
                  className={`px-4 py-2 rounded-md font-semibold transition duration-200 text-teal-900
                  ${
                    pathname === "/maps/rayon/District-Courts"
                      ? "bg-slate-200 text-blue-500"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {getTranslation("HeaderNavFour", language)}
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
          <div
            className="flex gap-2 items-center px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 
              transition-all duration-200 cursor-pointer"
            onClick={toggleLanguage}
          >
            <GrLanguage className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 font-medium text-sm">
              {language === "ru" ? "Кыргызча" : "Русский"}
            </span>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 rounded-lg ">
            <div className="flex items-center gap-2">
              <CgProfile className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {user ? `${user.first_name} ${user.last_name}` : "Загрузка..."}
              </span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <LogoutButton/>
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
        className={`fixed top-0 left-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
    </>
  );
};

export default Header;
