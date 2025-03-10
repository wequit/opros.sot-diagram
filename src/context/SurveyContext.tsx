import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
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

interface SurveyData {
  questions: Question[];
  period_start: string;
  period_end: string;
  total_responses: number;
}

interface Assessment {
  aspect: string;
  court_avg: number;
  assessment_count: string;
}

interface CourtData {
  court_id: number;
  court: string;
  instantiation: string;
  overall_assessment: number;
  assessment: Assessment[];
  assessment_count: string;
  total_survey_responses: number;
}

type Language = "ky" | "ru";

interface RegionData {
  id: number;
  name: string;
  overall: number;
  ratings: number[];
  totalAssessments: number;
}

interface SurveyContextType {
  surveyData: SurveyData | null;
  setSurveyData: (data: SurveyData | null) => void;
  totalResponses: number; 
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  userCourt: string | null;
  setUserCourt: (court: string | null) => void;
  courtName: string | null;
  setCourtName: (name: string | null) => void;
  courtNameId: string | null;
  setCourtNameId: (nameId: string | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  selectedRegion: RegionData[] | null;
  setSelectedRegion: React.Dispatch<React.SetStateAction<RegionData[] | null>>;
  selectedCourt: CourtData | null;
  setSelectedCourt: React.Dispatch<React.SetStateAction<CourtData | null>>;
  selectedCourtName: string | null;
  setSelectedCourtName: React.Dispatch<React.SetStateAction<string | null>>;
  selectedCourtId: number | null;
  setSelectedCourtId: React.Dispatch<React.SetStateAction<number | null>>;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [totalResponses, setTotalResponses] = useState<number>(0); 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userCourt, setUserCourt] = useState<string | null>(null);
  const [courtName, setCourtName] = useState<string | null>(null);
  const [courtNameId, setCourtNameId] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("ru");
  const [selectedCourt, setSelectedCourt] = useState<CourtData | null>(null);
  const [selectedCourtName, setSelectedCourtName] = useState<string | null>(null);
  const [selectedCourtId, setSelectedCourtId] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionData[] | null>(null);

  useEffect(() => {
    if (typeof surveyData?.total_responses === "number" && surveyData?.total_responses >= 0) {
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

  const toggleLanguage = () => {
    const newLanguage: Language = language === "ru" ? "ky" : "ru";
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  return (
    <SurveyContext.Provider
      value={{
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
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}

export function getTranslation(key: keyof typeof ru, language: Language): string {
  const translations: Record<Language, typeof ru> = {
    ru,
    ky,
  };
  return translations[language][key] || key;
}

export function useSurveyData(): SurveyContextType {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error("useSurveyData must be used within a SurveyProvider");
  }
  return context;
}