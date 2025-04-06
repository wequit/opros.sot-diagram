// context/ChartDataContext.tsx
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

// Определяем тип для surveyData (на основе вашего кода)
interface SurveyData {
  radar?: { court?: string };
  // Добавьте другие поля, если они есть
}

interface ChartDataContextType {
  circleData: any; // Уточните тип, если нужно
  setCircleData: Dispatch<SetStateAction<any>>;
  radarData: any; // Уточните тип, если нужно
  setRadarData: Dispatch<SetStateAction<any>>;
  barData: any; // Уточните тип, если нужно
  setBarData: Dispatch<SetStateAction<any>>;
  progressData: any; // Уточните тип, если нужно
  setProgressData: Dispatch<SetStateAction<any>>;
  columnData: any; // Уточните тип, если нужно
  setColumnData: Dispatch<SetStateAction<any>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  surveyResponsesCount: number;
  setSurveyResponsesCount: Dispatch<SetStateAction<number>>;
  surveyData: SurveyData | null; // Добавляем surveyData для совместимости с RegionDetails
  setSurveyData: Dispatch<SetStateAction<SurveyData | null>>; // Добавляем setSurveyData
}

const ChartDataContext = createContext<ChartDataContextType | undefined>(undefined);

export const ChartDataProvider = ({ children }: { children: ReactNode }) => {
  const [circleData, setCircleData] = useState<any>(null);
  const [radarData, setRadarData] = useState<any>(null);
  const [barData, setBarData] = useState<any>(null);
  const [progressData, setProgressData] = useState<any>(null);
  const [columnData, setColumnData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [surveyResponsesCount, setSurveyResponsesCount] = useState<number>(0);
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null); // Добавляем состояние для surveyData

  return (
    <ChartDataContext.Provider
      value={{
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
        isLoading,
        setIsLoading,
        surveyResponsesCount,
        setSurveyResponsesCount,
        surveyData,
        setSurveyData,
      }}
    >
      {children}
    </ChartDataContext.Provider>
  );
};

export const useChartData = () => {
  const context = useContext(ChartDataContext);
  if (!context) {
    throw new Error("useChartData must be used within a ChartDataProvider");
  }
  return context;
};