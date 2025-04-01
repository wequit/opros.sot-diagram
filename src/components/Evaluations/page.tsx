"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SkeletonDashboard from "@/lib/utils/SkeletonLoader/SkeletonLoader";
import NoData from "@/components/NoData/NoData";
import CommentsSection from "../Charts/CommentsSection";
import CategoryPieChart from "../Charts/CategoryPieChart";
import RadarChart from "../Charts/RadarChart";
import DemographicsChart from "../Charts/DemographicsChart";
import CategoryJudgeChart from "../Charts/CategoryJudgeChart";
import TrafficSourceChart from "../Charts/TrafficSourceChart";
import RatingChart from "../Charts/RatingChart";
import ReusablePieChart from "../Charts/ReusablePieChart";
import DisrespectChart from "../Charts/DisrespectChart";
import useEvaluationData from "@/hooks/useEvaluationsData";

interface RegionSummaryData {
  overall_rating: number;
  total_responses: number;
  courts_count: number;
  ratings_by_category: {
    [key: string]: number;
  };
}

// Evaluations.tsx
export default function Evaluations({
  selectedCourtId,
  courtNameId,
  summaryData,
}: {
  selectedCourtId?: number | null;
  courtNameId?: string | null;
  summaryData?: RegionSummaryData | null;
}) {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const pathname = usePathname();
  const [demographicsView, setDemographicsView] = useState("пол");

  let remarksPath = "/Home/summary/feedbacks";

  if (pathname.includes("/Home/supreme-court/rating")) {
    remarksPath = "/Home/supreme-court/feedbacks";
  } else if (pathname.startsWith("/Home/second-instance/")) {
    // Формируем путь с selectedCourtId перед /feedbacks
    remarksPath = `/Home/second-instance${selectedCourtId ? `/${selectedCourtId}` : ""}/feedbacks`;
  } else if (pathname.includes("/Home/first-instance")) {
    remarksPath = "/Home/first-instance/feedbacks";
  }
  
// Добавляем selectedCourtId и courtNameId, если они есть
if (courtNameId) remarksPath += `/${courtNameId}`;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    categoryData,
    genderData,
    trafficSourceData,
    caseTypesData,
    audioVideoData,
    judgeRatings,
    staffRatings,
    processRatings,
    accessibilityRatings,
    officeRatings,
    startTimeData,
    radarData,
    totalResponses,
    totalResponsesAnswer,
    disrespectData,
    ageData,
    ageGenderData,
    comments,
    isLoading,
  } = useEvaluationData();

  if (isLoading) return <SkeletonDashboard />;

  return (
    <div className="min-h-screen mb-4">
      <div className="max-w-[1250px] mx-auto">
        <div className="grid grid-cols-2 gap-4 EvalutionCols">
          {radarData.datasets.length > 0 && (
            <RadarChart radarData={radarData} windowWidth={windowWidth}  totalResponses={totalResponses}/>
          )}
          <CommentsSection totalResponsesAnswer={totalResponsesAnswer} remarksPath={remarksPath} comments={comments} />
          {categoryData.datasets[0].data.length > 0 && (
            <CategoryPieChart categoryData={categoryData} windowWidth={windowWidth} />
          )}
          {(genderData.datasets[0].data.length > 0 || ageData.datasets[0].data.length > 0) && (
            <DemographicsChart
              genderData={genderData}
              ageGenderData={ageGenderData}
              ageData={ageData}
              demographicsView={demographicsView}
              setDemographicsView={setDemographicsView}
              windowWidth={windowWidth}
            />
          )}
          {trafficSourceData.datasets[0].data.length > 0 && (
            <TrafficSourceChart trafficSourceData={trafficSourceData} windowWidth={windowWidth} />
          )}
          {caseTypesData.datasets[0].data.length > 0 && (
            <CategoryJudgeChart caseTypesData={caseTypesData} windowWidth={windowWidth} />
          )}
          {Object.keys(judgeRatings).length > 0 && (
            <RatingChart ratings={judgeRatings} translationKey="DiagrammSeven" />
          )}
          {disrespectData.datasets[0].data.length > 0 && (
            <DisrespectChart disrespectData={disrespectData} windowWidth={windowWidth} />
          )}
          {Object.keys(staffRatings).length > 0 && (
            <RatingChart ratings={staffRatings} translationKey="DiagrammNine" />
          )}
          {Object.keys(processRatings).length > 0 && (
            <RatingChart ratings={processRatings} translationKey="DiagrammTen" />
          )}
          {audioVideoData.datasets[0].data.length > 0 && (
            <ReusablePieChart
              data={audioVideoData}
              translationKey="DiagrammEleven"
              windowWidth={windowWidth}
              className="EvaluationsAudio"
            />
          )}
          {startTimeData.datasets[0].data.length > 0 && (
            <ReusablePieChart
              data={startTimeData}
              translationKey="DiagrammTwelve"
              windowWidth={windowWidth}
              className="EvaluationsTime"
            />
          )}
          {Object.keys(officeRatings).length > 0 && (
            <RatingChart ratings={officeRatings} translationKey="DiagrammThirteen" />
          )}
          {Object.keys(accessibilityRatings).length > 0 && (
            <RatingChart ratings={accessibilityRatings} translationKey="DiagrammFourteen" />
          )}
        </div>
      </div>
    </div>
  );
}