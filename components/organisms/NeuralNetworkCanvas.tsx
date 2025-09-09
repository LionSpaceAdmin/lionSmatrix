"use client"

import React from "react"
import { useWargameEngine } from "@/lib/use-wargame-engine"

interface NeuralNetworkCanvasProps {
  onNodeClick?: (actor: string | null) => void
}

const NeuralNetworkCanvas: React.FC<NeuralNetworkCanvasProps> = ({ onNodeClick }) => {
  const { canvasRef, state } = useWargameEngine(onNodeClick)

  // Show loading state while initializing
  if (!state.isInitialized) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="animate-pulse font-mono text-sm text-green-400">INITIALIZING NEURAL NETWORK...</div>
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className="neural-network-canvas absolute inset-0 z-10"
      style={{
        background: "transparent",
        pointerEvents: "auto",
      }}
      aria-label="Interactive neural network visualization showing intelligence actors and their connections"
      role="application"
    />
  )
}

export default React.memo(NeuralNetworkCanvas)
