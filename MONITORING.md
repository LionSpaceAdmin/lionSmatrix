# Lions of Zion - Monitoring & Performance Guide

## 🎯 Overview

This guide covers the comprehensive monitoring and performance setup for the Lions of Zion platform, including Sentry error tracking, Web Vitals monitoring, and bundle optimization.

## 📊 Performance Budgets

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: ≤ 2.5s (target: 2.0s)
- **CLS (Cumulative Layout Shift)**: < 0.1 (target: 0.05)
- **FID (First Input Delay)**: ≤ 100ms (target: 50ms)
- **INP (Interaction to Next Paint)**: ≤ 200ms (target: 100ms)

### Bundle Size Limits
- **Initial JavaScript**: 200KB (gzipped)
- **Total JavaScript**: 500KB (gzipped)
- **CSS**: 50KB (gzipped)
- **Images**: WebP/AVIF optimized, lazy loaded

### Lighthouse Targets
- **Performance**: ≥ 90
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

## 🔧 Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN="https://your-dsn@sentry.io/project-id"
NEXT_PUBLIC_SENTRY_ENVIRONMENT="development"
SENTRY_DSN="https://your-dsn@sentry.io/project-id"
SENTRY_ORG="your-sentry-org"
SENTRY_PROJECT="your-sentry-project"
SENTRY_AUTH_TOKEN="your-sentry-auth-token"
```

### 2. Sentry Project Setup

1. Create a new project at [sentry.io](https://sentry.io)
2. Get your DSN from Project Settings > Client Keys
3. Create an auth token in User Settings > Auth Tokens
4. Configure organization and project names

### 3. Install Dependencies

```bash
npm install
```

## 🚀 Monitoring Features

### Error Tracking
- **Automatic Error Capture**: Client and server-side errors
- **Source Maps**: Full stack traces with original code
- **User Context**: Session replays and user feedback
- **Performance Issues**: Slow database queries, API calls
- **Release Tracking**: Git commit-based releases

### Performance Monitoring
- **Real User Monitoring (RUM)**: Web Vitals from real users
- **Core Web Vitals**: LCP, CLS, FID, INP tracking
- **Bundle Analysis**: Automated size checking
- **Memory Monitoring**: JavaScript heap usage
- **Resource Timing**: Slow loading assets

### Custom Metrics
- **Component Performance**: Render time tracking
- **API Call Monitoring**: Request/response timing
- **User Interactions**: Click tracking and form submissions
- **Page Navigation**: Route change performance

## 📈 Available Scripts

### Development
```bash
npm run dev                 # Start development server
npm run analyze:bundle      # Build and analyze bundle size
npm run analyze:quick       # Quick bundle analysis (requires build)
npm run perf:monitor        # Full performance monitoring
```

### Production
```bash
npm run build              # Production build
npm run start              # Start production server
npm run sentry:sourcemaps  # Upload source maps to Sentry
```

### Testing
```bash
npm run test:e2e           # End-to-end tests
npm run test:perf          # Performance testing with Lighthouse
npm run test:a11y          # Accessibility testing
```

## 🎛️ Monitoring Dashboard

Access the performance dashboard at `/monitoring` (development only):

- **Core Web Vitals**: Real-time metrics
- **Bundle Analysis**: Size and loading performance
- **Error Tracking**: Recent errors and their frequency
- **User Sessions**: Session replays and user flows

## 🔍 Bundle Analysis

### Automated Analysis
```bash
npm run analyze:bundle
```

### Manual Analysis
```bash
# Enable bundle analyzer
ANALYZE=true npm run build
```

### Bundle Optimization Tips

1. **Code Splitting**
   ```typescript
   // Use dynamic imports for heavy components
   const HeavyComponent = dynamic(() => import('./HeavyComponent'))
   ```

2. **Tree Shaking**
   ```typescript
   // Import only what you need
   import { specific } from 'library'
   // Instead of: import * as all from 'library'
   ```

3. **Route-based Splitting**
   ```typescript
   // Next.js automatically splits routes
   // Keep page components small and focused
   ```

## 🚨 Error Handling

### Error Boundaries
```tsx
import { ErrorBoundary } from '@/components/monitoring/ErrorBoundary'

// Wrap components with error boundaries
<ErrorBoundary name="ComponentName" level="component">
  <YourComponent />
</ErrorBoundary>
```

### Custom Error Reporting
```typescript
import { captureError } from '@/lib/monitoring'

try {
  // Your code
} catch (error) {
  captureError(error, { context: 'additional info' })
}
```

### Performance Monitoring Hooks
```typescript
import { useComponentMonitoring, useInteractionTracking } from '@/lib/hooks/use-monitoring'

function MyComponent() {
  const { startRender, endRender } = useComponentMonitoring('MyComponent')
  const { trackClick } = useInteractionTracking()
  
  // Use in your component
}
```

## 📊 Performance Monitoring API

### Send Custom Metrics
```typescript
// POST /api/monitoring
{
  "type": "performance",
  "metrics": {
    "pageLoadTime": 1200,
    "customMetric": 500
  }
}
```

### Web Vitals Reporting
Automatically tracked and reported:
- Browser automatically sends Core Web Vitals
- Server-side performance metrics
- Custom business metrics

## 🔧 Configuration

### Sentry Configuration
- **Client Config**: `sentry.client.config.ts`
- **Server Config**: `sentry.server.config.ts`
- **Edge Config**: `sentry.edge.config.ts`

### Next.js Integration
```typescript
// next.config.ts
export default withSentryConfig(config, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
})
```

## 🎯 Optimization Checklist

### Before Release
- [ ] Bundle size under limits (500KB JS, 50KB CSS)
- [ ] Core Web Vitals passing (LCP ≤ 2.5s, CLS < 0.1)
- [ ] Lighthouse score ≥ 90 (all categories)
- [ ] Error boundaries implemented
- [ ] Sentry configured and tested
- [ ] Source maps uploaded
- [ ] Performance monitoring active

### Continuous Monitoring
- [ ] Weekly bundle analysis
- [ ] Monthly performance review
- [ ] Error rate monitoring (< 1%)
- [ ] User session analysis
- [ ] Performance budget alerts

## 🆘 Troubleshooting

### Common Issues

1. **High Bundle Size**
   - Check for duplicate dependencies
   - Use dynamic imports for large components
   - Enable tree shaking

2. **Poor Core Web Vitals**
   - Optimize images (WebP/AVIF)
   - Reduce JavaScript execution time
   - Minimize layout shifts

3. **Sentry Not Working**
   - Verify DSN configuration
   - Check source map uploads
   - Validate environment variables

4. **Memory Leaks**
   - Check useEffect cleanup
   - Avoid global state accumulation
   - Monitor component unmounting

### Getting Help
- Check Sentry dashboard for error details
- Use performance dashboard for bottlenecks
- Review bundle analysis for optimization opportunities
- Monitor Core Web Vitals in production

## 📚 Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Bundle Analysis Best Practices](https://nextjs.org/docs/advanced-features/analyzing-bundles)