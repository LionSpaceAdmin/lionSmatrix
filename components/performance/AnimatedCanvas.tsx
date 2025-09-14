"use client"

import { useEffect, useRef, useState } from "react"
import { 
  useAnimationController, 
  useTabVisibility, 
  usePerformanceMonitor,
  useIdleCallback 
} from "@/lib/hooks/usePerformanceOptimizations"
import { cn } from "@/lib/utils"

interface AnimatedCanvasProps {
  children: React.ReactNode
  className?: string
  threshold?: number
  pauseOnTabHidden?: boolean
  respectReducedMotion?: boolean
  priority?: 'low' | 'medium' | 'high'
}

/**
 * Enhanced wrapper component that optimizes animations based on visibility,
 * performance, and user preferences
 */
export function AnimatedCanvas({ 
  children, 
  className = "", 
  threshold = 0.1,
  pauseOnTabHidden = true,
  respectReducedMotion = true,
  priority = 'medium'
}: AnimatedCanvasProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const [isReady, setIsReady] = useState(false)
  
  // Use comprehensive animation controller
  const { 
    shouldAnimate, 
    isInViewport, 
    isTabVisible, 
    prefersReducedMotion 
  } = useAnimationController(canvasRef, {
    threshold,
    respectReducedMotion,
    pauseOnTabHidden
  })
  
  // Monitor performance for adaptive behavior
  const { fps, isLowPerformance } = usePerformanceMonitor()
  
  // Delay non-critical setup using idle callback
  useIdleCallback(() => {
    setIsReady(true)
  }, [isInViewport], { immediate: priority === 'high' })
  
  // Adaptive animation quality based on performance
  const animationQuality = isLowPerformance ? 'low' : fps > 45 ? 'high' : 'medium'
  
  return (
    <div
      ref={canvasRef}
      className={cn(
        "relative overflow-hidden",
        className
      )}
      data-animation-active={shouldAnimate}
      data-animation-quality={animationQuality}
      data-performance-mode={isLowPerformance ? 'low' : 'normal'}
      style={{
        "--animation-play-state": shouldAnimate && isReady ? "running" : "paused",
        "--animation-fps": fps,
        "--animation-quality": animationQuality
      } as React.CSSProperties}
    >
      {isReady ? children : (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-background via-muted to-background">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="font-mono text-sm text-muted-foreground">Initializing...</div>
          </div>
        </div>
      )}
      
      {/* Performance indicator for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 text-xs bg-black/50 text-white p-1 rounded">
          FPS: {fps} | Quality: {animationQuality}
        </div>
      )}
    </div>
  )
}

/**
 * Hook for scroll-based animation controls
 */
export function useScrollAnimation() {
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true)

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    const throttledHandleScroll = throttle(handleScroll, 16) // ~60fps
    window.addEventListener("scroll", throttledHandleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return { isScrolling }
}

// Throttle function for scroll performance
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
