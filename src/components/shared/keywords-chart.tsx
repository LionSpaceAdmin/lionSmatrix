"use client";

import { PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const data = {
    labels: ['#genocide', '#FakeResistance', '#ZionistEntity', '#FreePalestine', '#Apartheid'],
    datasets: [{
        label: 'Mentions (last 24h)',
        data: [1200, 950, 800, 1500, 700],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    }]
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
        r: {
            ticks: {
                color: '#0B1220',
                backdropColor: 'rgba(203, 213, 225, 0.6)'
            },
            grid: {
                color: 'rgba(203, 213, 225, 0.1)'
            }
        }
    }
};

export default function KeywordsChart() {
  return <PolarArea data={data} options={options} />;
}
