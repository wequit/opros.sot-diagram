import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectedOption {
  id: number;
  text_ru: string;
  text_kg: string;
  value?: number;
}

export interface QuestionResponse {
  question: number;
  selected_option: SelectedOption | null;
  custom_answer: string | null;
}

export interface Question {
  id: number;
  text: string;
  question_text: string;
  question_type: 'multiple_choice' | 'text' | 'rating';
  options?: string[];
  question_responses: QuestionResponse[];
  responses: {
    answer: string | number;
    timestamp: string;
  }[];
}

interface SurveyData {
  questions: Question[];
  period_start: string;
  period_end: string;
  total_responses: number;
}

interface SurveyContextType {
  surveyData: SurveyData | null;
  setSurveyData: (data: SurveyData) => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);

  return (
    <SurveyContext.Provider value={{ surveyData, setSurveyData }}>
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurveyData() {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurveyData must be used within a SurveyProvider');
  }
  return context;
} 