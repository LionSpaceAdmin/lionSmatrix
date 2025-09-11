'use client'

import React, { useState } from 'react'
import { EnhancedTerminalBackground } from '../organisms/EnhancedTerminalBackground'
import { AdvancedNetworkVisualization } from '../organisms/AdvancedNetworkVisualization'
import { MatrixDataFlow } from '../organisms/MatrixDataFlow'
import { Brain, Shield, Search, Monitor, Zap, Activity } from 'lucide-react'

export function NetworkVisualizationDemo() {
  const [selectedDemo, setSelectedDemo] = useState<'background' | 'network' | 'matrix'>('background')
  const [networkMode, setNetworkMode] = useState<'intelligence' | 'defense' | 'analysis'>('intelligence')
  const [matrixMode, setMatrixMode] = useState<'intelligence' | 'defense' | 'analysis' | 'warfare'>('intelligence')
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high' | 'extreme'>('medium')

  const demos = {
    background: {
      title: 'Enhanced Terminal Background',
      description: 'Complete background visualization with neural networks and matrix effects',
      icon: Monitor
    },
    network: {
      title: 'Advanced Network Visualization', 
      description: 'Interactive neural network with intelligent connections and data flows',
      icon: Brain
    },
    matrix: {
      title: 'Matrix Data Flow',
      description: 'Digital rain with cyber security terms and technical intelligence words',
      icon: Zap
    }
  }

  const currentDemo = demos[selectedDemo]

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text relative">
      {/* Background visualization for all demos */}
      {selectedDemo === 'background' && (
        <EnhancedTerminalBackground 
          enableControls={true}
          defaultMode="moderate"
        />
      )}
      
      {/* Content Layer */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-terminal-border/30 bg-terminal-bg/80 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <currentDemo.icon className="w-8 h-8 text-terminal-cyan" />
                <div>
                  <h1 className="text-2xl font-terminal font-bold text-terminal-cyan">
                    {currentDemo.title}
                  </h1>
                  <p className="text-sm text-terminal-text/70 font-terminal">
                    {currentDemo.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-terminal-green animate-pulse" />
                <span className="text-xs font-terminal text-terminal-text/70">LIVE DEMO</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Demo Selection */}
        <div className="border-b border-terminal-border/30 bg-terminal-bg/60 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-3">
            <div className="flex gap-4">
              {Object.entries(demos).map(([key, demo]) => (
                <button
                  key={key}
                  onClick={() => setSelectedDemo(key as typeof selectedDemo)}
                  className={`flex items-center gap-2 px-4 py-2 rounded font-terminal text-sm transition-colors ${
                    selectedDemo === key
                      ? 'bg-terminal-cyan/20 text-terminal-cyan border border-terminal-cyan/50'
                      : 'text-terminal-text/70 hover:text-terminal-cyan hover:bg-terminal-cyan/10'
                  }`}
                >
                  <demo.icon className="w-4 h-4" />
                  {demo.title}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 relative">
          {selectedDemo === 'background' && (
            <div className="container mx-auto px-6 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Info Cards */}
                <div className="terminal-card p-6 space-y-4">
                  <h3 className="text-lg font-terminal font-bold text-terminal-cyan">
                    Intelligence Network
                  </h3>
                  <p className="text-sm text-terminal-text/80">
                    Neural network nodes represent intelligence analysis points with dynamic 
                    connections showing data flow between analysis centers.
                  </p>
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-terminal-gold" />
                    <span className="text-xs font-terminal text-terminal-text/70">
                      AI-Powered Analysis
                    </span>
                  </div>
                </div>
                
                <div className="terminal-card p-6 space-y-4">
                  <h3 className="text-lg font-terminal font-bold text-terminal-cyan">
                    Matrix Data Flow
                  </h3>
                  <p className="text-sm text-terminal-text/80">
                    Real-time data streams showing intelligence terms, technical concepts,
                    and cyber warfare indicators flowing through the system.
                  </p>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-terminal-gold" />
                    <span className="text-xs font-terminal text-terminal-text/70">
                      Real-time Processing
                    </span>
                  </div>
                </div>
                
                <div className="terminal-card p-6 space-y-4">
                  <h3 className="text-lg font-terminal font-bold text-terminal-cyan">
                    Defense Matrix
                  </h3>
                  <p className="text-sm text-terminal-text/80">
                    Advanced terminal interface with enhanced visual effects for 
                    cyber defense operations and threat analysis.
                  </p>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-terminal-gold" />
                    <span className="text-xs font-terminal text-terminal-text/70">
                      Defense Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {selectedDemo === 'network' && (
            <div className="h-[calc(100vh-200px)] p-6">
              <div className="h-full grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Controls */}
                <div className="xl:col-span-1 space-y-4">
                  <div className="terminal-card p-4">
                    <h3 className="text-sm font-terminal font-bold text-terminal-cyan mb-3">
                      NETWORK CONTROLS
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-terminal text-terminal-text/70 mb-1">
                          MODE
                        </label>
                        <select
                          value={networkMode}
                          onChange={(e) => setNetworkMode(e.target.value as typeof networkMode)}
                          className="w-full bg-terminal-bg border border-terminal-border/50 text-terminal-text font-terminal text-xs p-2 rounded"
                        >
                          <option value="intelligence">Intelligence</option>
                          <option value="defense">Defense</option>
                          <option value="analysis">Analysis</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-terminal text-terminal-text/70 mb-1">
                          DENSITY
                        </label>
                        <select
                          value={intensity}
                          onChange={(e) => setIntensity(e.target.value as typeof intensity)}
                          className="w-full bg-terminal-bg border border-terminal-border/50 text-terminal-text font-terminal text-xs p-2 rounded"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Network Visualization */}
                <div className="xl:col-span-3">
                  <AdvancedNetworkVisualization
                    density={intensity === 'low' ? 'low' : intensity === 'medium' ? 'medium' : 'high'}
                    mode={networkMode}
                    showMatrix={true}
                    showDataFlow={true}
                    interactive={true}
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          )}
          
          {selectedDemo === 'matrix' && (
            <div className="h-[calc(100vh-200px)] p-6">
              <div className="h-full grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Controls */}
                <div className="xl:col-span-1 space-y-4">
                  <div className="terminal-card p-4">
                    <h3 className="text-sm font-terminal font-bold text-terminal-cyan mb-3">
                      MATRIX CONTROLS
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-terminal text-terminal-text/70 mb-1">
                          MODE
                        </label>
                        <select
                          value={matrixMode}
                          onChange={(e) => setMatrixMode(e.target.value as typeof matrixMode)}
                          className="w-full bg-terminal-bg border border-terminal-border/50 text-terminal-text font-terminal text-xs p-2 rounded"
                        >
                          <option value="intelligence">Intelligence</option>
                          <option value="defense">Defense</option>
                          <option value="analysis">Analysis</option>
                          <option value="warfare">Warfare</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-terminal text-terminal-text/70 mb-1">
                          INTENSITY
                        </label>
                        <select
                          value={intensity}
                          onChange={(e) => setIntensity(e.target.value as typeof intensity)}
                          className="w-full bg-terminal-bg border border-terminal-border/50 text-terminal-text font-terminal text-xs p-2 rounded"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="extreme">Extreme</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Matrix Legend */}
                  <div className="terminal-card p-4">
                    <h4 className="text-xs font-terminal font-bold text-terminal-cyan mb-2">
                      DATA STREAMS
                    </h4>
                    <div className="space-y-2 text-xs font-terminal">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-terminal-cyan rounded-full" />
                        <span className="text-terminal-text/70">Intelligence</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-terminal-gold rounded-full" />
                        <span className="text-terminal-text/70">Technical</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-terminal-red rounded-full" />
                        <span className="text-terminal-text/70">Threats</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-terminal-green rounded-full" />
                        <span className="text-terminal-text/70">Operations</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Matrix Visualization */}
                <div className="xl:col-span-3">
                  <MatrixDataFlow
                    intensity={intensity}
                    mode={matrixMode}
                    showHorizontalStreams={true}
                    showVerticalMatrix={true}
                    highlightThreats={intensity === 'extreme'}
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
        
        {/* Footer */}
        <footer className="border-t border-terminal-border/30 bg-terminal-bg/80 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between text-xs font-terminal text-terminal-text/70">
              <div>
                Lions of Zion Platform - Advanced Network Visualization System
              </div>
              <div className="flex items-center gap-4">
                <span>Mode: {selectedDemo.toUpperCase()}</span>
                <span>Status: OPERATIONAL</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse" />
                  <span>LIVE</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}