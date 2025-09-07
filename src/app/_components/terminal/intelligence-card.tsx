'use client';

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  Shield, 
  Target,
  Activity,
  BarChart3,
  Eye
} from 'lucide-react';

type TrendDirection = 'up' | 'down' | 'neutral';
type CardPriority = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface IntelligenceCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    direction: TrendDirection;
    value: string;
    label?: string;
  };
  priority?: CardPriority;
  icon?: React.ReactNode;
  metrics?: {
    label: string;
    value: string | number;
  }[];
  actions?: {
    label: string;
    onClick: () => void;
  }[];
  className?: string;
  onClick?: () => void;
}

export function IntelligenceCard({
  title,
  value,
  subtitle,
  trend,
  priority = 'info',
  icon,
  metrics,
  actions,
  className = '',
  onClick
}: IntelligenceCardProps) {
  const getPriorityConfig = () => {
    switch (priority) {
      case 'critical':
        return {
          borderColor: 'border-terminal-red',
          glowColor: 'terminal-red',
          iconColor: 'text-terminal-red',
          bgPattern: 'bg-terminal-red/5'
        };
      case 'high':
        return {
          borderColor: 'border-terminal-gold',
          glowColor: 'terminal-gold',
          iconColor: 'text-terminal-gold',
          bgPattern: 'bg-terminal-gold/5'
        };
      case 'medium':
        return {
          borderColor: 'border-terminal-cyan',
          glowColor: 'terminal-cyan',
          iconColor: 'text-terminal-cyan',
          bgPattern: 'bg-terminal-cyan/5'
        };
      case 'low':
        return {
          borderColor: 'border-terminal-text/50',
          glowColor: 'terminal-text',
          iconColor: 'text-terminal-text',
          bgPattern: 'bg-terminal-text/5'
        };
      default:
        return {
          borderColor: 'border-terminal-border',
          glowColor: 'terminal-cyan',
          iconColor: 'text-terminal-cyan',
          bgPattern: ''
        };
    }
  };

  const getTrendIcon = (direction: TrendDirection) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (direction: TrendDirection) => {
    switch (direction) {
      case 'up':
        return 'text-terminal-cyan';
      case 'down':
        return 'text-terminal-red';
      default:
        return 'text-terminal-muted';
    }
  };

  const config = getPriorityConfig();

  return (
    <div
      onClick={onClick}
      className={`
        terminal-card rounded-lg overflow-hidden border ${config.borderColor}
        ${onClick ? 'cursor-pointer hover:border-opacity-80' : ''}
        ${config.bgPattern}
        transition-all duration-300
        ${className}
      `}
      style={{
        boxShadow: priority !== 'info' ? `0 0 20px rgba(var(--${config.glowColor}), 0.2)` : undefined
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-terminal-border/30 bg-terminal-secondary/20">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {icon && (
              <div className={`${config.iconColor}`}>
                {icon}
              </div>
            )}
            <h3 className="text-xs font-terminal text-terminal-muted uppercase tracking-wider">
              {title}
            </h3>
          </div>
          {priority === 'critical' && (
            <AlertTriangle className="w-4 h-4 text-terminal-red animate-pulse" />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Value Display */}
        <div className="mb-3">
          <div className="text-2xl font-bold font-terminal text-terminal-text terminal-glow">
            {value}
          </div>
          {subtitle && (
            <div className="text-xs text-terminal-muted mt-1 font-terminal">
              {subtitle}
            </div>
          )}
        </div>

        {/* Trend */}
        {trend && (
          <div className={`flex items-center gap-2 mb-3 ${getTrendColor(trend.direction)}`}>
            {getTrendIcon(trend.direction)}
            <span className="text-sm font-terminal font-bold">
              {trend.value}
            </span>
            {trend.label && (
              <span className="text-xs text-terminal-muted font-terminal">
                {trend.label}
              </span>
            )}
          </div>
        )}

        {/* Metrics */}
        {metrics && metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-terminal-border/30">
            {metrics.map((metric, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-xs text-terminal-muted font-terminal">
                  {metric.label}
                </span>
                <span className="text-sm font-bold text-terminal-cyan font-terminal">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-terminal-border/30">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                className="flex-1 px-2 py-1 text-xs font-terminal uppercase tracking-wider
                         border border-terminal-cyan/30 text-terminal-cyan
                         hover:bg-terminal-cyan/10 hover:border-terminal-cyan
                         transition-all duration-200 rounded"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Intelligence Grid Component for multiple cards
interface IntelligenceGridProps {
  cards: IntelligenceCardProps[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function IntelligenceGrid({
  cards,
  columns = 3,
  className = ''
}: IntelligenceGridProps) {
  const getGridCols = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <div className={`grid ${getGridCols()} gap-4 ${className}`}>
      {cards.map((card, index) => (
        <IntelligenceCard key={index} {...card} />
      ))}
    </div>
  );
}

// Default Icons for common intelligence types
export const IntelligenceIcons = {
  threat: <Shield className="w-4 h-4" />,
  target: <Target className="w-4 h-4" />,
  activity: <Activity className="w-4 h-4" />,
  analytics: <BarChart3 className="w-4 h-4" />,
  monitoring: <Eye className="w-4 h-4" />
};