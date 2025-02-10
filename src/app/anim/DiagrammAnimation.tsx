'use client';

import { useRef, useEffect, useState, RefObject, ReactNode } from 'react';
import { Bar, Pie, Radar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';

// Хук для отслеживания видимости
function useIntersectionObserver(options = {}): [RefObject<HTMLDivElement>, boolean] {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, {
      threshold: 0.1,
      ...options
    });

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  return [elementRef, isVisible];
}

type ChartType = 'bar' | 'pie' | 'radar';

interface AnimatedChartProps<T extends ChartType> {
  type: T;
  data: ChartData<T>;
  options?: ChartOptions<T>;
  title: string;
}

export const AnimatedChart = <T extends ChartType>({ 
  type, 
  data, 
  options, 
  title 
}: AnimatedChartProps<T>) => {
  const [ref, isVisible] = useIntersectionObserver();

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: isVisible ? 1000 : 0,
      easing: 'easeInOutQuart'
    }
  };

  const chartOptions = {
    ...baseOptions,
    ...options
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={data as ChartData<'bar'>} options={chartOptions as ChartOptions<'bar'>} />;
      case 'pie':
        return <Pie data={data as ChartData<'pie'>} options={chartOptions as ChartOptions<'pie'>} />;
      case 'radar':
        return <Radar data={data as ChartData<'radar'>} options={chartOptions as ChartOptions<'radar'>} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={ref}
      className={`
        bg-white rounded-lg shadow-xl p-6
        transition-all duration-1000 transform
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
      `}
    >
      <h2 className="text-xl font-medium mb-4 text-gray-800">{title}</h2>
      <div className="h-[300px]">
        {renderChart()}
      </div>
    </div>
  );
};

interface AnimatedDivProps {
  children: ReactNode;
  className?: string;
}

export const AnimatedDiv = ({ children, className = '' }: AnimatedDivProps) => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-1000 transform
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Пример использования в компоненте страницы:
/*
import { AnimatedChart } from '@/app/anim/DiagrammAnimation';

// В вашем компоненте:
<AnimatedChart
  type="bar"
  data={yourChartData}
  options={yourChartOptions}
  title="Название диаграммы"
/>
*/ 