'use client'

import React from 'react'
import { Clock, AlertTriangle, Shield, TrendingUp, Users, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NarrativeData {
  id: string
  title: string
  description: string
  threatLevel: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  evidenceCount: number
  lastUpdated: string
  region?: string
  topics?: string[]
  impactScore?: number
  engagementCount?: number
}

interface NarrativeCardProps {
  narrative: NarrativeData
  onFactCheck?: () => void
  onViewDetails?: () => void
  className?: string
  compact?: boolean
}

const threatColors = {
  low: 'border-green-500/30 bg-green-500/5',
  medium: 'border-yellow-500/30 bg-yellow-500/5',
  high: 'border-orange-500/30 bg-orange-500/5',
  critical: 'border-red-500/30 bg-red-500/5'
}

const threatIcons = {
  low: 'text-green-400',
  medium: 'text-yellow-400',
  high: 'text-orange-400',
  critical: 'text-red-400'
}

export function NarrativeCard({
  narrative,
  onFactCheck,
  onViewDetails,
  className,
  compact = false
}: NarrativeCardProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffHours < 48) return 'Yesterday'
    return `${Math.floor(diffHours / 24)}d ago`
  }

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-lg border backdrop-blur-sm transition-all duration-300',
        'hover:shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-500/50',
        threatColors[narrative.threatLevel],
        className
      )}
    >
      <div className="absolute top-0 right-0 p-3">
        <div className={cn('flex items-center gap-1', threatIcons[narrative.threatLevel])}>
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-mono uppercase">{narrative.threatLevel}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3 pr-20">
          <h3 className="font-bold text-terminal-cyan line-clamp-2 mb-1">
            {narrative.title}
          </h3>
          
          {narrative.topics && narrative.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {narrative.topics.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>

        {!compact && (
          <p className="text-sm text-terminal-muted line-clamp-3 mb-4">
            {narrative.description}
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-terminal-cyan" />
            <div>
              <div className="text-xs text-terminal-muted font-mono">CONFIDENCE</div>
              <div className="text-sm font-bold text-terminal-text">
                {narrative.confidence}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-terminal-cyan" />
            <div>
              <div className="text-xs text-terminal-muted font-mono">EVIDENCE</div>
              <div className="text-sm font-bold text-terminal-text">
                {narrative.evidenceCount}
              </div>
            </div>
          </div>

          {narrative.impactScore && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-terminal-cyan" />
              <div>
                <div className="text-xs text-terminal-muted font-mono">IMPACT</div>
                <div className="text-sm font-bold text-terminal-text">
                  {narrative.impactScore}k
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-terminal-cyan" />
            <div>
              <div className="text-xs text-terminal-muted font-mono">UPDATED</div>
              <div className="text-sm font-bold text-terminal-text">
                {formatTimeAgo(narrative.lastUpdated)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onFactCheck}
            className="flex-1 px-3 py-2 rounded bg-cyan-500/10 border border-cyan-500/30 
                     text-cyan-400 font-mono text-sm hover:bg-cyan-500/20 
                     hover:border-cyan-500/50 transition-all duration-200"
          >
            FACT-CHECK
          </button>
          <button
            onClick={onViewDetails}
            className="px-3 py-2 rounded bg-terminal-secondary border border-terminal-border 
                     text-terminal-text font-mono text-sm hover:bg-terminal-secondary/80 
                     hover:border-terminal-cyan/50 transition-all duration-200
                     flex items-center gap-1"
          >
            <span>DETAILS</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />
        </div>
      </div>
    </article>
  )
}

export default NarrativeCard
