'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Monitor, Database, Search, Shield } from 'lucide-react'

// Enhanced matrix words from our data files
const INTELLIGENCE_TERMS = [
  'OSINT', 'SIGINT', 'HUMINT', 'GEOINT', 'MASINT', 'TECHINT', 'IMINT',
  'Moscow', 'Rumble', 'Russia', 'Disinformation', 'Nasrallah', 'Propaganda',
  'Hamas', 'Quds', 'Jackson_Hinkle', 'Max_Blumenthal', 'Abby_Martin',
  'Network_Analysis', 'Threat_Actor', 'Attribution', 'IOCs', 'TTPs',
  'APT1', 'APT28', 'APT29', 'Lazarus_Group', 'Equation_Group'
]

const TECHNICAL_TERMS = [
  'Neural_Network', 'Machine_Learning', 'Deep_Learning', 'AI', 'NLP',
  'Pattern_Recognition', 'Anomaly_Detection', 'Classification', 'Clustering',
  'Supervised_Learning', 'Unsupervised_Learning', 'Reinforcement_Learning',
  'Transformer', 'BERT', 'GPT', 'Attention_Mechanism', 'Word2Vec', 'GloVe',
  'Feature_Extraction', 'Text_Mining', 'Sentiment_Analysis', 'Topic_Modeling'
]

const CYBER_WARFARE_TERMS = [
  'Information_Warfare', 'Psychological_Operations', 'PSYOPS', 'Cognitive_Security',
  'Social_Engineering', 'Phishing', 'Spear_Phishing', 'Ransomware', 'Malware',
  'Botnet', 'Command_Control', 'C2_Infrastructure', 'Domain_Generation',
  'Fast_Flux', 'Bulletproof_Hosting', 'Tor', 'VPN', 'Proxy_Servers',
  'Encrypted_Communications', 'Steganography', 'Cryptography', 'PKI'
]

const OPERATION_TERMS = [
  'Influence_Operation', 'Active_Measures', 'Dezinformatsiya', 'Astroturfing',
  'Sock_Puppets', 'Fake_Accounts', 'Bot_Networks', 'Troll_Farms',
  'Click_Farms', 'Engagement_Pods', 'Comment_Manipulation', 'Review_Manipulation',
  'Search_Engine_Manipulation', 'Social_Media_Manipulation', 'Platform_Manipulation',
  'Algorithmic_Manipulation', 'Filter_Bubbles', 'Echo_Chambers'
]

const MATRIX_SYMBOLS = ['0', '1', '|', '/', '\\', '-', '_', '▓', '░', '█', '▒', '╬', '╫', '╪', '╩', '╨']

interface MatrixColumn {
  id: string
  x: number
  chars: MatrixCharacter[]
  speed: number
  density: number
  category: 'intelligence' | 'technical' | 'cyber' | 'operations' | 'symbols'
}

interface MatrixCharacter {
  id: string
  char: string
  y: number
  opacity: number
  age: number
  maxAge: number
  isHighlight: boolean
  category: string
}

interface HorizontalDataStream {
  id: string
  y: number
  content: string
  speed: number
  opacity: number
  width: number
  category: 'intelligence' | 'threat' | 'analysis' | 'response'
}

interface MatrixDataFlowProps {
  className?: string
  intensity?: 'low' | 'medium' | 'high' | 'extreme'
  mode?: 'intelligence' | 'defense' | 'analysis' | 'warfare'
  showHorizontalStreams?: boolean
  showVerticalMatrix?: boolean
  highlightThreats?: boolean
}

export function MatrixDataFlow({
  className = '',
  intensity = 'medium',
  mode = 'intelligence',
  showHorizontalStreams = true,
  showVerticalMatrix = true,
  highlightThreats = true
}: MatrixDataFlowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [matrixColumns, setMatrixColumns] = useState<MatrixColumn[]>([])
  const [horizontalStreams, setHorizontalStreams] = useState<HorizontalDataStream[]>([])
  const [animationPhase, setAnimationPhase] = useState(0)

  // Get word pool based on mode
  const getWordPool = useCallback(() => {
    switch (mode) {
      case 'intelligence':
        return [...INTELLIGENCE_TERMS, ...TECHNICAL_TERMS]
      case 'defense':
        return [...CYBER_WARFARE_TERMS, ...TECHNICAL_TERMS]
      case 'analysis':
        return [...TECHNICAL_TERMS, ...INTELLIGENCE_TERMS]
      case 'warfare':
        return [...CYBER_WARFARE_TERMS, ...OPERATION_TERMS]
      default:
        return [...INTELLIGENCE_TERMS, ...TECHNICAL_TERMS, ...CYBER_WARFARE_TERMS]
    }
  }, [mode])

  // Initialize matrix columns
  const initializeMatrix = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const columnWidth = 20
    const columnCount = Math.floor(container.offsetWidth / columnWidth)
    const columns: MatrixColumn[] = []

    const intensityConfig = {
      low: { density: 0.2, maxColumns: Math.floor(columnCount * 0.3) },
      medium: { density: 0.4, maxColumns: Math.floor(columnCount * 0.6) },
      high: { density: 0.6, maxColumns: Math.floor(columnCount * 0.8) },
      extreme: { density: 0.8, maxColumns: columnCount }
    }

    const config = intensityConfig[intensity]

    for (let i = 0; i < config.maxColumns; i++) {
      const columnIndex = Math.floor(Math.random() * columnCount)
      
      if (!columns.find(col => Math.abs(col.x - columnIndex * columnWidth) < columnWidth)) {
        const categories: MatrixColumn['category'][] = ['intelligence', 'technical', 'cyber', 'operations', 'symbols']
        const category = categories[Math.floor(Math.random() * categories.length)]
        
        columns.push({
          id: `column-${i}`,
          x: columnIndex * columnWidth,
          chars: [],
          speed: 0.5 + Math.random() * (intensity === 'extreme' ? 3 : 2),
          density: config.density + Math.random() * 0.3,
          category
        })
      }
    }

    setMatrixColumns(columns)
  }, [intensity])

  // Generate matrix characters for a column
  const generateMatrixChars = useCallback((column: MatrixColumn): MatrixCharacter[] => {
    if (!containerRef.current) return []
    
    const container = containerRef.current
    const chars: MatrixCharacter[] = []
    const wordPool = getWordPool()
    
    // Generate characters based on column category and density
    const charCount = Math.floor(column.density * 30)
    
    for (let i = 0; i < charCount; i++) {
      let char: string
      let isHighlight = false
      
      if (column.category === 'symbols') {
        char = MATRIX_SYMBOLS[Math.floor(Math.random() * MATRIX_SYMBOLS.length)]
      } else {
        if (Math.random() < 0.3) { // 30% chance for words
          char = wordPool[Math.floor(Math.random() * wordPool.length)]
          isHighlight = highlightThreats && (
            char.includes('Threat') || 
            char.includes('Attack') || 
            char.includes('Malware') ||
            char.includes('Disinformation') ||
            char.includes('Propaganda')
          )
        } else {
          char = MATRIX_SYMBOLS[Math.floor(Math.random() * MATRIX_SYMBOLS.length)]
        }
      }
      
      chars.push({
        id: `char-${column.id}-${i}`,
        char,
        y: -Math.random() * container.offsetHeight,
        opacity: 0.3 + Math.random() * 0.7,
        age: 0,
        maxAge: 100 + Math.random() * 200,
        isHighlight,
        category: column.category
      })
    }
    
    return chars
  }, [getWordPool, highlightThreats])

  // Generate horizontal data streams
  const generateHorizontalStreams = useCallback(() => {
    if (!containerRef.current) return []
    
    const container = containerRef.current
    const streams: HorizontalDataStream[] = []
    const streamCount = intensity === 'low' ? 2 : intensity === 'medium' ? 4 : intensity === 'high' ? 6 : 8
    
    for (let i = 0; i < streamCount; i++) {
      const categories: HorizontalDataStream['category'][] = ['intelligence', 'threat', 'analysis', 'response']
      const category = categories[Math.floor(Math.random() * categories.length)]
      const wordPool = getWordPool()
      
      const content = Array.from({ length: 5 + Math.floor(Math.random() * 10) }, () => 
        Math.random() < 0.7 ? 
          wordPool[Math.floor(Math.random() * wordPool.length)] :
          MATRIX_SYMBOLS[Math.floor(Math.random() * MATRIX_SYMBOLS.length)]
      ).join(' ')
      
      streams.push({
        id: `stream-${i}`,
        y: Math.random() * container.offsetHeight,
        content,
        speed: 1 + Math.random() * 3,
        opacity: 0.4 + Math.random() * 0.4,
        width: container.offsetWidth + 200,
        category
      })
    }
    
    return streams
  }, [intensity, getWordPool])

  // Initialize everything
  useEffect(() => {
    initializeMatrix()
    if (showHorizontalStreams) {
      setHorizontalStreams(generateHorizontalStreams())
    }
  }, [initializeMatrix, generateHorizontalStreams, showHorizontalStreams])

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setAnimationPhase(prev => prev + 1)
      
      if (showVerticalMatrix) {
        // Update matrix columns
        setMatrixColumns(prev => prev.map(column => ({
          ...column,
          chars: column.chars.map(char => ({
            ...char,
            y: char.y + column.speed,
            age: char.age + 1,
            opacity: Math.max(0, char.opacity - 0.005)
          })).filter(char => 
            char.y < (containerRef.current?.offsetHeight || 0) + 50 && 
            char.age < char.maxAge
          ).concat(
            // Add new characters occasionally
            Math.random() < column.density * 0.1 ? 
              generateMatrixChars({ ...column, chars: [] }).slice(0, 1) : 
              []
          )
        })))
      }
      
      if (showHorizontalStreams) {
        // Update horizontal streams
        setHorizontalStreams(prev => {
          const updated = prev.map(stream => ({
            ...stream,
            y: stream.y + stream.speed * 0.1, // Slow vertical movement
            opacity: stream.opacity > 0 ? stream.opacity - 0.003 : 0
          })).filter(stream => 
            stream.y < (containerRef.current?.offsetHeight || 0) + 100 &&
            stream.opacity > 0
          )
          
          // Add new streams occasionally
          if (Math.random() < 0.02) {
            updated.push(...generateHorizontalStreams().slice(0, 1))
          }
          
          return updated
        })
      }
      
      requestAnimationFrame(animate)
    }
    
    const animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [showVerticalMatrix, showHorizontalStreams, generateMatrixChars, generateHorizontalStreams])

  const getModeConfig = () => {
    switch (mode) {
      case 'intelligence':
        return {
          title: 'INTELLIGENCE_MATRIX',
          icon: Search,
          primaryColor: 'text-terminal-cyan',
          accentColor: 'text-terminal-gold'
        }
      case 'defense':
        return {
          title: 'DEFENSE_PROTOCOLS',
          icon: Shield,
          primaryColor: 'text-terminal-green',
          accentColor: 'text-terminal-cyan'
        }
      case 'analysis':
        return {
          title: 'ANALYSIS_ENGINE',
          icon: Database,
          primaryColor: 'text-terminal-gold',
          accentColor: 'text-terminal-cyan'
        }
      case 'warfare':
        return {
          title: 'WARFARE_MATRIX',
          icon: Monitor,
          primaryColor: 'text-terminal-red',
          accentColor: 'text-terminal-gold'
        }
    }
  }

  const config = getModeConfig()

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-terminal-bg overflow-hidden ${className}`}
      style={{ fontFamily: 'var(--font-terminal)' }}
    >
      {/* Vertical Matrix Rain */}
      {showVerticalMatrix && matrixColumns.map(column => (
        <div key={column.id} className="absolute top-0" style={{ left: column.x }}>
          {column.chars.map(char => (
            <div
              key={char.id}
              className={`absolute whitespace-nowrap ${
                char.isHighlight ? 'text-terminal-red font-bold' :
                char.category === 'intelligence' ? 'text-terminal-cyan' :
                char.category === 'technical' ? 'text-terminal-gold' :
                char.category === 'cyber' ? 'text-terminal-red' :
                char.category === 'operations' ? 'text-terminal-green' :
                'text-terminal-cyan'
              } animate-matrix-char-fade`}
              style={{
                top: char.y,
                opacity: char.opacity,
                fontSize: char.char.length > 3 ? '8px' : '12px',
                textShadow: char.isHighlight ? 
                  '0 0 10px rgba(239, 68, 68, 0.8)' :
                  '0 0 5px currentColor'
              }}
            >
              {char.char}
            </div>
          ))}
        </div>
      ))}
      
      {/* Horizontal Data Streams */}
      {showHorizontalStreams && horizontalStreams.map(stream => (
        <div
          key={stream.id}
          className={`absolute data-flow-line animate-data-flow ${
            stream.category === 'threat' ? 'text-terminal-red' :
            stream.category === 'intelligence' ? 'text-terminal-cyan' :
            stream.category === 'analysis' ? 'text-terminal-gold' :
            'text-terminal-green'
          }`}
          style={{
            top: stream.y,
            left: -200,
            width: stream.width,
            opacity: stream.opacity,
            fontSize: '10px',
            whiteSpace: 'nowrap',
            textShadow: '0 0 8px currentColor',
            background: `linear-gradient(90deg, transparent 0%, currentColor 20%, currentColor 80%, transparent 100%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}
        >
          {stream.content}
        </div>
      ))}
      
      {/* Terminal Grid Overlay */}
      <div className="terminal-grid opacity-10" />
      
      {/* Scan Lines */}
      <div className="scanline" />
      
      {/* Matrix Status Display */}
      <div className="absolute top-4 right-4 bg-terminal-bg/80 backdrop-blur-sm border border-terminal-border/50 rounded p-3">
        <div className="flex items-center gap-2 mb-2">
          <config.icon className={`w-4 h-4 ${config.primaryColor}`} />
          <span className={`font-terminal text-sm font-bold ${config.primaryColor}`}>
            {config.title}
          </span>
        </div>
        
        <div className="space-y-1 text-xs font-terminal">
          <div className="flex justify-between">
            <span className="text-terminal-text/70">MODE:</span>
            <span className={config.accentColor}>{mode.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-terminal-text/70">INTENSITY:</span>
            <span className={config.primaryColor}>{intensity.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-terminal-text/70">COLUMNS:</span>
            <span className="text-terminal-cyan">{matrixColumns.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-terminal-text/70">STREAMS:</span>
            <span className="text-terminal-gold">{horizontalStreams.length}</span>
          </div>
        </div>
      </div>
      
      {/* Frame Counter */}
      <div className="absolute bottom-4 right-4 font-terminal text-xs text-terminal-text/50">
        FRAME_{String(animationPhase).padStart(6, '0')}
      </div>
    </div>
  )
}