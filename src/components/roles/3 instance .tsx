import React from "react";
import Dates from "@/lib/utils/Dates";
import DataFetcher from "../DataFetcher";
import { Evaluations } from '@/app/Evaluations/page';

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
