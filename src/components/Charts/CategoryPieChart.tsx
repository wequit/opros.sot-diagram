import React from 'react';
import { Pie } from 'react-chartjs-2';
import { ChartOptions, ChartData, LegendItem } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useLanguage } from '@/context/LanguageContext';

interface CategoryPieChartProps {
  categoryData: ChartData<'pie'>;
  windowWidth: number;
  title: string;
}

export default function CategoryPieChart({ categoryData, windowWidth, title }: CategoryPieChartProps) {
  const { language } = useLanguage();
  const getMaxLabelLength = (width: number): number => {
    if (width < 440) return 38; 
    return 55;                  
  };

  const MAX_LABEL_LENGTH = getMaxLabelLength(windowWidth);

  const categoryOptions: ChartOptions<'pie'> = {
    plugins: {
      legend: {
        position: 'bottom',
        align: 'start',
        labels: {
          padding: 20,
          boxWidth: 15,
          font: {
            size: windowWidth < 440 ? 10 : 11,
            family: 'Inter, sans-serif',
          },
          usePointStyle: true,
          generateLabels: (chart): LegendItem[] => {
            const { data } = chart;
            if (data.labels) {
              return data.labels.map((label, index) => {
                const labelText = typeof label === 'string' ? label : String(label ?? '');
                const text = labelText.length > MAX_LABEL_LENGTH
                  ? `${labelText.substring(0, MAX_LABEL_LENGTH)}...`
                  : labelText;

                const fillStyle = Array.isArray(data.datasets[0].backgroundColor)
                  ? (data.datasets[0].backgroundColor[index] as string)
                  : (data.datasets[0].backgroundColor as string);

                return {
                  text,
                  fillStyle,
                  hidden: !chart.isDatasetVisible(0),
                  fontColor: '#666',
                  lineWidth: 0,
                  pointStyle: 'circle',
                  padding: 20,
                } as LegendItem;
              });
            }
            return [];
          },
        },
      },
      datalabels: {
        color: '#FFFFFF',
        font: {
          size: 16,
          weight: 'bold',
        },
        formatter: (value: number, context: any) => {
          const total = context.chart.data.datasets[0].data.reduce((sum: number, v: number) => sum + v, 0);
          const percent = total ? Math.round((value / total) * 100) : 0;
          return percent > 0 ? percent + '%' : '';
        },
        display: true,
        anchor: 'center',
        align: 'center',
        clamp: true,
      },
      tooltip: {
        bodyFont: {
          size: windowWidth < 440 ? 7 : 9,
        },
        titleFont: {
          size: windowWidth < 440 ? 7 : 10,
        },
        padding: windowWidth < 440 ? 4 : 6,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          },
        },
      },
    },
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 20,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg   min-h-[300px] flex flex-col">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-medium DiagrammThreeName">
          {title.replace(/^\d+\.\s*/, "")}
        </h2>
      </div>
      <div className="p-6 relative overflow-visible">
        <div className="chart-container">
          <div className="w-[350px] h-[400px] EvaluationsCategoryRespond mx-auto">
            <Pie data={categoryData} options={categoryOptions} plugins={[ChartDataLabels]} />
          </div>
        </div>
      </div>
    </div>
  );
}
