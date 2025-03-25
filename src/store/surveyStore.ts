// import { create } from "zustand";

// interface SurveyStore {
//   data: any | null;
//   isLoading: boolean;
//   setData: (data: any) => void;
//   setIsLoading: (loading: boolean) => void;
// }

// export const useSurveyStore = create<SurveyStore>((set) => {
//   let storedData = null;

//   if (typeof window !== "undefined") {
//     const localData = localStorage.getItem("surveyData");
//     if (localData) {
//       storedData = JSON.parse(localData);
//     }
//   }


//   return {
//     data: storedData,
//     isLoading: storedData ? false : true,
//     setData: (data) => {
//       set({ data, isLoading: false });
//       localStorage.setItem("surveyData", JSON.stringify(data));
//     },
//     setIsLoading: (loading) => {
//       set({ isLoading: loading });
//     },
//   };
// });
