"use client";

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
    labels: ['Factual Narrative', 'Disinfo Narrative A', 'Disinfo Narrative B'],
    datasets: [{
        data: [55, 30, 15],
        backgroundColor: ['#B8FFF2', '#FF6384', '#FFCE56']
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
    }
};

export default function SovChart() {
  return <Doughnut data={data} options={options} />;
}
