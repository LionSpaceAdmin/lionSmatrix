"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', impact: 4000 },
  { name: 'Feb', impact: 3000 },
  { name: 'Mar', impact: 2000 },
  { name: 'Apr', impact: 2780 },
  { name: 'May', impact: 1890 },
  { name: 'Jun', impact: 2390 },
];

export function ImpactChart() {
  return (
    <>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
              }}
            />
            <Legend />
            <Bar dataKey="impact" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 overflow-x-auto sm:hidden">
        <h3 className="sr-only">Chart Data</h3>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2">Month</th>
              <th className="p-2">Impact Score</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.name}>
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
