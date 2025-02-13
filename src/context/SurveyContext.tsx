"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ru from '@/locales/ru.json';
import ky from '@/locales/ky.json';

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
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userCourt, setUserCourt] = useState<string | null>(null);
  const [courtName, setCourtName] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("ru");

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
