// Mock web-vitals implementation - replace with actual web-vitals when packages are installed
const mockMetric = { name: '', value: 0, delta: 0, id: '', entries: [] };

const getCLS = () => Promise.resolve(mockMetric);
const getFID = () => Promise.resolve(mockMetric);
const getFCP = () => Promise.resolve(mockMetric);
const getLCP = () => Promise.resolve(mockMetric);
const getTTFB = () => Promise.resolve(mockMetric);
const getINP = () => Promise.resolve(mockMetric);

const onFCP = (callback: any) => { console.log('FCP tracking disabled (mock)'); };
const onLCP = (callback: any) => { console.log('LCP tracking disabled (mock)'); };
const onCLS = (callback: any) => { console.log('CLS tracking disabled (mock)'); };
const onFID = (callback: any) => { console.log('FID tracking disabled (mock)'); };
const onTTFB = (callback: any) => { console.log('TTFB tracking disabled (mock)'); };
const onINP = (callback: any) => { console.log('INP tracking disabled (mock)'); };

// Mock Sentry
const Sentry = {
  captureMessage: (message: string, level?: string) => { console.log('Sentry:', message); },
  addBreadcrumb: (data: any) => { console.log('Sentry breadcrumb:', data); },
  setMeasurement: (name: string, value: number, unit: string) => { console.log('Sentry measurement:', name, value, unit); }
};

// Web Vitals tracking for performance monitoring
export function trackWebVitals() {
  try {
    // Track Core Web Vitals with Sentry
    onCLS((metric) => {
      Sentry.addBreadcrumb({
        category: 'web-vitals',
        message: `CLS: ${metric.value}`,
        level: 'info',
        data: metric,
      });
      
      // Send to Sentry as measurement
      Sentry.setMeasurement('cls', metric.value, 'none');
      
      // Log warning if CLS is poor (>0.25)
      if (metric.value > 0.25) {
        Sentry.captureMessage(`Poor CLS score: ${metric.value}`, 'warning');
      }
    });

    onLCP((metric) => {
      Sentry.addBreadcrumb({
        category: 'web-vitals',
        message: `LCP: ${metric.value}ms`,
        level: 'info',
        data: metric,
      });
      
      Sentry.setMeasurement('lcp', metric.value, 'millisecond');
      
      // Log warning if LCP is poor (>4000ms)
      if (metric.value > 4000) {
        Sentry.captureMessage(`Poor LCP score: ${metric.value}ms`, 'warning');
      }
    });

    onFID((metric) => {
      Sentry.addBreadcrumb({
        category: 'web-vitals',
        message: `FID: ${metric.value}ms`,
        level: 'info',
        data: metric,
      });
      
      Sentry.setMeasurement('fid', metric.value, 'millisecond');
      
      // Log warning if FID is poor (>300ms)
      if (metric.value > 300) {
        Sentry.captureMessage(`Poor FID score: ${metric.value}ms`, 'warning');
      }
    });

    onFCP((metric) => {
      Sentry.addBreadcrumb({
        category: 'web-vitals',
        message: `FCP: ${metric.value}ms`,
        level: 'info',
        data: metric,
      });
      
      Sentry.setMeasurement('fcp', metric.value, 'millisecond');
    });

    onTTFB((metric) => {
      Sentry.addBreadcrumb({
        category: 'web-vitals',
        message: `TTFB: ${metric.value}ms`,
        level: 'info',
        data: metric,
      });
      
      Sentry.setMeasurement('ttfb', metric.value, 'millisecond');
    });

    // Interaction to Next Paint (INP) - New Core Web Vital replacing FID
    onINP((metric) => {
      Sentry.addBreadcrumb({
        category: 'web-vitals',
        message: `INP: ${metric.value}ms`,
        level: 'info',
        data: metric,
      });
      
      Sentry.setMeasurement('inp', metric.value, 'millisecond');
      
      // Log warning if INP is poor (>500ms)
      if (metric.value > 500) {
        Sentry.captureMessage(`Poor INP score: ${metric.value}ms`, 'warning');
      }
    });

  } catch (error) {
    console.error('Error tracking web vitals:', error);
  }
}

// Function to get current web vitals metrics manually
export async function getWebVitalsMetrics() {
  const metrics = {
    cls: null as number | null,
    lcp: null as number | null,
    fid: null as number | null,
    fcp: null as number | null,
    ttfb: null as number | null,
    inp: null as number | null,
  };

  try {
    metrics.cls = await getCLS();
    metrics.lcp = await getLCP();
    metrics.fid = await getFID();
    metrics.fcp = await getFCP();
    metrics.ttfb = await getTTFB();
    metrics.inp = await getINP();
  } catch (error) {
    console.error('Error getting web vitals metrics:', error);
  }

  return metrics;
}

// Performance monitoring utility
export function trackPerformanceMetrics() {
  if (typeof window === 'undefined') return;

  // Track page load time
  window.addEventListener('load', () => {
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigationTiming) {
      const pageLoadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart;
      
      Sentry.setMeasurement('page_load_time', pageLoadTime, 'millisecond');
      Sentry.addBreadcrumb({
        category: 'performance',
        message: `Page loaded in ${pageLoadTime}ms`,
        level: 'info',
      });
    }
  });

  // Track JavaScript bundle size
  if ('performance' in window && 'getEntriesByType' in performance) {
    const resources = performance.getEntriesByType('resource');
    const jsResources = resources.filter(resource => 
      resource.name.includes('.js') && 
      !resource.name.includes('/_next/static/')
    );
    
    const totalJSSize = jsResources.reduce((total, resource) => {
      return total + ((resource as PerformanceResourceTiming).transferSize || 0);
    }, 0);
    
    if (totalJSSize > 0) {
      Sentry.setMeasurement('js_bundle_size', totalJSSize, 'byte');
      
      // Warn if bundle is larger than 500KB
      if (totalJSSize > 512000) {
        Sentry.captureMessage(`Large JS bundle size: ${(totalJSSize / 1024).toFixed(2)}KB`, 'warning');
      }
    }
  }
}