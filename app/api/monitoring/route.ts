import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

// POST /api/monitoring - Receive client-side performance data
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { type, metrics, userAgent, url } = data;

    // Validate required fields
    if (!type || !metrics) {
      return NextResponse.json(
        { error: 'Missing required fields: type, metrics' },
        { status: 400 }
      );
    }

    // Set user context for this request
    Sentry.setContext('client_info', {
      userAgent: userAgent || 'unknown',
      url: url || 'unknown',
      timestamp: new Date().toISOString(),
    });

    switch (type) {
      case 'web-vitals':
        await handleWebVitals(metrics);
        break;
      
      case 'performance':
        await handlePerformanceMetrics(metrics);
        break;
      
      case 'error':
        await handleClientError(metrics);
        break;
      
      case 'user-interaction':
        await handleUserInteraction(metrics);
        break;
      
      default:
        return NextResponse.json(
          { error: `Unknown monitoring type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing monitoring data:', error);
    Sentry.captureException(error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle Web Vitals metrics
async function handleWebVitals(metrics: any) {
  const { name, value, id, delta, rating } = metrics;
  
  // Set measurements in Sentry
  Sentry.setMeasurement(name.toLowerCase(), value, getWebVitalUnit(name));
  
  // Add breadcrumb
  Sentry.addBreadcrumb({
    category: 'web-vitals',
    message: `${name}: ${value} (${rating})`,
    level: rating === 'poor' ? 'warning' : 'info',
    data: { name, value, id, delta, rating },
  });

  // Capture poor metrics as issues
  if (rating === 'poor') {
    Sentry.captureMessage(
      `Poor ${name} score: ${value}${getWebVitalUnit(name)}`,
      'warning'
    );
  }
}

// Handle general performance metrics
async function handlePerformanceMetrics(metrics: any) {
  const { 
    pageLoadTime, 
    firstByte, 
    domContentLoaded, 
    bundleSize,
    memoryUsage 
  } = metrics;

  // Set measurements
  if (pageLoadTime) {
    Sentry.setMeasurement('page_load_time', pageLoadTime, 'millisecond');
  }
  
  if (firstByte) {
    Sentry.setMeasurement('ttfb', firstByte, 'millisecond');
  }
  
  if (domContentLoaded) {
    Sentry.setMeasurement('dom_content_loaded', domContentLoaded, 'millisecond');
  }
  
  if (bundleSize) {
    Sentry.setMeasurement('bundle_size', bundleSize, 'byte');
  }

  // Add performance context
  Sentry.setContext('performance', {
    pageLoadTime,
    firstByte,
    domContentLoaded,
    bundleSize,
    memoryUsage,
  });

  // Warn about slow page loads
  if (pageLoadTime && pageLoadTime > 3000) {
    Sentry.captureMessage(
      `Slow page load: ${pageLoadTime}ms`,
      'warning'
    );
  }

  // Warn about large bundles
  if (bundleSize && bundleSize > 500 * 1024) {
    Sentry.captureMessage(
      `Large bundle size: ${(bundleSize / 1024).toFixed(2)}KB`,
      'warning'
    );
  }
}

// Handle client-side errors
async function handleClientError(errorData: any) {
  const { message, stack, component, url, userAgent } = errorData;
  
  // Create error object
  const error = new Error(message);
  if (stack) {
    error.stack = stack;
  }

  // Capture with context
  Sentry.captureException(error, {
    tags: {
      component: component || 'unknown',
      source: 'client',
    },
    contexts: {
      client: {
        url,
        userAgent,
      },
    },
  });
}

// Handle user interaction tracking
async function handleUserInteraction(interaction: any) {
  const { action, target, duration, metadata } = interaction;
  
  Sentry.addBreadcrumb({
    category: 'ui.interaction',
    message: `User ${action}${target ? ` on ${target}` : ''}`,
    level: 'info',
    data: {
      action,
      target,
      duration,
      metadata,
    },
  });

  // Track slow interactions (>100ms)
  if (duration && duration > 100) {
    Sentry.setMeasurement(`interaction_${action}`, duration, 'millisecond');
  }
}

// Get appropriate unit for Web Vital metric
function getWebVitalUnit(name: string): string {
  switch (name) {
    case 'CLS':
      return 'none';
    case 'LCP':
    case 'FID':
    case 'FCP':
    case 'TTFB':
    case 'INP':
      return 'millisecond';
    default:
      return 'none';
  }
}

// GET /api/monitoring - Health check for monitoring endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    monitoring: {
      sentry: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
      webVitals: true,
      performance: true,
    },
  });
}