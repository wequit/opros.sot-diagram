"use client";
import React from "react";
import Link from "next/link";
import { MdAssessment, MdFeedback, MdClose, MdMap } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from '../../../public/logo.webp'
import { useLanguage } from "@/context/LanguageContext";

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const { getTranslation } = useLanguage();

  if (!isAuthenticated || pathname === "/login") {
    return null;
  }

  const isActivePath = (path: string) => pathname === path;

  return (
    <div className="h-full flex flex-col ">
      {/* Шапка сайдбара */}
      <div className="p-4 border-b flex justify-between items-center">
        <Image
          src={logo}
          alt="Логотип"
          width={45}
          height={45}
          className="rounded-full shadow-sm"
        />
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
            ${
              isActivePath("/")
                ? "bg-green-50 text-green-700 font-medium shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }
          `}
        >
          <MdAssessment className="w-6 h-6" />
          <span>
            {user?.role === "Председатель 3 инстанции"
              ? getTranslation("HeaderNavOne")
              : "Оценки по судам"}
          </span>
        </Link>

        {user?.role !== "Председатель 2 инстанции" &&
        user?.role !== "Председатель 1 инстанции" ? (
          <>
            <Link
              href="/maps/General"
              onClick={onClose}
              className={`
            flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
            ${
              isActivePath("/maps/General")
                ? "bg-green-50 text-green-700 font-medium shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }
          `}
            >
              <MdMap className="w-6 h-6" />
              <span>{getTranslation("HeaderNavTwo")}</span>
            </Link>

            <Link
              href="/Home/second-instance/regions"
              onClick={onClose}
              className={`
            flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
            ${
              isActivePath("/Home/second-instance/regions")
                ? "bg-green-50 text-green-700 font-medium shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }
          `}
            >
              <MdMap className="w-6 h-6 " />
              <span>{getTranslation("HeaderNavThree")}</span>
            </Link>


            <Link
              href="/Home/first-instance/ratings"
              onClick={onClose}
              className={`
            flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
            ${
              isActivePath("/Home/first-instance/ratings")
                ? "bg-green-50 text-green-700 font-medium shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }
          `}
            >
              <MdMap className="w-6 h-6" />
              <span>{getTranslation("HeaderNavFour")}</span>
            </Link>
            
          </>
        ) : (
          ""
        )}
      </nav>
    </div>
  );
}
