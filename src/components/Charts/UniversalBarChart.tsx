import React from "react";
import { Bar } from "react-chartjs-2";
import { ChartOptions, ChartData } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

interface UniversalBarChartProps {
  barData: ChartData<"bar">;
  windowWidth: number;
  title: string;
}

export default function UniversalBarChart({ barData, windowWidth, title }: UniversalBarChartProps) {
  const options: ChartOptions<"bar"> = {
    indexAxis: "x",
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        align: 'center',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 10,
          color: '#718096',
          font: {
            size: windowWidth < 440 ? 10 : 11,
          },
          generateLabels: (chart): import('chart.js').LegendItem[] => {
            const data = chart.data;
            if (data.labels && data.datasets && data.datasets[0]) {
              const dataset = data.datasets[0];
              return data.labels.map((label, i) => {
                const originalText = label as string;
                const maxLength = windowWidth < 768 ? 25 : 35;
                const displayText = originalText.length > maxLength
                  ? originalText.substring(0, maxLength) + '...'
                  : originalText;
                const fillStyle = Array.isArray(dataset.backgroundColor)
                  ? (dataset.backgroundColor[i] as string)
                  : (dataset.backgroundColor as string) || 'gray';
                return {
                  text: displayText,
                  fillStyle,
                  strokeStyle: Array.isArray(dataset.borderColor) ? dataset.borderColor[i] as string : (dataset.borderColor as string) || 'rgba(0,0,0,0)',
                  lineWidth: dataset.borderWidth || 0,
                  pointStyle: 'circle',
                  fontColor: '#5e6d7d',
                } as import('chart.js').LegendItem;
              });
            }
            return [];
          }
        },
      },
      datalabels: {
        anchor: 'center', 
        align: 'center',   
        color: 'white',
        font: {
          size: 12,
          weight: 'bold',
        },
        formatter: (value: number, context: any) => {
          const dataset = context.dataset;
          const percentages = dataset.percentages;
          const percentage = percentages ? percentages[context.dataIndex] : '';
          return `${value} (${percentage})`;
        },
        display: true,
        clamp: true,
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            const dataset = context.dataset as any;
            const percentages = dataset.percentages;
            const percentage = percentages ? percentages[context.dataIndex] : '';
            return `Количество: ${context.parsed.y} (${percentage})`;
          },
          title: function(context) {
            return context[0].label;
          }
        },
        bodyFont: {
          size: 11,
        },
        titleFont: {
          size: 10,
        },
      }
    },
    scales: {
      x: {
        display: false,
        grid: { display: false },
        ticks: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: { display: true, color: 'rgba(0,0,0,0.05)' },
        ticks: { stepSize: 1, color: '#555' },
      },
    },
    maintainAspectRatio: false,
    layout: { padding: { top: 20, bottom: 20, left: 20, right: 20 } },
  };

  return (
    <div className="bg-white rounded-lg min-h-[300px] flex flex-col shadow-sm">
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-800">
            {title.replace(/^\d+\.\s*/, "")}
          </h2>
        </div>
      )}
      <div className="p-6 flex-grow">
        <div className="chart-container h-full">
          <div className="h-[300px] md:h-[400px]">
            <Bar data={barData} options={options} plugins={[ChartDataLabels]} />
          </div>
        </div>
      </div>
    </div>
  );
}