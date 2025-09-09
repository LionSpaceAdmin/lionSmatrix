'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { INTELLIGENCE_DATA } from '@/lib/intelligence-data'

interface ActorData {
  name: string
  alias: string
  followers: string
  platforms: string[]
  risk_level: string
  keywords: string[]
  narratives: string[]
  network_connections: string[]
  activity_summary: string
  last_activity: string
  engagement_rate: string
  content_frequency: string
}

interface IntelligencePanelProps {
  actor: string | null
  onClose: () => void
}

const IntelligencePanel: React.FC<IntelligencePanelProps> = ({ actor, onClose }) => {
  const [actorData, setActorData] = useState<ActorData | null>(null)
  
  useEffect(() => {
    if (actor) {
      const actorEntry = (INTELLIGENCE_DATA.intelligence_panel_data as Record<string, ActorData>)[actor];
      if (actorEntry) {
        setActorData(actorEntry);
      } else {
        setActorData(null);
      }
    } else {
      setActorData(null);
    }
  }, [actor])
  
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH': return 'text-red-500 bg-red-500/10 border-red-500/30'
      case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30'
      case 'LOW': return 'text-green-500 bg-green-500/10 border-green-500/30'
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30'
    }
  }
  
  return (
    <AnimatePresence>
      {actorData && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-black/95 backdrop-blur-lg border-l border-green-500/30 z-50 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="intelligence-panel-title"
            aria-describedby="intelligence-panel-description"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-green-500/20">
                <div className="flex items-center justify-between">
                  <h2 
                    id="intelligence-panel-title"
                    className="text-2xl font-bold text-green-400 font-mono"
                  >
                    INTELLIGENCE PROFILE
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-green-400 hover:text-green-300 transition-colors p-2 focus-terminal"
                    aria-label="Close intelligence profile panel"
                  >
                    <svg 
                      className="w-6 h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div 
                id="intelligence-panel-description"
                className="flex-1 overflow-y-auto p-6 space-y-6"
                role="main"
              >
                {/* Primary Info */}
                <section className="space-y-4" aria-labelledby="actor-info-heading">
                  <div>
                    <h3 
                      id="actor-info-heading"
                      className="text-xl font-bold text-green-300 mb-2 font-mono"
                    >
                      {actorData.name}
                    </h3>
                    <p className="text-green-400/70 font-mono text-sm" aria-label="Actor alias">@{actorData.alias}</p>
                  </div>
                  
                  {/* Risk Level */}
                  <div className="flex items-center space-x-4" role="group" aria-label="Risk assessment">
                    <span className="text-green-400/70 font-mono text-sm">RISK LEVEL:</span>
                    <span 
                      className={`px-3 py-1 rounded-full border font-mono text-sm font-bold ${getRiskColor(actorData.risk_level)}`}
                      role="status"
                      aria-label={`Risk level: ${actorData.risk_level}`}
                    >
                      {actorData.risk_level}
                    </span>
                  </div>
                  
                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-500/5 border border-green-500/20 rounded p-3">
                      <p className="text-green-400/70 text-xs font-mono mb-1">FOLLOWERS</p>
                      <p className="text-green-300 font-bold font-mono">{actorData.followers}</p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded p-3">
                      <p className="text-green-400/70 text-xs font-mono mb-1">ENGAGEMENT</p>
                      <p className="text-green-300 font-bold font-mono">{actorData.engagement_rate || 'N/A'}</p>
                    </div>
                  </div>
                </section>
                
                {/* Platforms */}
                <div>
                  <h4 className="text-green-400 font-mono text-sm mb-2">PLATFORMS</h4>
                  <div className="flex flex-wrap gap-2">
                    {actorData.platforms.map((platform: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-500/10 border border-green-500/30 rounded text-green-300 text-xs font-mono"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Keywords */}
                <div>
                  <h4 className="text-green-400 font-mono text-sm mb-2">KEYWORDS</h4>
                  <div className="flex flex-wrap gap-2">
                    {actorData.keywords.map((keyword: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-300 text-xs font-mono"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Narratives */}
                <div>
                  <h4 className="text-green-400 font-mono text-sm mb-2">NARRATIVES</h4>
                  <ul className="space-y-2">
                    {actorData.narratives.map((narrative: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">▸</span>
                        <span className="text-green-300/80 text-sm font-mono">{narrative}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Network Connections */}
                <div>
                  <h4 className="text-green-400 font-mono text-sm mb-2">NETWORK CONNECTIONS</h4>
                  <div className="flex flex-wrap gap-2">
                    {actorData.network_connections.map((connection: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-300 text-xs font-mono"
                      >
                        {connection}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Activity Summary */}
                <div>
                  <h4 className="text-green-400 font-mono text-sm mb-2">ACTIVITY SUMMARY</h4>
                  <div className="bg-green-500/5 border border-green-500/20 rounded p-4">
                    <p className="text-green-300/80 text-sm font-mono leading-relaxed">
                      {actorData.activity_summary}
                    </p>
                  </div>
                </div>
                
                {/* Additional Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-500/5 border border-green-500/20 rounded p-3">
                    <p className="text-green-400/70 text-xs font-mono mb-1">LAST ACTIVITY</p>
                    <p className="text-green-300 text-sm font-mono">{actorData.last_activity}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded p-3">
                    <p className="text-green-400/70 text-xs font-mono mb-1">POST FREQUENCY</p>
                    <p className="text-green-300 text-sm font-mono">{actorData.content_frequency}</p>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-green-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-green-400/50 text-xs font-mono">
                    INTEL UPDATED: {new Date().toISOString().split('T')[0]}
                  </span>
                  <span className="text-green-400/50 text-xs font-mono">
                    CLASSIFICATION: UNCLASSIFIED
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default React.memo(IntelligencePanel)