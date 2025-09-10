'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ActionItem {
  id: string
  title: string
  description: string
  icon?: LucideIcon
  href?: string
  onClick?: () => void
  badge?: string
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
}

interface ActionGridProps {
  actions: ActionItem[]
  columns?: 1 | 2 | 3 | 4
  className?: string
}

const variantStyles = {
  primary: 'bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-500/50 text-cyan-400',
  secondary: 'bg-terminal-secondary border-terminal-border hover:bg-terminal-secondary/80 hover:border-terminal-cyan/50 text-terminal-text',
  danger: 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 text-red-400'
}

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
}

export function ActionGrid({
  actions,
  columns = 3,
  className
}: ActionGridProps) {
  const renderAction = (action: ActionItem) => {
    const Icon = action.icon
    const variant = action.variant || 'secondary'
    
    const content = (
      <>
        <div className="flex items-start justify-between mb-3">
          {Icon && (
            <div className={cn(
              'p-2 rounded',
              variant === 'primary' && 'bg-cyan-500/20',
              variant === 'secondary' && 'bg-terminal-secondary',
              variant === 'danger' && 'bg-red-500/20'
            )}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          {action.badge && (
            <span className="px-2 py-0.5 text-xs font-mono rounded bg-terminal-secondary text-terminal-muted">
              {action.badge}
            </span>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-bold text-terminal-cyan font-mono flex items-center gap-2">
            {action.title}
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-sm text-terminal-muted line-clamp-2">
            {action.description}
          </p>
        </div>
      </>
    )

    const commonClasses = cn(
      'group relative p-4 rounded-lg border transition-all duration-200',
      'hover:shadow-lg hover:shadow-cyan-500/10',
      variantStyles[variant],
      action.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
    )

    if (action.href && !action.disabled) {
      return (
        <Link
          key={action.id}
          href={action.href}
          className={cn(commonClasses, 'block')}
        >
          {content}
        </Link>
      )
    }

    return (
      <button
        key={action.id}
        onClick={action.onClick}
        disabled={action.disabled}
        className={cn(commonClasses, 'w-full text-left')}
      >
        {content}
      </button>
    )
  }

  return (
    <div className={cn(
      'grid gap-4',
      columnClasses[columns],
      className
    )}>
      {actions.map(renderAction)}
    </div>
  )
}

export default ActionGrid
