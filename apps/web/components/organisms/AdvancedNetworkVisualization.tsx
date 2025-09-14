'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Activity, Brain, Network, Shield, Zap } from 'lucide-react'

// Matrix words from the data files
const MATRIX_WORDS = [
  'OSINT', 'SIGINT', 'HUMINT', 'GEOINT', 'Neural', 'Network', 'Intelligence',
  'Analysis', 'Threat', 'Detection', 'Disinformation', 'Propaganda', 'Moscow',
  'Data', 'Mining', 'Machine', 'Learning', 'AI', 'Pattern', 'Recognition',
  'Surveillance', 'Counter', 'Intelligence', 'Cyber', 'Warfare', 'Information',
  'Operations', 'Psychological', 'Warfare', 'Attribution', 'IOCs', 'APT',
  'Adversary', 'Campaign', 'Bot', 'Network', 'Astroturfing', 'Influence',
  'Operation', 'Truth', 'Verification', 'Evidence', 'Correlation', 'Analysis',
  'Social', 'Media', 'Monitoring', 'Sentiment', 'NLP', 'Classification',
  'Clustering', 'Anomaly', 'Detection', 'Deep', 'Learning', 'Transformer',
  'BERT', 'GPT', 'Neural', 'Networks', 'Supervised', 'Unsupervised',
  'Reinforcement', 'Learning', 'Feature', 'Extraction', 'Text', 'Mining',
  'Information', 'Retrieval', 'Topic', 'Modeling', 'Word2Vec', 'GloVe',
  'Attention', 'Mechanism', 'Encoder', 'Decoder', 'Sequence', 'Generation'
]

const TECH_CHARS = ['0', '1', '|', '-', '/', '\\', '<', '>', '[', ']', '{', '}', '▓', '░', '█']

interface MatrixChar {
  id: string
  x: number
  y: number
  char: string
  speed: number
  opacity: number
  age: number
  maxAge: number
}

interface NeuralNode {
  id: string
  x: number
  y: number
  type: 'core' | 'hub' | 'sensor' | 'analyzer' | 'response'
  connections: string[]
  activity: number
  pulsePhase: number
  size: number
  intelligence: number
}

interface DataPacket {
  id: string
  sourceId: string
  targetId: string
  progress: number
  data: string
  type: 'intelligence' | 'threat' | 'response' | 'analysis'
}

interface AdvancedNetworkVisualizationProps {
  className?: string
  density?: 'low' | 'medium' | 'high'
  mode?: 'intelligence' | 'defense' | 'analysis'
  showMatrix?: boolean
  showDataFlow?: boolean
  interactive?: boolean
}

export function AdvancedNetworkVisualization({
  className = '',
  density = 'medium',
  mode = 'intelligence',
  showMatrix = true,
  showDataFlow = true,
  interactive = false
}: AdvancedNetworkVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [matrixChars, setMatrixChars] = useState<MatrixChar[]>([])
  const [neuralNodes, setNeuralNodes] = useState<NeuralNode[]>([])
  const [dataPackets, setDataPackets] = useState<DataPacket[]>([])
  const [animationFrame, setAnimationFrame] = useState(0)

  // Generate matrix rain characters
  const generateMatrixChars = useCallback(() => {
    if (!containerRef.current) return []
    
    const container = containerRef.current
    const columns = Math.floor(container.offsetWidth / 20)
    const chars: MatrixChar[] = []
    
    for (let i = 0; i < columns; i++) {
      if (Math.random() < 0.3) { // 30% chance for each column
        const wordOrChar = (Math.random() < 0.4 ? 
          MATRIX_WORDS[Math.floor(Math.random() * MATRIX_WORDS.length)] :
          TECH_CHARS[Math.floor(Math.random() * TECH_CHARS.length)]) || '0'
        
        chars.push({
          id: `matrix-${i}-${Date.now()}-${Math.random()}`,
          x: i * 20,
          y: -20,
          char: wordOrChar,
          speed: 0.5 + Math.random() * 2,
          opacity: 0.7 + Math.random() * 0.3,
          age: 0,
          maxAge: 200 + Math.random() * 300
        })
      }
    }
    
    return chars
  }, [])

  // Generate neural network nodes
  const generateNeuralNodes = useCallback(() => {
    if (!containerRef.current) return []
    
    const container = containerRef.current
    const nodeCount = density === 'low' ? 15 : density === 'medium' ? 25 : 40
    const nodes: NeuralNode[] = []
    
    // Create different types of nodes based on mode
    const nodeTypes: NeuralNode['type'][] = 
      mode === 'intelligence' ? ['core', 'hub', 'sensor', 'analyzer'] :
      mode === 'defense' ? ['core', 'hub', 'response', 'analyzer'] :
      ['core', 'hub', 'sensor', 'analyzer', 'response']
    
    for (let i = 0; i < nodeCount; i++) {
      const type = nodeTypes[Math.floor(Math.random() * nodeTypes.length)]
      const intelligence = type === 'core' ? 0.9 : 
                          type === 'hub' ? 0.7 :
                          type === 'analyzer' ? 0.8 : 0.5
      
      nodes.push({
        id: `node-${i}`,
        x: Math.random() * container.offsetWidth,
        y: Math.random() * container.offsetHeight,
        type: type || 'sensor',
        connections: [],
        activity: Math.random(),
        pulsePhase: Math.random() * Math.PI * 2,
        size: type === 'core' ? 12 : type === 'hub' ? 8 : 6,
        intelligence
      })
    }
    
    // Create intelligent connections
    nodes.forEach((node, i) => {
      const connectionCount = node.type === 'core' ? 6 : 
                             node.type === 'hub' ? 4 : 2
      
      for (let j = 0; j < connectionCount; j++) {
        const possibleTargets = nodes.filter((target, targetIndex) => 
          targetIndex !== i && 
          !node.connections.includes(target.id) &&
          target.connections.length < 5
        )
        
        if (possibleTargets.length > 0) {
          // Prefer connecting to higher intelligence nodes
          possibleTargets.sort((a, b) => b.intelligence - a.intelligence)
          const target = possibleTargets[Math.floor(Math.random() * Math.min(3, possibleTargets.length))]
          if (target) {
            node.connections.push(target.id)
          }
        }
      }
    })
    
    return nodes
  }, [density, mode])

  // Generate data packets
  const generateDataPackets = useCallback(() => {
    if (neuralNodes.length < 2) return []
    
    const packets: DataPacket[] = []
    const packetCount = Math.floor(neuralNodes.length / 3)
    
    for (let i = 0; i < packetCount; i++) {
      const sourceNode = neuralNodes[Math.floor(Math.random() * neuralNodes.length)]
      if (sourceNode && sourceNode.connections.length > 0) {
        const targetId = sourceNode.connections[Math.floor(Math.random() * sourceNode.connections.length)]
        const dataType: DataPacket['type'] = 
          Math.random() < 0.3 ? 'threat' :
          Math.random() < 0.5 ? 'intelligence' :
          Math.random() < 0.7 ? 'analysis' : 'response'
        
        packets.push({
          id: `packet-${i}-${Date.now()}-${Math.random()}`,
          sourceId: sourceNode.id,
          targetId: targetId || 'unknown',
          progress: 0,
          data: MATRIX_WORDS[Math.floor(Math.random() * MATRIX_WORDS.length)] || 'data',
          type: dataType
        })
      }
    }
    
    return packets
  }, [neuralNodes])

  // Initialize visualization
  useEffect(() => {
    const nodes = generateNeuralNodes()
    setNeuralNodes(nodes)
  }, [generateNeuralNodes])

  // Generate data packets when nodes change
  useEffect(() => {
    if (showDataFlow && neuralNodes.length > 0) {
      setDataPackets(generateDataPackets())
    }
  }, [neuralNodes, showDataFlow, generateDataPackets])

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setAnimationFrame(prev => prev + 1)
      
      // Update matrix characters
      if (showMatrix) {
        setMatrixChars(prev => {
          const updated = prev.map(char => ({
            ...char,
            y: char.y + char.speed,
            age: char.age + 1,
            opacity: Math.max(0, char.opacity - 0.002)
          })).filter(char => 
            char.y < (containerRef.current?.offsetHeight || 0) + 50 && 
            char.age < char.maxAge
          )
          
          // Add new characters occasionally
          if (Math.random() < 0.1) {
            updated.push(...generateMatrixChars())
          }
          
          return updated
        })
      }
      
      // Update neural nodes
      setNeuralNodes(prev => prev.map(node => ({
        ...node,
        activity: Math.max(0, node.activity + (Math.random() - 0.5) * 0.1),
        pulsePhase: node.pulsePhase + 0.05
      })))
      
      // Update data packets
      if (showDataFlow) {
        setDataPackets(prev => {
          const updated = prev.map(packet => ({
            ...packet,
            progress: Math.min(1, packet.progress + 0.02)
          })).filter(packet => packet.progress < 1)
          
          // Generate new packets occasionally
          if (Math.random() < 0.05 && updated.length < 10) {
            updated.push(...generateDataPackets().slice(0, 2))
          }
          
          return updated
        })
      }
      
      requestAnimationFrame(animate)
    }
    
    const animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [showMatrix, showDataFlow, generateMatrixChars, generateDataPackets])

  const getModeConfig = () => {
    switch (mode) {
      case 'intelligence':
        return {
          title: 'INTELLIGENCE NETWORK',
          icon: Brain,
          primaryColor: 'terminal-cyan',
          secondaryColor: 'terminal-gold'
        }
      case 'defense':
        return {
          title: 'DEFENSE MATRIX',
          icon: Shield,
          primaryColor: 'terminal-green',
          secondaryColor: 'terminal-cyan'
        }
      case 'analysis':
        return {
          title: 'ANALYSIS ENGINE',
          icon: Network,
          primaryColor: 'terminal-gold',
          secondaryColor: 'terminal-cyan'
        }
      default:
        return {
          title: 'INTELLIGENCE NETWORK',
          icon: Brain,
          primaryColor: 'terminal-cyan',
          secondaryColor: 'terminal-gold'
        }
    }
  }

  const config = getModeConfig()

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-terminal-bg overflow-hidden border border-terminal-border/30 ${className}`}
    >
      {/* Neural Network Background */}
      <div className="neural-grid absolute inset-0">
        {/* Network Nodes */}
        {neuralNodes.map(node => (
          <div key={node.id} className="absolute">
            {/* Node connections */}
            {node.connections.map(targetId => {
              const target = neuralNodes.find(n => n.id === targetId)
              if (!target) return null
              
              const dx = target.x - node.x
              const dy = target.y - node.y
              const length = Math.sqrt(dx * dx + dy * dy)
              const angle = Math.atan2(dy, dx) * 180 / Math.PI
              
              return (
                <div
                  key={`${node.id}-${targetId}`}
                  className="network-connection animate-connection-pulse"
                  style={{
                    left: node.x,
                    top: node.y,
                    width: length,
                    transform: `rotate(${angle}deg)`,
                    animationDelay: `${node.pulsePhase}s`
                  }}
                />
              )
            })}
            
            {/* Neural node */}
            <div
              className={`neural-node animate-neural-pulse ${
                node.type === 'core' ? 'bg-terminal-gold' :
                node.type === 'hub' ? 'bg-terminal-cyan' :
                node.type === 'sensor' ? 'bg-terminal-red' :
                'bg-terminal-cyan'
              }`}
              style={{
                left: node.x - node.size / 2,
                top: node.y - node.size / 2,
                width: node.size,
                height: node.size,
                animationDelay: `${node.pulsePhase}s`,
                opacity: 0.6 + node.activity * 0.4
              }}
            />
            
            {/* Node label for important nodes */}
            {(node.type === 'core' || node.type === 'hub') && (
              <div
                className="absolute text-xs font-terminal text-terminal-cyan/60 pointer-events-none"
                style={{
                  left: node.x - 20,
                  top: node.y - node.size - 15,
                  width: 40,
                  textAlign: 'center'
                }}
              >
                {node.type.toUpperCase()}
              </div>
            )}
          </div>
        ))}
        
        {/* Data Packets */}
        {showDataFlow && dataPackets.map(packet => {
          const source = neuralNodes.find(n => n.id === packet.sourceId)
          const target = neuralNodes.find(n => n.id === packet.targetId)
          
          if (!source || !target) return null
          
          const x = source.x + (target.x - source.x) * packet.progress
          const y = source.y + (target.y - source.y) * packet.progress
          
          return (
            <div
              key={packet.id}
              className={`data-packet animate-data-pulse ${
                packet.type === 'threat' ? 'bg-terminal-red' :
                packet.type === 'intelligence' ? 'bg-terminal-cyan' :
                packet.type === 'analysis' ? 'bg-terminal-gold' :
                'bg-terminal-green'
              }`}
              style={{
                left: x - 2,
                top: y - 2,
                opacity: Math.sin(packet.progress * Math.PI) // Fade in and out
              }}
            />
          )
        })}
      </div>
      
      {/* Matrix Rain */}
      {showMatrix && (
        <div className="matrix-container absolute inset-0">
          {matrixChars.map(char => (
            <div
              key={char.id}
              className={`matrix-rain animate-matrix-char-fade ${
                MATRIX_WORDS.includes(char.char) ? 'text-terminal-gold' : 'text-terminal-cyan'
              }`}
              style={{
                left: char.x,
                top: char.y,
                opacity: char.opacity,
                fontSize: MATRIX_WORDS.includes(char.char) ? '10px' : '12px',
                animationDelay: `${char.age * 0.01}s`
              }}
            >
              {char.char}
            </div>
          ))}
        </div>
      )}
      
      {/* Terminal Grid Enhancement */}
      <div className="terminal-grid" />
      
      {/* Scan Lines */}
      <div className="scanline" />
      
      {/* Control Panel */}
      <div className="absolute top-4 left-4 bg-terminal-bg/80 backdrop-blur-sm border border-terminal-border/50 rounded p-3">
        <div className="flex items-center gap-2 mb-2">
          <config.icon className="w-4 h-4 text-terminal-cyan" />
          <span className="text-terminal-cyan font-terminal text-sm font-bold">
            {config.title}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs font-terminal">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-terminal-cyan rounded-full animate-pulse" />
            <span className="text-terminal-text/70">Nodes: {neuralNodes.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-terminal-gold rounded-full animate-pulse" />
            <span className="text-terminal-text/70">Active: {dataPackets.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse" />
            <span className="text-terminal-text/70">Intel: {mode}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-terminal-cyan animate-pulse" />
            <span className="text-terminal-text/70">Live</span>
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 right-4 bg-terminal-bg/60 backdrop-blur-sm border border-terminal-border/30 rounded p-2">
        <div className="flex items-center justify-between text-xs font-terminal">
          <div className="flex items-center gap-4">
            <span className="text-terminal-cyan">STATUS:</span>
            <span className="text-terminal-green">OPERATIONAL</span>
            {showMatrix && (
              <span className="text-terminal-gold">MATRIX_ACTIVE</span>
            )}
            {showDataFlow && (
              <span className="text-terminal-cyan">DATA_FLOW_ENABLED</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-terminal-gold animate-pulse" />
            <span className="text-terminal-text/70">
              {Math.floor(animationFrame / 60)}s
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}