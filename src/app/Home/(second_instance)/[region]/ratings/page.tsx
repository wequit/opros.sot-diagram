"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";
import { getCurrentUser } from "@/lib/api/login";
import CourtApi from "@/lib/api/CourtAPI";
import courtIdsData from "../../../../../../public/courtIds.json";

const RegionalCourtPage = () => {
  const params = useParams();
  const region = params?.region as string; // Это slug региона, например, "Djalal-Abad"
  const courtId = params?.courtId as string; // Это ID суда, например, "19"
  const router = useRouter();

  const [courtName, setCourtName] = useState<string>("");
  const [userRegion, setUserRegion] = useState<string | null>(null);
  const [userCourt, setUserCourt] = useState<string | null>(null);
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);

  // Функция для получения названия суда по slug региона
  const getCourtNameFromSlug = (slug: string): string => {
    const regionMap: { [key: string]: string } = {
      Talas: "Таласский областной суд",
      "Issyk-Kyl": "Иссык-кульский областной суд",
      Naryn: "Нарынский областной суд",
      Batken: "Баткенский областной суд",
      Chyi: "Чуйский областной суд",
      Osh: "Ошский областной суд",
      "Djalal-Abad": "Жалал-Абадский областной суд",
      Bishkek: "Бишкекский городской суд",
    };
    return regionMap[slug] || "";
  };

  // Функция для получения названия региона по названию суда
  const getRegionFromCourt = (court: string): string => {
    const regionMap: { [key: string]: string } = {
      "Таласский областной суд": "Таласская область",
      "Иссык-кульский областной суд": "Иссык-Кульская область",
      "Нарынский областной суд": "Нарынская область",
      "Баткенский областной суд": "Баткенская область",
      "Чуйский областной суд": "Чуйская область",
      "Ошский областной суд": "Ошская область",
      "Жалал-Абадский областной суд": "Жалал-Абадская область",
      "Бишкекский городской суд": "Город Бишкек",
    };
    return regionMap[court] || "Оценки по области";
  };

  // Получаем данные пользователя и сравниваем суды
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        const userCourtFromApi = userData.court || null;
        setUserCourt(userCourtFromApi);

        // Получаем название суда из slug региона
        const courtFromSlug = getCourtNameFromSlug(region);

        // Находим суд по courtId в courtIds.json
        const courtFromJson = courtIdsData.courts.find(
          (c: { court_id: number }) => c.court_id.toString() === courtId
        );

        if (courtFromJson) {
          const courtFromId = courtFromJson.court; // Название суда из JSON

          // Проверяем, совпадает ли суд из slug с судом из courtId
          if (courtFromSlug === courtFromId) {
            setCourtName(courtFromId); // Устанавливаем название суда
            setUserRegion(getRegionFromCourt(courtFromId)); // Устанавливаем регион

            // Сравниваем userCourt из getCurrentUser с судом
            if (userCourtFromApi === courtFromId && userData.role === "Председатель 2 инстанции") {
              setSelectedCourtId(courtId); // Устанавливаем courtId для CourtApi
            }
          } else {
            console.error("Суд из region не совпадает с судом из courtId:", { region, courtId });
          }
        } else {
          console.error("Суд с courtId не найден в courtIds.json:", courtId);
        }
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
      }
    };

    fetchUserData();
  }, [region, courtId]);

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="max-w-[1250px] mx-auto px-4 py-4">
      <Breadcrumb
        regionName={userRegion || "Оценки по области"}
        courtName={courtName}
        onCourtBackClick={handleBackClick}
        showHome={true}
      />
      <h2 className="text-3xl font-bold mb-4 mt-4">{courtName}</h2>
      <Dates />
      {selectedCourtId && <CourtApi courtId={selectedCourtId} />}
      <Evaluations courtNameId={courtId} />
    </div>
  );
};

export default RegionalCourtPage;