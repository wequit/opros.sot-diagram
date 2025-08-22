"use client";
import React, { useState, useEffect } from "react";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from "chart.js";
Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

import SkeletonDashboard from "@/lib/utils/SkeletonLoader/SkeletonLoader";
import useEvaluationData, { getBarData } from "@/hooks/useEvaluationsData";
import NoData from "../NoData/NoData";
import UniversalBarChart from "../Charts/UniversalBarChart";
import CommentsSection from "../Charts/CommentsSection";
import { usePathname } from "next/navigation";
import {
  SquareGanttChart,
  CircleUser,       
  LockKeyhole,       
  Users,            
  Hammer,            
  Building,          
  Sparkles,          
  MessageSquare      
} from 'lucide-react'; 





export default function Evaluations() {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { isLoading, totalResponses, questionsById, sections, textQuestionIds } = useEvaluationData();
  const pathname = usePathname();

  if (isLoading) return <SkeletonDashboard />;
  if (!isLoading && totalResponses === 0) return <NoData />;

  const tabSections = [
    { title: `Все ответы (${totalResponses})`, shortTitle: "Все", icon: <SquareGanttChart size={20} />, type: "all" },
    { title: "Респонденты", shortTitle: "Респонденты", icon: <CircleUser size={20} />, questionIds: [1, 2, 3, 4] },
    { title: "Доступ", shortTitle: "Доступ", icon: <LockKeyhole size={20} />, questionIds: [5, 6] },
    { title: "Сотрудники", shortTitle: "Сотрудники", icon: <Users size={20} />, questionIds: [7, 8] },
    { title: "Судьи", shortTitle: "Судьи", icon: <Hammer size={20} />, questionIds: [9, 10, 11, 12, 13] },
    { title: "Здание", shortTitle: "Здание", icon: <Building size={20} />, questionIds: [14, 15, 17] },
    { title: "Оценка", shortTitle: "Оценка", icon: <Sparkles size={20} />, questionIds: [18, 19, 20] },
    { title: "Замечания", shortTitle: "Замечания", icon: <MessageSquare size={20} />, type: "comments" }
  ];

  const comments: { text: string }[] = [];
  const totalResponsesAnswer = totalResponses || 0;
  
  // Правильно формируем путь для feedbacks в зависимости от текущей страницы
  let remarksPath = "/Home/summary/feedbacks";
  if (pathname.includes("/Home/supreme-court/ratings")) {
    remarksPath = "/Home/supreme-court/feedbacks";
  } else if (pathname.startsWith("/Home/second-instance/")) {
    remarksPath = pathname.replace("/ratings", "/feedbacks");
  } else if (pathname.startsWith("/Home/first-instance/")) {
    remarksPath = pathname.replace("/ratings", "/feedbacks");
  } else if (pathname.startsWith("/Home/summary")) {
    remarksPath = "/Home/summary/feedbacks";
  }

  const allQuestions = tabSections
    .filter(s => s.questionIds)
    .flatMap(s => s.questionIds!.map(qid => questionsById[qid]))
    .filter(Boolean);
  const allCommentsQuestions = allQuestions.filter(q => textQuestionIds.includes(q.question_id));
  const allDiagramQuestions = allQuestions.filter(q => !textQuestionIds.includes(q.question_id));

  return (
    <div className="min-h-screen rounded-xl mb-4 p-2 md:p-6 print-content-padding bg-gray-50"> 
      <div className="max-w-[1250px] mx-auto">
      <div className="flex overflow-x-auto whitespace-nowrap pb-2 mb-8 border-b border-gray-200 dark:border-gray-700"> 
        <div className="flex -mb-px min-w-full"> 
          {tabSections.map((section, idx) => (
            <button
              key={section.title}
              className={
                `flex items-center gap-1 md:gap-2 px-2 md:px-4 py-3 font-semibold text-xs md:text-sm lg:text-base cursor-pointer relative whitespace-nowrap ` +
                `transition-all duration-250 ease-in-out ` +
                (activeTab === idx
                  ? "text-indigo-700 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600") 
              }
              onClick={() => setActiveTab(idx)}
              title={section.title}
            >
              <span className="hidden sm:inline">{section.icon}</span>
              <span className="hidden sm:inline truncate">{section.title}</span>
              <span className="sm:hidden truncate">{section.shortTitle}</span>
              {activeTab !== idx && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-transparent group-hover:bg-indigo-300 dark:group-hover:bg-indigo-700 transition-colors duration-200"></span>
              )}
            </button>
          ))}
        </div>
      </div>
        <div className="mt-6">
            {tabSections.map((section, idx) => (
            <div
              key={section.title}
              className={activeTab === idx ? "block" : "hidden"}
              role="tabpanel"
            >
              {section.type === "all" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {allDiagramQuestions.map(question => (
                      <UniversalBarChart key={question.question_id} barData={getBarData(question)} windowWidth={windowWidth} title={question.question_text_ru} />
                    ))}
                  </div>
                 
                </>
              )}
              {!section.type && (
                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {section.questionIds && section.questionIds
                      .map(qid => questionsById[qid])
                      .filter(q => q && !textQuestionIds.includes(q.question_id))
                      .map(question => (
                        <UniversalBarChart key={question.question_id} barData={getBarData(question)} windowWidth={windowWidth} title={question.question_text_ru} />
                      ))}
          </div>
                  
                </>
              )}
              {section.type === "comments" && (
                <CommentsSection comments={comments} totalResponsesAnswer={totalResponsesAnswer} remarksPath={remarksPath} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}