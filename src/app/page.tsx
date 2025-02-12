"use client";
import React from "react";
import Dates from "@/lib/utils/Dates";
import Evaluations from "@/components/Evaluations/page";
import DataFetcher from "@/components/DataFetcher";
import { useAuth } from "@/lib/utils/AuthContext";
import SecondInstance from "@/components/roles/2 instance";
import ThirdInstance from "@/components/roles/3 instance ";
import { withAuth } from "@/api/withAuth"; // Импортируем HOC

function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {user?.role === "Председатель 1 инстанции" ? (
        <>
          <Dates />
          <DataFetcher />
          <Evaluations />
        </>
      ) : user?.role === "Председатель 2 инстанции" ? (
        <SecondInstance />
      ) : user?.role === "Председатель 3 инстанции" ? (
        <ThirdInstance />
      ) : null}
    </div>
  );
}

export default withAuth(Home);
