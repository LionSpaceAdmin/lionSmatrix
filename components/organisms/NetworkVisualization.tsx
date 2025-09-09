"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/atoms/grid"

interface NetworkNode {
  id: string
  label: string
  type: "actor" | "narrative" | "platform" | "threat"
  risk: "low" | "medium" | "high" | "critical"
  connections: number
  x?: number
  y?: number
  vx?: number
  vy?: number
}

interface NetworkLink {
  source: string
  target: string
  strength: number
  type: "influence" | "coordination" | "amplification"
}

interface NetworkVisualizationProps {
  className?: string
  interactive?: boolean
  showLabels?: boolean
}

export function NetworkVisualization({
  className = "",
  interactive = true,
  showLabels = true,
}: NetworkVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null)
  const nodesRef = useRef<NetworkNode[]>([])
  const linksRef = useRef<NetworkLink[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })

  // Initialize network data
  useEffect(() => {
    // Sample network data
    const nodes: NetworkNode[] = [
      { id: "actor1", label: "PRIMARY ACTOR", type: "actor", risk: "critical", connections: 8 },
      { id: "actor2", label: "AMPLIFIER_01", type: "actor", risk: "high", connections: 5 },
      { id: "actor3", label: "BOT_NETWORK", type: "actor", risk: "high", connections: 6 },
      { id: "narrative1", label: "DISINFO_CAMPAIGN", type: "narrative", risk: "critical", connections: 4 },
      { id: "narrative2", label: "PROPAGANDA_WAVE", type: "narrative", risk: "high", connections: 3 },
      { id: "platform1", label: "SOCIAL_PLATFORM_A", type: "platform", risk: "medium", connections: 7 },
      { id: "platform2", label: "MESSAGING_APP_X", type: "platform", risk: "low", connections: 4 },
      { id: "threat1", label: "CYBER_THREAT_01", type: "threat", risk: "critical", connections: 5 },
      { id: "threat2", label: "PHISHING_CLUSTER", type: "threat", risk: "high", connections: 3 },
    ]

    const links: NetworkLink[] = [
      { source: "actor1", target: "narrative1", strength: 0.9, type: "influence" },
      { source: "actor1", target: "actor2", strength: 0.7, type: "coordination" },
      { source: "actor2", target: "platform1", strength: 0.6, type: "amplification" },
      { source: "actor3", target: "platform1", strength: 0.8, type: "amplification" },
      { source: "narrative1", target: "platform1", strength: 0.9, type: "influence" },
      { source: "narrative1", target: "narrative2", strength: 0.5, type: "influence" },
      { source: "platform1", target: "platform2", strength: 0.4, type: "amplification" },
      { source: "threat1", target: "actor1", strength: 0.8, type: "coordination" },
      { source: "threat2", target: "actor3", strength: 0.6, type: "coordination" },
      { source: "narrative2", target: "platform2", strength: 0.7, type: "influence" },
    ]

    // Initialize positions
    const canvas = canvasRef.current
    if (canvas) {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(centerX, centerY) * 0.6

      nodes.forEach((node, i) => {
        const angle = (i / nodes.length) * Math.PI * 2
        node.x = centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 50
        node.y = centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 50
        node.vx = 0
        node.vy = 0
      })
    }

    nodesRef.current = nodes
    linksRef.current = links
  }, [])

  // Force simulation
  const simulate = useCallback(() => {
    const nodes = nodesRef.current
    const links = linksRef.current
    const canvas = canvasRef.current
    if (!canvas) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Apply forces
    nodes.forEach((node, i) => {
      if (!node.x || !node.y) return

      // Center gravity
      const dx = centerX - node.x
      const dy = centerY - node.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance > 0) {
        node.vx = (node.vx || 0) + dx * 0.0001
        node.vy = (node.vy || 0) + dy * 0.0001
      }

      // Repulsion between nodes
      nodes.forEach((other, j) => {
        if (i === j || !node.x || !node.y || !other.x || !other.y) return
        const dx = node.x - other.x
        const dy = node.y - other.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance > 0 && distance < 100) {
          const force = 1000 / (distance * distance)
          node.vx = (node.vx || 0) + (dx / distance) * force
          node.vy = (node.vy || 0) + (dy / distance) * force
        }
      })

      // Link forces
      links.forEach((link) => {
        const source = nodes.find((n) => n.id === link.source)
        const target = nodes.find((n) => n.id === link.target)
        if (source && target && source.x && source.y && target.x && target.y) {
          if (node.id === link.source || node.id === link.target) {
            const other = node.id === link.source ? target : source
            if (!other.x || !other.y || !node.x || !node.y) return
            const dx = other.x - node.x
            const dy = other.y - node.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const idealDistance = 150
            if (distance > 0) {
              const force = (distance - idealDistance) * link.strength * 0.001
              node.vx = (node.vx || 0) + (dx / distance) * force
              node.vy = (node.vy || 0) + (dy / distance) * force
            }
          }
        }
      })

      // Apply velocity damping
      node.vx = (node.vx || 0) * 0.85
      node.vy = (node.vy || 0) * 0.85

      // Update position
      node.x += node.vx || 0
      node.y += node.vy || 0

      // Keep within bounds
      node.x = Math.max(50, Math.min(canvas.width - 50, node.x))
      node.y = Math.max(50, Math.min(canvas.height - 50, node.y))
    })
  }, [])

  // Draw network
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const nodes = nodesRef.current
    const links = linksRef.current

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background grid
    ctx.strokeStyle = "rgba(110, 231, 183, 0.05)"
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

    // Draw links
    links.forEach((link) => {
      const source = nodes.find((n) => n.id === link.source)
      const target = nodes.find((n) => n.id === link.target)
      if (source?.x && source?.y && target?.x && target?.y) {
        ctx.beginPath()
        ctx.moveTo(source.x, source.y)
        ctx.lineTo(target.x, target.y)

        // Color based on link type
        const alpha = link.strength * 0.5
        if (link.type === "influence") {
          ctx.strokeStyle = `rgba(110, 231, 183, ${alpha})`
        } else if (link.type === "coordination") {
          ctx.strokeStyle = `rgba(255, 195, 0, ${alpha})`
        } else {
          ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`
        }

        ctx.lineWidth = link.strength * 3
        ctx.stroke()
      }
    })

    // Draw nodes
    nodes.forEach((node) => {
      if (!node.x || !node.y) return

      const isHovered = hoveredNode?.id === node.id
      const isSelected = selectedNode?.id === node.id
      const radius = 8 + node.connections * 2

      // Node color based on type and risk
      let color = "rgba(110, 231, 183, 0.8)"
      if (node.risk === "critical") {
        color = "rgba(239, 68, 68, 0.8)"
      } else if (node.risk === "high") {
        color = "rgba(255, 195, 0, 0.8)"
      } else if (node.risk === "medium") {
        color = "rgba(110, 231, 183, 0.8)"
      }

      // Draw node
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()

      // Draw border
      ctx.strokeStyle = isSelected ? "rgba(255, 255, 255, 1)" : color
      ctx.lineWidth = isHovered || isSelected ? 3 : 2
      ctx.stroke()

      // Draw glow effect for critical nodes
      if (node.risk === "critical") {
        ctx.shadowColor = "rgba(239, 68, 68, 0.5)"
        ctx.shadowBlur = 20
        ctx.stroke()
        ctx.shadowBlur = 0
      }

      // Draw label
      if (showLabels || isHovered || isSelected) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
        ctx.font = "10px monospace"
        ctx.textAlign = "center"
        ctx.fillText(node.label, node.x, node.y - radius - 5)
      }

      // Draw node type icon
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.font = "12px monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      if (node.type === "actor") {
        ctx.fillText("A", node.x, node.y)
      } else if (node.type === "narrative") {
        ctx.fillText("N", node.x, node.y)
      } else if (node.type === "platform") {
        ctx.fillText("P", node.x, node.y)
      } else if (node.type === "threat") {
        ctx.fillText("T", node.x, node.y)
      }
    })

    // Draw info panel for selected node
    if (selectedNode && selectedNode.x && selectedNode.y) {
      const panelWidth = 200
      const panelHeight = 100
      const panelX = Math.min(selectedNode.x + 20, canvas.width - panelWidth - 10)
      const panelY = Math.min(selectedNode.y - 50, canvas.height - panelHeight - 10)

      ctx.fillStyle = "rgba(0, 0, 0, 0.9)"
      ctx.fillRect(panelX, panelY, panelWidth, panelHeight)
      ctx.strokeStyle = "rgba(110, 231, 183, 0.5)"
      ctx.strokeRect(panelX, panelY, panelWidth, panelHeight)

      ctx.fillStyle = "rgba(110, 231, 183, 1)"
      ctx.font = "bold 12px monospace"
      ctx.fillText(selectedNode.label, panelX + 10, panelY + 20)

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.font = "10px monospace"
      ctx.fillText(`Type: ${selectedNode.type.toUpperCase()}`, panelX + 10, panelY + 40)
      ctx.fillText(`Risk: ${selectedNode.risk.toUpperCase()}`, panelX + 10, panelY + 55)
      ctx.fillText(`Connections: ${selectedNode.connections}`, panelX + 10, panelY + 70)
    }
  }, [hoveredNode, selectedNode, showLabels])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const animate = () => {
      simulate()
      draw()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [simulate, draw])

  // Handle canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // Handle mouse interactions
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!interactive) return

      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      mouseRef.current = { x, y }

      // Find hovered node
      const nodes = nodesRef.current
      let foundNode: NetworkNode | null = null

      for (const node of nodes) {
        if (!node.x || !node.y) continue
        const dx = x - node.x
        const dy = y - node.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const radius = 8 + node.connections * 2

        if (distance <= radius) {
          foundNode = node
          break
        }
      }

      setHoveredNode(foundNode)
      canvas.style.cursor = foundNode ? "pointer" : "default"
    },
    [interactive]
  )

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!interactive) return

      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Find clicked node
      const nodes = nodesRef.current
      for (const node of nodes) {
        if (!node.x || !node.y) continue
        const dx = x - node.x
        const dy = y - node.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const radius = 8 + node.connections * 2

        if (distance <= radius) {
          setSelectedNode(node === selectedNode ? null : node)
          break
        }
      }
    },
    [interactive, selectedNode]
  )

  return (
    <Card className={`terminal-card ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>NETWORK ANALYSIS</span>
          {selectedNode && (
            <span className="text-terminal-muted text-sm font-normal">Selected: {selectedNode.label}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <canvas ref={canvasRef} className="h-[500px] w-full" onMouseMove={handleMouseMove} onClick={handleClick} />
        <div className="border-terminal-border border-t p-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <div className="flex gap-4">
              <span className="flex items-center gap-2">
                <div className="bg-terminal-red h-3 w-3 rounded-full" />
                Critical Risk
              </span>
              <span className="flex items-center gap-2">
                <div className="bg-terminal-gold h-3 w-3 rounded-full" />
                High Risk
              </span>
              <span className="flex items-center gap-2">
                <div className="bg-terminal-cyan h-3 w-3 rounded-full" />
                Medium/Low Risk
              </span>
            </div>
            <span className="text-terminal-muted">
              {nodesRef.current.length} nodes, {linksRef.current.length} connections
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
