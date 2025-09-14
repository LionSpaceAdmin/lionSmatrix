'use client';

import { useEffect, useState } from 'react';

export function useProgressiveEnhancement() {
  const [isReady, setIsReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasGoodPerformance, setHasGoodPerformance] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    const checkPerformance = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      const connection = (navigator as any).connection;
      const memory = (performance as any).memory;

      let performanceScore = 0;

      if (gl) performanceScore += 2;
      if (connection && connection.effectiveType === '4g') performanceScore += 1;
      if (memory && memory.jsHeapSizeLimit > 1000000000) performanceScore += 1;

      setHasGoodPerformance(performanceScore >= 2);
    };

    checkPerformance();
    
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
        if (entry?.isIntersecting) {
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

  if (priority === 'high') {
    return children;
  }

  if (priority === 'medium' && !isReady) {
    return fallback || null;
  }

  if (priority === 'low' && (!isReady || !hasGoodPerformance)) {
    return fallback || null;
  }

  return children;
}