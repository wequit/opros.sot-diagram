'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
};

export const TableSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-gray-200 rounded w-1/4" />
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 rounded" />
      ))}
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white rounded-lg shadow-xl p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
    <div className="h-[300px] bg-gray-200 rounded" />
  </div>
);

export const HeaderSkeleton = () => (
  <header className="h-16 bg-white flex items-center justify-between px-6">
    <div className="flex items-center gap-4">
      <Skeleton className="w-6 h-6 rounded" />
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="w-48 h-6" />
      </div>
    </div>
    <div className="flex items-center gap-3">
      <Skeleton className="w-24 h-8 rounded-full" />
      <Skeleton className="w-48 h-10 rounded-lg" />
    </div>
  </header>
);

export const SidebarSkeleton = () => (
  <div className="w-64 h-full bg-white shadow-lg p-6 space-y-6">
    <Skeleton className="w-32 h-8" />
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="w-6 h-6 rounded" />
          <Skeleton className="w-32 h-6" />
        </div>
      ))}
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="bg-white rounded-lg shadow-xl p-6 animate-pulse">
    <div className="flex items-center gap-4 mb-6">
      <div className="h-16 w-16 bg-gray-200 rounded-full" />
      <div className="space-y-2">
        <div className="h-6 w-48 bg-gray-200 rounded" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </div>
    </div>
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-8 bg-gray-200 rounded" />
      ))}
    </div>
  </div>
);

export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-xl p-6 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
        <div className="h-8 w-16 bg-gray-200 rounded" />
      </div>
    ))}
  </div>
);

export const EvaluationsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow p-6 space-y-4">
        <Skeleton className="w-48 h-8" />
        <Skeleton className="w-full h-[300px]" />
        <div className="space-y-2">
          {[...Array(3)].map((_, j) => (
            <Skeleton key={j} className="w-full h-6" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const MapSkeleton = () => (
  <div className="relative w-full">
    <Skeleton className="w-full h-[600px] rounded-lg" />
    <div className="absolute top-4 right-4">
      <Skeleton className="w-48 h-[200px] rounded-lg" />
    </div>
  </div>
);

export const CourtTableSkeleton = () => (
  <div className="bg-white rounded-lg shadow-xl p-6 animate-pulse">
    {/* Заголовок таблицы */}
    <div className="flex justify-between items-center mb-6">
      <div className="h-8 w-1/3 bg-gray-200 rounded" />
      <div className="h-10 w-40 bg-gray-200 rounded" />
    </div>
    
    {/* Поиск и фильтры */}
    <div className="flex gap-4 mb-6">
      <div className="h-10 w-64 bg-gray-200 rounded" />
      <div className="h-10 w-48 bg-gray-200 rounded" />
    </div>
    
    {/* Заголовки колонок */}
    <div className="grid grid-cols-5 gap-4 mb-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-8 bg-gray-200 rounded" />
      ))}
    </div>
    
    {/* Строки таблицы */}
    <div className="space-y-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, j) => (
            <div key={j} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
      ))}
    </div>
    
    {/* Пагинация */}
    <div className="flex justify-between items-center mt-6">
      <div className="h-8 w-32 bg-gray-200 rounded" />
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-8 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  </div>
);

export const DistrictTableSkeleton = () => (
  <div className="bg-white rounded-lg shadow-xl p-6 animate-pulse">
    {/* Заголовок и фильтры */}
    <div className="space-y-6 mb-6">
      <div className="h-8 w-1/4 bg-gray-200 rounded" />
      <div className="flex gap-4">
        <div className="h-10 w-64 bg-gray-200 rounded" />
        <div className="h-10 w-48 bg-gray-200 rounded" />
        <div className="h-10 w-48 bg-gray-200 rounded" />
      </div>
    </div>
    
    {/* Таблица */}
    <div className="space-y-4">
      {/* Заголовки */}
      <div className="grid grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded" />
        ))}
      </div>
      
      {/* Строки */}
      {[...Array(10)].map((_, i) => (
        <div key={i} className="grid grid-cols-6 gap-4">
          {[...Array(6)].map((_, j) => (
            <div key={j} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const LoginFormSkeleton = () => (
  <div className="min-h-screen flex">
    <div className="hidden lg:flex lg:w-1/2 bg-gray-100">
      <Skeleton className="w-full h-screen" />
    </div>
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <Skeleton className="w-24 h-24 mx-auto rounded-full" />
        <Skeleton className="w-48 h-8 mx-auto" />
        <div className="space-y-4">
          <Skeleton className="w-full h-12 rounded-lg" />
          <Skeleton className="w-full h-12 rounded-lg" />
          <Skeleton className="w-full h-12 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
); 