'use client'

import React, { useState } from 'react'
import { FileText, Link2, Image, Video, Twitter, Check, X, ExternalLink, Calendar, User, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Evidence {
  id: string
  type: 'document' | 'link' | 'image' | 'video' | 'social'
  title: string
  source: string
  url?: string
  date: string
  author?: string
  verified: boolean
  confidence: number
  tags?: string[]
  description?: string
}

interface EvidenceListProps {
  evidence: Evidence[]
  editable?: boolean
  onRemove?: (id: string) => void
  onVerify?: (id: string) => void
  className?: string
}

const typeIcons = {
  document: FileText,
  link: Link2,
  image: Image,
  video: Video,
  social: Twitter
}

const typeColors = {
  document: 'text-blue-400',
  link: 'text-cyan-400',
  image: 'text-purple-400',
  video: 'text-red-400',
  social: 'text-blue-400'
}

export function EvidenceList({
  evidence,
  editable = false,
  onRemove,
  onVerify,
  className
}: EvidenceListProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400'
    if (confidence >= 60) return 'text-yellow-400'
    if (confidence >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-mono font-bold text-terminal-cyan">
          EVIDENCE ({evidence.length})
        </h3>
        {editable && (
          <span className="text-xs text-terminal-muted font-mono">
            Click to expand • Drag to reorder
          </span>
        )}
      </div>

      {/* Evidence Items */}
      <div className="space-y-2">
        {evidence.map((item, index) => {
          const Icon = typeIcons[item.type]
          const isExpanded = expandedItems.has(item.id)

          return (
            <div
              key={item.id}
              className={cn(
                'relative rounded-lg border transition-all duration-200',
                'bg-terminal-secondary border-terminal-border',
                'hover:border-terminal-cyan/50',
                editable && 'cursor-move'
              )}
            >
              {/* Main Content */}
              <div
                className="p-3 cursor-pointer"
                onClick={() => toggleExpanded(item.id)}
              >
                <div className="flex items-start gap-3">
                  {/* Type Icon */}
                  <div className={cn(
                    'flex-shrink-0 p-2 rounded bg-terminal-bg',
                    typeColors[item.type]
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-terminal-text text-sm line-clamp-1">
                          {index + 1}. {item.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-terminal-muted font-mono">
                            {item.source}
                          </span>
                          <span className="text-xs text-terminal-muted">•</span>
                          <span className={cn(
                            'text-xs font-mono',
                            getConfidenceColor(item.confidence)
                          )}>
                            {item.confidence}% confidence
                          </span>
                        </div>
                      </div>

                      {/* Verification Status */}
                      <div className="flex items-center gap-2">
                        {item.verified ? (
                          <div className="flex items-center gap-1 text-green-400">
                            <Check className="w-4 h-4" />
                            <span className="text-xs font-mono">VERIFIED</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-yellow-400">
                            <X className="w-4 h-4" />
                            <span className="text-xs font-mono">UNVERIFIED</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-terminal-border space-y-2">
                        {item.description && (
                          <p className="text-sm text-terminal-muted">
                            {item.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-3 text-xs">
                          {item.date && (
                            <div className="flex items-center gap-1 text-terminal-muted">
                              <Calendar className="w-3 h-3" />
                              <span>{item.date}</span>
                            </div>
                          )}
                          {item.author && (
                            <div className="flex items-center gap-1 text-terminal-muted">
                              <User className="w-3 h-3" />
                              <span>{item.author}</span>
                            </div>
                          )}
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-cyan-400 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>View Source</span>
                            </a>
                          )}
                        </div>

                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map(tag => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-terminal-bg text-terminal-muted"
                              >
                                <Tag className="w-3 h-3" />
                                <span className="text-xs">{tag}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        {editable && (
                          <div className="flex gap-2 pt-2">
                            {!item.verified && onVerify && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onVerify(item.id)
                                }}
                                className="px-3 py-1 rounded bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-xs hover:bg-green-500/20 transition-colors"
                              >
                                VERIFY
                              </button>
                            )}
                            {onRemove && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onRemove(item.id)
                                }}
                                className="px-3 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs hover:bg-red-500/20 transition-colors"
                              >
                                REMOVE
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {evidence.length === 0 && (
        <div className="text-center py-8 text-terminal-muted">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-mono">No evidence collected yet</p>
        </div>
      )}
    </div>
  )
}

export default EvidenceList
