'use client'

import React, { useState } from 'react'
import { X, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type AlertType = 'info' | 'warning' | 'success' | 'error'

interface AlertBannerProps {
  type: AlertType
  title: string
  message: string
  dismissible?: boolean
  onDismiss?: () => void
  actions?: Array<{
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary'
  }>
  className?: string
}

const alertConfig = {
  info: {
    icon: Info,
    colors: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    iconColor: 'text-blue-400'
  },
  warning: {
    icon: AlertTriangle,
    colors: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    iconColor: 'text-yellow-400'
  },
  success: {
    icon: CheckCircle,
    colors: 'bg-green-500/10 border-green-500/30 text-green-400',
    iconColor: 'text-green-400'
  },
  error: {
    icon: XCircle,
    colors: 'bg-red-500/10 border-red-500/30 text-red-400',
    iconColor: 'text-red-400'
  }
}

export function AlertBanner({
  type,
  title,
  message,
  dismissible = true,
  onDismiss,
  actions,
  className
}: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const config = alertConfig[type]
  const Icon = config.icon

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) return null

  return (
    <div
      role="alert"
      className={cn(
        'relative rounded-lg border p-4 backdrop-blur-sm',
        config.colors,
        className
      )}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <Icon className={cn('w-5 h-5', config.iconColor)} />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold font-mono text-sm">
            {title}
          </h3>
          <p className="text-sm opacity-90">
            {message}
          </p>

          {/* Actions */}
          {actions && actions.length > 0 && (
            <div className="flex gap-2 pt-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={cn(
                    'px-3 py-1.5 rounded text-xs font-mono transition-all duration-200',
                    action.variant === 'primary'
                      ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30'
                      : 'bg-terminal-secondary border border-terminal-border text-terminal-text hover:bg-terminal-secondary/80'
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default AlertBanner
