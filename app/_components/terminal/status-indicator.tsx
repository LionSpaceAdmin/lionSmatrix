'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, Activity } from 'lucide-react';

type StatusType = 'online' | 'offline' | 'warning' | 'error' | 'idle' | 'processing';

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

export function StatusIndicator({
  status,
  label,
  showIcon = true,
  size = 'md',
  pulse = true,
  className = ''
}: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          color: 'terminal-cyan',
          bgColor: 'bg-terminal-cyan',
          textColor: 'text-terminal-cyan',
          borderColor: 'border-terminal-cyan',
          icon: CheckCircle,
          defaultLabel: 'ONLINE'
        };
      case 'offline':
        return {
          color: 'terminal-muted',
          bgColor: 'bg-terminal-muted',
          textColor: 'text-terminal-muted',
          borderColor: 'border-terminal-muted',
          icon: AlertCircle,
          defaultLabel: 'OFFLINE'
        };
      case 'warning':
        return {
          color: 'terminal-gold',
          bgColor: 'bg-terminal-gold',
          textColor: 'text-terminal-gold',
          borderColor: 'border-terminal-gold',
          icon: AlertTriangle,
          defaultLabel: 'WARNING'
        };
      case 'error':
        return {
          color: 'terminal-red',
          bgColor: 'bg-terminal-red',
          textColor: 'text-terminal-red',
          borderColor: 'border-terminal-red',
          icon: AlertCircle,
          defaultLabel: 'ERROR'
        };
      case 'idle':
        return {
          color: 'terminal-text',
          bgColor: 'bg-terminal-text',
          textColor: 'text-terminal-text',
          borderColor: 'border-terminal-text',
          icon: Info,
          defaultLabel: 'IDLE'
        };
      case 'processing':
        return {
          color: 'terminal-cyan',
          bgColor: 'bg-terminal-cyan',
          textColor: 'text-terminal-cyan',
          borderColor: 'border-terminal-cyan',
          icon: Activity,
          defaultLabel: 'PROCESSING'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  const displayLabel = label || config.defaultLabel;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          dot: 'w-1.5 h-1.5',
          icon: 'w-3 h-3',
          text: 'text-xs',
          gap: 'gap-1'
        };
      case 'lg':
        return {
          dot: 'w-3 h-3',
          icon: 'w-5 h-5',
          text: 'text-sm',
          gap: 'gap-2'
        };
      default:
        return {
          dot: 'w-2 h-2',
          icon: 'w-4 h-4',
          text: 'text-xs',
          gap: 'gap-1.5'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={`inline-flex items-center ${sizeClasses.gap} ${className}`}>
      {/* Status Dot */}
      <div className="relative">
        <div 
          className={`
            ${sizeClasses.dot} rounded-full ${config.bgColor}
            ${pulse && (status === 'online' || status === 'processing') ? '' : ''}
          `}
          style={{
            boxShadow: `0 0 10px rgba(var(--${config.color}), 0.8)`
          }}
        />
        {pulse && (status === 'online' || status === 'processing') && (
          <div 
            className={`
              absolute inset-0 rounded-full ${config.bgColor}
              animate-status-ping
            `}
          />
        )}
      </div>

      {/* Icon */}
      {showIcon && Icon && (
        <Icon className={`${sizeClasses.icon} ${config.textColor}`} />
      )}

      {/* Label */}
      {displayLabel && (
        <span className={`${sizeClasses.text} ${config.textColor} font-terminal font-bold tracking-wider`}>
          {displayLabel}
        </span>
      )}
    </div>
  );
}

// Multi Status Panel Component
interface StatusPanelProps {
  title?: string;
  statuses: {
    id: string;
    label: string;
    status: StatusType;
    value?: string | number;
  }[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function StatusPanel({
  title = 'SYSTEM STATUS',
  statuses,
  columns = 2,
  className = ''
}: StatusPanelProps) {
  const getGridCols = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 3: return 'grid-cols-1 sm:grid-cols-3';
      case 4: return 'grid-cols-2 sm:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2';
    }
  };

  return (
    <div className={`terminal-card rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      {title && (
        <div className="bg-terminal-secondary px-4 py-2 border-b border-terminal-border">
          <h3 className="text-xs text-terminal-muted font-terminal tracking-wider">
            {title}
          </h3>
        </div>
      )}

      {/* Status Grid */}
      <div className={`grid ${getGridCols()} gap-px bg-terminal-border p-px`}>
        {statuses.map((item) => (
          <div
            key={item.id}
            className="bg-terminal-bg p-3 flex items-center justify-between hover:bg-terminal-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <StatusIndicator 
                status={item.status} 
                label={item.label}
                showIcon={false}
                size="sm"
              />
            </div>
            {item.value !== undefined && (
              <span className="text-terminal-cyan font-terminal text-sm font-bold">
                {item.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}