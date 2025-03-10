import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartOptions, ChartData } from 'chart.js';
import { getTranslation, useSurveyData } from '@/context/SurveyContext';

interface DisrespectChartProps {
  disrespectData: ChartData<'bar'>;
  windowWidth: number;
}



export default function DisrespectChart({
  disrespectData,
  windowWidth,
}: DisrespectChartProps) {
  const { language } = useSurveyData();

  const getMaxValue = (data: (number | [number, number] | null)[]): number => {
    const numericData = data
      .filter((item): item is number | [number, number] => item !== null)
      .map((item) => (Array.isArray(item) ? item[0] : item)); 
    return numericData.length > 0 ? Math.max(...numericData) + 1 : 1;
  };

  const disrespectOptions: ChartOptions<'bar'> = {
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: true,
        },
        suggestedMax: getMaxValue(disrespectData.datasets[0]?.data || [0]),
        ticks: {
          stepSize: 1,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          padding: 1,
          align: 'center' as const,
          font: {
            size: windowWidth < 470 ? 11 : 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const sum = disrespectData.datasets[0].data
            .filter((item): item is number | [number, number] => item !== null) 
            .reduce((a: number, b: number | [number, number]) => a + (Array.isArray(b) ? b[0] : b), 0);
            
            const percentage = ((value / sum) * 100).toFixed(1);
            return `${value} (${percentage}%)`;
          },
        },
      },
    },
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 1,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200">
      <div className="px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium DiagrammEightName">
            {getTranslation('DiagrammEight', language)}
          </h2>
        </div>
      </div>
      <div className="p-6">
        <div className="h-[300px] w-full">
          <Bar data={disrespectData} options={disrespectOptions} />
        </div>
      </div>
    </div>
  );
}