import { useCallback, useEffect, useRef } from 'react';
import { monitor } from '@/lib/monitoring';
import * as Sentry from '@sentry/nextjs';

// Hook for monitoring component performance
export function useComponentMonitoring(componentName: string) {
  const renderStartTime = useRef<number>();

  useEffect(() => {
    // Track component mount
    monitor.trackPageView(`component-${componentName}`);
    
    return () => {
      // Track component unmount
      Sentry.addBreadcrumb({
        category: 'component',
        message: `${componentName} unmounted`,
        level: 'info',
      });
    };
  }, [componentName]);

  const startRender = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRender = useCallback(() => {
    if (renderStartTime.current) {
      const duration = performance.now() - renderStartTime.current;
      monitor.endTiming(`component-render-${componentName}`);
      
      // Warn about slow renders (>16ms for 60fps)
      if (duration > 16) {
        Sentry.addBreadcrumb({
          category: 'performance',
          message: `Slow render: ${componentName} (${duration.toFixed(2)}ms)`,
          level: 'warning',
        });
      }
    }
  }, [componentName]);

  return { startRender, endRender };
}

// Hook for tracking user interactions
export function useInteractionTracking() {
  const trackClick = useCallback((target: string, metadata?: Record<string, any>) => {
    monitor.trackUserInteraction('click', target);
    
    // Send to monitoring API
    fetch('/api/monitoring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'user-interaction',
        metrics: {
          action: 'click',
          target,
          metadata,
          timestamp: Date.now(),
        },
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    }).catch(console.error);
  }, []);

  const trackFormSubmit = useCallback((formName: string, metadata?: Record<string, any>) => {
    monitor.trackUserInteraction('form-submit', formName);
    
    fetch('/api/monitoring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'user-interaction',
        metrics: {
          action: 'form-submit',
          target: formName,
          metadata,
          timestamp: Date.now(),
        },
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    }).catch(console.error);
  }, []);

  const trackCustomEvent = useCallback((
    action: string, 
    target?: string, 
    metadata?: Record<string, any>
  ) => {
    monitor.trackUserInteraction(action, target);
    
    fetch('/api/monitoring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'user-interaction',
        metrics: {
          action,
          target,
          metadata,
          timestamp: Date.now(),
        },
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    }).catch(console.error);
  }, []);

  return {
    trackClick,
    trackFormSubmit,
    trackCustomEvent,
  };
}

// Hook for API call monitoring
export function useApiMonitoring() {
  const trackApiCall = useCallback(async <T>(
    name: string,
    apiCall: () => Promise<T>,
    options?: {
      onSuccess?: (result: T) => void;
      onError?: (error: Error) => void;
    }
  ): Promise<T> => {
    try {
      const result = await monitor.trackApiCall(name, apiCall);
      options?.onSuccess?.(result);
      return result;
    } catch (error) {
      options?.onError?.(error as Error);
      throw error;
    }
  }, []);

  return { trackApiCall };
}

// Hook for error boundary monitoring
export function useErrorMonitoring() {
  const captureError = useCallback((
    error: Error,
    errorInfo?: { componentStack: string },
    context?: Record<string, any>
  ) => {
    Sentry.captureException(error, {
      contexts: {
        react: errorInfo,
        additional: context,
      },
      tags: {
        source: 'error-boundary',
      },
    });
  }, []);

  const captureMessage = useCallback((
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
    context?: Record<string, any>
  ) => {
    Sentry.captureMessage(message, level);
    if (context) {
      Sentry.setContext('additional', context);
    }
  }, []);

  return {
    captureError,
    captureMessage,
  };
}

// Hook for performance budget monitoring
export function usePerformanceBudget() {
  const checkBudget = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Check Core Web Vitals budget
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const lcp = navigation.loadEventEnd - navigation.navigationStart;
      const fcp = navigation.responseStart - navigation.navigationStart;
      
      // LCP budget: 2.5s
      if (lcp > 2500) {
        Sentry.captureMessage(
          `LCP budget exceeded: ${lcp}ms (budget: 2500ms)`,
          'warning'
        );
      }
      
      // FCP budget: 1.8s
      if (fcp > 1800) {
        Sentry.captureMessage(
          `FCP budget exceeded: ${fcp}ms (budget: 1800ms)`,
          'warning'
        );
      }
    }

    // Check bundle size budget
    const resources = performance.getEntriesByType('resource');
    const jsSize = resources
      .filter(r => r.name.includes('.js') && !r.name.includes('node_modules'))
      .reduce((total, r) => total + ((r as PerformanceResourceTiming).transferSize || 0), 0);
    
    // JS bundle budget: 500KB
    if (jsSize > 512000) {
      Sentry.captureMessage(
        `JS bundle budget exceeded: ${(jsSize / 1024).toFixed(2)}KB (budget: 500KB)`,
        'warning'
      );
    }
  }, []);

  useEffect(() => {
    // Check budget on page load
    const timer = setTimeout(checkBudget, 2000);
    return () => clearTimeout(timer);
  }, [checkBudget]);

  return { checkBudget };
}