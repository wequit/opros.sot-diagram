"use client";
import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { DateParamsContextType } from "../types/contextTypes";

const DateParamsContext = createContext<DateParamsContextType | undefined>(undefined);

export function DateParamsProvider({ children }: { children: ReactNode }) {
  const [dateParams, setDateParams] = useState<{ year?: string; quarter?: number; month?: number }>({ year: "2025" });

  const value = useMemo(() => ({ dateParams, setDateParams }), [dateParams]);

  return <DateParamsContext.Provider value={value}>{children}</DateParamsContext.Provider>;
}

export function useDateParams() {
  const context = useContext(DateParamsContext);
  if (!context) throw new Error("useDateParams must be used within a DateParamsProvider");
  return context;
}