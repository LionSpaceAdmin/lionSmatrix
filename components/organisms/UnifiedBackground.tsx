'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { type ActorData, loadMatrixData, type MatrixData } from '@/lib/data-parsers'

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
  className = ''
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
    const particleCount = intensity === 'high' ? 100 : intensity === 'medium' ? 50 : 25

    // Add grid particles for all variants
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

    // Add matrix rain for landing and platform
    if (variant === 'landing' || variant === 'platform') {
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
        } else {
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

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [variant, intensity, interactive])

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(to bottom, #030712, #0F172A)',
          opacity: intensity === 'high' ? 1 : intensity === 'medium' ? 0.8 : 0.6
        }}
      />
    </div>
  )
}

export default UnifiedBackground
