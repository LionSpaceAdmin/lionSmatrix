'use client'

import React, { useState } from 'react'
import { Shield, CheckCircle, AlertTriangle, Users, Target, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PledgeBoxProps {
  title?: string
  description?: string
  points?: string[]
  onAccept?: () => void
  onDecline?: () => void
  acceptText?: string
  disabled?: boolean
  className?: string
  variant?: 'default' | 'compact'
}

export function PledgeBox({
  title = "Commitment to Truth & Responsibility",
  description = "By continuing, you pledge to use this platform responsibly, respect democratic values, and contribute to the fight against disinformation.",
  points = [
    "I will verify information before sharing",
    "I will respect the privacy and dignity of all individuals",
    "I will not use this platform to spread false information",
    "I will report suspicious activity when I encounter it",
    "I will use this tool to protect democratic processes"
  ],
  onAccept,
  onDecline,
  acceptText = "I Accept",
  disabled = false,
  className,
  variant = 'default'
}: PledgeBoxProps) {
  const [accepted, setAccepted] = useState(false)
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  const handleAccept = () => {
    setAccepted(true)
    onAccept?.()
  }

  const pledgePoints = [
    {
      icon: Shield,
      title: 'Truth Above All',
      description: 'I pledge to seek and defend truth, even when it challenges my beliefs.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'I commit to protecting our communities from manipulation and deception.'
    },
    {
      icon: Target,
      title: 'Verified Action',
      description: 'I will verify before I share, and act only on confirmed information.'
    },
    {
      icon: Heart,
      title: 'Ethical Resistance',
      description: 'I will fight disinformation with integrity, never becoming what we oppose.'
    }
  ]

  if (accepted && variant === 'compact') {
    return (
      <div className={cn(
        'p-3 rounded-lg border bg-green-500/10 border-green-500/30',
        className
      )}>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-sm font-mono text-green-400">
            PLEDGE ACCEPTED - Welcome to the resistance
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      'relative overflow-hidden rounded-lg border backdrop-blur-sm',
      'bg-gradient-to-br from-terminal-bg via-terminal-secondary to-terminal-bg',
      'border-terminal-cyan/30',
      className
    )}>
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500 to-transparent animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-full bg-cyan-500/10 mb-4">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-terminal-cyan font-mono mb-2">
            THE LIONS' PLEDGE
          </h2>
          <p className="text-terminal-muted text-sm max-w-md mx-auto">
            Join thousands of digital defenders committed to protecting truth in the information age
          </p>
        </div>

        {/* Mission Statement */}
        <div className="p-4 rounded bg-terminal-bg/50 border border-terminal-border mb-6">
          <p className="text-terminal-text text-center italic">
            "In an era of weaponized lies and algorithmic manipulation, we stand as guardians of truth. 
            We are the Lions of Zion - defenders of facts, protectors of minds, warriors against deception."
          </p>
        </div>

        {/* Pledge Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {pledgePoints.map((point, index) => {
            const Icon = point.icon
            return (
              <div
                key={index}
                className={cn(
                  'p-3 rounded border transition-all duration-200',
                  'bg-terminal-secondary/50 border-terminal-border',
                  'hover:border-cyan-500/50 hover:bg-terminal-secondary',
                  hoveredPoint === index && 'scale-105'
                )}
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-terminal-cyan text-sm mb-1">
                      {point.title}
                    </h3>
                    <p className="text-xs text-terminal-muted">
                      {point.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2 p-3 rounded bg-yellow-500/10 border border-yellow-500/30 mb-6">
          <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-400">
            By accepting this pledge, you commit to ethical information warfare. 
            We fight with facts, not fabrication. We expose lies, not create them.
          </p>
        </div>

        {/* Actions */}
        {!accepted ? (
          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              className={cn(
                'flex-1 px-4 py-3 rounded font-mono font-semibold transition-all duration-200',
                'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400',
                'hover:bg-cyan-500/30 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20'
              )}
            >
              I ACCEPT THE PLEDGE
            </button>
            {onDecline && (
              <button
                onClick={onDecline}
                className={cn(
                  'px-4 py-3 rounded font-mono text-sm transition-all duration-200',
                  'bg-terminal-secondary border border-terminal-border text-terminal-muted',
                  'hover:bg-terminal-secondary/80 hover:border-terminal-border/80'
                )}
              >
                Not Now
              </button>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-3 rounded bg-green-500/10 border border-green-500/30">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="font-mono font-semibold text-green-400">
                PLEDGE ACCEPTED
              </span>
            </div>
            <p className="text-sm text-terminal-muted mt-3">
              Welcome to the resistance. Your journey begins now.
            </p>
          </div>
        )}

        {/* Member Count */}
        <div className="text-center mt-6 pt-6 border-t border-terminal-border">
          <div className="inline-flex items-center gap-2 text-xs text-terminal-muted">
            <Users className="w-4 h-4" />
            <span className="font-mono">
              <span className="text-terminal-cyan font-bold">12,847</span> Lions have taken the pledge
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PledgeBox
