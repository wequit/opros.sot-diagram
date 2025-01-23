import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  };
  title: string;
}

export function PieChart({ data, title }: PieChartProps) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      datalabels: {
        display: true,
        backgroundColor: 'white',
        borderRadius: 6,
        padding: 4,
        color: 'black',
        font: {
          size: 14,
          weight: 'bold' as const,
        },
        formatter: (value: number, context: any) => {
          const label = context.chart.data.labels[context.dataIndex];
          return [label, value + '%'];
        },
        anchor: 'center' as const,
        align: 'center' as const,
      },
    },
    layout: {
      padding: 20
    }
  };

  const chartData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      datalabels: {
        display: true
      }
    })),
    newPieChart: {
      labels: ['Категория 1', 'Категория 2', 'Категория 3'],
      datasets: [{
        data: [30, 40, 30],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)'
        ]
      }]
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <Pie data={chartData} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
} 