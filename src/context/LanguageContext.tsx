// // LanguageContext
// interface LanguageContextType {
//   language: Language;
//   setLanguage: Dispatch<SetStateAction<Language>>;
//   toggleLanguage: () => void;
// }

// const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// export function LanguageProvider({ children }: { children: ReactNode }) {
//   const [language, setLanguage] = useState<Language>(() => {
//     if (typeof window !== "undefined") {
//       const saved = localStorage.getItem("language") as Language | null;
//       return saved === "ky" || saved === "ru" ? saved : "ru";
//     }
//     return "ru";
//   });

//   const toggleLanguage = useCallback(() => {
//     const newLanguage: Language = language === "ru" ? "ky" : "ru";
//     setLanguage(newLanguage);
//     localStorage.setItem("language", newLanguage);
//   }, [language]);

//   const value = useMemo(() => ({ language, setLanguage, toggleLanguage }), [language]);

//   return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
// }

// export function useLanguage() {
//   const context = useContext(LanguageContext);
//   if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
//   return context;
// }