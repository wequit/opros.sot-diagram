"use client";

import { getCookie, getCurrentUser } from "@/lib/api/login";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSurveyData } from "@/context/SurveyContext";

export interface Remark {
  id: number;
  custom_answer: string | null;
  reply_to_comment: string | null;
  comment_created_at: string;
  author?: string;
  question_id?: number;
  court: string;
}

export interface AddCommentParams {
  question_response: number;
  reply_to_comment: string;
}

export function useRemarks() {
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter(); 
  const { selectedCourt, courtName, selectedCourtName, selectedCourtId,  } =
    useSurveyData();

  const filterRemarks = (
    remarks: Remark[],
    user: any,
    pathname: string,
    selectedCourtName: string | null,
    courtId: number | null,
    selectedCourtId: number | null
  ): Remark[] => {

    
    // Дополнительная проверка для страниц региона, чтобы показать ВСЕ замечания
    if (pathname.includes("/first_instance/feedbacks/") && localStorage.getItem("viewMode") === "region") {
      const currentRegion = localStorage.getItem("currentRegion");
      
      // Показать все замечания кроме "Необязательный вопрос"
      const filtered = remarks.filter((item: Remark) => 
        item.custom_answer !== null && 
        item.custom_answer !== "Необязательный вопрос" &&
        isCourtInRegion(item.court, currentRegion)
      );
      
      
      
      return filtered;
    }
    
    const storedCourtName = localStorage.getItem("selectedCourtName");
    const courtNameId = localStorage.getItem("courtNameId");
    const courtNAME = localStorage.getItem("courtName");
    const setCourtName = localStorage.getItem("courtName2");
    
    return remarks.filter((item: Remark) => {
      if (
        user.role === "Председатель 3 инстанции" &&
        (pathname === "/Home/summary/ratings" || pathname === "/Home/summary/feedbacks")
      ) {
        return (
          item.custom_answer !== null &&
          item.custom_answer !== "Необязательный вопрос"
        );
      }

      if (user.role === "Председатель 3 инстанции") {
        if (pathname === "/Home/supreme-court/ratings" || pathname === "/Home/supreme-court/feedbacks") {
          return (
            item.court === "Верховный суд" &&
            item.custom_answer !== null &&
            item.custom_answer !== "Необязательный вопрос"
          );
        } else if (pathname === `/Home/second-instance/regions`) {
            return (
              item.custom_answer !== null &&
              item.custom_answer !== "Необязательный вопрос" &&
              item.court === storedCourtName
            );
          return false;
        }else if (pathname === `/Home/second-instance/feedbacks/${courtId}`) {
          return (
            item.custom_answer !== null &&
            item.custom_answer !== "Необязательный вопрос" &&
            item.court === storedCourtName
          );
        }

        else if (pathname === `/Home/first-instance/${courtNameId}`) {
          if (courtName && courtName === item.court) {
            return (
              item.custom_answer !== null &&
              item.custom_answer !== "Необязательный вопрос"
            );
          }
          return false;
        }else if (pathname === `/Home/first-instance/feedbacks/${courtNameId}`) {
          return (
            item.custom_answer !== null &&
            item.custom_answer !== "Необязательный вопрос" &&
            item.court === courtNAME
          );
        }
      }

      if (
        user.role === "Председатель 2 инстанции" &&
        pathname.startsWith("/Home/first_instance/feedbacks/")
      ) {
        const currentRegion = localStorage.getItem("currentRegion");
        const regionSlug = localStorage.getItem("regionSlug");
        
        if (pathname.includes(regionSlug || '')) {
          return (
            item.custom_answer !== null &&
            item.custom_answer !== "Необязательный вопрос" &&
            isCourtInRegion(item.court, currentRegion)
          );
        }
      }

      return (
        item.custom_answer !== null &&
        item.custom_answer !== "Необязательный вопрос"
      );
    });
  };

  const fetchRemarks = async () => {
    const storedCourtId = localStorage.getItem("selectedCourtId");
    const courtId = storedCourtId ? parseInt(storedCourtId, 10) : null;
  
  
    try {
      setIsLoading(true);
      const token = getCookie("access_token");
  
      const user = await getCurrentUser();
  
      const response = await fetch("https://opros.sot.kg/api/v1/comments/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        // Проверяем, истёк ли токен (401 Unauthorized)
        if (response.status === 401) {
          console.warn("Токен устарел, перенаправляем на /login");
          router.push("/login"); // Перенаправляем на страницу логина
          return; // Прерываем выполнение функции
        }
  
        const errorData = await response.json();
        throw new Error(errorData.detail || "Ошибка при получении данных");
      }
  
      const data = await response.json();
  
      const filteredData = filterRemarks(
        data,
        user,
        pathname,
        selectedCourtName,
        courtId,
        selectedCourtId
      ).map((item: Remark) => ({
        id: item.id,
        custom_answer: item.custom_answer,
        reply_to_comment: item.reply_to_comment,
        comment_created_at: item.comment_created_at,
        author: item.author,
        question_id: item.question_id,
        court: item.court,
      }));
  
      setRemarks(filteredData);
    } catch (err) {
      console.error("Ошибка при получении данных:", err);
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRemarks();
  }, [selectedCourt, courtName, selectedCourtName, selectedCourtId]);

  return { remarks, isLoading, error, fetchRemarks };
}

function isCourtInRegion(courtName: string, regionName: string | null) {
  if (!regionName) return false;
  
  // Карта судов по регионам
  const courtsInRegions: Record<string, string[]> = {
    "Иссык-Кульская область": [
      "Иссык-кульский областной суд",
      "Каракольский городской суд",
      "Жети-Огузский районный суд",
      "Ак-Суйский районный суд", 
      "Балыкчинский городской суд",
      "Тонский районный суд",
      "Тюпский районный суд",
      "Иссык-Кульский районный суд"
    ],
    "Таласская область": [
      "Таласский областной суд",
      "Таласский городской суд",
      "Таласский районный суд",
      "Бакай-Атинский районный суд",
      "Кара-Бууринский районный суд",
      "Манасский районный суд"
    ],
    "Нарынская область": [
      "Нарынский областной суд",
      "Нарынский городской суд",
      "Нарынский районный суд",
      "Ак-Талинский районный суд",
      "Ат-Башинский районный суд",
      "Жумгальский районный суд",
      "Кочкорский районный суд"
    ],
    "Баткенская область": [
      "Баткенский областной суд",
      "Баткенский районный суд",
      "Кадамжайский районный суд",
      "Лейлекский районный суд",
      "Сулюктинский городской суд",
      "Кызыл-Кийский городской суд"
    ],
    "Чуйская область": [
      "Чуйский областной суд",
      "Токмакский городской суд",
      "Аламудунский районный суд",
      "Московский районный суд",
      "Жайылский районный суд",
      "Ысык-Атинский районный суд",
      "Кеминский районный суд",
      "Панфиловский районный суд",
      "Сокулукский районный суд",
      "Чуйский районный суд"
    ],
    "Ошская область": [
      "Ошский областной суд",
      "Алайский районный суд",
      "Араванский районный суд",
      "Кара-Кулджинский районный суд",
      "Кара-Сууский районный суд",
      "Ноокатский районный суд",
      "Узгенский районный суд",
      "Чон-Алайский районный суд"
    ],
    "Жалал-Абадская область": [
      "Жалал-Абадский областной суд",
      "Джалал-Абадский городской суд",
      "Сузакский районный суд",
      "Ноокенский районный суд",
      "Базар-Коргонский районный суд",
      "Аксыйский районный суд",
      "Ала-Букинский районный суд",
      "Токтогульский районный суд",
      "Чаткальский районный суд",
      "Тогуз-Тороуский районный суд"
    ],
    "город Бишкек": [
      "Бишкекский городской суд",
      "Ленинский районный суд города Бишкек",
      "Октябрьский районный суд города Бишкек",
      "Первомайский районный суд города Бишкек",
      "Свердловский районный суд города Бишкек"
    ]
  };
  
  // Проверяем точное вхождение в список судов региона
  if (courtsInRegions[regionName]) {
    return courtsInRegions[regionName].some(courtNameInRegion => 
      courtName === courtNameInRegion || 
      courtName.includes(courtNameInRegion) || 
      courtNameInRegion.includes(courtName)
    );
  }
  
  // Резервный метод (старый) - используем только если нет точного совпадения
  switch (regionName) {
    case "Таласская область":
      return courtName.includes("Талас");
    case "Иссык-Кульская область":
      return courtName.includes("Иссык") || courtName.includes("Каракол") || 
             courtName.includes("Жети-Огуз") || courtName.includes("Ак-Суй") || 
             courtName.includes("Балыкчи") || courtName.includes("Тон") || 
             courtName.includes("Тюп");
    case "Нарынская область":
      return courtName.includes("Нарын");
    case "Баткенская область":
      return courtName.includes("Баткен") || courtName.includes("Кадамжай") || 
             courtName.includes("Лейлек") || courtName.includes("Сулюкт") || 
             courtName.includes("Кызыл-Кия");
    case "Чуйская область":
      return courtName.includes("Чуй") || courtName.includes("Токмак") || 
             courtName.includes("Аламудун") || courtName.includes("Московск") || 
             courtName.includes("Жайыл") || courtName.includes("Ысык-Ат") || 
             courtName.includes("Кемин") || courtName.includes("Панфилов") || 
             courtName.includes("Сокулук");
    case "Ошская область":
      return (courtName.includes("Ош") && !courtName.includes("город Ош")) || 
             courtName.includes("Алай") || courtName.includes("Араван") || 
             courtName.includes("Кара-Кулдж") || courtName.includes("Кара-Суу") || 
             courtName.includes("Ноокат") || courtName.includes("Узген") || 
             courtName.includes("Чон-Алай");
    case "Жалал-Абадская область":
      return courtName.includes("Жалал") || courtName.includes("Джалал") || 
             courtName.includes("Сузак") || courtName.includes("Ноокен") || 
             courtName.includes("Базар-Коргон") || courtName.includes("Аксы") || 
             courtName.includes("Ала-Бук") || courtName.includes("Токтогул") || 
             courtName.includes("Чаткал") || courtName.includes("Тогуз-Тороу");
    case "город Бишкек":
      return courtName.includes("Бишкек") || courtName.includes("Ленинский") || 
             courtName.includes("Октябрьский") || courtName.includes("Первомайский") || 
             courtName.includes("Свердловский");
    default:
      return false;
  }
}
