'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { loadMatrixData, type MatrixData, type ActorData } from '@/lib/data-parsers'

interface UnifiedBackgroundProps {
  variant?: 'landing' | 'platform' | 'minimal' | 'intelligence'
  intensity?: 'low' | 'medium' | 'high'
  interactive?: boolean
  className?: string
  heroMessage?: {
    main: string
    sub: string
  }
}

const UnifiedBackground: React.FC<UnifiedBackgroundProps> = ({
  variant = 'landing',
  intensity = 'medium',
  interactive = false,
  className = '',
  heroMessage
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const scanTextsRef = useRef<ScanText[]>([])
  const timeRef = useRef(0)
  const [matrixData, setMatrixData] = useState<MatrixData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const networkConnectionsRef = useRef<Array<{from: number, to: number, strength: number}>>([])

  interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    size: number
    opacity: number
    text?: string
    type: 'grid' | 'matrix' | 'neural' | 'scan' | 'horizontal-scan' | 'network-node'
    actorData?: ActorData
    layer?: number
    color?: string
  }

  interface ScanText {
    id: number
    text: string
    x: number
    y: number
    vx: number
    opacity: number
    layer: number
    category: 'truth' | 'propaganda' | 'disinformation' | 'pattern'
    color: string
  }

  // Load Matrix data for intelligence variant
  useEffect(() => {
    if (variant === 'intelligence' && !matrixData && !isLoading) {
      setIsLoading(true)
      loadMatrixData()
        .then(data => {
          setMatrixData(data)
          setIsLoading(false)
        })
        .catch(error => {
          console.error('Failed to load matrix data:', error)
          setIsLoading(false)
        })
    }
  }, [variant, matrixData, isLoading])

  // Initialize horizontal scanning texts for intelligence variant
  const initializeScanTexts = useCallback((canvas: HTMLCanvasElement) => {
    if (!matrixData || variant !== 'intelligence') return []

    const scanTexts: ScanText[] = []
    const layers = 3
    const textsPerLayer = intensity === 'high' ? 8 : intensity === 'medium' ? 5 : 3

    for (let layer = 0; layer < layers; layer++) {
      for (let i = 0; i < textsPerLayer; i++) {
        const wordIndex = Math.floor(Math.random() * matrixData.scanWords.length)
        const word = matrixData.scanWords[wordIndex] || 'PATTERN'
        
        // Determine category colors
        const categories = ['truth', 'propaganda', 'disinformation', 'pattern'] as const
        const category = categories[Math.floor(Math.random() * categories.length)]
        
        const colors = {
          truth: '#6EE7B7',      // Cyan
          pattern: '#34D399',     // Green
          propaganda: '#FFB700',  // Gold
          disinformation: '#D43F3F' // Red
        }

        scanTexts.push({
          id: Date.now() + Math.random(),
          text: word,
          x: -200, // Start off-screen left
          y: (canvas.height / layers) * layer + 50 + Math.random() * 100,
          vx: (layer + 1) * (0.5 + Math.random() * 1.5), // Different speeds per layer
          opacity: 0.3 + Math.random() * 0.4,
          layer,
          category,
          color: colors[category]
        })
      }
    }

    return scanTexts
  }, [matrixData, variant, intensity])

  // Initialize network nodes for intelligence variant
  const initializeNetworkNodes = useCallback((canvas: HTMLCanvasElement) => {
    if (!matrixData || variant !== 'intelligence') return []

    const nodes: Particle[] = []
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const maxRadius = Math.min(canvas.width, canvas.height) * 0.35

    matrixData.networkNodes.forEach((actor, index) => {
      // Position nodes in circular pattern with some randomization
      const angle = (index / matrixData.networkNodes.length) * Math.PI * 2
      const radiusVariation = 0.7 + Math.random() * 0.6 // 70-130% of max radius
      const radius = maxRadius * radiusVariation
      
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      nodes.push({
        x,
        y,
        vx: Math.cos(angle + Math.PI / 2) * 0.3,
        vy: Math.sin(angle + Math.PI / 2) * 0.3,
        size: actor.nodeSize,
        opacity: 0.8,
        type: 'network-node',
        actorData: actor,
        color: actor.color
      })
    })

    return nodes
  }, [matrixData, variant])

  // Initialize particles based on variant
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles based on variant
    const particles: Particle[] = []
    
    // Initialize scanning texts for intelligence variant
    if (variant === 'intelligence' && matrixData) {
      scanTextsRef.current = initializeScanTexts(canvas)
    }

    const particleCount = intensity === 'high' ? 100 : intensity === 'medium' ? 50 : 25

    // Add grid particles for all variants except minimal
    if (variant !== 'minimal') {
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.3 + 0.1,
          type: 'grid'
        })
      }
    }

    // Add matrix rain for landing, platform, and intelligence
    if (variant === 'landing' || variant === 'platform' || variant === 'intelligence') {
      const columns = Math.ceil(canvas.width / 30)
      for (let i = 0; i < columns; i++) {
        particles.push({
          x: i * 30,
          y: Math.random() * canvas.height,
          vx: 0,
          vy: Math.random() * 2 + 1,
          size: 12,
          opacity: Math.random() * 0.5 + 0.3,
          text: String.fromCharCode(Math.random() * 128),
          type: 'matrix'
        })
      }
    }

    // Add network nodes for intelligence variant
    if (variant === 'intelligence' && matrixData) {
      const networkNodes = initializeNetworkNodes(canvas)
      particles.push(...networkNodes)
      
      // Generate network connections
      const connections: Array<{from: number, to: number, strength: number}> = []
      const nodeCount = networkNodes.length
      
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const actor1 = networkNodes[i].actorData
          const actor2 = networkNodes[j].actorData
          
          if (actor1 && actor2) {
            // Calculate connection strength
            let strength = 0
            
            // Same threat level increases connection
            if (actor1.threatLevel === actor2.threatLevel) {
              strength += 0.3
            }
            
            // High audience actors connect more
            if (actor1.audienceNumber > 1000000 && actor2.audienceNumber > 1000000) {
              strength += 0.2
            }
            
            // Random connections for network effect
            strength += Math.random() * 0.3
            
            if (strength > 0.4) {
              connections.push({ from: i, to: j, strength })
            }
          }
        }
      }
      
      networkConnectionsRef.current = connections
    }
    
    // Add neural network nodes for platform
    if (variant === 'platform') {
      const nodeCount = intensity === 'high' ? 20 : 10
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2
        const radius = 200 + Math.random() * 100
        particles.push({
          x: canvas.width / 2 + Math.cos(angle) * radius,
          y: canvas.height / 2 + Math.sin(angle) * radius,
          vx: Math.cos(angle + Math.PI / 2) * 0.5,
          vy: Math.sin(angle + Math.PI / 2) * 0.5,
          size: 8,
          opacity: 0.8,
          type: 'neural'
        })
      }
    }

    particlesRef.current = particles

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      timeRef.current += 0.01

      // Draw grid background
      if (variant !== 'minimal') {
        ctx.strokeStyle = 'rgba(110, 231, 183, 0.03)'
        ctx.lineWidth = 1
        const gridSize = 50
        
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }
        
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }
      }

      // Draw horizontal scanning texts for intelligence variant
      if (variant === 'intelligence') {
        scanTextsRef.current.forEach((scanText, index) => {
          // Update position
          scanText.x += scanText.vx
          
          // Reset if off-screen
          if (scanText.x > canvas.width + 200) {
            scanText.x = -200
            // Change text occasionally
            if (Math.random() < 0.1 && matrixData) {
              const wordIndex = Math.floor(Math.random() * matrixData.scanWords.length)
              scanText.text = matrixData.scanWords[wordIndex] || 'PATTERN'
            }
          }
          
          // Draw text
          ctx.save()
          ctx.globalAlpha = scanText.opacity * (0.7 + 0.3 * Math.sin(timeRef.current * 2 + index))
          ctx.fillStyle = scanText.color
          ctx.font = `bold ${14 + scanText.layer * 2}px 'Space Mono', monospace`
          
          // Add glow effect
          ctx.shadowColor = scanText.color
          ctx.shadowBlur = 10
          ctx.fillText(scanText.text, scanText.x, scanText.y)
          
          // Second pass without shadow for crispness
          ctx.shadowBlur = 0
          ctx.fillText(scanText.text, scanText.x, scanText.y)
          
          ctx.restore()
        })
      }

      // Draw scan line for landing variant
      if (variant === 'landing') {
        const scanY = (timeRef.current * 100) % canvas.height
        const gradient = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50)
        gradient.addColorStop(0, 'transparent')
        gradient.addColorStop(0.5, 'rgba(110, 231, 183, 0.2)')
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.fillRect(0, scanY - 50, canvas.width, 100)
      }

      // Draw network connections for intelligence variant
      if (variant === 'intelligence') {
        ctx.save()
        networkConnectionsRef.current.forEach(connection => {
          const fromIndex = connection.from
          const toIndex = connection.to
          
          // Find network nodes in particles array
          const networkNodes = particlesRef.current.filter(p => p.type === 'network-node')
          const fromNode = networkNodes[fromIndex]
          const toNode = networkNodes[toIndex]
          
          if (fromNode && toNode) {
            // Animated connection strength
            const animatedStrength = connection.strength * 
              (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(timeRef.current * 2)))
            
            ctx.globalAlpha = animatedStrength * 0.6
            ctx.strokeStyle = '#6EE7B7'
            ctx.lineWidth = Math.max(0.5, connection.strength * 2)
            
            // Add glow
            ctx.shadowColor = '#6EE7B7'
            ctx.shadowBlur = 5
            
            ctx.beginPath()
            ctx.moveTo(fromNode.x, fromNode.y)
            ctx.lineTo(toNode.x, toNode.y)
            ctx.stroke()
          }
        })
        ctx.restore()
      }

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges
        if (particle.type === 'matrix') {
          if (particle.y > canvas.height) {
            particle.y = -20
            particle.text = String.fromCharCode(Math.random() * 128)
          }
        } else if (particle.type !== 'network-node') {
          // Don't wrap network nodes
          if (particle.x < 0) particle.x = canvas.width
          if (particle.x > canvas.width) particle.x = 0
          if (particle.y < 0) particle.y = canvas.height
          if (particle.y > canvas.height) particle.y = 0
        }

        // Draw particle
        ctx.save()
        ctx.globalAlpha = particle.opacity

        if (particle.type === 'grid') {
          ctx.fillStyle = 'rgba(110, 231, 183, 0.5)'
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (particle.type === 'matrix' && particle.text) {
          ctx.fillStyle = 'rgba(110, 231, 183, 0.8)'
          ctx.font = `${particle.size}px monospace`
          ctx.fillText(particle.text, particle.x, particle.y)
        } else if (particle.type === 'network-node') {
          // Draw actor network node
          const pulseScale = 1 + 0.1 * Math.sin(timeRef.current * 3 + particle.x * 0.01)
          const nodeSize = particle.size * pulseScale
          
          // Draw outer glow
          ctx.fillStyle = particle.color || '#6EE7B7'
          ctx.globalAlpha = particle.opacity * 0.3
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, nodeSize * 1.5, 0, Math.PI * 2)
          ctx.fill()
          
          // Draw main node
          ctx.globalAlpha = particle.opacity
          ctx.fillStyle = particle.color || '#6EE7B7'
          ctx.strokeStyle = particle.color || '#6EE7B7'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, nodeSize, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
          
          // Draw actor name on larger nodes
          if (particle.actorData && nodeSize > 15) {
            ctx.globalAlpha = 0.8
            ctx.fillStyle = '#E5E7EB'
            ctx.font = '10px Space Mono'
            ctx.textAlign = 'center'
            const name = particle.actorData.name.split(' ')[0] // First name only
            ctx.fillText(name, particle.x, particle.y - nodeSize - 5)
          }
          
        } else if (particle.type === 'neural') {
          // Draw node
          ctx.fillStyle = 'rgba(110, 231, 183, 0.2)'
          ctx.strokeStyle = 'rgba(110, 231, 183, 0.8)'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()

          // Draw connections to nearby nodes
          if (variant === 'platform') {
            particlesRef.current.forEach((other, otherIndex) => {
              if (other.type === 'neural' && index < otherIndex) {
                const distance = Math.sqrt(
                  Math.pow(particle.x - other.x, 2) + 
                  Math.pow(particle.y - other.y, 2)
                )
                if (distance < 150) {
                  ctx.strokeStyle = `rgba(110, 231, 183, ${0.2 * (1 - distance / 150)})`
                  ctx.lineWidth = 1
                  ctx.beginPath()
                  ctx.moveTo(particle.x, particle.y)
                  ctx.lineTo(other.x, other.y)
                  ctx.stroke()
                }
              }
            })
          }
        }

        ctx.restore()
      })

      // Add gradient overlay
      const centerGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      )
      centerGradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
      centerGradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)')
      ctx.fillStyle = centerGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw hero message for intelligence variant
      if (variant === 'intelligence' && heroMessage) {
        ctx.save()
        
        // Main message
        ctx.fillStyle = '#6EE7B7'
        ctx.font = 'bold 48px Space Mono'
        ctx.textAlign = 'center'
        ctx.shadowColor = '#6EE7B7'
        ctx.shadowBlur = 20
        ctx.fillText(heroMessage.main, canvas.width / 2, canvas.height / 2 - 50)
        
        // Sub message
        ctx.fillStyle = '#FFB700'
        ctx.font = '24px Space Mono'
        ctx.shadowColor = '#FFB700'
        ctx.shadowBlur = 15
        ctx.fillText(heroMessage.sub, canvas.width / 2, canvas.height / 2 + 20)
        
        ctx.restore()
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [variant, intensity, interactive, matrixData, initializeScanTexts, initializeNetworkNodes, heroMessage])

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: variant === 'intelligence' 
            ? 'linear-gradient(to bottom, #030712, #0F172A, #030712)' 
            : 'linear-gradient(to bottom, #030712, #0F172A)',
          opacity: intensity === 'high' ? 1 : intensity === 'medium' ? 0.8 : 0.6
        }}
      />
      {/* Loading indicator for intelligence variant */}
      {variant === 'intelligence' && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-terminal-cyan font-terminal text-lg">
            Loading intelligence data...
          </div>
        </div>
      )}
    </div>
  )
}

export default UnifiedBackground