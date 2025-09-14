'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ImpactData {
  month: string
  narratives: number
  factChecks: number
  threats: number
}

interface ImpactChartProps {
  data: ImpactData[]
  className?: string
}

export function ImpactChart({ data, className }: ImpactChartProps) {
  const maxValue = Math.max(...data.map(d => Math.max(d.narratives, d.factChecks, d.threats)))
  
  return (
    <div className={cn('w-full h-64 bg-terminal-secondary border border-terminal-border rounded-lg p-4', className)}>
      <div className="text-terminal-cyan font-terminal text-sm mb-4">IMPACT METRICS</div>
      <div className="flex items-end justify-between h-48 space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="flex flex-col space-y-1 w-full">
              {/* Narratives */}
              <div 
                className="bg-terminal-cyan h-8 rounded-t"
                style={{ height: `${(item.narratives / maxValue) * 100}%` }}
                title={`Narratives: ${item.narratives}`}
              />
              {/* Fact Checks */}
              <div 
                className="bg-terminal-gold h-8"
                style={{ height: `${(item.factChecks / maxValue) * 100}%` }}
                title={`Fact Checks: ${item.factChecks}`}
              />
              {/* Threats */}
              <div 
                className="bg-terminal-red h-8 rounded-b"
                style={{ height: `${(item.threats / maxValue) * 100}%` }}
                title={`Threats: ${item.threats}`}
              />
            </div>
            <div className="text-terminal-text text-xs mt-2 transform -rotate-45 origin-left">
              {item.month}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-6 mt-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-terminal-cyan rounded"></div>
          <span className="text-terminal-text">Narratives</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-terminal-gold rounded"></div>
          <span className="text-terminal-text">Fact Checks</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-terminal-red rounded"></div>
          <span className="text-terminal-text">Threats</span>
        </div>
      </div>
    </div>
  )
}
