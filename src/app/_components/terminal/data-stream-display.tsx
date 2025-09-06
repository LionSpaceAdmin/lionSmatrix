'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Activity, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface DataEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'warning' | 'error' | 'success';
  source: string;
  message: string;
  data?: Record<string, unknown>;
}

interface DataStreamDisplayProps {
  title?: string;
  height?: string;
  maxEntries?: number;
  autoScroll?: boolean;
  showTimestamp?: boolean;
  filterType?: DataEntry['type'] | 'all';
  onEntryClick?: (entry: DataEntry) => void;
}

export function DataStreamDisplay({
  title = 'DATA STREAM',
  height = '400px',
  maxEntries = 100,
  autoScroll = true,
  showTimestamp = true,
  filterType = 'all',
  onEntryClick
}: DataStreamDisplayProps) {
  const [entries, setEntries] = useState<DataEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const streamRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Simulate data stream
  useEffect(() => {
    if (isPaused) return;

    const sources = ['NODE-01', 'NODE-02', 'SCANNER', 'ANALYZER', 'MONITOR', 'GATEWAY'];
    const types: DataEntry['type'][] = ['info', 'warning', 'error', 'success'];
    const messages = [
      'Data packet received',
      'Processing request',
      'Connection established',
      'Scan completed',
      'Anomaly detected',
      'System check passed',
      'Warning: High traffic',
      'Error: Timeout exceeded',
      'Success: Operation completed',
      'Info: Status update'
    ];

    const generateEntry = (): DataEntry => ({
      id: `entry-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      type: types[Math.floor(Math.random() * types.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      data: Math.random() > 0.5 ? {
        latency: `${Math.floor(Math.random() * 100)}ms`,
        packets: Math.floor(Math.random() * 1000),
        status: 'ACTIVE'
      } : undefined
    });

    intervalRef.current = setInterval(() => {
      setEntries(prev => {
        const newEntry = generateEntry();
        const updated = [newEntry, ...prev].slice(0, maxEntries);
        return updated;
      });
    }, Math.random() * 2000 + 500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, maxEntries]);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && streamRef.current && !isPaused) {
      streamRef.current.scrollTop = 0;
    }
  }, [entries, autoScroll, isPaused]);

  const getIcon = (type: DataEntry['type']) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-3 h-3" />;
      case 'warning': return <Info className="w-3 h-3" />;
      case 'success': return <CheckCircle className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  const getTypeColor = (type: DataEntry['type']) => {
    switch (type) {
      case 'error': return 'text-terminal-red border-terminal-red/30 bg-terminal-red/5';
      case 'warning': return 'text-terminal-gold border-terminal-gold/30 bg-terminal-gold/5';
      case 'success': return 'text-terminal-cyan border-terminal-cyan/30 bg-terminal-cyan/5';
      default: return 'text-terminal-text border-terminal-border bg-terminal-secondary/20';
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const filteredEntries = filterType === 'all' 
    ? entries 
    : entries.filter(e => e.type === filterType);

  return (
    <div className="terminal-card rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-terminal-secondary px-4 py-2 border-b border-terminal-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-terminal-muted font-terminal">{title}</span>
          <div className="flex items-center gap-2">
            <Activity className={`w-3 h-3 ${!isPaused ? 'text-terminal-cyan animate-pulse' : 'text-terminal-muted'}`} />
            <span className="text-xs text-terminal-cyan font-terminal">
              {filteredEntries.length} ENTRIES
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="text-xs font-terminal px-2 py-1 rounded border transition-all
                     hover:bg-terminal-cyan/10 hover:border-terminal-cyan
                     border-terminal-border text-terminal-text"
        >
          {isPaused ? 'RESUME' : 'PAUSE'}
        </button>
      </div>

      {/* Stream */}
      <div 
        ref={streamRef}
        className="bg-terminal-bg p-2 overflow-y-auto font-terminal text-xs data-stream"
        style={{ height }}
      >
        {filteredEntries.length === 0 ? (
          <div className="text-center text-terminal-muted py-8">
            No data entries yet...
          </div>
        ) : (
          <div className="space-y-1">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => onEntryClick?.(entry)}
                className={`
                  flex items-start gap-2 p-2 rounded border transition-all
                  ${getTypeColor(entry.type)}
                  ${onEntryClick ? 'cursor-pointer hover:border-opacity-60' : ''}
                `}
              >
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(entry.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {showTimestamp && (
                      <span className="text-terminal-muted">
                        [{formatTimestamp(entry.timestamp)}]
                      </span>
                    )}
                    <span className="text-terminal-cyan font-bold">
                      {entry.source}
                    </span>
                    <span className="text-terminal-text">
                      {entry.message}
                    </span>
                  </div>
                  
                  {/* Additional Data */}
                  {entry.data && (
                    <div className="mt-1 text-terminal-muted">
                      {Object.entries(entry.data).map(([key, value]) => (
                        <span key={key} className="mr-3">
                          {key}: <span className="text-terminal-cyan">{value}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}