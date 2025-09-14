'use client'

import React, { useEffect, useRef, useState } from 'react'
import { AlertTriangle, TrendingUp, Clock, Shield, Zap, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ThreatAlert {
  id: string
  message: string
  level: 'info' | 'warning' | 'critical'
  timestamp: string
  region?: string
  source?: string
}

interface ThreatStripProps {
  alerts?: ThreatAlert[]
  threats?: ThreatAlert[]
  className?: string
  autoScroll?: boolean
  speed?: number
}

const levelConfig = {
  info: {
    icon: Shield,
    color: 'text-cyan-400 border-cyan-500/30',
    bg: 'bg-cyan-500/5',
    pulse: false
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-400 border-yellow-500/30',
    bg: 'bg-yellow-500/5',
    pulse: true
  },
  critical: {
    icon: Zap,
    color: 'text-red-400 border-red-500/30',
    bg: 'bg-red-500/5',
    pulse: true
  }
}

export function ThreatStrip({
  alerts,
  threats,
  className,
  autoScroll = true,
  speed = 50
}: ThreatStripProps) {
  // Support both alerts and threats props for backwards compatibility
  const threatData = alerts || threats || []
  
  // Early return if no data
  if (!threatData || threatData.length === 0) {
    return null
  }
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0)

  useEffect(() => {
    if (!autoScroll || isPaused || threatData.length <= 1) return

    const interval = setInterval(() => {
      setCurrentAlertIndex((prev) => (prev + 1) % threatData.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoScroll, isPaused, threatData.length])

  const currentAlert = threatData[currentAlertIndex]
  
  if (!currentAlert) {
    return null
  }

  const config = levelConfig[currentAlert.level] || levelConfig.info
  const Icon = config.icon

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border backdrop-blur-sm',
        config.color,
        config.bg,
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Live Indicator */}
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <Activity className="w-3 h-3 text-red-400" />
        <span className="text-xs font-mono text-red-400">LIVE</span>
        {config.pulse && (
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
        )}
      </div>

      {/* Main Content */}
      <div className="p-3 flex items-center gap-4">
        {/* Level Icon */}
        <div className={cn(
          'flex-shrink-0 p-2 rounded',
          currentAlert.level === 'critical' && 'animate-pulse'
        )}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Alert Message */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase opacity-70">
              {currentAlert.level}
            </span>
            {currentAlert.region && (
              <>
                <span className="text-xs opacity-50">•</span>
                <span className="text-xs font-mono opacity-70">
                  {currentAlert.region}
                </span>
              </>
            )}
            {currentAlert.source && (
              <>
                <span className="text-xs opacity-50">•</span>
                <span className="text-xs font-mono opacity-70">
                  {currentAlert.source}
                </span>
              </>
            )}
          </div>
          <p className={cn(
            'text-sm font-medium',
            autoScroll && 'animate-slide-left'
          )}>
            {currentAlert.message}
          </p>
        </div>

        {/* Timestamp */}
        <div className="flex-shrink-0 flex items-center gap-1 text-xs opacity-70">
          <Clock className="w-3 h-3" />
          <span className="font-mono">{currentAlert.timestamp}</span>
        </div>
      </div>

      {/* Progress Bar for Auto-scroll */}
      {autoScroll && threatData.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/20">
          <div
            className={cn(
              'h-full transition-all duration-[5000ms] ease-linear',
              (config.color.split(' ')[0] || '').replace('text', 'bg'),
              !isPaused && 'animate-progress'
            )}
            style={{
              width: isPaused ? '0%' : '100%'
            }}
          />
        </div>
      )}

      {/* Alert Counter */}
      {threatData.length > 1 && (
        <div className="absolute bottom-2 left-3 text-xs font-mono opacity-50">
          {currentAlertIndex + 1} / {threatData.length}
        </div>
      )}
    </div>
  )
}

export default ThreatStrip
