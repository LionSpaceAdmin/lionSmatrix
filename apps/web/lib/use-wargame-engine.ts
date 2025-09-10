'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { INTELLIGENCE_DATA } from './intelligence-data'

export interface Node {
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

export interface Edge {
  source: string
  target: string
  strength: number
}

export interface MousePosition {
  x: number
  y: number
}

export interface WargameEngineState {
  nodes: Node[]
  edges: Edge[]
  hoveredNode: string | null
  selectedNode: string | null
  focusedNodeIndex: number
  keyboardMode: boolean
  isInitialized: boolean
}

export interface WargameEngineCallbacks {
  onNodeClick: (actor: string | null) => void
  onNodeHover: (actor: string | null) => void
}

export interface UseWargameEngineReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  state: WargameEngineState
  callbacks: {
    handleMouseMove: (e: MouseEvent) => void
    handleClick: (e: MouseEvent) => void
  }
}

export const useWargameEngine = (
  onNodeClick?: (actor: string | null) => void
): UseWargameEngineReturn => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const edgesRef = useRef<Edge[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)
  const mouseRef = useRef<MousePosition>({ x: 0, y: 0 })
  
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [focusedNodeIndex, setFocusedNodeIndex] = useState<number>(-1)
  const [isInitialized, setIsInitialized] = useState(false)
  const [keyboardMode, setKeyboardMode] = useState(false)
  
  // Initialize nodes and edges data
  const initializeNetworkData = useCallback(() => {
    const actors = INTELLIGENCE_DATA.data_categories.primary_actors
    const actorData = INTELLIGENCE_DATA.intelligence_panel_data
    
    // Create nodes with physics properties
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
        risk: (actorData as Record<string, { risk_level: 'HIGH' | 'MEDIUM' | 'LOW', network_connections: string[] }>)[actor]?.risk_level || 'LOW',
        connections: (actorData as Record<string, { risk_level: 'HIGH' | 'MEDIUM' | 'LOW', network_connections: string[] }>)[actor]?.network_connections || [],
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
    setIsInitialized(true)
  }, [])
  
  // Physics simulation with optimized calculations
  const runPhysicsSimulation = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const nodes = nodesRef.current
    const edges = edgesRef.current
    
    // Apply forces to each node
    nodes.forEach((node, i) => {
      let fx = 0
      let fy = 0
      
      // Repulsion between nodes (optimized with distance check)
      nodes.forEach((other, j) => {
        if (i !== j) {
          const dx = node.x - other.x
          const dy = node.y - other.y
          const distanceSquared = dx * dx + dy * dy
          const distance = Math.sqrt(distanceSquared) || 1
          
          // Skip very distant nodes for performance
          if (distance < 500) {
            const force = 3000 / distanceSquared
            fx += (dx / distance) * force
            fy += (dy / distance) * force
          }
        }
      })
      
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
      
      // Mouse interaction force
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
  
  // Optimized rendering function with keyboard focus support
  const renderNetwork = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Update focus states before rendering
    const nodes = nodesRef.current
    nodes.forEach((node, index) => {
      // Add focus state to nodes
      (node as Node & { isFocused?: boolean }).isFocused = keyboardMode && index === focusedNodeIndex
      
      // Update hover state for focused node when in keyboard mode
      if (keyboardMode && index === focusedNodeIndex) {
        node.isHovered = true
      } else if (keyboardMode) {
        node.isHovered = false
      }
    })
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw edges with batched operations
    ctx.strokeStyle = 'rgba(110, 231, 183, 0.2)'
    ctx.lineWidth = 1
    ctx.beginPath()
    
    edgesRef.current.forEach(edge => {
      const source = nodesRef.current.find(n => n.id === edge.source)
      const target = nodesRef.current.find(n => n.id === edge.target)
      
      if (source && target) {
        ctx.moveTo(source.x, source.y)
        ctx.lineTo(target.x, target.y)
      }
    })
    
    ctx.stroke()
    
    // Draw nodes with optimized shadow rendering and focus states
    nodesRef.current.forEach(node => {
      const isFocused = (node as Node & { isFocused?: boolean }).isFocused
      
      // Draw focus ring for keyboard navigation
      if (isFocused) {
        ctx.beginPath()
        ctx.arc(node.x, node.y, 35, 0, Math.PI * 2)
        ctx.strokeStyle = '#6EE7B7'
        ctx.lineWidth = 3
        ctx.setLineDash([5, 5])
        ctx.stroke()
        ctx.setLineDash([]) // Reset dash pattern
      }
      
      // Node circle
      ctx.beginPath()
      ctx.arc(node.x, node.y, 25, 0, Math.PI * 2)
      
      // Fill based on risk level and state
      if (node.isSelected) {
        ctx.fillStyle = '#FFB700'
        ctx.shadowBlur = 20
        ctx.shadowColor = '#FFB700'
      } else if (node.isHovered || isFocused) {
        ctx.fillStyle = '#6EE7B7'
        ctx.shadowBlur = isFocused ? 20 : 15
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
      
      // Draw border with enhanced focus indication
      ctx.strokeStyle = (node.isHovered || isFocused) ? '#6EE7B7' : 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = isFocused ? 3 : 2
      ctx.stroke()
      
      // Draw label with enhanced visibility for focused nodes
      ctx.fillStyle = isFocused ? '#FFFFFF' : '#FFFFFF'
      ctx.font = (node.isHovered || isFocused) ? 'bold 12px monospace' : '11px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Split long names for better readability
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
      
      // Draw focus indicator text for screen readers
      if (isFocused && keyboardMode) {
        ctx.fillStyle = '#6EE7B7'
        ctx.font = 'bold 10px monospace'
        ctx.fillText('FOCUSED', node.x, node.y + 45)
      }
    })
  }, [keyboardMode, focusedNodeIndex])
  
  // Throttled mouse move handler for performance
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    mouseRef.current = { x, y }
    
    // Check for hover with distance optimization
    let foundHover = false
    nodesRef.current.forEach(node => {
      const dx = node.x - x
      const dy = node.y - y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 30) {
        if (!node.isHovered) {
          node.isHovered = true
          setHoveredNode(node.id)
          foundHover = true
          canvas.style.cursor = 'pointer'
        }
      } else {
        node.isHovered = false
      }
    })
    
    if (!foundHover && hoveredNode) {
      setHoveredNode(null)
      canvas.style.cursor = 'default'
    }
  }, [hoveredNode])
  
  // Click handler with precise hit detection
  const handleClick = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Check for click on node
    let clickedNode: Node | null = null
    nodesRef.current.forEach(node => {
      const dx = node.x - x
      const dy = node.y - y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 30) {
        clickedNode = node
      }
      
      node.isSelected = false
    })
    
    if (clickedNode !== null) {
      (clickedNode as Node).isSelected = true
      setSelectedNode((clickedNode as Node).id)
      onNodeClick?.((clickedNode as Node).id)
    } else {
      setSelectedNode(null)
      onNodeClick?.(null)
    }
  }, [onNodeClick])
  
  // Keyboard navigation handlers
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const nodes = nodesRef.current
    if (nodes.length === 0) return
    
    switch (e.key) {
      case 'Tab':
        e.preventDefault()
        setKeyboardMode(true)
        if (focusedNodeIndex === -1) {
          setFocusedNodeIndex(0)
        } else {
          const nextIndex = e.shiftKey 
            ? (focusedNodeIndex - 1 + nodes.length) % nodes.length
            : (focusedNodeIndex + 1) % nodes.length
          setFocusedNodeIndex(nextIndex)
        }
        break
        
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        setKeyboardMode(true)
        if (focusedNodeIndex === -1) {
          setFocusedNodeIndex(0)
        } else {
          setFocusedNodeIndex((focusedNodeIndex + 1) % nodes.length)
        }
        break
        
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        setKeyboardMode(true)
        if (focusedNodeIndex === -1) {
          setFocusedNodeIndex(nodes.length - 1)
        } else {
          setFocusedNodeIndex((focusedNodeIndex - 1 + nodes.length) % nodes.length)
        }
        break
        
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (focusedNodeIndex >= 0 && focusedNodeIndex < nodes.length) {
          const focusedNode = nodes[focusedNodeIndex];
          if (focusedNode) {
            // Clear all selections first
            nodes.forEach(node => { node.isSelected = false });
            // Select the focused node
            focusedNode.isSelected = true;
            setSelectedNode(focusedNode.id);
            onNodeClick?.(focusedNode.id);
          }
        }
        break
        
      case 'Escape':
        e.preventDefault()
        setFocusedNodeIndex(-1)
        setKeyboardMode(false)
        // Clear all selections
        nodes.forEach(node => { 
          node.isSelected = false
          node.isHovered = false
        })
        setSelectedNode(null)
        setHoveredNode(null)
        onNodeClick?.(null)
        break
    }
  }, [focusedNodeIndex, onNodeClick])
  
  // Update node focus states based on keyboard navigation
  const updateNodeFocusStates = useCallback(() => {
    const nodes = nodesRef.current
    nodes.forEach((node, index) => {
      // Add focus state to nodes
      (node as Node & { isFocused?: boolean }).isFocused = keyboardMode && index === focusedNodeIndex
      
      // Update hover state for focused node when in keyboard mode
      if (keyboardMode && index === focusedNodeIndex) {
        node.isHovered = true
        setHoveredNode(node.id)
      } else if (keyboardMode) {
        node.isHovered = false
      }
    })
  }, [keyboardMode, focusedNodeIndex])
  
  // Debounced resize handler
  const handleResize = useMemo(() => {
    let timeoutId: NodeJS.Timeout
    return () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        
        // Recalculate node positions relative to new center
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        
        nodesRef.current.forEach(node => {
          // Adjust positions proportionally
          const relativeX = (node.x - canvas.width / 2) / canvas.width
          const relativeY = (node.y - canvas.height / 2) / canvas.height
          
          node.x = centerX + relativeX * window.innerWidth
          node.y = centerY + relativeY * window.innerHeight
        })
      }, 100)
    }
  }, [])
  
  // Main animation loop
  useEffect(() => {
    if (!isInitialized) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    // Set initial canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const animate = () => {
      runPhysicsSimulation()
      renderNetwork()
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    // Start animation
    animate()
    
    // Add event listeners
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('click', handleClick)
    canvas.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)
    
    // Make canvas focusable for keyboard events
    canvas.setAttribute('tabindex', '0')
    canvas.setAttribute('role', 'application')
    canvas.setAttribute('aria-label', 'Interactive intelligence network visualization. Use Tab or arrow keys to navigate between nodes, Enter or Space to select, Escape to clear selection.')
    canvas.style.outline = 'none' // Remove default focus outline since we have custom focus indicators
    
    // Cleanup function
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('click', handleClick)
      canvas.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      
      // Clear refs to prevent memory leaks
      nodesRef.current = []
      edgesRef.current = []
      mouseRef.current = { x: 0, y: 0 }
    }
  }, [isInitialized, runPhysicsSimulation, renderNetwork, handleMouseMove, handleClick, handleKeyDown, handleResize])
  
  // Initialize network data on mount
  useEffect(() => {
    initializeNetworkData()
  }, [initializeNetworkData])
  
  // Return state and callbacks
  const state: WargameEngineState = {
    nodes: nodesRef.current,
    edges: edgesRef.current,
    hoveredNode,
    selectedNode,
    focusedNodeIndex,
    keyboardMode,
    isInitialized
  }
  
  return {
    canvasRef,
    state,
    callbacks: {
      handleMouseMove,
      handleClick
    }
  }
}