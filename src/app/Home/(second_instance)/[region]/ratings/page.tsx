"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";
import { getCurrentUser } from "@/lib/api/login";
import CourtApi from "@/lib/api/CourtAPI"; 
import courtIdsData from "../../../../../../public/courtIds.json"; // Импортируем courtIds.json

const RegionalCourtPage = () => {
  const params = useParams();
  const region = params?.region as string; // Это slug, например, "Naryn"
  const router = useRouter();

  const [courtName, setCourtName] = useState<string>("");
  const [userRegion, setUserRegion] = useState<string | null>(null);
  const [userCourt, setUserCourt] = useState<string | null>(null); // Для хранения userCourt из getCurrentUser
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null); // Для хранения courtId из JSON

  // Функция для получения названия суда по slug (обратное преобразование из Header)
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

  // Получаем данные пользователя и сравниваем суды
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        const userCourtFromApi = userData.court || null;
        setUserCourt(userCourtFromApi);

        // Получаем название суда из slug (region из params)
        const courtFromSlug = getCourtNameFromSlug(region);

        // Устанавливаем courtName для отображения
        setCourtName(courtFromSlug);

        // Сравниваем userCourt из getCurrentUser с судом из slug
        if (userCourtFromApi === courtFromSlug && userData.role === "Председатель 2 инстанции") {
          const court = courtIdsData.courts.find(
            (c: { court: string }) => c.court === courtFromSlug
          );
          if (court) {
            setSelectedCourtId(court.court_id.toString()); // Устанавливаем courtId из JSON
          }
        }
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
      }
    };

    fetchUserData();
  }, [region]);

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
      <Evaluations courtNameId={region} />
    </div>
  );
};

export default RegionalCourtPage;