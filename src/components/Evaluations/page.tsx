"use client";
import React, { useState, useEffect } from "react";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from "chart.js";
Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

import SkeletonDashboard from "@/lib/utils/SkeletonLoader/SkeletonLoader";
import useEvaluationData, { getPieData, getBarData, Question, Option } from "@/hooks/useEvaluationsData";
import NoData from "../NoData/NoData";
import CategoryPieChart from "../Charts/CategoryPieChart";
import UniversalBarChart from "../Charts/UniversalBarChart";
import CommentsSection from "../Charts/CommentsSection";
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

const sections = [
  { title: "Все ответы", icon: <SquareGanttChart size={20} />, type: "all" },
  { title: "Респонденты", icon: <CircleUser size={20} />, questionIds: [1, 2, 3, 4] },
  { title: "Доступ", icon: <LockKeyhole size={20} />, questionIds: [5, 6] },
  { title: "Сотрудники", icon: <Users size={20} />, questionIds: [7, 8] },
  { title: "Судьи", icon: <Hammer size={20} />, questionIds: [9, 10, 11, 12, 13] },
  { title: "Здание", icon: <Building size={20} />, questionIds: [14, 15, 16] },
  { title: "Оценка", icon: <Sparkles size={20} />, questionIds: [17, 18, 19, 20] },
  { title: "Замечания", icon: <MessageSquare size={20} />, type: "comments" }
];


const textQuestionIds = [6, 13, 20];

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

  const { isLoading, totalResponses, questionsById } = useEvaluationData();

  if (isLoading) return <SkeletonDashboard />;
  if (!isLoading && totalResponses === 0) return <NoData />;

  const comments: { text: string }[] = [];
  const totalResponsesAnswer = totalResponses || 0;
  const remarksPath = "/feedbacks";

  const allQuestions = sections
    .filter(s => s.questionIds)
    .flatMap(s => s.questionIds!.map(qid => questionsById[qid]))
    .filter(Boolean);
  const allCommentsQuestions = allQuestions.filter(q => textQuestionIds.includes(q.question_id));
  const allDiagramQuestions = allQuestions.filter(q => !textQuestionIds.includes(q.question_id));

  return (
    <div className="min-h-screen rounded-xl mb-4 p-2 md:p-6 print-content-padding bg-gray-50"> 
      <div className="max-w-[1250px] mx-auto">
      <div className="flex overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide mb-8 border-b border-gray-200 dark:border-gray-700"> 
        <div className="flex -mb-px"> 
          {sections.map((section, idx) => (
            <button
              key={section.title}
              className={
                `flex items-center gap-2 px-5 py-3 font-semibold text-sm md:text-base cursor-pointer relative ` +
                `transition-all duration-250 ease-in-out ` +
                (activeTab === idx
                  ? "text-indigo-700 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600") 
              }
              onClick={() => setActiveTab(idx)}
            >
              {section.icon}
              <span>{section.title}</span>
              {activeTab !== idx && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-transparent group-hover:bg-indigo-300 dark:group-hover:bg-indigo-700 transition-colors duration-200"></span>
              )}
            </button>
          ))}
        </div>
      </div>
        <div className="mt-6">
          {sections.map((section, idx) => (
            <div
              key={section.title}
              className={activeTab === idx ? "block" : "hidden"}
              role="tabpanel"
            >
              {section.type === "all" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {allDiagramQuestions.map(question => (
                      question._type === 'bar' ? (
                        <UniversalBarChart key={question.question_id} barData={getBarData(question)} windowWidth={windowWidth} title={question.question_text_ru} />
                      ) : (
                        <CategoryPieChart key={question.question_id} categoryData={getPieData(question)} windowWidth={windowWidth} title={question.question_text_ru} />
                      )
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
                        question._type === 'bar' ? (
                          <UniversalBarChart key={question.question_id} barData={getBarData(question)} windowWidth={windowWidth} title={question.question_text_ru} />
                        ) : (
                          <CategoryPieChart key={question.question_id} categoryData={getPieData(question)} windowWidth={windowWidth} title={question.question_text_ru} />
                        )
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