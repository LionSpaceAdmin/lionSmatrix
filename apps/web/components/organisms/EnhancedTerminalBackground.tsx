'use client'

import React, { useState, useEffect } from 'react'
import { AdvancedNetworkVisualization } from './AdvancedNetworkVisualization'
import { MatrixDataFlow } from './MatrixDataFlow'
import { Settings, Eye, EyeOff, Activity, Zap } from 'lucide-react'

interface EnhancedTerminalBackgroundProps {
  className?: string
  enableControls?: boolean
  defaultMode?: 'minimal' | 'moderate' | 'full' | 'extreme'
}

export function EnhancedTerminalBackground({
  className = '',
  enableControls = false,
  defaultMode = 'moderate'
}: EnhancedTerminalBackgroundProps) {
  const [mode, setMode] = useState(defaultMode)
  const [showNetworkViz, setShowNetworkViz] = useState(true)
  const [showMatrixFlow, setShowMatrixFlow] = useState(true)
  const [networkMode, setNetworkMode] = useState<'intelligence' | 'defense' | 'analysis'>('intelligence')
  const [matrixMode, setMatrixMode] = useState<'intelligence' | 'defense' | 'analysis' | 'warfare'>('intelligence')
  const [controlsVisible, setControlsVisible] = useState(false)

  // Mode configurations
  const modeConfigs = {
    minimal: {
      networkDensity: 'low' as const,
      matrixIntensity: 'low' as const,
      showMatrix: false,
      showDataFlow: true,
      networkInteractive: false
    },
    moderate: {
      networkDensity: 'medium' as const,
      matrixIntensity: 'medium' as const,
      showMatrix: true,
      showDataFlow: true,
      networkInteractive: false
    },
    full: {
      networkDensity: 'high' as const,
      matrixIntensity: 'high' as const,
      showMatrix: true,
      showDataFlow: true,
      networkInteractive: true
    },
    extreme: {
      networkDensity: 'high' as const,
      matrixIntensity: 'extreme' as const,
      showMatrix: true,
      showDataFlow: true,
      networkInteractive: true
    }
  }

  const currentConfig = modeConfigs[mode]

  // Sync network and matrix modes
  useEffect(() => {
    if (networkMode !== matrixMode && matrixMode !== 'warfare') {
      setMatrixMode(networkMode)
    }
  }, [networkMode, matrixMode])

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Enhanced Terminal Grid */}
      <div className="terminal-grid" />
      
      {/* Network Visualization Layer */}
      {showNetworkViz && (
        <div className="absolute inset-0 opacity-80">
          <AdvancedNetworkVisualization
            density={currentConfig.networkDensity}
            mode={networkMode}
            showMatrix={currentConfig.showMatrix}
            showDataFlow={currentConfig.showDataFlow}
            interactive={currentConfig.networkInteractive}
          />
        </div>
      )}
      
      {/* Matrix Data Flow Layer */}
      {showMatrixFlow && (
        <div className="absolute inset-0 opacity-60">
          <MatrixDataFlow
            intensity={currentConfig.matrixIntensity}
            mode={matrixMode}
            showHorizontalStreams={currentConfig.showDataFlow}
            showVerticalMatrix={currentConfig.showMatrix}
            highlightThreats={mode === 'extreme'}
          />
        </div>
      )}
      
      {/* Additional Visual Effects */}
      <div className="absolute inset-0">
        {/* Scanning Lines */}
        {mode !== 'minimal' && (
          <>
            <div className="scanline" />
            {mode === 'extreme' && (
              <div className="scanline" style={{ animationDelay: '4s', opacity: 0.3 }} />
            )}
          </>
        )}
        
        {/* Data Flow Lines */}
        {currentConfig.showDataFlow && (
          <>
            {[...Array(mode === 'extreme' ? 8 : mode === 'full' ? 5 : 3)].map((_, i) => (
              <div
                key={`data-flow-${i}`}
                className="data-flow-line animate-data-flow"
                style={{
                  top: `${20 + i * 15}%`,
                  left: '-100%',
                  width: '200%',
                  animationDelay: `${i * 1.5}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
            
            {mode === 'extreme' && (
              <>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={`data-flow-vertical-${i}`}
                    className="data-flow-vertical animate-data-flow-vertical"
                    style={{
                      left: `${30 + i * 25}%`,
                      top: '-100%',
                      height: '200%',
                      animationDelay: `${i * 2}s`
                    }}
                  />
                ))}
              </>
            )}
          </>
        )}
        
        {/* Network Nodes */}
        {mode !== 'minimal' && (
          <>
            {[...Array(mode === 'extreme' ? 12 : mode === 'full' ? 8 : 5)].map((_, i) => (
              <div
                key={`network-node-${i}`}
                className="network-node animate-node-pulse"
                style={{
                  left: `${Math.random() * 90 + 5}%`,
                  top: `${Math.random() * 90 + 5}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </>
        )}
      </div>
      
      {/* Control Panel */}
      {enableControls && (
        <div className="absolute top-4 right-4 pointer-events-auto z-50">
          <div className="relative">
            <button
              onClick={() => setControlsVisible(!controlsVisible)}
              className="terminal-button p-2 rounded bg-terminal-bg/80 backdrop-blur-sm border border-terminal-border/50"
              aria-label="Toggle visualization controls"
            >
              <Settings className="w-4 h-4 text-terminal-cyan" />
            </button>
            
            {controlsVisible && (
              <div className="absolute top-full right-0 mt-2 bg-terminal-bg/90 backdrop-blur-sm border border-terminal-border/50 rounded p-4 min-w-64">
                <h3 className="text-terminal-cyan font-terminal text-sm font-bold mb-3">
                  VISUALIZATION CONTROLS
                </h3>
                
                {/* Mode Selection */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-terminal-text/70 text-xs font-terminal mb-1">
                      INTENSITY MODE
                    </label>
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value as typeof mode)}
                      className="w-full bg-terminal-bg border border-terminal-border/50 text-terminal-text font-terminal text-xs p-2 rounded"
                    >
                      <option value="minimal">MINIMAL</option>
                      <option value="moderate">MODERATE</option>
                      <option value="full">FULL</option>
                      <option value="extreme">EXTREME</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-terminal-text/70 text-xs font-terminal mb-1">
                      NETWORK MODE
                    </label>
                    <select
                      value={networkMode}
                      onChange={(e) => setNetworkMode(e.target.value as typeof networkMode)}
                      className="w-full bg-terminal-bg border border-terminal-border/50 text-terminal-text font-terminal text-xs p-2 rounded"
                    >
                      <option value="intelligence">INTELLIGENCE</option>
                      <option value="defense">DEFENSE</option>
                      <option value="analysis">ANALYSIS</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-terminal-text/70 text-xs font-terminal mb-1">
                      MATRIX MODE
                    </label>
                    <select
                      value={matrixMode}
                      onChange={(e) => setMatrixMode(e.target.value as typeof matrixMode)}
                      className="w-full bg-terminal-bg border border-terminal-border/50 text-terminal-text font-terminal text-xs p-2 rounded"
                    >
                      <option value="intelligence">INTELLIGENCE</option>
                      <option value="defense">DEFENSE</option>
                      <option value="analysis">ANALYSIS</option>
                      <option value="warfare">WARFARE</option>
                    </select>
                  </div>
                  
                  {/* Layer Controls */}
                  <div className="space-y-2 pt-2 border-t border-terminal-border/30">
                    <button
                      onClick={() => setShowNetworkViz(!showNetworkViz)}
                      className="flex items-center gap-2 w-full text-left text-xs font-terminal text-terminal-text/70 hover:text-terminal-cyan"
                    >
                      {showNetworkViz ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      Network Visualization
                    </button>
                    
                    <button
                      onClick={() => setShowMatrixFlow(!showMatrixFlow)}
                      className="flex items-center gap-2 w-full text-left text-xs font-terminal text-terminal-text/70 hover:text-terminal-cyan"
                    >
                      {showMatrixFlow ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      Matrix Data Flow
                    </button>
                  </div>
                  
                  {/* Status */}
                  <div className="pt-2 border-t border-terminal-border/30">
                    <div className="flex items-center gap-2 text-xs font-terminal">
                      <Activity className="w-3 h-3 text-terminal-green animate-pulse" />
                      <span className="text-terminal-text/70">
                        Status: {mode.toUpperCase()} MODE
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-terminal mt-1">
                      <Zap className="w-3 h-3 text-terminal-gold" />
                      <span className="text-terminal-text/70">
                        Performance: {mode === 'extreme' ? 'HIGH' : mode === 'full' ? 'MEDIUM' : 'LOW'} LOAD
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Performance Warning */}
      {mode === 'extreme' && (
        <div className="absolute bottom-4 left-4 bg-terminal-red/20 border border-terminal-red/50 text-terminal-red text-xs font-terminal p-2 rounded pointer-events-auto">
          ⚠ EXTREME MODE: High performance impact
        </div>
      )}
    </div>
  )
}