"use client";
import React from "react";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";
import DataFetcher from "@/components/DataFetcher";
import { useAuth } from "@/context/AuthContext";
import SecondInstance from "@/components/roles/2 instance";
import ThirdInstance from "@/components/roles/3 instance ";
import { withAuth } from "@/lib/withAuth"; // Импортируем HOC

function Home() {
  const { user } = useAuth();

  return (
    <div className="">
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
