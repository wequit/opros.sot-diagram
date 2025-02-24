import React from "react";
import Dates from "@/components/Dates/Dates";
import DataFetcher from "../DataFetcher";
import Evaluations  from '@/components/Evaluations/page';

const ThirdInstance = () => {
  return (
    <>
      <Dates />
      <DataFetcher />
      <Evaluations />
    </>
  );
};

export default ThirdInstance;