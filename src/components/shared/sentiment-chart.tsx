"use client";

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const data = {
    labels: ['7 days ago', '6 days ago', '5 days ago', '4 days ago', '3 days ago', 'Yesterday', 'Today'],
    datasets: [
        {
            label: 'Positive',
            data: [12, 19, 15, 25, 22, 30, 28],
            borderColor: '#B8FFF2',
            tension: 0.1,
            pointBackgroundColor: '#B8FFF2'
        },
        {
            label: 'Negative',
            data: [30, 28, 22, 19, 15, 12, 10],
            borderColor: '#FF6384',
            tension: 0.1,
            pointBackgroundColor: '#FF6384'
        }
    ]
};

const options = {
    responsive: true,
    maintainAspectRatio: false,
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

export default function SentimentChart() {
  return <Line data={data} options={options} />;
}
