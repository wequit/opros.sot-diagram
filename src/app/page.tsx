'use client';
import React from 'react';
import EvaluationQuestions from '@/app/evaluations/page';
import Dates from '@/lib/utils/Dates';
import DataFetcher from '@/components/DataFetcher';

export default function Home() {


  return (
    <div className="space-y-6">
     
      <Dates />
      <DataFetcher />
      <EvaluationQuestions />
    </div>
  );
}
