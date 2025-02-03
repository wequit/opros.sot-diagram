"use client";
import NoData from "@/lib/utils/NoData";
import React, { useEffect, useState } from "react";
import Dates from "@/lib/utils/Dates";
// import Evaluations from "@/app/Evaluations/page";
// import { getCookie } from "@/lib/api/login";
// import NoData from "@/lib/utils/NoData";

export default function Page() {
//   const [surveyDataGeneral, setSurveyData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = getCookie('access_token');
//         if (!token) {
//           throw new Error("Token is null");
//         }
        
//         const response = await fetch("https://opros.sot.kg/api/v1/results/65/?year=2025", {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Ошибка при получении данных");
//         }
        
//         const data = await response.json();
//         setSurveyData(data); // Сохраняем данные в состоянии
//       } catch (error) {
//         console.error("Ошибка при получении данных:", error);
//       } finally {
//         setIsLoading(false); // Устанавливаем состояние загрузки в false
//       }
//     };

//     fetchData();
//   }, []);

//   if (isLoading) {
//     return <div><NoData/></div>; // Показываем сообщение о загрузке
//   }

  return (
    <div>
        <Dates/>
        <NoData/>
    </div>
  );
}