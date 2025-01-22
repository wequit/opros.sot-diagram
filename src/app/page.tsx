'use client';
import React, { useState, useCallback } from 'react';
import EvaluationQuestions from '@/app/evaluations/page';
import Data from '@/lib/utils/Data';


export default function Home() {


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Оценка деятельности районного суда за период
      </h1>

      <Data />
      <EvaluationQuestions />
    </div>
  );
}
