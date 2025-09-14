'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Activity, AlertTriangle, Shield, Zap, Globe, Users, TrendingUp, Eye } from 'lucide-react'

interface MatrixNode {
  id: string
  x: number
  y: number
  z: number
  label: string
  type: 'threat' | 'actor' | 'narrative' | 'response' | 'neutral'
  intensity: number
  connections: string[]
}

interface IntelligenceMatrixProps {
  className?: string
  data?: MatrixNode[]
  autoRotate?: boolean
  showLabels?: boolean
  showConnections?: boolean
}

export function IntelligenceMatrix({
  className = '',
  data,
  autoRotate = true,
  showLabels = true,
  showConnections = true
}: IntelligenceMatrixProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [metrics, setMetrics] = useState({
    threats: 0,
    actors: 0,
    narratives: 0,
    responses: 0
  })

  // Generate default matrix data if none provided
  const defaultNodes: MatrixNode[] = React.useMemo(() => {
    if (data) return data
    
    const nodes: MatrixNode[] = []
    const gridSize = 5
    const spacing = 100
    
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          const id = `node-${x}-${y}-${z}`
          const types: MatrixNode['type'][] = ['threat', 'actor', 'narrative', 'response', 'neutral']
          const type = types[Math.floor(Math.random() * types.length)]
          
          nodes.push({
            id,
            x: (x - gridSize / 2) * spacing,
            y: (y - gridSize / 2) * spacing,
            z: (z - gridSize / 2) * spacing,
            label: `${(type || 'neutral').toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
            type: type || 'neutral',
            intensity: Math.random(),
            connections: []
          })
        }
      }
    }
    
    // Add random connections
    nodes.forEach((node, i) => {
      const numConnections = Math.floor(Math.random() * 3)
      for (let j = 0; j < numConnections; j++) {
        const targetIndex = Math.floor(Math.random() * nodes.length)
        if (targetIndex !== i && nodes[targetIndex]) {
          node.connections.push(nodes[targetIndex].id)
        }
      }
    })
    
    return nodes
  }, [data])

  // Update metrics
  useEffect(() => {
    const counts = defaultNodes.reduce((acc, node) => {
      if (node.type === 'threat') acc.threats++
      else if (node.type === 'actor') acc.actors++
      else if (node.type === 'narrative') acc.narratives++
      else if (node.type === 'response') acc.responses++
      return acc
    }, { threats: 0, actors: 0, narratives: 0, responses: 0 })
    
    setMetrics(counts)
  }, [defaultNodes])

  // 3D Rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Transform matrix
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const scale = 1
      
      // Sort nodes by z-depth for proper rendering
      const sortedNodes = [...defaultNodes].sort((a, b) => {
        const aZ = rotatePoint(a.x, a.y, a.z, rotation).z
        const bZ = rotatePoint(b.x, b.y, b.z, rotation).z
        return aZ - bZ
      })
      
      // Draw connections
      if (showConnections) {
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)'
        ctx.lineWidth = 1
        
        sortedNodes.forEach(node => {
          const rotated = rotatePoint(node.x, node.y, node.z, rotation)
          const perspective = 1000 / (1000 + rotated.z)
          const x1 = centerX + rotated.x * perspective * scale
          const y1 = centerY + rotated.y * perspective * scale
          
          node.connections.forEach(targetId => {
            const target = defaultNodes.find(n => n.id === targetId)
            if (target) {
              const rotatedTarget = rotatePoint(target.x, target.y, target.z, rotation)
              const perspectiveTarget = 1000 / (1000 + rotatedTarget.z)
              const x2 = centerX + rotatedTarget.x * perspectiveTarget * scale
              const y2 = centerY + rotatedTarget.y * perspectiveTarget * scale
              
              ctx.beginPath()
              ctx.moveTo(x1, y1)
              ctx.lineTo(x2, y2)
              ctx.stroke()
            }
          })
        })
      }
      
      // Draw nodes
      sortedNodes.forEach(node => {
        const rotated = rotatePoint(node.x, node.y, node.z, rotation)
        const perspective = 1000 / (1000 + rotated.z)
        const x = centerX + rotated.x * perspective * scale
        const y = centerY + rotated.y * perspective * scale
        const size = 3 + node.intensity * 5 * perspective
        
        // Node color based on type
        const colors = {
          threat: 'rgba(255, 59, 48, 0.8)',
          actor: 'rgba(255, 149, 0, 0.8)',
          narrative: 'rgba(52, 199, 89, 0.8)',
          response: 'rgba(0, 122, 255, 0.8)',
          neutral: 'rgba(142, 142, 147, 0.5)'
        }
        
        // Draw node
        ctx.fillStyle = colors[node.type]
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
        
        // Draw glow for active nodes
        if (node.intensity > 0.7) {
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3)
          gradient.addColorStop(0, colors[node.type])
          gradient.addColorStop(1, 'transparent')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(x, y, size * 3, 0, Math.PI * 2)
          ctx.fill()
        }
        
        // Draw label
        if (showLabels && perspective > 0.5 && node.type !== 'neutral') {
          ctx.fillStyle = 'rgba(0, 255, 255, ' + (0.5 * perspective) + ')'
          ctx.font = `${10 * perspective}px monospace`
          ctx.textAlign = 'center'
          ctx.fillText(node.label, x, y - size - 5)
        }
      })
      
      // Auto-rotate
      if (autoRotate) {
        setRotation(prev => ({
          x: prev.x + 0.003,
          y: prev.y + 0.005,
          z: prev.z + 0.001
        }))
      }
      
      animationRef.current = requestAnimationFrame(render)
    }
    
    render()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [defaultNodes, rotation, autoRotate, showLabels, showConnections])
  
  // 3D rotation helper
  function rotatePoint(x: number, y: number, z: number, rotation: { x: number, y: number, z: number }) {
    // Rotate around X axis
    const newY = y * Math.cos(rotation.x) - z * Math.sin(rotation.x)
    let newZ = y * Math.sin(rotation.x) + z * Math.cos(rotation.x)
    
    // Rotate around Y axis
    const newX = x * Math.cos(rotation.y) + newZ * Math.sin(rotation.y)
    newZ = -x * Math.sin(rotation.y) + newZ * Math.cos(rotation.y)
    
    // Rotate around Z axis
    const finalX = newX * Math.cos(rotation.z) - newY * Math.sin(rotation.z)
    const finalY = newX * Math.sin(rotation.z) + newY * Math.cos(rotation.z)
    
    return { x: finalX, y: finalY, z: newZ }
  }
  
  // Handle mouse interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!autoRotate) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height
        setRotation({
          x: y * Math.PI,
          y: x * Math.PI,
          z: 0
        })
      }
    }
  }

  return (
    <div className={`relative w-full h-full bg-black/90 rounded-lg overflow-hidden ${className}`}>
      {/* Matrix Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-move"
        onMouseMove={handleMouseMove}
        style={{ minHeight: '400px' }}
      />
      
      {/* Overlay Stats */}
      <div className="absolute top-4 left-4 space-y-2 pointer-events-none">
        <div className="bg-black/70 backdrop-blur-sm rounded px-3 py-2 border border-cyan-500/30">
          <h3 className="text-cyan-400 font-mono text-sm font-bold mb-2">INTELLIGENCE MATRIX</h3>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span className="text-gray-400">Threats:</span>
              <span className="text-red-400">{metrics.threats}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 text-orange-400" />
              <span className="text-gray-400">Actors:</span>
              <span className="text-orange-400">{metrics.actors}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-gray-400">Narratives:</span>
              <span className="text-green-400">{metrics.narratives}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-blue-400" />
              <span className="text-gray-400">Responses:</span>
              <span className="text-blue-400">{metrics.responses}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => setRotation({ x: 0, y: 0, z: 0 })}
          className="px-3 py-1 bg-black/70 backdrop-blur-sm rounded border border-cyan-500/30 
                   text-cyan-400 text-xs font-mono hover:bg-cyan-500/20 transition-colors"
        >
          RESET
        </button>
        <button
          onClick={() => {}}
          className="px-3 py-1 bg-black/70 backdrop-blur-sm rounded border border-cyan-500/30 
                   text-cyan-400 text-xs font-mono hover:bg-cyan-500/20 transition-colors"
        >
          FULLSCREEN
        </button>
      </div>
      
      {/* Status Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-green-400 text-xs font-mono">LIVE</span>
      </div>
    </div>
  )
}