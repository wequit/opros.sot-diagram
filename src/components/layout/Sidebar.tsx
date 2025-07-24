"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from '../../../public/logo.webp'
import { useLanguage } from "@/context/LanguageContext";
import courtData from '../../../public/courtIds.json';

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const { getTranslation } = useLanguage();

  const isActivePath = (path: string) => pathname.startsWith(path) 

  const getCourtSlug = (courtName: string): string => {
    const court = courtData.courts.find((item: any) => item.court === courtName);
    return court ? court.slug : "court-id";
  };
  const userCourt = user?.court || null;

  return (
    <div className="h-full flex flex-col ">
      <div className="p-4 border-b flex justify-between items-center">
        <Image
          src={logo}
          alt="Логотип"
          width={40}
          height={40}
          className="rounded-full shadow-sm Logo_1024"
        />
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
        >
        </button>
      </div>

      <nav className="flex flex-col p-4 space-y-2">
        {user?.role === "Председатель 2 инстанции" ? (
          <>
            <Link
              href="/Home/summary2/ratings"
              onClick={onClose}
              className={
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ` +
                (isActivePath("/Home/summary2/")
                  ? "bg-green-50 text-green-700 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")
              }
            >
              <span>{getTranslation("HeaderNavOne")}</span>
            </Link>
            <Link
              href="/Home/first_instance/ratings"
              onClick={onClose}
              className={
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ` +
                (isActivePath("/Home/first_instance/")
                  ? "bg-green-50 text-green-700 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")
              }
            >
              <span>{getTranslation("HeaderNavRegionalRatings")}</span>
            </Link>
            {userCourt && (
              <Link
                href={`/Home/${getCourtSlug(userCourt)}/ratings2`}
                onClick={onClose}
                className={
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ` +
                  (isActivePath(`/Home/${getCourtSlug(userCourt)}/ratings2`)
                    ? "bg-green-50 text-green-700 font-medium shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")
                }
              >
                <span>{userCourt}</span>
              </Link>
            )}
          </>
        ) : user?.role !== "Председатель 1 инстанции" ? (
          <>
            <Link
              href="/Home/supreme-court/ratings"
              onClick={onClose}
              className={`
            flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
            ${
              isActivePath("/Home/supreme-court")
                ? "bg-green-50 text-green-700 font-medium shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }
          `}
            >
              <span>{getTranslation("HeaderNavTwo")}</span>
            </Link>

            <Link
              href="/Home/second-instance/"
              onClick={onClose}
              className={`
            flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
            ${
              isActivePath("/Home/second-instance")
                ? "bg-green-50 text-green-700 font-medium shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }
          `}
            >
              <span>{getTranslation("HeaderNavThree")}</span>
            </Link>


            <Link
              href="/Home/first-instance/ratings"
              onClick={onClose}
              className={`
            flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
            ${
              isActivePath("/Home/first-instance/")
                ? "bg-green-50 text-green-700 font-medium shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }
          `}
            >
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
