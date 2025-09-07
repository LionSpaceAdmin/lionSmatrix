'use client'

import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react'
import { INTELLIGENCE_DATA } from './intelligence-data'
import { createMatrixVocabulary } from '../../../lib/data-loaders'

interface MatrixWord {
  text: string
  x: number
  y: number
  speed: number
  opacity: number
  category: string
  layer: number
}

interface MatrixBackgroundProps {
  mode?: 'horizontal' | 'vertical'
  dataSource?: string[]
  className?: string
}

const MatrixBackground: React.FC<MatrixBackgroundProps> = ({ 
  mode = 'horizontal', 
  dataSource = [],
  className = ''
}) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const wordsRef = useRef<MatrixWord[]>([])
  const [vocabularyLoaded, setVocabularyLoaded] = useState(false)
  const [matrixWords, setMatrixWords] = useState<MatrixWord[]>([])
  const [dynamicVocabulary, setDynamicVocabulary] = useState<{
    primary_actors: string[]
    operation_keywords: string[]
    network_terms: string[]
    intelligence_terms: string[]
  } | null>(null)
  const [mounted, setMounted] = useState(false)
  
  // Load dynamic vocabulary from CSV data on component mount - SIMPLIFIED FOR DEBUGGING
  useEffect(() => {
    console.log('🚀 MatrixBackground initializing...')
    
    // IMMEDIATE TEST: Set vocabulary loaded with fallback data
    setVocabularyLoaded(true)
    console.log('✅ Vocabulary marked as loaded')
    
    createMatrixVocabulary().then(vocab => {
      console.log('🎯 Matrix vocabulary loaded from CSV:', {
        actors: vocab.primary_actors.length,
        keywords: vocab.operation_keywords.length,
        terms: vocab.intelligence_terms.length
      })
      setDynamicVocabulary(vocab)
    }).catch(error => {
      console.error('⚠️ Failed to load dynamic vocabulary, using fallback:', error)
    })
  }, [])

  // Categorize words for different opacity levels - ENHANCED WITH FALLBACK
  const categorizedWords = useMemo(() => {
    console.log('🔄 Categorizing words, dynamicVocabulary:', !!dynamicVocabulary)
    const categories: Record<string, string[]> = {}
    
    if (dynamicVocabulary && dynamicVocabulary.primary_actors.length > 0) {
      // Use loaded CSV data
      console.log('📊 Using dynamic vocabulary from CSV')
      categories.primary_actors = dynamicVocabulary.primary_actors
      categories.operation_keywords = dynamicVocabulary.operation_keywords
      categories.network_terms = dynamicVocabulary.network_terms
      categories.intelligence_terms = dynamicVocabulary.intelligence_terms
      
      // Add custom data source if provided
      if (dataSource.length > 0) {
        categories.custom_data = dataSource
      }
    } else {
      // ALWAYS have fallback data
      console.log('📋 Using fallback vocabulary from INTELLIGENCE_DATA')
      const { data_categories, matrix_vocabulary, fake_resistance_actors } = INTELLIGENCE_DATA
      
      Object.entries(data_categories || {}).forEach(([category, words]) => {
        categories[category] = words || []
      })
      
      categories.primary_actors = [
        ...(categories.primary_actors || []),
        ...(fake_resistance_actors || []).map(actor => actor.name)
      ]
      
      const allCategorizedWords = new Set(
        Object.values(data_categories || {}).flat()
      )
      
      categories.general = (matrix_vocabulary || []).filter(
        word => !allCategorizedWords.has(word)
      )
      
      // ENSURE we always have SOME words for testing
      if (Object.values(categories).every(arr => arr.length === 0)) {
        console.log('🆘 No vocabulary found, using emergency fallback')
        categories.intelligence_terms = [
          'INTELLIGENCE', 'MATRIX', 'SCANNING', 'PATTERN', 'ANALYSIS',
          'NETWORK', 'CONNECTIONS', 'THREAT', 'MONITORING', 'DATA',
          'COGNITIVE', 'WARFARE', 'INFLUENCE', 'NARRATIVE', 'OPERATION',
          'JACKSON HINKLE', 'SULAIMAN AHMED', 'PROPAGANDA', 'RESISTANCE'
        ]
      }
    }
    
    const totalWords = Object.values(categories).reduce((sum, arr) => sum + arr.length, 0)
    console.log('📈 Total categorized words:', totalWords, categories)
    return categories
  }, [dynamicVocabulary, dataSource])
  
  // Get opacity based on category and layer - ENHANCED FOR DYNAMIC DATA
  const getCategoryOpacity = (category: string, layer: number): number => {
    const baseOpacityMap: Record<string, number> = {
      primary_actors: 0.95,           // Highest visibility for key actors
      operation_keywords: 0.8,        // High visibility for operations
      intelligence_terms: 0.6,        // Medium-high for intelligence vocabulary  
      network_terms: 0.4,             // Medium for platforms/networks
      custom_data: 0.7,               // High for custom data source
      analysis_terms: 0.5,            // Medium for analysis
      technical_terms: 0.4,           // Medium-low for technical
      statistical_terms: 0.3,         // Low for statistics
      general: 0.2                    // Lowest for general terms
    }
    const layerMultiplier = Math.max(0.3, 1 - (layer * 0.12)) // Gentler layer fade
    return (baseOpacityMap[category] || 0.15) * layerMultiplier
  }
  
  // Initialize words - SUPPORTS BOTH HORIZONTAL AND VERTICAL MODES
  useEffect(() => {
    if (!vocabularyLoaded) return // Wait for vocabulary to load
    
    const containerWidth = window.innerWidth
    const containerHeight = window.innerHeight
    const words: MatrixWord[] = []
    
    if (mode === 'horizontal') {
      // HORIZONTAL SCANNING MODE (LEFT-TO-RIGHT and RIGHT-TO-LEFT)
      const rowHeight = 45 // Increased row height for better spacing
      const rows = Math.ceil(containerHeight / rowHeight)
      
      for (let row = 0; row < rows; row++) {
        for (let layer = 0; layer < 3; layer++) { // Reduced layers for clarity
          for (let wordIndex = 0; wordIndex < 4; wordIndex++) { // Much fewer words per layer
            const categoryNames = Object.keys(categorizedWords).filter(cat => categorizedWords[cat]?.length > 0)
            if (categoryNames.length === 0) continue
            
            const randomCategory = categoryNames[Math.floor(Math.random() * categoryNames.length)]
            const categoryWords = categorizedWords[randomCategory]
            const randomWord = categoryWords?.[Math.floor(Math.random() * categoryWords.length)]
            
            // Determine direction: LEFT-TO-RIGHT (positive) or RIGHT-TO-LEFT (negative)
            const direction = row % 2 === 0 ? 1 : -1 // Alternate rows
            
            words.push({
              text: (randomWord || 'SCANNING').toUpperCase(),
              x: direction > 0 
                ? -Math.random() * 800 - wordIndex * 400 // Much more spacing
                : containerWidth + Math.random() * 800 + wordIndex * 400,
              y: row * rowHeight + Math.random() * 6 - 3,
              speed: (0.8 + Math.random() * 2.0 + layer * 0.3) * direction, // Faster movement
              opacity: getCategoryOpacity(randomCategory, layer),
              category: randomCategory,
              layer: layer
            })
          }
        }
      }
    } else {
      // VERTICAL MODE (Traditional Matrix falling effect)
      const columnWidth = 20
      const columns = Math.ceil(containerWidth / columnWidth)
      
      for (let col = 0; col < columns; col++) {
        for (let layer = 0; layer < 4; layer++) {
          for (let wordIndex = 0; wordIndex < 10; wordIndex++) {
            const categoryNames = Object.keys(categorizedWords).filter(cat => categorizedWords[cat]?.length > 0)
            if (categoryNames.length === 0) continue
            
            const randomCategory = categoryNames[Math.floor(Math.random() * categoryNames.length)]
            const categoryWords = categorizedWords[randomCategory]
            const randomWord = categoryWords?.[Math.floor(Math.random() * categoryWords.length)]
            
            words.push({
              text: (randomWord || 'MATRIX').toUpperCase(),
              x: col * columnWidth + Math.random() * 10 - 5,
              y: -Math.random() * 500 - wordIndex * 100,
              speed: 0.5 + Math.random() * 1.2 + layer * 0.15,
              opacity: getCategoryOpacity(randomCategory, layer),
              category: randomCategory,
              layer: layer
            })
          }
        }
      }
    }
    
    wordsRef.current = words
    setMatrixWords(words) // Update state to trigger re-render
    console.log(`🎬 Initialized ${words.length} Matrix words in ${mode} mode`)
  }, [mode, vocabularyLoaded, categorizedWords])
  
  // Generate fallback words for immediate display
  const generateFallbackWords = useCallback((): MatrixWord[] => {
    const fallbackVocab = [
      'INTELLIGENCE', 'MATRIX', 'SCANNING', 'PATTERN', 'ANALYSIS',
      'JACKSON HINKLE', 'SULAIMAN AHMED', 'COGNITIVE WARFARE', 'PROPAGANDA',
      'NETWORK', 'CONNECTIONS', 'THREAT', 'MONITORING', 'DATA',
      'INFLUENCE', 'NARRATIVE', 'OPERATION', 'RESISTANCE', 'TRUTH',
      'INFORMATION WARFARE', 'MEDIA CONTROL', 'ALGORITHM', 'DETECTION'
    ]
    
    const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
    const containerHeight = typeof window !== 'undefined' ? window.innerHeight : 1080
    const words: MatrixWord[] = []
    
    if (mode === 'horizontal') {
      // Create horizontal scanning words
      const rowHeight = 35
      const rows = Math.ceil(containerHeight / rowHeight)
      
      for (let row = 0; row < rows; row++) {
        for (let wordIndex = 0; wordIndex < 8; wordIndex++) {
          const randomWord = fallbackVocab[Math.floor(Math.random() * fallbackVocab.length)]
          const direction = row % 2 === 0 ? 1 : -1 // Alternate directions
          const layer = wordIndex % 3
          
          words.push({
            text: randomWord,
            x: direction > 0 
              ? -Math.random() * 400 - wordIndex * 200 
              : containerWidth + Math.random() * 400 + wordIndex * 200,
            y: row * rowHeight + Math.random() * 10 - 5,
            fontSize: (layer + 1) * 0.3 + 0.6,
            opacity: Math.max(0.1, (3 - layer) * 0.2),
            color: `rgba(110, 231, 183, ${Math.max(0.1, (3 - layer) * 0.3)})`,
            animationSpeed: (3 - layer) * 0.5 + 0.5,
            direction,
            layer
          })
        }
      }
    } else {
      // Vertical mode fallback
      for (let i = 0; i < 168; i++) {
        const randomWord = fallbackVocab[Math.floor(Math.random() * fallbackVocab.length)]
        words.push({
          text: randomWord,
          x: Math.random() * containerWidth,
          y: Math.random() * containerHeight,
          fontSize: Math.random() * 0.5 + 0.8,
          opacity: Math.random() * 0.7 + 0.3,
          color: 'rgba(110, 231, 183, 0.8)',
          animationSpeed: Math.random() * 2 + 1
        })
      }
    }
    
    console.log(`Generated ${words.length} fallback words for ${mode} mode`)
    return words
  }, [mode])

  // If for any reason matrixWords are empty (slow CSV load), populate with fallback immediately
  useEffect(() => {
    if ((matrixWords || []).length === 0) {
      const fallback = generateFallbackWords()
      wordsRef.current = fallback
      setMatrixWords(fallback)
      console.log('⚠️ MatrixBackground used immediate fallback words')
    }
    // mark mounted on client to avoid SSR/client mismatch when rendering randomized positions
    setMounted(true)
  }, [generateFallbackWords, matrixWords])
    const fallbackVocab = [
      'INTELLIGENCE', 'MATRIX', 'SCANNING', 'PATTERN', 'ANALYSIS',
      'JACKSON HINKLE', 'SULAIMAN AHMED', 'COGNITIVE WARFARE', 'PROPAGANDA',
      'NETWORK', 'CONNECTIONS', 'THREAT', 'MONITORING', 'DATA',
      'INFLUENCE', 'NARRATIVE', 'OPERATION', 'RESISTANCE', 'TRUTH',
      'INFORMATION WARFARE', 'MEDIA CONTROL', 'ALGORITHM', 'DETECTION'
    ]
    
    const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
    const containerHeight = typeof window !== 'undefined' ? window.innerHeight : 1080
    const words: MatrixWord[] = []
    
    if (mode === 'horizontal') {
      // Create horizontal scanning words
      const rowHeight = 35
      const rows = Math.ceil(containerHeight / rowHeight)
      
      for (let row = 0; row < rows; row++) {
        for (let wordIndex = 0; wordIndex < 8; wordIndex++) {
          const randomWord = fallbackVocab[Math.floor(Math.random() * fallbackVocab.length)]
          const direction = row % 2 === 0 ? 1 : -1 // Alternate directions
          const layer = wordIndex % 3
          
          words.push({
            text: randomWord,
            x: direction > 0 
              ? -Math.random() * 400 - wordIndex * 200 
              : containerWidth + Math.random() * 400 + wordIndex * 200,
            y: row * rowHeight + Math.random() * 10 - 5,
            speed: (0.5 + Math.random() * 2 + layer * 0.3) * direction,
            opacity: 0.3 + Math.random() * 0.6 + layer * 0.1,
            category: 'fallback',
            layer: layer
          })
        }
      }
    }
    
    console.log(`🎭 Generated ${words.length} fallback words for ${mode} mode`)
    return words
  })

  // Initialize matrix words with fallback if needed
  
  // Animation loop - SUPPORTS BOTH HORIZONTAL AND VERTICAL MODES
  useEffect(() => {
    if (!canvasRef.current || !vocabularyLoaded) return
    
    const animate = () => {
      const containerWidth = window.innerWidth
      const containerHeight = window.innerHeight
      
      // Update each word position based on mode
      wordsRef.current = wordsRef.current.map(word => {
        if (mode === 'horizontal') {
          // HORIZONTAL movement (LEFT-TO-RIGHT and RIGHT-TO-LEFT)
          const newX = word.x + word.speed
          
          if (word.speed > 0) {
            // LEFT-TO-RIGHT movement
            if (newX > containerWidth + 400) {
              const categoryWords = categorizedWords[word.category]
              const newWord = categoryWords?.[Math.floor(Math.random() * (categoryWords?.length || 1))]
              
              return {
                ...word,
                text: (newWord || 'SCANNING').toUpperCase(),
                x: -400 - Math.random() * 500,
                speed: (0.4 + Math.random() * 1.8 + word.layer * 0.25)
              }
            }
          } else {
            // RIGHT-TO-LEFT movement
            if (newX < -400) {
              const categoryWords = categorizedWords[word.category]
              const newWord = categoryWords?.[Math.floor(Math.random() * (categoryWords?.length || 1))]
              
              return {
                ...word,
                text: (newWord || 'SCANNING').toUpperCase(),
                x: containerWidth + 400 + Math.random() * 500,
                speed: -(0.4 + Math.random() * 1.8 + word.layer * 0.25)
              }
            }
          }
          
          return { ...word, x: newX }
        } else {
          // VERTICAL movement (traditional falling Matrix)
          const newY = word.y + word.speed
          
          if (newY > containerHeight + 100) {
            const categoryWords = categorizedWords[word.category]
            const newWord = categoryWords?.[Math.floor(Math.random() * (categoryWords?.length || 1))]
            
            return {
              ...word,
              text: (newWord || 'MATRIX').toUpperCase(),
              y: -100 - Math.random() * 200,
              speed: 0.5 + Math.random() * 1.2 + word.layer * 0.15
            }
          }
          
          return { ...word, y: newY }
        }
      })
      
      // Update DOM
      if (canvasRef.current) {
        const wordElements = canvasRef.current.querySelectorAll('.matrix-word')
        wordElements.forEach((element, index) => {
          const word = wordsRef.current[index]
          if (word && element instanceof HTMLElement) {
            if (mode === 'horizontal') {
              element.style.transform = `translate(${word.x}px, ${word.y}px)`
            } else {
              element.style.transform = `translate(${word.x}px, ${word.y}px)`
            }
            element.textContent = word.text
            element.style.opacity = word.opacity.toString()
          }
        })
      }
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [categorizedWords, mode, vocabularyLoaded])
  
  return (
    <div className={`matrix-background fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      <div 
        ref={canvasRef}
        className="relative w-full h-full bg-black"
        style={{
          background: mode === 'horizontal' 
            ? 'linear-gradient(to bottom, #000000 0%, #0a0a0a 50%, #000000 100%)'
            : 'linear-gradient(45deg, #000000 0%, #001100 50%, #000000 100%)'
        }}
      >
  {/* Matrix words - dynamically generated or fallback (render only after client mount to avoid hydration mismatch) */}
  {mounted && (matrixWords.length > 0 ? matrixWords : generateFallbackWords()).map((word, index) => (
          <span
            key={index}
            className="matrix-word absolute text-white font-mono text-sm whitespace-nowrap transition-opacity duration-500"
            style={{
              transform: `translate(${word.x}px, ${word.y}px)`,
              opacity: word.opacity,
              textShadow: word.category === 'primary_actors' 
                ? '0 0 8px #ffffff, 0 0 16px #ffffff'
                : word.layer === 0 
                ? '0 0 4px #ffffff'
                : '0 0 2px #ffffff',
              fontFamily: "'Courier New', monospace",
              fontSize: word.category === 'primary_actors' ? '16px' : word.layer === 0 ? '15px' : '14px',
              fontWeight: word.category === 'primary_actors' ? 'bold' : word.layer === 0 ? 'normal' : 'lighter'
            }}
          >
            {word.text}
          </span>
        ))}
        
        {/* Scan lines for depth - MODE DEPENDENT */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: mode === 'horizontal'
              ? `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 26px,
                  rgba(255, 255, 255, 0.015) 27px
                )`
              : `repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 18px,
                  rgba(0, 255, 0, 0.02) 19px
                )`
          }}
        />
        
        {/* Moving scan line effect - ENHANCED FOR HORIZONTAL MODE */}
        {mode === 'horizontal' && (
          <div 
            className="absolute w-full h-px bg-white opacity-25 pointer-events-none"
            style={{
              top: '50%',
              animation: 'scanline 5s linear infinite',
              boxShadow: '0 0 30px rgba(255, 255, 255, 0.4), 0 0 60px rgba(255, 255, 255, 0.2)'
            }}
          />
        )}
        
        {mode === 'vertical' && (
          <div 
            className="absolute h-full w-px bg-green-400 opacity-20 pointer-events-none"
            style={{
              left: '50%',
              animation: 'vertical-scan 6s linear infinite',
              boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)'
            }}
          />
        )}
      </div>
    </div>
  )
}

// CSS animations for vertical mode (kept for potential future use)
// const additionalStyles = `
//   @keyframes vertical-scan {
//     0% {
//       transform: translateX(-100vw);
//       opacity: 1;
//     }
//     100% {
//       transform: translateX(100vw);
//       opacity: 0;
//     }
//   }
// `

export default React.memo(MatrixBackground)