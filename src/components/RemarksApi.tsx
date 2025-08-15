"use client";

import { getCookie, getCurrentUser } from "@/lib/api/login";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCourt } from "@/context/CourtContext";

export interface Remark {
  id: number;
  custom_answer: string | null;
  reply_to_comment: string | null;
  comment_created_at: string;
  author?: string;
  question_id?: number;
  question_text_ru?: string;
  court: string;
  due_date?: string;
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
  const { selectedCourt, courtName, selectedCourtName, selectedCourtId } = useCourt();

  const filterRemarks = (
    remarks: Remark[],
    user: any,
    pathname: string,
    selectedCourtName: string | null,
    courtId: number | null,
    selectedCourtId: number | null
  ): Remark[] => {
    const courtName2 = typeof window !== 'undefined' ? localStorage.getItem("courtName2") : null;
    const matchedCourt = typeof window !== 'undefined' ? localStorage.getItem("matchedCourt") : null;
    const storedCourtName = typeof window !== 'undefined' ? localStorage.getItem("selectedCourtName") : null;
    const courtNameId = typeof window !== 'undefined' ? localStorage.getItem("courtNameId") : null;
    const courtNAME = typeof window !== 'undefined' ? localStorage.getItem("courtName") : null;

    return remarks.filter((item: Remark) => {
      const isValid = 
        item.custom_answer !== null &&
        item.custom_answer !== "Необязательный вопрос";
  
      if (user.role === "Председатель 3 инстанции") {
        if (
          pathname === "/Home/summary/ratings" ||
          pathname === "/Home/summary/feedbacks"
        ) {
          return isValid;
        }
    
        if (
          pathname === "/Home/supreme-court/ratings" ||
          pathname === "/Home/supreme-court/feedbacks"
        ) {
          return isValid && item.court === "Верховный суд";
        }
    
        if (
          pathname.startsWith(`/Home/second-instance/`) ||
          pathname === "/results/Home/second-instance/"
        ) {
          return isValid && item.court === storedCourtName;
        }
    
        if (pathname === `/Home/second-instance/feedbacks/${courtId}`) {
          return isValid && item.court === storedCourtName;
        }
    
        if (pathname.startsWith(`/Home/first-instance/`)) {
          return isValid && item.court === storedCourtName;
        }
    
        if (pathname === `/Home/first-instance/feedbacks/${courtNameId}`) {
          return isValid && item.court === courtNAME;
        }
      }
    
      if (user.role === "Председатель 2 инстанции") {
        if (pathname.startsWith("/Home/first_instance/court/")) {
          return isValid && item.court === courtName2;
        }
    
        if (pathname.startsWith("/Home/first_instance/feedbacks/")) {
          return isValid && item.court === courtName2;
        }
    
        if (pathname.startsWith("/Home/") && pathname.endsWith("/ratings2")) {
          return isValid && item.court === matchedCourt;
        }
    
        if (pathname.startsWith("/Home/") && pathname.endsWith("/feedbacks2")) {
          return isValid && item.court === matchedCourt;
        }
      }
    
      return isValid;
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
        if (response.status === 401) {
          console.warn("Токен устарел, перенаправляем на /login");
          router.push("/login");
          return;
        }

        const errorData = await response.json();
        throw new Error(errorData.detail || "Ошибка при получении данных");
      }

      const data = await response.json();

      const rawItems: Remark[] = Array.isArray(data) && data.length > 0 && ("answers" in data[0])
        ? (data as any[]).flatMap((group: any) =>
            (group.answers || []).map((ans: any) => ({
              id: ans.id,
              custom_answer: ans.custom_answer,
              reply_to_comment: ans.reply_to_comment,
              comment_created_at: ans.comment_created_at,
              author: ans.author,
              court: ans.court,
              due_date: ans.due_date,
              question_id: ans.question_id ?? group.question_id,
              question_text_ru: group.question_text_ru,
            }))
          )
        : (data as Remark[]);

      const filteredData = filterRemarks(
        rawItems,
        user,
        pathname,
        selectedCourtName,
        courtId,
        selectedCourtId
      );

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
