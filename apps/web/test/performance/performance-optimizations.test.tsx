import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import {
  useIntersectionObserver,
  useIdleCallback,
  useThrottle,
  useDebounce,
  useTabVisibility,
  useAnimationController,
  usePerformanceMonitor,
  useVirtualScrolling
} from '@/lib/hooks/usePerformanceOptimizations';

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(private callback: IntersectionObserverCallback) {}
  
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

global.IntersectionObserver = MockIntersectionObserver as any;

// Mock requestIdleCallback
global.requestIdleCallback = vi.fn((cb: IdleRequestCallback) => {
  return setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 50 }), 1) as any;
});

global.cancelIdleCallback = vi.fn(clearTimeout);

describe('Performance Optimization Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useIntersectionObserver', () => {
    test('should initialize with default visibility state', () => {
      const ref = { current: document.createElement('div') };
      const { result } = renderHook(() => useIntersectionObserver(ref));
      
      expect(result.current.isVisible).toBe(false);
      expect(result.current.hasBeenVisible).toBe(false);
    });

    test('should create IntersectionObserver when element is provided', () => {
      const ref = { current: document.createElement('div') };
      renderHook(() => useIntersectionObserver(ref));
      
      expect(MockIntersectionObserver.prototype.observe).toHaveBeenCalled();
    });

    test('should handle element becoming visible', () => {
      const ref = { current: document.createElement('div') };
      let observerCallback: IntersectionObserverCallback;
      
      vi.mocked(MockIntersectionObserver.prototype.observe).mockImplementation(function(this: MockIntersectionObserver) {
        observerCallback = (this as any).callback;
      });

      const { result } = renderHook(() => useIntersectionObserver(ref));
      
      act(() => {
        observerCallback!([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
      });
      
      expect(result.current.isVisible).toBe(true);
      expect(result.current.hasBeenVisible).toBe(true);
    });
  });

  describe('useIdleCallback', () => {
    test('should call callback during idle time', async () => {
      const callback = vi.fn();
      renderHook(() => useIdleCallback(callback, []));
      
      await waitFor(() => {
        expect(global.requestIdleCallback).toHaveBeenCalled();
      });
    });

    test('should call callback immediately when immediate option is true', () => {
      const callback = vi.fn();
      renderHook(() => useIdleCallback(callback, [], { immediate: true }));
      
      expect(callback).toHaveBeenCalled();
    });

    test('should cancel idle callback on unmount', () => {
      const callback = vi.fn();
      const { unmount } = renderHook(() => useIdleCallback(callback, []));
      
      unmount();
      
      expect(global.cancelIdleCallback).toHaveBeenCalled();
    });
  });

  describe('useThrottle', () => {
    test('should throttle function calls', async () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useThrottle(callback, 100));
      
      const throttledFn = result.current;
      
      // Call multiple times rapidly
      throttledFn('arg1');
      throttledFn('arg2');
      throttledFn('arg3');
      
      // Should only be called once immediately (leading edge)
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('arg1');
      
      // Wait for throttle period
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should be called again (trailing edge)
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith('arg3');
    });

    test('should respect leading option', async () => {
      const callback = vi.fn();
      const { result } = renderHook(() => 
        useThrottle(callback, 100, { leading: false, trailing: true })
      );
      
      const throttledFn = result.current;
      
      throttledFn('arg1');
      
      // Should not be called immediately when leading is false
      expect(callback).not.toHaveBeenCalled();
      
      // Wait for throttle period
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should be called on trailing edge
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('arg1');
    });
  });

  describe('useDebounce', () => {
    test('should debounce function calls', async () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useDebounce(callback, 100));
      
      const debouncedFn = result.current;
      
      // Call multiple times rapidly
      debouncedFn('arg1');
      debouncedFn('arg2');
      debouncedFn('arg3');
      
      // Should not be called immediately
      expect(callback).not.toHaveBeenCalled();
      
      // Wait for debounce period
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should be called once with the last arguments
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('arg3');
    });
  });

  describe('useTabVisibility', () => {
    test('should track document visibility state', () => {
      Object.defineProperty(document, 'visibilityState', {
        writable: true,
        value: 'visible'
      });

      const { result } = renderHook(() => useTabVisibility());
      
      expect(result.current.isVisible).toBe(true);
      expect(result.current.isHidden).toBe(false);
      expect(result.current.isSupported).toBe(true);
    });

    test('should handle visibility change events', () => {
      Object.defineProperty(document, 'visibilityState', {
        writable: true,
        value: 'visible'
      });

      const { result } = renderHook(() => useTabVisibility());
      
      expect(result.current.isVisible).toBe(true);
      
      // Simulate tab becoming hidden
      Object.defineProperty(document, 'visibilityState', {
        value: 'hidden'
      });
      
      act(() => {
        document.dispatchEvent(new Event('visibilitychange'));
      });
      
      expect(result.current.isVisible).toBe(false);
      expect(result.current.isHidden).toBe(true);
    });
  });

  describe('useVirtualScrolling', () => {
    test('should calculate visible items correctly', () => {
      const items = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }));
      const options = {
        itemHeight: 50,
        containerHeight: 300,
        overscan: 2
      };

      const { result } = renderHook(() => useVirtualScrolling(items, options));
      
      const { visibleItems } = result.current;
      
      // Should calculate visible items based on container height and item height
      // containerHeight (300) / itemHeight (50) = 6 visible items + overscan (2) = 8 items
      expect(visibleItems.items.length).toBeLessThanOrEqual(8 + 2); // +2 for overscan on both ends
      expect(visibleItems.totalHeight).toBe(100 * 50); // 100 items * 50px height
    });

    test('should update visible items on scroll', () => {
      const scrollElement = document.createElement('div');
      scrollElement.scrollTop = 250; // Scroll down
      
      const ref = { current: scrollElement };
      const items = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }));
      const options = {
        itemHeight: 50,
        containerHeight: 300,
        overscan: 2,
        scrollElement: ref
      };

      const { result } = renderHook(() => useVirtualScrolling(items, options));
      
      // Simulate scroll event
      act(() => {
        scrollElement.scrollTop = 250;
        scrollElement.dispatchEvent(new Event('scroll'));
      });
      
      const { visibleItems } = result.current;
      
      // Should start from item around index 5 (250 / 50 = 5)
      expect(visibleItems.startIndex).toBeGreaterThan(0);
    });
  });

  describe('usePerformanceMonitor', () => {
    test('should initialize with default metrics', () => {
      const { result } = renderHook(() => usePerformanceMonitor());
      
      expect(result.current.fps).toBe(60);
      expect(result.current.memory).toEqual({ used: 0, limit: 0 });
      expect(result.current.connection).toBe('unknown');
      expect(result.current.isLowPerformance).toBe(false);
    });

    test('should detect low performance when FPS drops', async () => {
      // Mock performance.now to simulate low FPS
      const originalNow = performance.now;
      let time = 0;
      performance.now = vi.fn(() => {
        time += 100; // Simulate 100ms per frame = 10 FPS
        return time;
      });

      const { result } = renderHook(() => usePerformanceMonitor());
      
      // Wait for FPS measurement
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      await waitFor(() => {
        expect(result.current.isLowPerformance).toBe(true);
      });

      performance.now = originalNow;
    });
  });

  describe('useAnimationController', () => {
    test('should control animation based on visibility and preferences', () => {
      const ref = { current: document.createElement('div') };
      
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      const { result } = renderHook(() => 
        useAnimationController(ref, { respectReducedMotion: true })
      );
      
      // Should not animate when user prefers reduced motion
      expect(result.current.shouldAnimate).toBe(false);
      expect(result.current.prefersReducedMotion).toBe(true);
    });

    test('should allow animation when conditions are met', () => {
      const ref = { current: document.createElement('div') };
      
      // Mock no motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: false,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      // Mock document visibility
      Object.defineProperty(document, 'visibilityState', {
        value: 'visible'
      });

      const { result } = renderHook(() => 
        useAnimationController(ref, { 
          respectReducedMotion: true,
          pauseOnTabHidden: true 
        })
      );
      
      expect(result.current.prefersReducedMotion).toBe(false);
      expect(result.current.isTabVisible).toBe(true);
    });
  });
});

describe('Performance Integration Tests', () => {
  test('should integrate intersection observer with animation controller', () => {
    const ref = { current: document.createElement('div') };
    
    // Mock no motion preference and visible tab
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    Object.defineProperty(document, 'visibilityState', {
      value: 'visible'
    });

    const { result } = renderHook(() => useAnimationController(ref));
    
    // Should provide comprehensive animation control
    expect(typeof result.current.shouldAnimate).toBe('boolean');
    expect(typeof result.current.isInViewport).toBe('boolean');
    expect(typeof result.current.isTabVisible).toBe('boolean');
    expect(typeof result.current.prefersReducedMotion).toBe('boolean');
    expect(typeof result.current.canAnimate).toBe('boolean');
  });

  test('should handle virtual scrolling with performance monitoring', () => {
    const items = Array.from({ length: 1000 }, (_, i) => ({ id: i }));
    const scrollOptions = {
      itemHeight: 50,
      containerHeight: 400,
      overscan: 5
    };

    const { result: virtualResult } = renderHook(() => 
      useVirtualScrolling(items, scrollOptions)
    );

    const { result: perfResult } = renderHook(() => usePerformanceMonitor());
    
    // Virtual scrolling should limit rendered items
    expect(virtualResult.current.visibleItems.items.length).toBeLessThan(items.length);
    
    // Performance monitor should be tracking
    expect(typeof perfResult.current.fps).toBe('number');
    expect(typeof perfResult.current.isLowPerformance).toBe('boolean');
  });
});