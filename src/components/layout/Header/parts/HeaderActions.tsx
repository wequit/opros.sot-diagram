"use client";

import { useState, useEffect, RefObject } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Download, Globe, Printer, User } from "lucide-react";
import { LogoutButton } from "@/components/Logout";
import { usePathname } from "next/navigation";

interface HeaderActionsProps {
  printMenuRef: RefObject<HTMLDivElement>;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ printMenuRef }) => {
  const { language, toggleLanguage } = useLanguage();
  const { user } = useAuth();
  const pathname = usePathname();
  const [isPrintMenuOpen, setIsPrintMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (printMenuRef.current && !printMenuRef.current.contains(event.target as Node)) {
        setIsPrintMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrint = () => {
    setIsPrintMenuOpen(false);
    const isDiagramsPage =
      pathname.includes("/Home/summary/ratings") ||
      pathname.includes("/feedback") ||
      pathname.includes("/ratings");
    if (isDiagramsPage) {
      document.body.classList.add("printing-charts");
    }
    setTimeout(() => {
      window.print();
      document.body.classList.remove("printing-charts");
    }, 100);
  };

  const handleDownloadPDF = async () => {
    try {
      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = html2pdfModule.default;
      const element = document.querySelector("main") || document.body;
      const opt = {
        margin: [10, 10],
        filename: `${document.title || "document"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as "portrait" },
      };
      html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Ошибка при создании PDF:", error);
    }
    setIsPrintMenuOpen(false);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative" ref={printMenuRef}>
        <button
          onClick={() => setIsPrintMenuOpen(!isPrintMenuOpen)}
          className="flex gap-2 items-center px-3 py-1.5 bg-gradient-to-r from-gray-100 to-blue-100 
          hover:from-gray-200 hover:to-blue-200 transition-all duration-200 cursor-pointer rounded-full"
        >
          <Printer className="w-4 h-4 text-gray-800" />
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
                <Download className="w-4 h-4" />
                {language === "ru" ? "Скачать PDF" : "PDF жүктөп алуу"}
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Printer className="w-4 h-4" />
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
        <Globe
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
          <User className="w-5 h-5 text-gray-600 CgProfile" />
          {/* <span className="text-xs sm:text-sm font-medium text-gray-700 HeaderUserName">
            {user ? `${user.first_name} ${user.last_name}` : "Загрузка..."}
          </span> */}
        </div>
        <div className="h-4 w-px bg-gray-300"></div>
        <LogoutButton />
      </div>
    </div>
  );
};

export default HeaderActions;