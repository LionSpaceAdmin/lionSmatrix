'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { loadMatrixData, type MatrixData, type ActorData, type CognitiveWarfareMessage } from '@/lib/data-parsers'

interface MatrixWarfareBackgroundProps {
  intensity?: 'low' | 'medium' | 'high'
  interactive?: boolean
  className?: string
  heroMessage?: {
    main: string
    sub: string
  }
}

interface ScanLine {
  id: number
  text: string
  x: number
  y: number
  vx: number
  opacity: number
  layer: number
  category: 'truth' | 'propaganda' | 'disinformation' | 'pattern'
  color: string
  fontSize: number
}

interface NetworkNode {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  actor: ActorData
  pulseOffset: number
}

interface NetworkConnection {
  from: number
  to: number
  strength: number
  opacity: number
}

const MatrixWarfareBackground: React.FC<MatrixWarfareBackgroundProps> = ({
  intensity = 'high',
  interactive = false,
  className = '',
  heroMessage
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const timeRef = useRef(0)
  const [matrixData, setMatrixData] = useState<MatrixData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentHeroMessage, setCurrentHeroMessage] = useState(heroMessage)

  // Animation state
  const scanLinesRef = useRef<ScanLine[]>([])
  const networkNodesRef = useRef<NetworkNode[]>([])
  const networkConnectionsRef = useRef<NetworkConnection[]>([])
  const heroMessageIndexRef = useRef(0)
  const lastHeroUpdateRef = useRef(0)

  // Load Matrix data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const data = await loadMatrixData()
        setMatrixData(data)
        
        // Initialize hero message rotation if messages are available
        if (data.messages.length > 0 && !heroMessage) {
          setCurrentHeroMessage({
            main: "Truth is pattern. AI sees it.",
            sub: data.messages[0]?.en || "Join the battle for truth."
          })
        }
      } catch (error) {
        console.error('Failed to load matrix data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [heroMessage])

  // Initialize scanning text layers
  const initializeScanLines = useCallback((canvas: HTMLCanvasElement) => {
    if (!matrixData) return []

    const scanLines: ScanLine[] = []
    const layers = intensity === 'high' ? 5 : intensity === 'medium' ? 3 : 2
    const linesPerLayer = intensity === 'high' ? 12 : intensity === 'medium' ? 8 : 5

    const categoryColors = {
      truth: '#6EE7B7',        // Cyan-green
      pattern: '#34D399',      // Green  
      propaganda: '#FFB700',   // Gold
      disinformation: '#EF4444' // Red
    }

    for (let layer = 0; layer < layers; layer++) {
      for (let i = 0; i < linesPerLayer; i++) {
        // Select words from the scan words pool
        const wordIndex = Math.floor(Math.random() * matrixData.scanWords.length)
        let text = matrixData.scanWords[wordIndex] || 'PATTERN'
        
        // Occasionally use full message fragments for more impact
        if (Math.random() < 0.3 && matrixData.messages.length > 0) {
          const messageIndex = Math.floor(Math.random() * matrixData.messages.length)
          const message = matrixData.messages[messageIndex]
          const words = message.en.split(' ')
          const fragmentLength = Math.min(4, words.length)
          text = words.slice(0, fragmentLength).join(' ').toUpperCase()
        }

        // Determine category
        const categories = ['truth', 'pattern', 'propaganda', 'disinformation'] as const
        const category = categories[Math.floor(Math.random() * categories.length)]

        // Layer-specific properties
        const isLeftToRight = Math.random() < 0.5
        const startX = isLeftToRight ? -300 : canvas.width + 300
        const speed = isLeftToRight ? 
          (1 + layer * 0.5 + Math.random() * 2) : 
          -(1 + layer * 0.5 + Math.random() * 2)

        scanLines.push({
          id: Date.now() + Math.random(),
          text,
          x: startX,
          y: (canvas.height / (layers + 1)) * (layer + 1) + (Math.random() - 0.5) * 100,
          vx: speed,
          opacity: 0.2 + Math.random() * 0.6,
          layer,
          category,
          color: categoryColors[category],
          fontSize: 12 + layer * 2 + Math.random() * 8
        })
      }
    }

    return scanLines
  }, [matrixData, intensity])

  // Initialize network visualization
  const initializeNetwork = useCallback((canvas: HTMLCanvasElement) => {
    if (!matrixData || !matrixData.networkNodes.length) return { nodes: [], connections: [] }

    const nodes: NetworkNode[] = []
    const connections: NetworkConnection[] = []
    
    // Create circular layout for network nodes
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const baseRadius = Math.min(canvas.width, canvas.height) * 0.25
    
    matrixData.networkNodes.forEach((actor, index) => {
      const angle = (index / matrixData.networkNodes.length) * Math.PI * 2
      const radiusVariation = 0.7 + Math.random() * 0.6
      const radius = baseRadius * radiusVariation
      
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius
      
      nodes.push({
        id: index,
        x,
        y,
        vx: Math.cos(angle + Math.PI / 2) * 0.2,
        vy: Math.sin(angle + Math.PI / 2) * 0.2,
        size: Math.max(6, Math.min(20, actor.nodeSize)),
        opacity: 0.8,
        actor,
        pulseOffset: Math.random() * Math.PI * 2
      })
    })

    // Generate connections based on actor relationships
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const actor1 = nodes[i].actor
        const actor2 = nodes[j].actor
        
        let strength = 0
        
        // Same threat level
        if (actor1.threatLevel === actor2.threatLevel) {
          strength += 0.3
        }
        
        // Platform similarity
        if (actor1.platform === actor2.platform) {
          strength += 0.2
        }
        
        // High influence actors connect more
        if (actor1.audienceNumber > 1000000 && actor2.audienceNumber > 1000000) {
          strength += 0.2
        }
        
        // Check for narrative/affiliation keywords
        const narrative1 = actor1.narrative.toLowerCase()
        const narrative2 = actor2.narrative.toLowerCase()
        const affiliation1 = actor1.affiliation.toLowerCase()
        const affiliation2 = actor2.affiliation.toLowerCase()
        
        const keywords = ['iran', 'russia', 'israel', 'propaganda', 'grayzone', 'hamas']
        const commonKeywords = keywords.filter(keyword => 
          (narrative1.includes(keyword) && narrative2.includes(keyword)) ||
          (affiliation1.includes(keyword) && affiliation2.includes(keyword))
        )
        
        strength += commonKeywords.length * 0.15
        
        // Random factor for network effect
        strength += Math.random() * 0.2
        
        if (strength > 0.4) {
          connections.push({
            from: i,
            to: j,
            strength: Math.min(1, strength),
            opacity: strength * 0.6
          })
        }
      }
    }
    
    return { nodes, connections }
  }, [matrixData])

  // Hero message rotation
  const updateHeroMessage = useCallback(() => {
    if (!matrixData?.messages.length || heroMessage) return
    
    const now = timeRef.current
    if (now - lastHeroUpdateRef.current > 8) { // Change every 8 seconds
      heroMessageIndexRef.current = (heroMessageIndexRef.current + 1) % matrixData.messages.length
      const currentMessage = matrixData.messages[heroMessageIndexRef.current]
      
      setCurrentHeroMessage({
        main: "Truth is pattern. AI sees it.",
        sub: currentMessage.en
      })
      
      lastHeroUpdateRef.current = now
    }
  }, [matrixData, heroMessage])

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !matrixData) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize animation elements
    scanLinesRef.current = initializeScanLines(canvas)
    const { nodes, connections } = initializeNetwork(canvas)
    networkNodesRef.current = nodes
    networkConnectionsRef.current = connections

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      timeRef.current += 0.016 // ~60 FPS

      // Update hero message rotation
      updateHeroMessage()

      // Draw subtle grid background
      ctx.strokeStyle = 'rgba(110, 231, 183, 0.02)'
      ctx.lineWidth = 1
      const gridSize = 60
      
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

      // Draw network connections first (behind nodes)
      networkConnectionsRef.current.forEach(connection => {
        const fromNode = networkNodesRef.current[connection.from]
        const toNode = networkNodesRef.current[connection.to]
        
        if (fromNode && toNode) {
          const animatedOpacity = connection.opacity * 
            (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(timeRef.current * 1.5)))
          
          ctx.save()
          ctx.globalAlpha = animatedOpacity
          ctx.strokeStyle = '#6EE7B7'
          ctx.lineWidth = Math.max(0.5, connection.strength * 2)
          ctx.shadowColor = '#6EE7B7'
          ctx.shadowBlur = 3
          
          ctx.beginPath()
          ctx.moveTo(fromNode.x, fromNode.y)
          ctx.lineTo(toNode.x, toNode.y)
          ctx.stroke()
          ctx.restore()
        }
      })

      // Update and draw network nodes
      networkNodesRef.current.forEach((node) => {
        // Gentle orbital motion
        node.x += node.vx
        node.y += node.vy
        
        // Keep nodes within bounds with some margin
        const margin = 100
        if (node.x < margin || node.x > canvas.width - margin) node.vx *= -0.5
        if (node.y < margin || node.y > canvas.height - margin) node.vy *= -0.5
        
        // Draw node with pulsing effect
        const pulseScale = 1 + 0.15 * Math.sin(timeRef.current * 2 + node.pulseOffset)
        const nodeSize = node.size * pulseScale
        
        ctx.save()
        
        // Outer glow
        ctx.globalAlpha = node.opacity * 0.3
        ctx.fillStyle = node.actor.color
        ctx.beginPath()
        ctx.arc(node.x, node.y, nodeSize * 1.5, 0, Math.PI * 2)
        ctx.fill()
        
        // Main node
        ctx.globalAlpha = node.opacity
        ctx.fillStyle = node.actor.color
        ctx.strokeStyle = node.actor.color
        ctx.lineWidth = 2
        ctx.shadowColor = node.actor.color
        ctx.shadowBlur = 6
        
        ctx.beginPath()
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        
        // Node label for larger nodes
        if (nodeSize > 10 && node.actor.name) {
          ctx.globalAlpha = 0.7
          ctx.fillStyle = '#E5E7EB'
          ctx.font = '9px Space Mono'
          ctx.textAlign = 'center'
          ctx.shadowBlur = 2
          const firstName = node.actor.name.split(' ')[0]
          ctx.fillText(firstName, node.x, node.y - nodeSize - 8)
        }
        
        ctx.restore()
      })

      // Update and draw horizontal scanning text lines
      scanLinesRef.current.forEach((scanLine, index) => {
        // Update position
        scanLine.x += scanLine.vx
        
        // Reset position when off-screen
        const buffer = 400
        if (scanLine.vx > 0 && scanLine.x > canvas.width + buffer) {
          scanLine.x = -buffer
          // Occasionally change text
          if (Math.random() < 0.1 && matrixData.scanWords.length > 0) {
            const wordIndex = Math.floor(Math.random() * matrixData.scanWords.length)
            scanLine.text = matrixData.scanWords[wordIndex] || 'PATTERN'
            
            // Sometimes use message fragments
            if (Math.random() < 0.2 && matrixData.messages.length > 0) {
              const messageIndex = Math.floor(Math.random() * matrixData.messages.length)
              const message = matrixData.messages[messageIndex]
              const words = message.en.split(' ')
              scanLine.text = words.slice(0, 3).join(' ').toUpperCase()
            }
          }
        } else if (scanLine.vx < 0 && scanLine.x < -buffer) {
          scanLine.x = canvas.width + buffer
          // Same text update logic
          if (Math.random() < 0.1 && matrixData.scanWords.length > 0) {
            const wordIndex = Math.floor(Math.random() * matrixData.scanWords.length)
            scanLine.text = matrixData.scanWords[wordIndex] || 'PATTERN'
          }
        }
        
        // Draw text with glow effect
        ctx.save()
        
        // Animated opacity with layer-based pulsing
        const animatedOpacity = scanLine.opacity * 
          (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(timeRef.current * 2 + scanLine.layer + index * 0.1)))
        
        ctx.globalAlpha = animatedOpacity
        ctx.fillStyle = scanLine.color
        ctx.font = `bold ${scanLine.fontSize}px Space Mono`
        ctx.textAlign = 'left'
        
        // Glow effect
        ctx.shadowColor = scanLine.color
        ctx.shadowBlur = 8
        ctx.fillText(scanLine.text, scanLine.x, scanLine.y)
        
        // Second pass without shadow for crispness
        ctx.shadowBlur = 0
        ctx.fillText(scanLine.text, scanLine.x, scanLine.y)
        
        ctx.restore()
      })

      // Draw hero message with enhanced styling
      if (currentHeroMessage) {
        ctx.save()
        
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        
        // Background blur overlay for text readability
        const gradient = ctx.createRadialGradient(
          centerX, centerY - 40, 0,
          centerX, centerY - 40, 300
        )
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(centerX - 300, centerY - 120, 600, 160)
        
        // Main message
        ctx.fillStyle = '#6EE7B7'
        ctx.font = 'bold 42px Space Mono'
        ctx.textAlign = 'center'
        ctx.shadowColor = '#6EE7B7'
        ctx.shadowBlur = 15
        ctx.fillText(currentHeroMessage.main, centerX, centerY - 40)
        
        // Sub message with typewriter effect
        ctx.fillStyle = '#FFB700'
        ctx.font = '20px Space Mono'
        ctx.shadowColor = '#FFB700'
        ctx.shadowBlur = 10
        
        // Create typewriter effect based on time
        const typewriterSpeed = 0.05
        const charIndex = Math.floor((timeRef.current % 20) * typewriterSpeed * currentHeroMessage.sub.length)
        const displayText = currentHeroMessage.sub.substring(0, charIndex)
        
        ctx.fillText(displayText, centerX, centerY + 10)
        
        // Cursor blink
        if (Math.sin(timeRef.current * 4) > 0) {
          ctx.fillText('_', centerX + ctx.measureText(displayText).width / 2 + 5, centerY + 10)
        }
        
        ctx.restore()
      }

      // Scanline effect
      const scanlineY = (timeRef.current * 80) % canvas.height
      const scanlineGradient = ctx.createLinearGradient(0, scanlineY - 3, 0, scanlineY + 3)
      scanlineGradient.addColorStop(0, 'transparent')
      scanlineGradient.addColorStop(0.5, 'rgba(110, 231, 183, 0.1)')
      scanlineGradient.addColorStop(1, 'transparent')
      ctx.fillStyle = scanlineGradient
      ctx.fillRect(0, scanlineY - 3, canvas.width, 6)

      // Vignette effect
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      )
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
      vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0.1)')
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.6)')
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [matrixData, currentHeroMessage, initializeScanLines, initializeNetwork, updateHeroMessage])

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(to bottom, #000000, #0F172A, #000000)',
          opacity: intensity === 'high' ? 1 : intensity === 'medium' ? 0.9 : 0.7
        }}
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-terminal-cyan font-terminal text-lg animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 border-2 border-terminal-cyan border-t-transparent rounded-full animate-spin"></div>
              <span>Initializing Matrix warfare system...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MatrixWarfareBackground