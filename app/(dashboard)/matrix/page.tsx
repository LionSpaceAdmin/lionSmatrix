import type { Metadata } from 'next'
import { IntelligenceMatrix } from '@/components/organisms/IntelligenceMatrix'
import { Globe, Users, AlertTriangle, TrendingUp, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Intelligence Matrix | Lions of Zion',
  description: 'Real-time 3D visualization of global threat intelligence and disinformation networks',
}

export default function MatrixPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-cyan-500/20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-mono text-cyan-400 flex items-center gap-2">
                <Globe className="w-6 h-6" />
                GLOBAL INTELLIGENCE MATRIX
              </h1>
              <p className="text-sm text-gray-500 font-mono mt-1">
                Real-time threat visualization and network analysis
              </p>
            </div>
            
            {/* Live Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm font-mono">SYSTEM ONLINE</span>
              </div>
              <div className="text-sm font-mono text-gray-500">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Panel - Stats */}
          <div className="lg:col-span-1 space-y-4">
            {/* Threat Level */}
            <div className="bg-black/80 border border-cyan-500/30 rounded-lg p-4">
              <h3 className="text-cyan-400 font-mono text-sm font-bold mb-3">THREAT LEVEL</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400 font-mono">GLOBAL</span>
                    <span className="text-xs text-orange-400 font-mono">ELEVATED</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 w-3/4" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400 font-mono">REGIONAL</span>
                    <span className="text-xs text-red-400 font-mono">CRITICAL</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 w-11/12" />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Metrics */}
            <div className="bg-black/80 border border-cyan-500/30 rounded-lg p-4">
              <h3 className="text-cyan-400 font-mono text-sm font-bold mb-3">ACTIVE METRICS</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-gray-400 font-mono">Threats</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-red-400">247</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-gray-400 font-mono">Actors</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-orange-400">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-400 font-mono">Narratives</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-green-400">342</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-gray-400 font-mono">Responses</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-blue-400">156</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-black/80 border border-cyan-500/30 rounded-lg p-4">
              <h3 className="text-cyan-400 font-mono text-sm font-bold mb-3">RECENT ACTIVITY</h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-start gap-2">
                  <span className="text-green-400">14:23</span>
                  <span className="text-gray-400">New threat cluster detected in APAC region</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400">14:21</span>
                  <span className="text-gray-400">Narrative amplification spike: +340%</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400">14:18</span>
                  <span className="text-gray-400">Bot network identified: 12K accounts</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400">14:15</span>
                  <span className="text-gray-400">Deepfake video intercepted</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400">14:12</span>
                  <span className="text-gray-400">Response team deployed to sector 7</span>
                </div>
              </div>
            </div>

            {/* Control Panel */}
            <div className="bg-black/80 border border-cyan-500/30 rounded-lg p-4">
              <h3 className="text-cyan-400 font-mono text-sm font-bold mb-3">VISUALIZATION CONTROLS</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 font-mono block mb-1">FILTER BY TYPE</label>
                  <select className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs font-mono text-gray-300">
                    <option>All Entities</option>
                    <option>Threats Only</option>
                    <option>Actors Only</option>
                    <option>Narratives Only</option>
                    <option>Responses Only</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-mono block mb-1">TIME RANGE</label>
                  <select className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs font-mono text-gray-300">
                    <option>Real-time</option>
                    <option>Last Hour</option>
                    <option>Last 24 Hours</option>
                    <option>Last 7 Days</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-xs font-mono text-cyan-400 hover:bg-cyan-500/30 transition-colors">
                    PAUSE
                  </button>
                  <button className="flex-1 px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-xs font-mono text-cyan-400 hover:bg-cyan-500/30 transition-colors">
                    RESET
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Main Matrix */}
          <div className="lg:col-span-2">
            <div className="bg-black/80 border border-cyan-500/30 rounded-lg overflow-hidden" style={{ height: '600px' }}>
              <IntelligenceMatrix 
                className="w-full h-full"
                autoRotate={true}
                showLabels={true}
                showConnections={true}
              />
            </div>
            
            {/* Bottom Info Bar */}
            <div className="mt-4 bg-black/80 border border-cyan-500/30 rounded-lg p-4">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold font-mono text-cyan-400">1,247</div>
                  <div className="text-xs text-gray-500 font-mono uppercase">Total Nodes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-cyan-400">3,892</div>
                  <div className="text-xs text-gray-500 font-mono uppercase">Connections</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-cyan-400">89.3%</div>
                  <div className="text-xs text-gray-500 font-mono uppercase">Coverage</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-cyan-400">12ms</div>
                  <div className="text-xs text-gray-500 font-mono uppercase">Latency</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Network View */}
        <div className="mt-6 bg-black/80 border border-cyan-500/30 rounded-lg p-4">
          <h3 className="text-cyan-400 font-mono text-sm font-bold mb-3">NETWORK TOPOLOGY</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-gray-400">NORTH AMERICA</span>
                <span className="text-xs font-mono text-orange-400">HIGH ACTIVITY</span>
              </div>
              <div className="h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded flex items-center justify-center">
                <div className="text-3xl font-bold font-mono text-orange-400">342</div>
              </div>
            </div>
            <div className="bg-gray-900/50 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-gray-400">EUROPE</span>
                <span className="text-xs font-mono text-yellow-400">MODERATE</span>
              </div>
              <div className="h-32 bg-gradient-to-br from-yellow-500/20 to-transparent rounded flex items-center justify-center">
                <div className="text-3xl font-bold font-mono text-yellow-400">189</div>
              </div>
            </div>
            <div className="bg-gray-900/50 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-gray-400">ASIA PACIFIC</span>
                <span className="text-xs font-mono text-red-400">CRITICAL</span>
              </div>
              <div className="h-32 bg-gradient-to-br from-red-500/20 to-transparent rounded flex items-center justify-center">
                <div className="text-3xl font-bold font-mono text-red-400">567</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}