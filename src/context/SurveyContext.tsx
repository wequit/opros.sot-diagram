"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
  useMemo,
  useRef,
} from "react";
import ru from "@/locales/ru.json";
import ky from "@/locales/ky.json";

export interface SelectedOption {
  id: number;
  text_ru: string;
  text_kg: string;
  value?: number;
}

export interface QuestionResponse {
  id: number;
  selected_option: SelectedOption | null;
  multiple_selected_options?: SelectedOption[];
  text_response?: string;
  created_at: string;
  question: number;
  custom_answer: string | null;
  gender: string;
}

export interface Question {
  id: number;
  text: string;
  question_text: string;
  question_type: string;
  question_responses: QuestionResponse[];
  options?: string[];
}

export type Language = "ky" | "ru";

export interface RegionData {
  id: number;
  name: string;
  overall: number;
  ratings: number[];
  totalAssessments: number;
}

export interface Assessment {
  aspect: string;
  court_avg: number;
  assessment_count: string;
}

export interface CourtData {
  court_id: number;
  court: string;
  instantiation: string;
  overall_assessment: number;
  assessment: Assessment[];
  assessment_count: string;
  total_survey_responses: number;
}

interface SurveyContextType {
  circleData: any | null;
  setCircleData: Dispatch<SetStateAction<any | null>>;
  radarData: any | null;
  setRadarData: Dispatch<SetStateAction<any | null>>;
  barData: any | null;
  setBarData: Dispatch<SetStateAction<any | null>>;
  progressData: any | null;
  setProgressData: Dispatch<SetStateAction<any | null>>;
  columnData: any | null;
  setColumnData: Dispatch<SetStateAction<any | null>>;
  totalResponses: number;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  userCourt: string | null;
  setUserCourt: Dispatch<SetStateAction<string | null>>;
  courtName: string | null;
  setCourtName: Dispatch<SetStateAction<string | null>>;
  courtNameId: string | null;
  setCourtNameId: Dispatch<SetStateAction<string | null>>;
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  toggleLanguage: () => void;
  selectedRegion: RegionData[] | null;
  setSelectedRegion: Dispatch<SetStateAction<RegionData[] | null>>;
  selectedCourt: CourtData | null;
  setSelectedCourt: Dispatch<SetStateAction<CourtData | null>>;
  selectedCourtName: string | null;
  setSelectedCourtName: Dispatch<SetStateAction<string | null>>;
  selectedCourtId: number | null;
  setSelectedCourtId: Dispatch<SetStateAction<number | null>>;
  regionName: string | null;
  setRegionName: Dispatch<SetStateAction<string | null>>;
  dateParams: { year?: string; quarter?: number; month?: number };
  setDateParams: (params: { year?: string; quarter?: number; month?: number }) => void;
  surveyResponsesCount: number;
  setSurveyResponsesCount: (count: number) => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [circleData, setCircleData] = useState<any | null>(null);
  const [radarData, setRadarData] = useState<any | null>(null);
  const [barData, setBarData] = useState<any | null>(null);
  const [progressData, setProgressData] = useState<any | null>(null);
  const [columnData, setColumnData] = useState<any | null>(null);
  const [totalResponses, setTotalResponses] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userCourt, setUserCourt] = useState<string | null>(null);
  const [courtName, setCourtName] = useState<string | null>(null);
  const [courtNameId, setCourtNameId] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("ru");
  const [selectedCourt, setSelectedCourt] = useState<CourtData | null>(null);
  const [selectedCourtName, setSelectedCourtName] = useState<string | null>(null);
  const [surveyResponsesCount, setSurveyResponsesCount] = useState(0);
  const [selectedCourtId, setSelectedCourtId] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionData[] | null>(null);
  const [regionName, setRegionName] = useState<string | null>(null);
  const [dateParams, setDateParams] = useState<{ year?: string; quarter?: number; month?: number }>({ year: "2025" });

  const prevCourtName = useRef<string | null>(null);

  useEffect(() => {
    if (courtName !== null) {
      prevCourtName.current = courtName;
    } else if (prevCourtName.current !== null) {
      setCourtName(prevCourtName.current);
    }
  }, [courtName]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as Language | null;
      if (savedLanguage === "ky" || savedLanguage === "ru") {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  const toggleLanguage = (): void => {
    const newLanguage: Language = language === "ru" ? "ky" : "ru";
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const value = useMemo(
    () => ({
      circleData,
      setCircleData,
      radarData,
      setRadarData,
      barData,
      setBarData,
      progressData,
      setProgressData,
      columnData,
      setColumnData,
      totalResponses,
      isLoading,
      setIsLoading,
      userCourt,
      setUserCourt,
      courtName,
      setCourtName,
      courtNameId,
      setCourtNameId,
      language,
      setLanguage,
      toggleLanguage,
      selectedRegion,
      setSelectedRegion,
      selectedCourt,
      setSelectedCourt,
      selectedCourtName,
      setSelectedCourtName,
      selectedCourtId,
      setSelectedCourtId,
      regionName,
      setRegionName,
      dateParams,
      setDateParams,
      surveyResponsesCount,
      setSurveyResponsesCount,
    }),
    [
      circleData,
      radarData,
      barData,
      progressData,
      columnData,
      totalResponses,
      isLoading,
      userCourt,
      courtName,
      courtNameId,
      language,
      selectedRegion,
      selectedCourt,
      selectedCourtName,
      selectedCourtId,
      regionName,
      dateParams,
      surveyResponsesCount,
    ]
  );

  return <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>;
}

export function getTranslation(key: keyof typeof ru, language: Language): string {
  const translations: Record<Language, typeof ru> = { ru, ky };
  return translations[language][key] || key;
}

export function useSurveyData(): SurveyContextType {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error("useSurveyData must be used within a SurveyProvider");
  }
  return context;
}