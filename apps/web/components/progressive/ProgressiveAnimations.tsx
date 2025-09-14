'use client';

import { useEffect, useState, useRef } from 'react';

// Hook for progressive animation enhancement
export function useProgressiveAnimation(options: {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  disabled?: boolean;
} = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    delay = 0,
    disabled = false
  } = options;

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (disabled || prefersReducedMotion) {
      setShouldAnimate(false);
      return;
    }

    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          if (entry.isIntersecting) {
            setIsIntersecting(true);

            if (delay > 0) {
              setTimeout(() => setShouldAnimate(true), delay);
            } else {
              setShouldAnimate(true);
            }

            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setIsIntersecting(false);
            setShouldAnimate(false);
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce, delay, disabled]);

  return {
    ref,
    isIntersecting,
    shouldAnimate,
    // CSS classes for different animation types
    fadeInClass: shouldAnimate ? 'animate-fade-in' : 'opacity-0',
    slideUpClass: shouldAnimate ? 'animate-slide-up' : 'translate-y-8 opacity-0',
    slideInLeftClass: shouldAnimate ? 'animate-slide-in-left' : '-translate-x-8 opacity-0',
    slideInRightClass: shouldAnimate ? 'animate-slide-in-right' : 'translate-x-8 opacity-0',
    scaleInClass: shouldAnimate ? 'animate-scale-in' : 'scale-95 opacity-0',
    // Inline styles for smooth transitions
    transitionStyle: {
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDelay: `${delay}ms`,
    }
  };
}

// Hook for reducing animations based on system preferences
export function useResponsiveAnimations() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    motionQuery.addEventListener('change', handleMotionChange);

    // Check for low power mode (approximate)
    const checkLowPowerMode = () => {
      // Check device memory (if available)
      const memory = (navigator as any).deviceMemory;
      if (memory && memory < 4) {
        setIsLowPowerMode(true);
      }

      // Check connection speed
      const connection = (navigator as any).connection;
      if (connection && connection.effectiveType && 
          ['slow-2g', '2g', '3g'].includes(connection.effectiveType)) {
        setIsLowPowerMode(true);
      }
    };

    checkLowPowerMode();

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return {
    shouldReduceAnimations: prefersReducedMotion || isLowPowerMode,
    prefersReducedMotion,
    isLowPowerMode,
    // Animation configuration based on capabilities
    animationConfig: {
      duration: prefersReducedMotion ? 0 : isLowPowerMode ? 200 : 600,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      delay: prefersReducedMotion ? 0 : isLowPowerMode ? 0 : 100,
    }
  };
}

// Progressive component wrapper for animations
interface ProgressiveAnimationWrapperProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale';
  delay?: number;
  className?: string;
  triggerOnce?: boolean;
  threshold?: number;
}

export function ProgressiveAnimationWrapper({
  children,
  animation = 'fade',
  delay = 0,
  className = '',
  triggerOnce = true,
  threshold = 0.1,
}: ProgressiveAnimationWrapperProps) {
  const { shouldReduceAnimations } = useResponsiveAnimations();
  
  const {
    ref,
    shouldAnimate,
    fadeInClass,
    slideUpClass,
    slideInLeftClass,
    slideInRightClass,
    scaleInClass,
    transitionStyle
  } = useProgressiveAnimation({
    delay,
    triggerOnce,
    threshold,
    disabled: shouldReduceAnimations
  });

  const getAnimationClass = () => {
    if (shouldReduceAnimations) return '';
    
    switch (animation) {
      case 'fade': return fadeInClass;
      case 'slide-up': return slideUpClass;
      case 'slide-left': return slideInLeftClass;
      case 'slide-right': return slideInRightClass;
      case 'scale': return scaleInClass;
      default: return fadeInClass;
    }
  };

  return (
    <div
      ref={ref}
      className={`${getAnimationClass()} ${className}`}
      style={shouldReduceAnimations ? {} : transitionStyle}
    >
      {children}
    </div>
  );
}

// Hook for staggered animations (useful for lists)
export function useStaggeredAnimation(count: number, baseDelay: number = 100) {
  const { shouldReduceAnimations } = useResponsiveAnimations();
  
  const getDelay = (index: number) => {
    if (shouldReduceAnimations) return 0;
    return baseDelay * index;
  };

  const getStaggeredProps = (index: number) => ({
    delay: getDelay(index),
    disabled: shouldReduceAnimations,
  });

  return {
    getStaggeredProps,
    shouldReduceAnimations,
  };
}

// CSS-in-JS animations for critical path (avoids FOUC)
export const getCriticalAnimationStyles = () => `
  @media (prefers-reduced-motion: no-preference) {
    .animate-fade-in {
      opacity: 1;
      transform: translateY(0);
    }
    
    .animate-slide-up {
      opacity: 1;
      transform: translateY(0);
    }
    
    .animate-slide-in-left {
      opacity: 1;
      transform: translateX(0);
    }
    
    .animate-slide-in-right {
      opacity: 1;
      transform: translateX(0);
    }
    
    .animate-scale-in {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    .animate-fade-in,
    .animate-slide-up,
    .animate-slide-in-left,
    .animate-slide-in-right,
    .animate-scale-in {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
`;

// Performance monitoring for animations
export function useAnimationPerformance() {
  const [fps, setFps] = useState(60);
  const [isDroppedFrames, setIsDroppedFrames] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrame: number;

    const measureFps = () => {
      const now = performance.now();
      frameCount++;

      if (now >= lastTime + 1000) {
        const currentFps = Math.round((frameCount * 1000) / (now - lastTime));
        setFps(currentFps);
        setIsDroppedFrames(currentFps < 50);
        
        frameCount = 0;
        lastTime = now;
      }

      animationFrame = requestAnimationFrame(measureFps);
    };

    measureFps();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return {
    fps,
    isDroppedFrames,
    shouldReduceAnimations: isDroppedFrames || fps < 30,
  };
}