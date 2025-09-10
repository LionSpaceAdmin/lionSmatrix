'use client';

import { ReactNode, createContext, useContext } from 'react';

// Tabs Context for managing active state
interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: ReactNode;
}

export function Tabs({ value, onValueChange, className = '', children }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={`${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  className?: string;
  children: ReactNode;
}

export function TabsList({ className = '', children }: TabsListProps) {
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
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
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');
  
  const { value: activeValue, onValueChange } = context;
  const isActive = activeValue === value;
  
  return (
    <button 
      onClick={() => onValueChange(value)}
      className={`
        px-4 py-2 text-sm font-medium font-terminal rounded transition-all duration-200
        ${isActive 
          ? 'bg-terminal-cyan text-terminal-bg border border-terminal-cyan' 
          : 'text-terminal-muted hover:text-terminal-cyan border border-transparent hover:border-terminal-cyan/50'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
}

export function TabsContent({ value, children }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');
  
  const { value: activeValue } = context;
  
  if (activeValue !== value) return null;
  
  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-1">
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
  const trendColor = trend > 0 ? 'text-terminal-green' : trend < 0 ? 'text-terminal-red' : 'text-terminal-muted';
  const trendSymbol = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';

  return (
    <div className="terminal-card p-4 hover:scale-105 transition-transform duration-200">
      <h3 className="text-xs text-terminal-muted uppercase mb-2">{title}</h3>
      <div className="text-2xl font-bold text-terminal-cyan mb-1">{value}</div>
      <div className={`text-sm font-mono ${trendColor}`}>
        {trendSymbol} {Math.abs(trend)}%
      </div>
    </div>
  );
}