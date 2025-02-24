import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ru from '@/locales/ru.json';
import ky from '@/locales/ky.json';

interface Court {
  court_id: number;
  court: string;
  instantiation: string;
  id: number;
  name: string;
  instance: string;
  overall_assessment: number;
  assessment: {
    judge: number;
    process: number;
    staff: number;
    office: number;
    building: number;
  };
  total_survey_responses: number;
}

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
  court?: string;
}

type Language = "ky" | "ru";

interface SurveyContextType {
  surveyData: SurveyData | null;
  setSurveyData: (data: SurveyData) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  userCourt: string | null;
  setUserCourt: (court: string | null) => void;
  courtName: string | null;
  setCourtName: (name: string | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  selectedRegion: {
    id: number;
    name: any;
    overall: any;
    ratings: any;
    totalAssessments: any;
  }[] | null;
  setSelectedRegion: React.Dispatch<React.SetStateAction<
    {
      id: number;
      name: any;
      overall: any;
      ratings: any;
      totalAssessments: any;
    }[] | null
  >>;
  breadcrumbRegion: string | null;
  setBreadcrumbRegion: (region: string | null) => void;
  breadcrumbCourt: string | null;
  setBreadcrumbCourt: (court: string | null) => void;
  selectedCourt?: Court;
  setSelectedCourt: (court: Court | undefined) => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userCourt, setUserCourt] = useState<string | null>(null);
  const [courtName, setCourtName] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("ru");
  const [selectedRegion, setSelectedRegion] = useState<
    {
      id: number;
      name: any;
      overall: any;
      ratings: any;
      totalAssessments: any;
    }[] | null
  >(null);
  const [breadcrumbRegion, setBreadcrumbRegion] = useState<string | null>(null);
  const [breadcrumbCourt, setBreadcrumbCourt] = useState<string | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<Court | undefined>(undefined);

  // При монтировании считываем сохранённый язык из localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language");
      if (savedLanguage === "ky" || savedLanguage === "ru") {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === "ru" ? "ky" : "ru";
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  return (
    <SurveyContext.Provider
      value={{
        surveyData,
        setSurveyData,
        isLoading,
        setIsLoading,
        userCourt,
        setUserCourt,
        courtName,
        setCourtName,
        language,
        setLanguage,
        toggleLanguage,
        selectedRegion,
        setSelectedRegion,
        breadcrumbRegion,
        setBreadcrumbRegion,
        breadcrumbCourt,
        setBreadcrumbCourt,
        selectedCourt,
        setSelectedCourt,
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

export function useSurveyData() {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurveyData must be used within a SurveyProvider');
  }
  return context;
}
