'use client';

import { ReactNode } from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: ReactNode;
}

export function Tabs({ value, onValueChange, className = '', children }: TabsProps) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}

interface TabsListProps {
  className?: string;
  children: ReactNode;
}

export function TabsList({ className = '', children }: TabsListProps) {
  return (
    <div className={`flex overflow-x-auto border-b border-gray-600 ${className}`}>
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className = '' }: TabsTriggerProps) {
  return (
    <button className={`px-4 py-2 text-sm font-medium text-gray-300 hover:text-white border-b-2 border-transparent hover:border-green-400 transition-colors ${className}`}>
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
}

export function TabsContent({ value, children }: TabsContentProps) {
  return (
    <div>
      {children}
    </div>
  );
}

interface KpiCardProps {
  title: string;
  value: string;
  trend: number;
}

export function KpiCard({ title, value, trend }: KpiCardProps) {
  const trendColor = trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-gray-400';
  const trendSymbol = trend > 0 ? '+' : '';

  return (
    <div className="bg-black/30 border border-green-400/20 rounded-lg p-4">
      <h3 className="text-sm text-gray-400 mb-2">{title}</h3>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className={`text-xs ${trendColor}`}>
        {trendSymbol}{trend}%
      </div>
    </div>
  );
}