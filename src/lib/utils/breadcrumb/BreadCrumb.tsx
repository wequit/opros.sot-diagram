"use client";

import React from "react";
import Link from "next/link"; 
import { ChevronRight } from "lucide-react";
import { getTranslation, useSurveyData } from "@/context/SurveyContext";
import { useAuth } from "@/context/AuthContext";

interface BreadcrumbProps {
  regionName?: string | null;
  courtName?: string | null;
  onCourtBackClick?: () => void;
  onRegionBackClick?: () => void; 
  showHome?: boolean; 
  headerKey?: "BreadCrumb_RegionName" | "HeaderNavFour" | "BreadCrumb_CourtName"; 
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  regionName,
  courtName,
  onCourtBackClick,
  onRegionBackClick,
  showHome = true, 
  headerKey = "BreadCrumb_RegionName", 
}) => {
  const { language } = useSurveyData();
    const { user } = useAuth();

    const effectiveHeaderKey =
    headerKey === "BreadCrumb_CourtName"
      ? "BreadCrumb_CourtName"
      : headerKey || (regionName ? "BreadCrumb_RegionName" : "HeaderNavFour");


  return (
    <nav
      className="flex items-center space-x-2 text-sm text-gray-600 "
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2 BreadCrumbText">
        {/* Фиксированная "Главная" с href="/" */}
        {user?.role !== "Председатель 2 инстанции" ? (
        <li className="flex items-center">
          <Link
            href="/Home/summary/ratings"
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            {getTranslation("Regional_Courts_Breadcrumbs_Main", language)}
          </Link>
          {(showHome || regionName || courtName) && (
            <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
          )}
        </li>) : '' }
        

        {/* Вторая "Главная" (HeaderNavThree или HeaderNavFour) - отображается только если showHome === true */}
        {showHome && (
          <li className="flex items-center">
            <button
              onClick={onRegionBackClick}
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed"
              disabled={!onRegionBackClick}
            >
              {getTranslation(effectiveHeaderKey, language)}
            </button>
            {(regionName || courtName) && (
              <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
            )}
          </li>
        )}

        {/* Название региона */}
        {regionName && (
          <li className="flex items-center">
            {onCourtBackClick ? (
              <button
                onClick={onCourtBackClick}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {regionName}
              </button>
            ) : (
              <span className="text-gray-800 font-medium">{regionName}</span>
            )}
            {courtName && (
              <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
            )}
          </li>
        )}

        {/* Название суда */}
        {courtName && (
          <li className="flex items-center">
            <span className="text-gray-800 font-medium truncate max-w-[15ch]">
              {courtName}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
