'use client';

import { useEffect, useState } from 'react';

/**
 * Progressive Enhancement Hook for Animations
 * Only enables animations when:
 * 1. User doesn't prefer reduced motion
 * 2. Component is visible/ready
 * 3. Device has good performance capabilities
 */
export function useProgressiveEnhancement() {
  const [isReady, setIsReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasGoodPerformance, setHasGoodPerformance] = useState(true);

  useEffect(() => {
    // Check user motion preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Check device performance indicators
    const checkPerformance = () => {
      // Check if device has hardware acceleration
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      // Check memory and connection
      const connection = (navigator as any).connection;
      const memory = (performance as any).memory;

      let performanceScore = 0;

      // WebGL support (+2 points)
      if (gl) performanceScore += 2;

      // Good connection (+1 point)
      if (connection && connection.effectiveType === '4g') performanceScore += 1;

      // Sufficient memory (+1 point)
      if (memory && memory.jsHeapSizeLimit > 1000000000) performanceScore += 1;

      // Set performance threshold (need at least 2/4 points)
      setHasGoodPerformance(performanceScore >= 2);
    };

    checkPerformance();
    
    // Mark as ready after initial checks
    const timer = setTimeout(() => setIsReady(true), 100);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      clearTimeout(timer);
    };
  }, []);

  return {
    isReady,
    shouldAnimate: isReady && !prefersReducedMotion && hasGoodPerformance,
    shouldLazyLoad: isReady,
    prefersReducedMotion,
    hasGoodPerformance
  };
}

/**
 * Intersection Observer Hook for Lazy Loading
 * Only loads components when they're about to be visible
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasBeenVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasBeenVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
        ...options
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef, hasBeenVisible, options]);

  return { isVisible, hasBeenVisible };
}

/**
 * Idle Callback Hook
 * Delays non-critical updates until browser is idle
 */
export function useIdleCallback(callback: () => void, deps: React.DependencyList) {
  useEffect(() => {
    const requestIdleCallback = 
      window.requestIdleCallback || 
      ((cb: IdleRequestCallback) => setTimeout(cb, 1));

    const cancelIdleCallback = 
      window.cancelIdleCallback || 
      clearTimeout;

    const id = requestIdleCallback(callback, { timeout: 5000 });

    return () => cancelIdleCallback(id);
  }, deps);
}

/**
 * Performance-aware component wrapper
 */
interface PerformanceWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
}

export function PerformanceWrapper({ 
  children, 
  fallback, 
  priority = 'medium' 
}: PerformanceWrapperProps) {
  const { isReady, hasGoodPerformance } = useProgressiveEnhancement();

  // High priority: always render
  if (priority === 'high') {
    return <>{children}</>;
  }

  // Medium priority: wait for ready state
  if (priority === 'medium' && !isReady) {
    return <>{fallback || <div className="animate-pulse">Loading...</div>}</>;
  }

  // Low priority: also check performance
  if (priority === 'low' && (!isReady || !hasGoodPerformance)) {
    return <>{fallback || <div>Content not available</div>}</>;
  }

  return <>{children}</>;
}
