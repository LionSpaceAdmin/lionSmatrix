'use client'

import { Shield, CheckCircle, AlertCircle, AlertTriangle, FileCheck } from 'lucide-react'

// Verification states for content provenance
const verificationStates = {
  verified: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    label: 'Verified',
    description: 'Content authenticity verified'
  },
  partial: {
    icon: AlertCircle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    label: 'Partial',
    description: 'Some metadata verified'
  },
  unverified: {
    icon: AlertTriangle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    label: 'Unverified',
    description: 'No verification available'
  },
  processing: {
    icon: FileCheck,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    label: 'Processing',
    description: 'Verification in progress'
  }
} as const

interface ProvenanceBadgeProps {
  state?: keyof typeof verificationStates
  showDetails?: boolean
  className?: string
}

export function ProvenanceBadge({ 
  state = 'verified', 
  showDetails = false,
  className = ''
}: ProvenanceBadgeProps) {
  const stateInfo = verificationStates[state]
  const Icon = stateInfo.icon

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${stateInfo.bgColor} ${stateInfo.borderColor} ${className}`}>
      <Icon className={`w-4 h-4 ${stateInfo.color}`} />
      <span className={`text-sm font-medium ${stateInfo.color}`}>
        {stateInfo.label}
      </span>
      {showDetails && (
        <span className="text-xs text-terminal-muted ml-2">
          {stateInfo.description}
        </span>
      )}
    </div>
  )
}

export default ProvenanceBadge