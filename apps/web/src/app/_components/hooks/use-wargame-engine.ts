'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { INTELLIGENCE_DATA } from '../visuals/intelligence-data'

interface Node {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  label: string
  risk: 'HIGH' | 'MEDIUM' | 'LOW'
  connections: string[]
  isHovered: boolean
  isSelected: boolean
}

interface Edge {
  source: string
  target: string
  strength: number
}

interface WargameEngineState {
  hoveredNode: string | null
  selectedNode: string | null
  canvasRef: React.RefObject<HTMLCanvasElement>
  handleNodeClick: (actor: string | null) => void
}

export function useWargameEngine(onNodeClick?: (actor: string | null) => void): WargameEngineState {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const edgesRef = useRef<Edge[]>([])
  const animationFrameRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0 })
  const onNodeClickRef = useRef(onNodeClick)
  
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  // Update the ref when the callback changes
  useEffect(() => {
    onNodeClickRef.current = onNodeClick
  }, [onNodeClick])

  // Initialize nodes and edges
  useEffect(() => {
    const actors = INTELLIGENCE_DATA.data_categories.primary_actors
    const actorData = INTELLIGENCE_DATA.intelligence_panel_data
    
    // Create nodes with physics initialization
    const nodes: Node[] = actors.map((actor, index) => {
      const angle = (index / actors.length) * Math.PI * 2
      const radius = 250
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      return {
        id: actor,
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 100,
        y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 100,
        vx: 0,
        vy: 0,
        label: actor,
        risk: actorData[actor]?.risk_level as 'HIGH' | 'MEDIUM' | 'LOW' || 'LOW',
        connections: actorData[actor]?.network_connections || [],
        isHovered: false,
        isSelected: false
      }
    })
    
    // Create edges based on network connections
    const edges: Edge[] = []
    nodes.forEach(node => {
      node.connections.forEach(connection => {
        const targetNode = nodes.find(n => n.id === connection)
        if (targetNode) {
          edges.push({
            source: node.id,
            target: targetNode.id,
            strength: node.risk === 'HIGH' ? 0.8 : 0.5
          })
        }
      })
    })
    
    nodesRef.current = nodes
    edgesRef.current = edges
  }, [])

  // Mouse event handlers with optimized performance
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    mouseRef.current = { x, y }
    
    // Optimize hover detection
    let foundHover = false
    const nodes = nodesRef.current
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const distance = Math.sqrt(
        Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)
      )
      
      if (distance < 30) {
        node.isHovered = true
        setHoveredNode(node.id)
        foundHover = true
        canvas.style.cursor = 'pointer'
        break // Early exit for performance
      } else {
        node.isHovered = false
      }
    }
    
    if (!foundHover) {
      setHoveredNode(null)
      canvas.style.cursor = 'default'
    }
  }, [])
  
  const handleClick = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Optimized click detection
    let clickedNode: Node | null = null
    const nodes = nodesRef.current
    
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const distance = Math.sqrt(
        Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)
      )
      
      node.isSelected = false // Reset all selections
      
      if (distance < 30 && !clickedNode) {
        clickedNode = node
      }
    }
    
    if (clickedNode) {
      clickedNode.isSelected = true
      setSelectedNode(clickedNode.id)
      onNodeClickRef.current?.(clickedNode.id)
    } else {
      setSelectedNode(null)
      onNodeClickRef.current?.(null)
    }
  }, [])

  // Physics simulation with performance optimizations
  const runPhysicsSimulation = useCallback((canvas: HTMLCanvasElement) => {
    const nodes = nodesRef.current
    const edges = edgesRef.current
    
    // Apply forces with performance optimizations
    nodes.forEach((node, i) => {
      let fx = 0
      let fy = 0
      
      // Repulsion between nodes (optimized)
      for (let j = 0; j < nodes.length; j++) {
        if (i !== j) {
          const other = nodes[j]
          const dx = node.x - other.x
          const dy = node.y - other.y
          const distanceSquared = dx * dx + dy * dy
          const distance = Math.sqrt(distanceSquared) || 1
          
          // Avoid expensive calculations for distant nodes
          if (distance < 200) {
            const force = 3000 / distanceSquared
            fx += (dx / distance) * force
            fy += (dy / distance) * force
          }
        }
      }
      
      // Attraction along edges
      edges.forEach(edge => {
        let other: Node | undefined
        if (edge.source === node.id) {
          other = nodes.find(n => n.id === edge.target)
        } else if (edge.target === node.id) {
          other = nodes.find(n => n.id === edge.source)
        }
        
        if (other) {
          const dx = other.x - node.x
          const dy = other.y - node.y
          const distance = Math.sqrt(dx * dx + dy * dy) || 1
          const force = distance * 0.001 * edge.strength
          
          fx += dx * force
          fy += dy * force
        }
      })
      
      // Center gravity
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      fx += (centerX - node.x) * 0.0001
      fy += (centerY - node.y) * 0.0001
      
      // Mouse interaction
      if (node.isHovered) {
        const dx = mouseRef.current.x - node.x
        const dy = mouseRef.current.y - node.y
        fx += dx * 0.01
        fy += dy * 0.01
      }
      
      // Apply forces with damping
      node.vx = (node.vx + fx) * 0.85
      node.vy = (node.vy + fy) * 0.85
      
      // Update position
      node.x += node.vx
      node.y += node.vy
      
      // Boundary constraints
      const margin = 50
      if (node.x < margin) node.x = margin
      if (node.x > canvas.width - margin) node.x = canvas.width - margin
      if (node.y < margin) node.y = margin
      if (node.y > canvas.height - margin) node.y = canvas.height - margin
    })
  }, [])

  // Optimized rendering function
  const renderVisualization = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw edges
    ctx.strokeStyle = 'rgba(110, 231, 183, 0.2)'
    ctx.lineWidth = 1
    
    edgesRef.current.forEach(edge => {
      const source = nodesRef.current.find(n => n.id === edge.source)
      const target = nodesRef.current.find(n => n.id === edge.target)
      
      if (source && target) {
        ctx.beginPath()
        ctx.moveTo(source.x, source.y)
        ctx.lineTo(target.x, target.y)
        ctx.stroke()
      }
    })
    
    // Draw nodes
    nodesRef.current.forEach(node => {
      // Node circle
      ctx.beginPath()
      ctx.arc(node.x, node.y, 25, 0, Math.PI * 2)
      
      // Fill based on risk level and state
      if (node.isSelected) {
        ctx.fillStyle = '#FFB700'
        ctx.shadowBlur = 20
        ctx.shadowColor = '#FFB700'
      } else if (node.isHovered) {
        ctx.fillStyle = '#6EE7B7'
        ctx.shadowBlur = 15
        ctx.shadowColor = '#6EE7B7'
      } else if (node.risk === 'HIGH') {
        ctx.fillStyle = '#D43F3F'
        ctx.shadowBlur = 10
        ctx.shadowColor = '#D43F3F'
      } else if (node.risk === 'MEDIUM') {
        ctx.fillStyle = '#F59E0B'
        ctx.shadowBlur = 8
        ctx.shadowColor = '#F59E0B'
      } else {
        ctx.fillStyle = '#10B981'
        ctx.shadowBlur = 5
        ctx.shadowColor = '#10B981'
      }
      
      ctx.fill()
      ctx.shadowBlur = 0
      
      // Draw border
      ctx.strokeStyle = node.isHovered ? '#6EE7B7' : 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Draw label
      ctx.fillStyle = '#FFFFFF'
      ctx.font = node.isHovered ? 'bold 12px monospace' : '11px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Split long names
      const words = node.label.split(' ')
      if (words.length > 2) {
        ctx.fillText(words.slice(0, 2).join(' '), node.x, node.y - 6)
        ctx.fillText(words.slice(2).join(' '), node.x, node.y + 6)
      } else {
        ctx.fillText(node.label, node.x, node.y)
      }
      
      // Draw risk indicator
      if (node.risk === 'HIGH') {
        ctx.beginPath()
        ctx.arc(node.x + 20, node.y - 20, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#FF0000'
        ctx.fill()
      }
    })
  }, [])

  // Main animation loop with comprehensive lifecycle management
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Canvas resize handler with debouncing
    let resizeTimeout: NodeJS.Timeout
    const resizeCanvas = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        
        // Recalculate node positions if needed
        const nodes = nodesRef.current
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        
        nodes.forEach(node => {
          // Gently pull nodes toward new center if they're outside bounds
          if (node.x > canvas.width - 50) node.x = canvas.width - 50
          if (node.y > canvas.height - 50) node.y = canvas.height - 50
        })
      }, 100)
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // Add event listeners
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('click', handleClick)
    
    // Animation loop
    const animate = () => {
      runPhysicsSimulation(canvas)
      renderVisualization(ctx, canvas)
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    // Comprehensive cleanup function
    return () => {
      // Clear timeout
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }
      
      // Remove event listeners
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('click', handleClick)
      
      // Cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      
      // Nullify large data objects for memory management
      nodesRef.current = []
      edgesRef.current = []
      mouseRef.current = { x: 0, y: 0 }
    }
  }, []) // Remove all dependencies to prevent re-initialization

  // Expose node click handler for external use
  const handleNodeClick = useCallback((actor: string | null) => {
    onNodeClickRef.current?.(actor)
  }, [])

  return {
    hoveredNode,
    selectedNode,
    canvasRef,
    handleNodeClick
  }
}