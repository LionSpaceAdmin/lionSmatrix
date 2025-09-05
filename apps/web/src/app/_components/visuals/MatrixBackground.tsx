'use client'

import React, { useEffect, useRef, useMemo } from 'react'
import { INTELLIGENCE_DATA } from './intelligence-data'

interface MatrixWord {
  text: string
  x: number
  y: number
  speed: number
  opacity: number
  category: string
}

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()
  const wordsRef = useRef<MatrixWord[]>([])
  
  // Categorize words for different opacity levels
  const categorizedWords = useMemo(() => {
    const categories: Record<string, string[]> = {}
    const { data_categories, matrix_vocabulary } = INTELLIGENCE_DATA
    
    // Assign categories
    Object.entries(data_categories).forEach(([category, words]) => {
      categories[category] = words
    })
    
    // Add remaining vocabulary to a general category
    const allCategorizedWords = new Set(
      Object.values(data_categories).flat()
    )
    
    categories.general = matrix_vocabulary.filter(
      word => !allCategorizedWords.has(word)
    )
    
    return categories
  }, [])
  
  // Get opacity based on category
  const getCategoryOpacity = (category: string): number => {
    const opacityMap: Record<string, number> = {
      primary_actors: 1.0,
      operation_keywords: 0.8,
      analysis_terms: 0.6,
      technical_terms: 0.4,
      network_terms: 0.3,
      statistical_terms: 0.2,
      general: 0.15
    }
    return opacityMap[category] || 0.1
  }
  
  // Initialize words
  useEffect(() => {
    const containerWidth = window.innerWidth
    const containerHeight = window.innerHeight
    const columnWidth = 120
    const columns = Math.ceil(containerWidth / columnWidth)
    
    const words: MatrixWord[] = []
    
    // Create multiple layers of cascading text - more words for better effect
    for (let col = 0; col < columns; col++) {
      for (let layer = 0; layer < 5; layer++) {
        for (let row = 0; row < 3; row++) {
          // Select random words from different categories
          const categoryNames = Object.keys(categorizedWords)
          const randomCategory = categoryNames[Math.floor(Math.random() * categoryNames.length)]
          const categoryWords = categorizedWords[randomCategory]
          const randomWord = categoryWords[Math.floor(Math.random() * categoryWords.length)]
          
          words.push({
            text: randomWord || 'INTEL',
            x: col * columnWidth + Math.random() * 40 - 20,
            y: -Math.random() * containerHeight * 3 - row * 100,
            speed: 0.5 + Math.random() * 1.5 + layer * 0.2,
            opacity: getCategoryOpacity(randomCategory),
            category: randomCategory
          })
        }
      }
    }
    
    wordsRef.current = words
  }, [categorizedWords])
  
  // Animation loop
  useEffect(() => {
    if (!canvasRef.current) return
    
    const animate = () => {
      const containerHeight = window.innerHeight
      
      // Update each word position
      wordsRef.current = wordsRef.current.map(word => {
        const newY = word.y + word.speed
        
        // Reset word to top if it goes off screen
        if (newY > containerHeight + 50) {
          // Pick a new random word from the same category
          const categoryWords = categorizedWords[word.category]
          const newWord = categoryWords[Math.floor(Math.random() * categoryWords.length)]
          
          return {
            ...word,
            text: newWord,
            y: -50 - Math.random() * 200,
            speed: 0.5 + Math.random() * 1.5
          }
        }
        
        return { ...word, y: newY }
      })
      
      // Update DOM
      if (canvasRef.current) {
        const wordElements = canvasRef.current.querySelectorAll('.matrix-word')
        wordElements.forEach((element, index) => {
          const word = wordsRef.current[index]
          if (word && element instanceof HTMLElement) {
            element.style.transform = `translate(${word.x}px, ${word.y}px)`
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
  }, [categorizedWords])
  
  return (
    <div className="matrix-background fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div 
        ref={canvasRef}
        className="relative w-full h-full"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.95) 100%)'
        }}
      >
        {/* Create initial word elements */}
        {wordsRef.current.map((word, index) => (
          <span
            key={index}
            className="matrix-word absolute text-green-400 font-mono text-sm whitespace-nowrap transition-opacity duration-1000"
            style={{
              transform: `translate(${word.x}px, ${word.y}px)`,
              opacity: word.opacity,
              textShadow: word.category === 'primary_actors' 
                ? '0 0 10px #10b981, 0 0 20px #10b981'
                : '0 0 5px #10b981',
              fontFamily: "'Courier New', monospace",
              fontSize: word.category === 'primary_actors' ? '16px' : '14px',
              fontWeight: word.category === 'primary_actors' ? 'bold' : 'normal'
            }}
          >
            {word.text}
          </span>
        ))}
        
        {/* Overlay gradient for depth */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, transparent 50%, rgba(0, 0, 0, 0.3) 100%)'
          }}
        />
      </div>
    </div>
  )
}

export default React.memo(MatrixBackground)