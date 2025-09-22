"use client";

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const data = {
    labels: ['X', 'Telegram', 'Facebook', 'TikTok', 'YouTube'],
    datasets: [{
        label: 'Disinfo Signals',
        data: [65, 59, 80, 81, 56],
        backgroundColor: 'rgba(184, 255, 242, 0.5)',
        borderColor: '#B8FFF2',
        borderWidth: 1
    }]
};

const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
        legend: {
            labels: {
                color: '#cbd5e1'
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#cbd5e1'
            },
            grid: {
                color: 'rgba(203, 213, 225, 0.1)'
            }
        },
        y: {
            ticks: {
                color: '#cbd5e1'
            },
            grid: {
                color: 'rgba(203, 213, 225, 0.1)'
            }
        }
    }
};

export default function PlatformChart() {
  return <Bar data={data} options={options} />;
}
