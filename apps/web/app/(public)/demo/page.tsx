'use client'

import { useState } from 'react'
import { Eye, Shield, Search, TrendingUp, Settings, Zap, Brain, Target } from 'lucide-react'
import { EnhancedTerminalBackground } from '@/components/organisms/EnhancedTerminalBackground'
import { NetworkVisualizationDemo } from '@/components/examples/NetworkVisualizationDemo'

export default function DemoPage() {
  const [currentMode, setCurrentMode] = useState<'intelligence' | 'defense' | 'analysis' | 'warfare'>('intelligence')
  const [currentIntensity, setCurrentIntensity] = useState<'low' | 'medium' | 'high' | 'extreme'>('medium')

  const modes = [
    {
      id: 'intelligence' as const,
      name: 'Intelligence',
      icon: Eye,
      description: 'Subtle monitoring mode with gentle network connections',
      color: 'text-blue-400'
    },
    {
      id: 'defense' as const,
      name: 'Defense',
      icon: Shield,
      description: 'Active defense mode with dynamic connections',
      color: 'text-green-400'
    },
    {
      id: 'analysis' as const,
      name: 'Analysis',
      icon: TrendingUp,
      description: 'Data-heavy analysis mode with intensive matrix flow',
      color: 'text-yellow-400'
    },
    {
      id: 'warfare' as const,
      name: 'Warfare',
      icon: Target,
      description: 'Aggressive warfare mode with maximum activity',
      color: 'text-red-400'
    }
  ]

  const intensities = [
    { id: 'low' as const, name: 'Low', description: 'Minimal effects for performance' },
    { id: 'medium' as const, name: 'Medium', description: 'Balanced effects' },
    { id: 'high' as const, name: 'High', description: 'Enhanced effects' },
    { id: 'extreme' as const, name: 'Extreme', description: 'Maximum effects' }
  ]

  return (
    <main className="relative min-h-screen">
      {/* Enhanced Terminal Background */}
      <EnhancedTerminalBackground 
        intensity={currentIntensity}
        mode={currentMode}
        className="fixed inset-0 z-0"
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Brain className="w-16 h-16 text-terminal-cyan" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-mono text-terminal-cyan mb-4">
              NEURAL NETWORK DEMO
            </h1>
            <p className="text-xl text-terminal-muted max-w-3xl mx-auto">
              Experience the advanced visual effects powering Lions of Zion. 
              Neural networks, matrix data flows, and intelligent connections in real-time.
            </p>
          </div>

          {/* Controls Panel */}
          <div className="p-6 bg-terminal-secondary/90 border border-terminal-border rounded-lg mb-8">
            <h2 className="text-2xl font-bold text-terminal-text mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Live Controls
            </h2>

            {/* Mode Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-terminal-text mb-4">Background Mode</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {modes.map(({ id, name, icon: Icon, description, color }) => (
                  <button
                    key={id}
                    onClick={() => setCurrentMode(id)}
                    className={`p-4 border rounded-lg transition-all duration-300 text-left ${
                      currentMode === id
                        ? 'border-terminal-cyan bg-terminal-cyan/10 text-terminal-cyan'
                        : 'border-terminal-border bg-terminal-bg/50 text-terminal-text hover:border-terminal-cyan/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`w-6 h-6 ${currentMode === id ? 'text-terminal-cyan' : color}`} />
                      <span className="font-mono font-bold">{name}</span>
                    </div>
                    <p className="text-sm text-terminal-muted">{description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-terminal-text mb-4">Effect Intensity</h3>
              <div className="flex flex-wrap gap-3">
                {intensities.map(({ id, name, description }) => (
                  <button
                    key={id}
                    onClick={() => setCurrentIntensity(id)}
                    className={`px-4 py-2 border rounded font-mono transition-all duration-300 ${
                      currentIntensity === id
                        ? 'border-terminal-cyan bg-terminal-cyan/10 text-terminal-cyan'
                        : 'border-terminal-border bg-terminal-bg/50 text-terminal-text hover:border-terminal-cyan/50'
                    }`}
                    title={description}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Settings Display */}
            <div className="p-4 bg-terminal-bg/80 border border-terminal-border rounded">
              <div className="flex items-center gap-4 text-sm font-mono">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-terminal-cyan" />
                  <span className="text-terminal-muted">Mode:</span>
                  <span className="text-terminal-cyan font-bold">{currentMode.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-terminal-cyan" />
                  <span className="text-terminal-muted">Intensity:</span>
                  <span className="text-terminal-cyan font-bold">{currentIntensity.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-terminal-secondary/80 border border-terminal-border rounded-lg">
              <h3 className="text-xl font-bold text-terminal-text mb-3 flex items-center gap-2">
                <Brain className="w-6 h-6 text-terminal-cyan" />
                Neural Network
              </h3>
              <p className="text-terminal-muted mb-4">
                Intelligent nodes that form dynamic connections. Watch as the network adapts and evolves based on the selected mode.
              </p>
              <ul className="text-sm text-terminal-muted space-y-1">
                <li>• Dynamic node connections</li>
                <li>• Data packet transmission</li>
                <li>• Adaptive network topology</li>
              </ul>
            </div>

            <div className="p-6 bg-terminal-secondary/80 border border-terminal-border rounded-lg">
              <h3 className="text-xl font-bold text-terminal-text mb-3 flex items-center gap-2">
                <Search className="w-6 h-6 text-terminal-cyan" />
                Matrix Data Flow
              </h3>
              <p className="text-terminal-muted mb-4">
                Digital rain effect with cyber security terminology. Real words from intelligence operations flow through the matrix.
              </p>
              <ul className="text-sm text-terminal-muted space-y-1">
                <li>• Vertical/horizontal streams</li>
                <li>• OSINT/SIGINT terminology</li>
                <li>• Variable speed animation</li>
              </ul>
            </div>

            <div className="p-6 bg-terminal-secondary/80 border border-terminal-border rounded-lg">
              <h3 className="text-xl font-bold text-terminal-text mb-3 flex items-center gap-2">
                <Target className="w-6 h-6 text-terminal-cyan" />
                Performance Optimized
              </h3>
              <p className="text-terminal-muted mb-4">
                Hardware-accelerated animations with reduced motion support. Built for production deployment.
              </p>
              <ul className="text-sm text-terminal-muted space-y-1">
                <li>• GPU acceleration</li>
                <li>• Accessibility compliant</li>
                <li>• Battery-friendly</li>
              </ul>
            </div>
          </div>

          {/* Interactive Demo Component */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-terminal-text mb-6 text-center">
              Interactive Network Visualization
            </h2>
            <NetworkVisualizationDemo />
          </div>

          {/* Technical Specs */}
          <div className="p-6 bg-terminal-secondary/90 border border-terminal-border rounded-lg">
            <h2 className="text-2xl font-bold text-terminal-text mb-6">Technical Specifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-terminal-text mb-3">Animation Features</h3>
                <ul className="space-y-2 text-terminal-muted">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-terminal-cyan rounded-full"></span>
                    60+ custom CSS animations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-terminal-cyan rounded-full"></span>
                    Hardware-accelerated transforms
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-terminal-cyan rounded-full"></span>
                    Dynamic neural connections
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-terminal-cyan rounded-full"></span>
                    Matrix digital rain effects
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-terminal-cyan rounded-full"></span>
                    Multi-layer data flows
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-terminal-text mb-3">Performance & Accessibility</h3>
                <ul className="space-y-2 text-terminal-muted">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-terminal-green rounded-full"></span>
                    Reduced motion compliance (WCAG 2.2)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-terminal-green rounded-full"></span>
                    Battery-optimized animations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-terminal-green rounded-full"></span>
                    GPU-accelerated rendering
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-terminal-green rounded-full"></span>
                    Configurable intensity levels
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-terminal-green rounded-full"></span>
                    Production-ready optimization
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="p-8 bg-terminal-secondary/80 border border-terminal-border rounded-lg">
              <h2 className="text-3xl font-bold text-terminal-text mb-4">
                Ready for Deployment
              </h2>
              <p className="text-xl text-terminal-muted mb-6">
                This neural network visualization system is now integrated across all Lions of Zion pages.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/"
                  className="px-8 py-3 bg-terminal-cyan text-terminal-bg font-mono font-bold rounded
                           hover:bg-terminal-cyan/80 transition-colors"
                >
                  View Live Site
                </a>
                <a
                  href="/dashboard/war-machine"
                  className="px-8 py-3 border border-terminal-cyan text-terminal-cyan font-mono rounded
                           hover:bg-terminal-cyan/10 transition-colors"
                >
                  Enter War Machine
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}