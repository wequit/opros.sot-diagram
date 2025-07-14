"use client";

import Header from "@/components/layout/Header/Header";

export default function RegionalCourtsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div>{children}</div>
    </>
  );
}
