'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Shield, Activity, AlertTriangle, Users, Globe, Lock, Terminal, Database, Network } from 'lucide-react'
import { StatusIndicator } from '@/app/_components/terminal/status-indicator'

// Dynamically import components to avoid SSR issues with canvas
const MatrixBackground = dynamic(
  () => import('../../_components/visuals/MatrixBackground').then(mod => ({ default: mod.MatrixBackground })),
  { ssr: false }
)
const NeuralNetworkCanvas = dynamic(
  () => import('../../_components/visuals/NeuralNetworkCanvas').then(mod => ({ default: mod.NeuralNetworkCanvas })),
  { ssr: false }
)
const IntelligencePanel = dynamic(
  () => import('../../_components/visuals/IntelligencePanel').then(mod => ({ default: mod.IntelligencePanel })),
  { ssr: false }
)

export default function WarRoom() {
  const [selectedActor, setSelectedActor] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  useEffect(() => {
    // Ensure client-side rendering
    setIsLoaded(true)
    
    // Update time
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  const handleNodeClick = (actor: string | null) => {
    setSelectedActor(actor)
  }
  
  const handleClosePanel = () => {
    setSelectedActor(null)
  }
  
  const systemStats = [
    { label: 'ACTORS', value: '14', icon: <Users className="w-4 h-4" /> },
    { label: 'CONNECTIONS', value: '47', icon: <Network className="w-4 h-4" /> },
    { label: 'THREATS', value: '7', icon: <AlertTriangle className="w-4 h-4" />, color: 'red' },
    { label: 'SECURE', value: '98%', icon: <Lock className="w-4 h-4" />, color: 'green' }
  ]
  
  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-terminal-bg flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-terminal-cyan mx-auto mb-4 animate-pulse" />
          <div className="text-terminal-cyan font-terminal text-xl">
            INITIALIZING WAR ROOM...
          </div>
          <div className="mt-2 text-terminal-muted text-sm">
            Loading intelligence systems
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-terminal-bg font-terminal">
      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-terminal-secondary/90 backdrop-blur-sm border-b border-terminal-border">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-terminal-cyan" />
              <h1 className="text-2xl font-bold text-terminal-cyan terminal-glow">
                WAR ROOM v3.0
              </h1>
            </div>
            <span className="text-sm text-terminal-gold">
              INTELLIGENCE COMMAND CENTER
            </span>
          </div>
          <div className="flex items-center gap-6">
            <StatusIndicator status="online" label="SYSTEM ACTIVE" />
            <span className="text-xs text-terminal-muted">
              {currentTime.toLocaleTimeString('en-US', { 
                hour12: false,
                timeZone: 'UTC'
              })} UTC
            </span>
          </div>
        </div>
      </div>
      
      {/* Instructions Panel */}
      <div className="absolute bottom-6 left-6 z-30 max-w-md">
        <div className="terminal-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-4 h-4 text-terminal-cyan" />
            <span className="text-xs font-bold text-terminal-cyan uppercase">Operation Instructions</span>
          </div>
          <p className="text-xs text-terminal-muted leading-relaxed">
            INTERACT with network nodes to access intelligence profiles. 
            ANALYZE connections between actors. Risk assessment: 
            <span className="text-terminal-red font-bold"> CRITICAL</span>,
            <span className="text-terminal-gold font-bold"> ELEVATED</span>,
            <span className="text-terminal-green font-bold"> MINIMAL</span>.
          </p>
        </div>
      </div>
      
      {/* Stats Panel */}
      <div className="absolute top-20 right-6 z-30">
        <div className="terminal-card p-4 min-w-[200px]">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-terminal-cyan" />
            <span className="text-xs font-bold text-terminal-cyan uppercase">System Metrics</span>
          </div>
          <div className="space-y-3">
            {systemStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-terminal-${stat.color || 'cyan'}`}>
                    {stat.icon}
                  </span>
                  <span className="text-xs text-terminal-muted uppercase">{stat.label}:</span>
                </div>
                <span className={`text-sm font-bold text-terminal-${stat.color || 'text'}`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-terminal-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-terminal-muted">STATUS:</span>
              <span className="text-xs font-bold text-terminal-green animate-pulse">
                MONITORING
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Threat Level Indicator */}
      <div className="absolute top-20 left-6 z-30">
        <div className="terminal-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-terminal-gold" />
            <span className="text-xs font-bold text-terminal-gold uppercase">Global Threat Level</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-2 h-6 bg-terminal-green rounded-sm"></div>
              <div className="w-2 h-6 bg-terminal-green rounded-sm"></div>
              <div className="w-2 h-6 bg-terminal-gold rounded-sm"></div>
              <div className="w-2 h-6 bg-terminal-gold rounded-sm"></div>
              <div className="w-2 h-6 bg-terminal-red/30 rounded-sm"></div>
            </div>
            <span className="text-sm font-bold text-terminal-gold">ELEVATED</span>
          </div>
        </div>
      </div>
      
      {/* Matrix Background Layer */}
      <MatrixBackground />
      
      {/* Neural Network Visualization Layer */}
      <div className="absolute inset-0 pt-16">
        <NeuralNetworkCanvas onNodeClick={handleNodeClick} />
      </div>
      
      {/* Intelligence Panel */}
      <IntelligencePanel actor={selectedActor} onClose={handleClosePanel} />
      
      {/* Grid Overlay Effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-20 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(110, 231, 183, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(110, 231, 183, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-25">
        <div className="scanline" />
      </div>
    </div>
  )
}