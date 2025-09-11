'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

/**
 * Enhanced Intersection Observer Hook with Animation Controls
 * Optimizes performance by only animating when visible
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !('IntersectionObserver' in window)) {
      // Fallback for older browsers
      setIsVisible(true);
      setHasBeenVisible(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setIsVisible(isIntersecting);
        
        if (isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px 50px 0px', // Start loading 50px before element enters viewport
        ...options
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [elementRef, hasBeenVisible, options]);

  return { 
    isVisible, 
    hasBeenVisible,
    disconnect: () => observerRef.current?.disconnect()
  };
}

/**
 * Enhanced Idle Callback Hook with Timeout Management
 * Uses requestIdleCallback for non-critical operations
 */
export function useIdleCallback(
  callback: () => void, 
  deps: React.DependencyList,
  options: { timeout?: number; immediate?: boolean } = {}
) {
  const { timeout = 5000, immediate = false } = options;
  const callbackRef = useRef(callback);
  const idRef = useRef<number | null>(null);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // Cancel previous idle callback
    if (idRef.current !== null) {
      const cancelIdleCallback = 
        window.cancelIdleCallback || 
        ((id: number) => clearTimeout(id));
      cancelIdleCallback(idRef.current);
    }

    if (immediate) {
      callbackRef.current();
      return;
    }

    const requestIdleCallback = 
      window.requestIdleCallback || 
      ((cb: IdleRequestCallback, opts?: IdleRequestOptions) => 
        setTimeout(() => cb({ 
          didTimeout: false, 
          timeRemaining: () => 50 
        }), 1) as unknown as number);

    idRef.current = requestIdleCallback(
      (deadline) => {
        if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
          callbackRef.current();
        }
      },
      { timeout }
    );

    return () => {
      if (idRef.current !== null) {
        const cancelIdleCallback = 
          window.cancelIdleCallback || 
          ((id: number) => clearTimeout(id));
        cancelIdleCallback(idRef.current);
        idRef.current = null;
      }
    };
  }, deps);
}

/**
 * Advanced Throttle Hook for Scroll and Resize Events
 * Includes leading and trailing edge options
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): T {
  const { leading = true, trailing = true } = options;
  const lastCallTime = useRef<number>(0);
  const lastInvokeTime = useRef<number>(0);
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const lastArgs = useRef<Parameters<T>>();

  const throttledFunction = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const since = now - lastCallTime.current;
    
    lastArgs.current = args;
    lastCallTime.current = now;

    const invokeFunc = () => {
      lastInvokeTime.current = now;
      callback(...args);
    };

    const shouldInvoke = () => {
      return (
        lastCallTime.current === 0 || // First call
        since >= delay || // Time has passed
        since < 0 // System clock moved backwards
      );
    };

    if (shouldInvoke()) {
      if (timerId.current) {
        clearTimeout(timerId.current);
        timerId.current = null;
      }
      
      if (leading) {
        invokeFunc();
      }
    } else if (!timerId.current && trailing) {
      timerId.current = setTimeout(() => {
        timerId.current = null;
        if (lastArgs.current) {
          callback(...lastArgs.current);
        }
      }, delay - since);
    }
  }, [callback, delay, leading, trailing]) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, []);

  return throttledFunction;
}

/**
 * Debounce Hook for Input Handling
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFunction;
}

/**
 * Tab Visibility Hook for Animation Pausing
 * Pauses animations when tab is not visible
 */
export function useTabVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Check if Page Visibility API is supported
    const isAPISupported = 'visibilityState' in document;
    setIsSupported(isAPISupported);
    
    if (!isAPISupported) {
      // Fallback: always visible if API not supported
      setIsVisible(true);
      return;
    }

    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    // Set initial state
    setIsVisible(document.visibilityState === 'visible');

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return { 
    isVisible, 
    isSupported,
    isHidden: !isVisible 
  };
}

/**
 * Animation Controller Hook
 * Combines intersection observer, tab visibility, and user preferences
 */
export function useAnimationController(
  elementRef: React.RefObject<Element>,
  options: {
    threshold?: number;
    rootMargin?: string;
    respectReducedMotion?: boolean;
    pauseOnTabHidden?: boolean;
  } = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    respectReducedMotion = true,
    pauseOnTabHidden = true
  } = options;

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const { isVisible: isInViewport } = useIntersectionObserver(elementRef, {
    threshold,
    rootMargin
  });
  
  const { isVisible: isTabVisible } = useTabVisibility();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const shouldAnimate = 
    isInViewport && 
    (!respectReducedMotion || !prefersReducedMotion) &&
    (!pauseOnTabHidden || isTabVisible);

  return {
    shouldAnimate,
    isInViewport,
    isTabVisible,
    prefersReducedMotion,
    canAnimate: !prefersReducedMotion
  };
}

/**
 * Performance Monitor Hook
 * Tracks performance metrics and adjusts behavior accordingly
 */
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: { used: 0, limit: 0 },
    connection: 'unknown',
    isLowPerformance: false
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrame: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
        
        setMetrics(prev => ({
          ...prev,
          fps,
          isLowPerformance: fps < 30
        }));
      }
      
      animationFrame = requestAnimationFrame(measureFPS);
    };

    // Get memory info if available
    const getMemoryInfo = () => {
      const memory = (performance as any).memory;
      if (memory) {
        return {
          used: memory.usedJSHeapSize,
          limit: memory.jsHeapSizeLimit
        };
      }
      return { used: 0, limit: 0 };
    };

    // Get connection info if available
    const getConnectionInfo = () => {
      const connection = (navigator as any).connection;
      return connection?.effectiveType || 'unknown';
    };

    setMetrics(prev => ({
      ...prev,
      memory: getMemoryInfo(),
      connection: getConnectionInfo()
    }));

    // Start FPS monitoring
    animationFrame = requestAnimationFrame(measureFPS);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return metrics;
}

/**
 * Virtual Scrolling Hook for Large Lists
 * Optimizes rendering of large datasets
 */
export function useVirtualScrolling<T>(
  items: T[],
  options: {
    itemHeight: number;
    containerHeight: number;
    overscan?: number;
    scrollElement?: React.RefObject<HTMLElement>;
  }
) {
  const {
    itemHeight,
    containerHeight,
    overscan = 5,
    scrollElement
  } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLElement>(null);

  const actualScrollElement = scrollElement?.current || scrollElementRef.current;

  useEffect(() => {
    if (!actualScrollElement) return;

    const handleScroll = useThrottle(() => {
      setScrollTop(actualScrollElement.scrollTop);
    }, 16); // ~60fps

    actualScrollElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => actualScrollElement.removeEventListener('scroll', handleScroll);
  }, [actualScrollElement]);

  const visibleItems = useMemo(() => {
    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const visibleItems = items.slice(startIndex, endIndex + 1);
    const offsetY = startIndex * itemHeight;

    return {
      items: visibleItems.map((item, index) => ({
        item,
        index: startIndex + index,
        offsetY: offsetY + (index * itemHeight)
      })),
      totalHeight,
      startIndex,
      endIndex
    };
  }, [items, itemHeight, scrollTop, containerHeight, overscan]);

  return {
    visibleItems,
    scrollElementRef,
    totalHeight: visibleItems.totalHeight
  };
}

/**
 * Utility function to create throttled event handlers
 */
export function createThrottledHandler<T extends (...args: any[]) => any>(
  handler: T,
  delay: number = 16,
  options?: { leading?: boolean; trailing?: boolean }
): T {
  let lastCallTime = 0;
  let lastInvokeTime = 0;
  let timerId: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T>;

  const { leading = true, trailing = true } = options || {};

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    const since = now - lastCallTime;
    
    lastArgs = args;
    lastCallTime = now;

    const invokeFunc = () => {
      lastInvokeTime = now;
      handler(...args);
    };

    const shouldInvoke = () => {
      return (
        lastCallTime === 0 ||
        since >= delay ||
        since < 0
      );
    };

    if (shouldInvoke()) {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      
      if (leading) {
        invokeFunc();
      }
    } else if (!timerId && trailing) {
      timerId = setTimeout(() => {
        timerId = null;
        handler(...lastArgs);
      }, delay - since);
    }
  }) as T;
}