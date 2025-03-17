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
import logo from "../../../public/logo.png";
import { FaBuilding, FaCity, FaHome, FaMap } from "react-icons/fa";

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { courtName, language, toggleLanguage } = useSurveyData();
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            : "fixed top-0 left-0 right-0 bg-white w-full"
        } HeaderHeight h-[4.5rem] flex items-center justify-between px-6 transition-all duration-500 ${
          isSidebarOpen ? "backdrop-blur-lg" : ""
        }`}
      >
        <div className="flex items-center gap-1">
          {windowWidth < 1024 && (
            <>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <HiMenu className="w-6 h-6 text-gray-600" />
              </button>
              <Link href="/Home/summary/ratings">
                <Image
                  src={logo}
                  alt="Логотип"
                  width={40}
                  height={40}
                  className="rounded-full shadow-sm Logo_1024"
                />
              </Link>
            </>
          )}
          {windowWidth > 1024 && (
            <div className="flex items-center gap-3">
              <Link href="/Home/summary/ratings">
                <Image
                  src={logo}
                  alt="Логотип"
                  width={45}
                  height={45}
                  className="rounded-full shadow-sm"
                />
              </Link>

              {user?.role === "Председатель 3 инстанции" ? (
                <div className="flex space-x-3 p-2 rounded-xl  ">
                  <Link
                    href="/Home/summary/ratings"
                    className={`HeaderNav relative px-4 py-2 rounded-md font-semibold transition-all duration-300 
    flex items-center gap-2
    ${
      pathname === "/Home/summary/ratings" ||
      pathname === "/Home/summary/feedbacks"
        ? "text-gray-600 bg-blue-50 shadow-inner"
        : "text-gray-700 hover:text-blue-900 hover:bg-blue-50"
    }`}
                  >
                    {getTranslation("HeaderNavOne", language)}
                  </Link>

                  <Link
                    href="/Home/supreme-court/ratings"
                    className={`HeaderNav relative px-4 py-2 rounded-md font-semibold transition-all duration-300 
                   flex items-center gap-2
                   ${
                     pathname === "/Home/supreme-court/ratings" ||
                     pathname === "/Home/supreme-court/feedbacks" 
                       ? "text-blue-600 bg-blue-100 shadow-inner"
                       : "text-gray-700 hover:text-blue-900 hover:bg-blue-50"
                   }`}
                  >
                    {getTranslation("HeaderNavTwo", language)}
                  </Link>

                  <Link
                    href="/Home/second-instance"
                    className={`HeaderNav relative px-4 py-2 rounded-md font-semibold transition-all duration-300 
                   flex items-center gap-2
                   ${
                     pathname === "/Home/second-instance/regions" ||
                     pathname === "/Home/second-instance" ||
                     pathname === "/Home/second-instance/rating/" ||
                     pathname === "/Home/second-instance/feedbacks" 
                       ? "text-blue-600 bg-blue-100 shadow-inner"
                       : "text-gray-700 hover:text-blue-900 hover:bg-blue-50"
                   }`}
                  >
                    {getTranslation("HeaderNavThree", language)}
                  </Link>

                  <Link
                    href="/Home/first-instance/ratings"
                    className={`HeaderNav relative px-4 py-2 rounded-md font-semibold transition-all duration-300 
                   flex items-center gap-2
                   ${
                     pathname === "/Home/first-instance/ratings"
                       ? "text-blue-600 bg-blue-100 shadow-inner"
                       : "text-gray-700 hover:text-blue-900 hover:bg-blue-50"
                   }`}
                  >
                    {getTranslation("HeaderNavFour", language)}
                  </Link>
                </div>
              ) : (
                <span className="text-lg font-semibold text-black uppercase">
                  {user?.role === "Председатель 2 инстанции" ? "" : ""}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex gap-2 items-center px-3 py-1.5 bg-gradient-to-r from-gray-100 to-blue-100 
      hover:from-gray-200 hover:to-blue-200 transition-all duration-200 cursor-pointer rounded-full"
            onClick={toggleLanguage}
          >
            <GrLanguage
              className={`w-4 h-4 text-gray-800 transition-transform duration-300 ${
                language === "ru" ? "rotate-0" : "rotate-180"
              }`}
            />
            <span className="text-gray-800 font-medium text-xs sm:text-sm">
              {language === "ru"
                ? windowWidth < 640
                  ? "KG"
                  : "Кыргызча"
                : windowWidth < 640
                ? "RU"
                : "Русский"}
            </span>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 rounded-lg HeaderUser_Exit">
            <div className="flex items-center gap-2 HeaderUser">
              <CgProfile className="w-5 h-5 text-gray-600 CgProfile" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 HeaderUserName">
                {user ? `${user.first_name} ${user.last_name}` : "Загрузка..."}
              </span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <LogoutButton />
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
        className={`SideBarWindow fixed top-0 left-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
    </>
  );
};

export default Header;
