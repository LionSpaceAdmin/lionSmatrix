import * as Sentry from '@sentry/nextjs';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private marks: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Start timing an operation
  startTiming(name: string): void {
    this.marks.set(name, performance.now());
    performance.mark(`${name}-start`);
  }

  // End timing and report to Sentry
  endTiming(name: string): number | null {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`No start time found for ${name}`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    // Report to Sentry
    Sentry.setMeasurement(name, duration, 'millisecond');
    Sentry.addBreadcrumb({
      category: 'performance',
      message: `${name}: ${duration.toFixed(2)}ms`,
      level: 'info',
    });

    this.marks.delete(name);
    return duration;
  }

  // Track component render time
  trackComponent(componentName: string, renderFn: () => void): void {
    this.startTiming(`component-render-${componentName}`);
    renderFn();
    this.endTiming(`component-render-${componentName}`);
  }

  // Track API call performance
  async trackApiCall<T>(
    name: string, 
    apiCall: () => Promise<T>
  ): Promise<T> {
    this.startTiming(`api-${name}`);
    
    try {
      const result = await apiCall();
      this.endTiming(`api-${name}`);
      return result;
    } catch (error) {
      this.endTiming(`api-${name}`);
      Sentry.captureException(error, {
        tags: { api_call: name },
      });
      throw error;
    }
  }

  // Track user interactions
  trackUserInteraction(action: string, target?: string): void {
    Sentry.addBreadcrumb({
      category: 'ui.interaction',
      message: `User ${action}${target ? ` on ${target}` : ''}`,
      level: 'info',
      timestamp: Date.now() / 1000,
    });
  }

  // Track page views with performance context
  trackPageView(pageName: string, loadTime?: number): void {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Navigated to ${pageName}`,
      level: 'info',
      data: {
        page: pageName,
        loadTime: loadTime || 'unknown',
      },
    });

    // Set user context
    Sentry.setContext('page', {
      name: pageName,
      loadTime: loadTime || 'unknown',
      timestamp: new Date().toISOString(),
    });
  }
}

// Error boundary utilities
export function captureError(
  error: Error,
  context?: Record<string, any>
): void {
  Sentry.captureException(error, {
    contexts: context ? { additional: context } : undefined,
  });
}

// User feedback utilities
export function captureUserFeedback(
  name: string,
  email: string,
  comments: string
): void {
  Sentry.captureUserFeedback({
    name,
    email,
    comments,
  });
}

// Resource loading monitoring
export function trackResourceLoading(): void {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'resource') {
        const resourceEntry = entry as PerformanceResourceTiming;
        
        // Track slow resources (>2s)
        if (resourceEntry.duration > 2000) {
          Sentry.addBreadcrumb({
            category: 'performance',
            message: `Slow resource load: ${resourceEntry.name}`,
            level: 'warning',
            data: {
              duration: resourceEntry.duration,
              size: resourceEntry.transferSize,
              type: resourceEntry.initiatorType,
            },
          });
        }

        // Track large resources (>1MB)
        if (resourceEntry.transferSize > 1024 * 1024) {
          Sentry.addBreadcrumb({
            category: 'performance',
            message: `Large resource: ${resourceEntry.name}`,
            level: 'warning',
            data: {
              size: resourceEntry.transferSize,
              duration: resourceEntry.duration,
            },
          });
        }
      }
    }
  });

  observer.observe({ entryTypes: ['resource'] });
}

// Memory usage monitoring
export function trackMemoryUsage(): void {
  if (typeof window === 'undefined' || !('memory' in performance)) return;

  const memory = (performance as any).memory;
  
  Sentry.setContext('memory', {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
  });

  // Warn if memory usage is high (>50MB)
  if (memory.usedJSHeapSize > 50 * 1024 * 1024) {
    Sentry.captureMessage(
      `High memory usage: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
      'warning'
    );
  }
}

// Singleton instance
export const monitor = PerformanceMonitor.getInstance();