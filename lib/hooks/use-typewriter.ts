import { useEffect, useRef } from 'react';

/**
 * Custom hook for typewriter text animation effect
 * @param element - The HTML element to animate
 * @param getLines - Function that returns array of text lines to animate
 * @param speed - Base typing speed in milliseconds (default: 50)
 */
export function useTypewriter(
  element: HTMLElement | null,
  getLines: () => string[],
  speed: number = 50
) {
  const animationRef = useRef<boolean>(true);

  useEffect(() => {
    if (!element) return;

    const typewrite = async () => {
      let lineIndex = 0;
      
      while (animationRef.current) {
        const lines = getLines();
        const line = lines[lineIndex];
        if (!line) break; // Handle undefined line
        const typeSpeed = speed + Math.random() * 30;
        
        // Type out the line
        for (let i = 0; i < line.length && animationRef.current; i++) {
          element.textContent = line.substring(0, i + 1);
          // Add pause after punctuation
          if (['.', ',', '!', '?'].includes(line[i] || '')) {
            await new Promise(res => setTimeout(res, 400));
          }
          await new Promise(res => setTimeout(res, typeSpeed));
        }
        
        // Hold the complete line
        await new Promise(res => setTimeout(res, 1500));
        
        // Delete the line
        for (let i = line.length; i > 0 && animationRef.current; i--) {
          element.textContent = line.substring(0, i - 1);
          await new Promise(res => setTimeout(res, 20));
        }
        
        // Pause before next line
        await new Promise(res => setTimeout(res, 300));
        lineIndex = (lineIndex + 1) % lines.length;
      }
    };

    // Check for reduced motion preference (accessibility)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches) {
      typewrite();
    } else {
      // If user prefers reduced motion, just show static text
      const lines = getLines();
      element.textContent = lines[0] || '';
      element.classList.remove('typewriter-cursor');
    }

    return () => {
      animationRef.current = false;
    };
  }, [element, getLines, speed]);
}

/**
 * Alternative hook with more control over the animation
 */
export function useAdvancedTypewriter(
  element: HTMLElement | null,
  options: {
    lines: string[] | (() => string[]);
    typeSpeed?: number;
    deleteSpeed?: number;
    pauseTime?: number;
    loop?: boolean;
    cursor?: boolean;
    onLineComplete?: (lineIndex: number) => void;
    onAnimationComplete?: () => void;
  }
) {
  const {
    lines,
    typeSpeed = 50,
    deleteSpeed = 20,
    pauseTime = 1500,
    loop = true,
    cursor = true,
    onLineComplete,
    onAnimationComplete
  } = options;

  const animationRef = useRef<boolean>(true);
  const cursorRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!element) return;

    // Add cursor if needed
    if (cursor && !cursorRef.current) {
      cursorRef.current = document.createElement('span');
      cursorRef.current.className = 'typewriter-cursor';
      cursorRef.current.textContent = '|';
      cursorRef.current.style.animation = 'blink 1s infinite';
      element.parentElement?.appendChild(cursorRef.current);
    }

    const getTextLines = () => {
      return typeof lines === 'function' ? lines() : lines;
    };

    const typewrite = async () => {
      let lineIndex = 0;
      const textLines = getTextLines();
      
      do {
        const line = textLines[lineIndex];
        if (!line) break; // Handle undefined line
        const dynamicTypeSpeed = typeSpeed + Math.random() * 30;
        
        // Type out the line
        for (let i = 0; i < line.length && animationRef.current; i++) {
          element.textContent = line.substring(0, i + 1);
          
          // Variable speed for more natural typing
          if (['.', ',', '!', '?', ';', ':'].includes(line[i] || '')) {
            await new Promise(res => setTimeout(res, 400));
          } else if (line[i] === ' ') {
            await new Promise(res => setTimeout(res, dynamicTypeSpeed * 0.5));
          }
          
          await new Promise(res => setTimeout(res, dynamicTypeSpeed));
        }
        
        // Trigger line complete callback
        if (onLineComplete) {
          onLineComplete(lineIndex);
        }
        
        // Hold the complete line
        await new Promise(res => setTimeout(res, pauseTime));
        
        // Delete the line (if not the last line in non-loop mode)
        if (loop || lineIndex < textLines.length - 1) {
          for (let i = line.length; i > 0 && animationRef.current; i--) {
            element.textContent = line.substring(0, i - 1);
            await new Promise(res => setTimeout(res, deleteSpeed));
          }
          
          // Pause before next line
          await new Promise(res => setTimeout(res, 300));
        }
        
        lineIndex = (lineIndex + 1) % textLines.length;
        
        // Check if animation should continue
        if (!loop && lineIndex === 0) {
          animationRef.current = false;
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }
      } while (animationRef.current);
    };

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches) {
      typewrite();
    } else {
      const textLines = getTextLines();
      element.textContent = textLines[0] || '';
      if (cursorRef.current) {
        cursorRef.current.style.display = 'none';
      }
    }

    return () => {
      animationRef.current = false;
      if (cursorRef.current) {
        cursorRef.current.remove();
        cursorRef.current = null;
      }
    };
  }, [element, lines, typeSpeed, deleteSpeed, pauseTime, loop, cursor, onLineComplete, onAnimationComplete]);
}

/**
 * Hook for single line typewriter effect (no deletion)
 */
export function useSimpleTypewriter(
  element: HTMLElement | null,
  text: string,
  speed: number = 50,
  onComplete?: () => void
) {
  const animationRef = useRef<boolean>(true);

  useEffect(() => {
    if (!element || !text) return;

    const typewrite = async () => {
      element.textContent = '';
      
      for (let i = 0; i < text.length && animationRef.current; i++) {
        element.textContent = text.substring(0, i + 1);
        
        // Add natural pauses
        if (['.', ',', '!', '?'].includes(text[i] || '')) {
          await new Promise(res => setTimeout(res, 300));
        }
        
        const typeSpeed = speed + Math.random() * 20;
        await new Promise(res => setTimeout(res, typeSpeed));
      }
      
      if (onComplete && animationRef.current) {
        onComplete();
      }
    };

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches) {
      typewrite();
    } else {
      element.textContent = text;
      if (onComplete) {
        onComplete();
      }
    }

    return () => {
      animationRef.current = false;
    };
  }, [element, text, speed, onComplete]);
}