'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Activity, Globe, Users, Zap } from 'lucide-react'

interface NetworkNode {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  type: 'hub' | 'node' | 'threat' | 'response'
  size: number
  connections: string[]
  label?: string
  activity: number
}

interface NetworkVisualizationProps {
  className?: string
  nodeCount?: number
  animated?: boolean
  showActivity?: boolean
}

export function NetworkVisualization({
  className = '',
  nodeCount = 50,
  animated = true,
  showActivity = true
}: NetworkVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [nodes, setNodes] = useState<NetworkNode[]>([])
  const [pulsePhase, setPulsePhase] = useState(0)

  // Initialize network nodes
  useEffect(() => {
    const newNodes: NetworkNode[] = []
    const hubCount = Math.floor(nodeCount / 10)
    
    // Create hub nodes
    for (let i = 0; i < hubCount; i++) {
      newNodes.push({
        id: `hub-${i}`,
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        type: 'hub',
        size: 8,
        connections: [],
        label: `HUB-${i}`,
        activity: Math.random()
      })
    }
    
    // Create regular nodes
    for (let i = 0; i < nodeCount - hubCount; i++) {
      const types: NetworkNode['type'][] = ['node', 'threat', 'response']
      const type = types[Math.floor(Math.random() * types.length)]
      
      newNodes.push({
        id: `node-${i}`,
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        type,
        size: type === 'threat' ? 6 : 4,
        connections: [],
        activity: Math.random()
      })
    }
    
    // Create connections
    newNodes.forEach((node, i) => {
      if (node.type === 'hub') {
        // Hubs connect to many nodes
        const connectionCount = 5 + Math.floor(Math.random() * 10)
        for (let j = 0; j < connectionCount; j++) {
          const targetIndex = Math.floor(Math.random() * newNodes.length)
          if (targetIndex !== i) {
            node.connections.push(newNodes[targetIndex].id)
          }
        }
      } else {
        // Regular nodes connect to 1-3 other nodes
        const connectionCount = 1 + Math.floor(Math.random() * 3)
        for (let j = 0; j < connectionCount; j++) {
          const targetIndex = Math.floor(Math.random() * newNodes.length)
          if (targetIndex !== i) {
            node.connections.push(newNodes[targetIndex].id)
          }
        }
      }
    })
    
    setNodes(newNodes)
  }, [nodeCount])

  // Animation loop
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
    
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Update pulse phase
      setPulsePhase(prev => prev + 0.02)
      
      // Update node positions
      if (animated) {
        nodes.forEach(node => {
          // Apply velocity
          node.x += node.vx
          node.y += node.vy
          
          // Bounce off walls
          if (node.x < 0 || node.x > canvas.width) {
            node.vx *= -1
            node.x = Math.max(0, Math.min(canvas.width, node.x))
          }
          if (node.y < 0 || node.y > canvas.height) {
            node.vy *= -1
            node.y = Math.max(0, Math.min(canvas.height, node.y))
          }
          
          // Apply slight attraction to center
          const centerX = canvas.width / 2
          const centerY = canvas.height / 2
          const dx = centerX - node.x
          const dy = centerY - node.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance > 100) {
            node.vx += dx / distance * 0.01
            node.vy += dy / distance * 0.01
          }
          
          // Limit velocity
          const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy)
          if (speed > 2) {
            node.vx = (node.vx / speed) * 2
            node.vy = (node.vy / speed) * 2
          }
        })
      }
      
      // Draw connections
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)'
      ctx.lineWidth = 1
      
      nodes.forEach(node => {
        node.connections.forEach(targetId => {
          const target = nodes.find(n => n.id === targetId)
          if (target) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(target.x, target.y)
            ctx.stroke()
            
            // Draw activity pulses along connections
            if (showActivity && node.activity > 0.7) {
              const pulseX = node.x + (target.x - node.x) * ((pulsePhase % 1))
              const pulseY = node.y + (target.y - node.y) * ((pulsePhase % 1))
              
              ctx.fillStyle = 'rgba(0, 255, 255, 0.8)'
              ctx.beginPath()
              ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        })
      })
      
      // Draw nodes
      nodes.forEach(node => {
        // Node color based on type
        const colors = {
          hub: 'rgba(0, 255, 255, 0.9)',
          node: 'rgba(100, 200, 255, 0.7)',
          threat: 'rgba(255, 100, 100, 0.8)',
          response: 'rgba(100, 255, 100, 0.8)'
        }
        
        // Draw node
        ctx.fillStyle = colors[node.type]
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Draw activity ring for active nodes
        if (showActivity && node.activity > 0.5) {
          const ringSize = node.size + 5 + Math.sin(pulsePhase + node.activity * Math.PI) * 3
          ctx.strokeStyle = colors[node.type]
          ctx.globalAlpha = 0.3
          ctx.beginPath()
          ctx.arc(node.x, node.y, ringSize, 0, Math.PI * 2)
          ctx.stroke()
          ctx.globalAlpha = 1
        }
        
        // Draw labels for hubs
        if (node.type === 'hub' && node.label) {
          ctx.fillStyle = 'rgba(0, 255, 255, 0.6)'
          ctx.font = '10px monospace'
          ctx.textAlign = 'center'
          ctx.fillText(node.label, node.x, node.y - node.size - 5)
        }
      })
      
      // Draw overlay effects
      if (showActivity) {
        // Scanning line effect
        const scanY = (pulsePhase * 100) % canvas.height
        const gradient = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20)
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0)')
        gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.1)')
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0)')
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, scanY - 20, canvas.width, 40)
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [nodes, animated, showActivity, pulsePhase])

  return (
    <div className={`relative w-full h-full bg-black/90 rounded-lg overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ minHeight: '300px' }}
      />
      
      {/* Overlay Info */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="bg-black/70 backdrop-blur-sm rounded px-3 py-2 border border-cyan-500/30">
          <h3 className="text-cyan-400 font-mono text-xs font-bold mb-1">NETWORK STATUS</h3>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full" />
              <span className="text-gray-400">Hubs</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="text-gray-400">Nodes</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <span className="text-gray-400">Threats</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-gray-400">Responses</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Activity Indicator */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
        <span className="text-cyan-400 text-xs font-mono">MONITORING ACTIVE</span>
      </div>
    </div>
  )
}