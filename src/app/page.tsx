'use client';
import React from 'react';
import EvaluationQuestions from '@/app/evaluations/page';
import Data from '@/lib/utils/Data';
import DataFetcher from '@/components/DataFetcher';

export default function Home() {


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Оценка деятельности районного суда за период
      </h1>

      <Data />
      <DataFetcher />
      <EvaluationQuestions />
    </div>
  );
}
