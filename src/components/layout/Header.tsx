"use client";
import React, { useState, useEffect, useRef } from "react";
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
import { FaBuilding, FaCity, FaHome, FaMap, FaPrint } from "react-icons/fa";
import { BiDownload } from "react-icons/bi";

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { courtName, language, toggleLanguage } = useSurveyData();
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [isPrintMenuOpen, setIsPrintMenuOpen] = useState(false);
  const printMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (printMenuRef.current && !printMenuRef.current.contains(event.target as Node)) {
        setIsPrintMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isAuthenticated || pathname === "/login") {
    return null; 
  }

  const getRegionalCourtName = (userCourt: string): string => {
    const courtMap: { [key: string]: string } = {
      "Таласский областной суд": "Таласский областной суд",
      "Иссык-кульский областной суд": "Иссык-кульский областной суд",
      "Нарынский областной суд": "Нарынский областной суд",
      "Баткенский областной суд": "Баткенский областной суд",
      "Чуйский областной суд": "Чуйский областной суд",
      "Ошский областной суд": "Ошский областной суд",
      "Жалал-Абадский областной суд": "Жалал-Абадский областной суд",
      "Бишкекский городской суд": "Бишкекский городской суд ",
    };
    return courtMap[userCourt] || "";
  };

  const getRegionSlug = (courtName: string): string => {
    const regionMap: { [key: string]: string } = {
      "Таласский областной суд": "Talas",
      "Иссык-кульский областной суд": "Issyk-Kyl", 
      "Нарынский областной суд": "Naryn",
      "Баткенский областной суд": "Batken",
      "Чуйский областной суд": "Chyi",
      "Ошский областной суд": "Osh",
      "Жалал-Абадский областной суд": "Djalal-Abad",
      "Бишкекский городской суд": "Bishkek",
    };

    return regionMap[courtName] || "court-id";
  };

  const renderSecondInstanceNav = () => {
    if (user?.role !== "Председатель 2 инстанции") return null;

    const regionalCourt = getRegionalCourtName(user.court);
    
    return (
      <div className="flex space-x-3 p-2 rounded-xl">
        <Link
          href="/Home/summary2/ratings"
          className={`HeaderNav relative px-4 py-2 rounded-md font-semibold transition-all duration-300 
          flex items-center gap-2
          ${
            pathname === "/Home/summary2/ratings"
              ? "text-blue-600 bg-blue-100 shadow-inner"
              : "text-gray-700 hover:text-blue-900 hover:bg-blue-50"
          }`}
        >
          {getTranslation("HeaderNavOne", language)}
        </Link>

        <Link
          href="/Home/first_instance/ratings"
          className={`HeaderNav relative px-4 py-2 rounded-md font-semibold transition-all duration-300 
          flex items-center gap-2
          ${
            pathname === "/Home/first_instance/ratings"
              ? "text-blue-600 bg-blue-100 shadow-inner"
              : "text-gray-700 hover:text-blue-900 hover:bg-blue-50"
          }`}
        >
          {getTranslation("HeaderNavRegionalRatings", language)}
        </Link>

        <Link
          href={`/Home/${getRegionSlug(regionalCourt)}/ratings`}
          className={`HeaderNav relative px-4 py-2 rounded-md font-semibold transition-all duration-300 
          flex items-center gap-2
          ${
            pathname.includes(`/Home/${getRegionSlug(regionalCourt)}/ratings`) ||
            pathname.includes(`/Home/${getRegionSlug(regionalCourt)}/feedbacks`)
              ? "text-blue-600 bg-blue-100 shadow-inner"
              : "text-gray-700 hover:text-blue-900 hover:bg-blue-50"
          }`}
        >
          {regionalCourt}
        </Link>
      </div>
    );
  };

  const logoLink = () => {
    if (user?.role === "Председатель 2 инстанции") {
      return "/Home/first_instance/ratings";
    } else {
      return "/Home/summary/ratings";
    }
  };

  const handlePrint = () => {
    setIsPrintMenuOpen(false);
    
    // Проверяем, находимся ли мы на странице с диаграммами
    const isDiagramsPage = pathname.includes('/Home/summary/ratings') || 
      pathname.includes('/feedback') || 
      pathname.includes('/ratings');
    
    if (isDiagramsPage) {
      // Добавляем класс для страниц с диаграммами
      document.body.classList.add('printing-charts');
    }
    
    setTimeout(() => {
      window.print();
      
      // Удаляем класс после печати
      setTimeout(() => {
        document.body.classList.remove('printing-charts');
      }, 500);
    }, 100);
  };

  const handleDownloadPDF = async () => {
    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;
      
      const element = document.querySelector('main') || document.body;
      
      const opt = {
        margin: [10, 10],
        filename: `${document.title || 'document'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as 'portrait' }
      };
      
      html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
    }
    
    setIsPrintMenuOpen(false);
  };

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
              <Link href={logoLink()} className="flex items-center">
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
              <Link href={logoLink()} className="flex items-center">
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
                   pathname.startsWith("/Home/second-instance") || pathname === "/results/Home/second-instance"
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
                       pathname.startsWith("/Home/first-instance") || pathname === "/results/Home/first-instance"
                       ? "text-blue-600 bg-blue-100 shadow-inner"
                       : "text-gray-700 hover:text-blue-900 hover:bg-blue-50"
                   }`}
                  >
                    {getTranslation("HeaderNavFour", language)}
                  </Link>
                </div>
              ) : (
                renderSecondInstanceNav()
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={printMenuRef}>
            <button
              onClick={() => setIsPrintMenuOpen(!isPrintMenuOpen)}
              className="flex gap-2 items-center px-3 py-1.5 bg-gradient-to-r from-gray-100 to-blue-100 
              hover:from-gray-200 hover:to-blue-200 transition-all duration-200 cursor-pointer rounded-full"
            >
              <FaPrint className="w-4 h-4 text-gray-800" />
              <span className="text-gray-800 font-medium text-xs sm:text-sm hidden sm:inline">
                {language === "ru" ? "Печать" : "Басып чыгаруу"}
              </span>
            </button>
            
            {isPrintMenuOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-[999] border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <BiDownload className="w-4 h-4" />
                    {language === "ru" ? "Скачать PDF" : "PDF жүктөп алуу"}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FaPrint className="w-4 h-4" />
                    {language === "ru" ? "Распечатать" : "Басып чыгаруу"}
                  </button>
                </div>
              </div>
            )}
          </div>

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
