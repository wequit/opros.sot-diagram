import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import ru from "@/locales/ru.json";
import ky from "@/locales/ky.json";

// Тип для опций вопросов
export interface SelectedOption {
  id: number;
  text_ru: string;
  text_kg: string;
  value?: number;
}

// Тип для ответа на вопрос
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

// Тип для вопроса
export interface Question {
  id: number;
  text: string;
  question_text: string;
  question_type: string;
  question_responses: QuestionResponse[];
  options?: string[];
}

// Тип для данных опроса
export interface SurveyData {
  questions?: Question[];
  period_start?: string;
  period_end?: string;
  total_responses?: number;
  circle?: any;
  radar?: any;
  bar?: any;
  progress?: any;
  column?: any;
}

// Тип для оценки аспекта суда
export interface Assessment {
  aspect: string;
  court_avg: number;
  assessment_count: string;
}

// Тип для данных суда
export interface CourtData {
  court_id: number;
  court: string;
  instantiation: string;
  overall_assessment: number;
  assessment: Assessment[];
  assessment_count: string;
  total_survey_responses: number;
}

// Тип для языка
export type Language = "ky" | "ru";

// Тип для данных региона
export interface RegionData {
  id: number;
  name: string;
  overall: number;
  ratings: number[];
  totalAssessments: number;
}

// Интерфейс контекста с полной типизацией
interface SurveyContextType {
  surveyData: SurveyData | null;
  setSurveyData: Dispatch<SetStateAction<SurveyData | null>>;
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

// Создание контекста с типом
const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

// Провайдер контекста
export function SurveyProvider({ children }: { children: ReactNode }) {
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [totalResponses, setTotalResponses] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userCourt, setUserCourt] = useState<string | null>(null);
  const [courtName, setCourtName] = useState<string | null>(null);
  const [courtNameId, setCourtNameId] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("ru");
  const [selectedCourt, setSelectedCourt] = useState<CourtData | null>(null);
  const [selectedCourtName, setSelectedCourtName] = useState<string | null>(
    null
  );
  const [surveyResponsesCount, setSurveyResponsesCount] = useState(0);
  const [selectedCourtId, setSelectedCourtId] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionData[] | null>(
    null
  );
  const [regionName, setRegionName] = useState<string | null>(null);
  const [dateParams, setDateParams] = useState<{ year?: string; quarter?: number; month?: number }>({ year: "2025" });
  useEffect(() => {
    if (
      typeof surveyData?.total_responses === "number" &&
      surveyData?.total_responses >= 0
    ) {
      setTotalResponses(surveyData.total_responses);
    }
  }, [surveyData]);

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

  const value: SurveyContextType = {
    surveyData,
    setSurveyData,
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
  };

  return (
    <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>
  );
}

// Функция для получения перевода
export function getTranslation(
  key: keyof typeof ru,
  language: Language
): string {
  const translations: Record<Language, typeof ru> = {
    ru,
    ky,
  };
  return translations[language][key] || key;
}

// Хук для использования контекста
export function useSurveyData(): SurveyContextType {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error("useSurveyData must be used within a SurveyProvider");
  }
  return context;
}