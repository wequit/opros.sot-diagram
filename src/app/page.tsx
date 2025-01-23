'use client';
import React, { useState, useCallback, useEffect } from 'react';
import EvaluationQuestions from '@/app/evaluations/page';
import Data from '@/lib/utils/Data';
import { useAuth } from '@/lib/utils/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

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
