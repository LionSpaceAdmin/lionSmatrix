'use client';

import { useState, useEffect } from 'react';

interface ThreatStat {
  label: string;
  value: number;
  change: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export function ThreatOverview() {
  const [stats, setStats] = useState<ThreatStat[]>([]);

  useEffect(() => {
    // Simulate fetching threat statistics
    const mockStats: ThreatStat[] = [
      { label: 'Critical Threats', value: 3, change: 2, severity: 'critical' },
      { label: 'High Priority', value: 7, change: -1, severity: 'high' },
      { label: 'Medium Priority', value: 15, change: 3, severity: 'medium' },
      { label: 'Low Priority', value: 28, change: 5, severity: 'low' }
    ];
    setStats(mockStats);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-900';
      case 'high': return 'text-orange-400 bg-orange-900/20 border-orange-900';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-900';
      case 'low': return 'text-green-400 bg-green-900/20 border-green-900';
      default: return 'text-terminal-cyan bg-gray-900/20 border-terminal-cyan/30';
    }
  };

  return (
    <div className="bg-gray-950 border border-terminal-cyan/30 rounded-lg p-6">
      <h3 className="text-lg font-bold text-terminal-cyan mb-6 font-mono">
        THREAT OVERVIEW
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getSeverityColor(stat.severity)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl font-bold font-mono">
                {stat.value}
              </span>
              <span className={`text-xs font-mono px-2 py-1 rounded ${
                stat.change > 0 
                  ? 'bg-red-900/50 text-red-400' 
                  : stat.change < 0
                  ? 'bg-green-900/50 text-green-400'
                  : 'bg-gray-900/50 text-gray-400'
              }`}>
                {stat.change > 0 ? '+' : ''}{stat.change}
              </span>
            </div>
            <p className="text-sm font-mono opacity-80">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-terminal-cyan/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-terminal-muted font-mono text-sm">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-mono text-sm">
                MONITORING ACTIVE
              </span>
            </div>
          </div>
          <button className="px-4 py-2 bg-terminal-cyan/20 border border-terminal-cyan text-terminal-cyan font-mono text-sm rounded hover:bg-terminal-cyan/30 transition-colors">
            REFRESH DATA
          </button>
        </div>
      </div>
    </div>
  );
}