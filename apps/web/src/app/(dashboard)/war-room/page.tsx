'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import components to avoid SSR issues with canvas
const MatrixBackground = dynamic(
  () => import('../../_components/visuals/MatrixBackground'),
  { ssr: false }
)
const NeuralNetworkCanvas = dynamic(
  () => import('../../_components/visuals/NeuralNetworkCanvas'),
  { ssr: false }
)
const IntelligencePanel = dynamic(
  () => import('../../_components/visuals/IntelligencePanel'),
  { ssr: false }
)

export default function WarRoom() {
  const [selectedActor, setSelectedActor] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    // Ensure client-side rendering
    setIsLoaded(true)
  }, [])
  
  const handleNodeClick = (actor: string | null) => {
    setSelectedActor(actor)
  }
  
  const handleClosePanel = () => {
    setSelectedActor(null)
  }
  
  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-green-400 font-mono text-xl animate-pulse">
          INITIALIZING INTELLIGENCE SYSTEM...
        </div>
      </div>
    )
  }
  
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Title Overlay */}
      <div className="absolute top-4 left-4 z-30">
        <h1 className="text-3xl font-bold text-green-400 font-mono tracking-wider">
          WARGAME v3.0
        </h1>
        <p className="text-green-400/70 font-mono text-sm mt-1">
          Intelligence Visualization System
        </p>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-30 max-w-md">
        <div className="bg-black/70 backdrop-blur-sm border border-green-500/30 rounded p-3">
          <p className="text-green-400/70 font-mono text-xs">
            INSTRUCTIONS: Click on network nodes to view intelligence profiles. 
            Hover to highlight connections. Risk levels indicated by color: 
            <span className="text-red-500"> HIGH</span>,
            <span className="text-yellow-500"> MEDIUM</span>,
            <span className="text-green-500"> LOW</span>.
          </p>
        </div>
      </div>
      
      {/* Stats Overlay */}
      <div className="absolute top-4 right-4 z-30">
        <div className="bg-black/70 backdrop-blur-sm border border-green-500/30 rounded p-4 space-y-2">
          <div className="flex justify-between items-center space-x-8">
            <span className="text-green-400/70 font-mono text-xs">ACTORS:</span>
            <span className="text-green-300 font-mono text-sm font-bold">14</span>
          </div>
          <div className="flex justify-between items-center space-x-8">
            <span className="text-green-400/70 font-mono text-xs">CONNECTIONS:</span>
            <span className="text-green-300 font-mono text-sm font-bold">47</span>
          </div>
          <div className="flex justify-between items-center space-x-8">
            <span className="text-green-400/70 font-mono text-xs">STATUS:</span>
            <span className="text-green-400 font-mono text-sm font-bold animate-pulse">ACTIVE</span>
          </div>
        </div>
      </div>
      
      {/* Matrix Background Layer */}
      <MatrixBackground />
      
      {/* Neural Network Visualization Layer */}
      <NeuralNetworkCanvas onNodeClick={handleNodeClick} />
      
      {/* Intelligence Panel */}
      <IntelligencePanel actor={selectedActor} onClose={handleClosePanel} />
      
      {/* Grid Overlay Effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-25">
        <div 
          className="h-px bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-30"
          style={{
            animation: 'scanline 8s linear infinite',
          }}
        />
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  )
}