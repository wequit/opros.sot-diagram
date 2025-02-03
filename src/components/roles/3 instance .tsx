import React from "react";
import Dates from "@/lib/utils/Dates";
import DataFetcher from "../DataFetcher";
import EvaluationQuestions from "@/app/Evaluations/page";

const ThirdInstance = () => {
  return (
    <>
      <Dates />
      <DataFetcher />
      <EvaluationQuestions />
    </>
  );
};

export default ThirdInstance;
