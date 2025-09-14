// This file configures the initialization of Sentry on the server side.
// It is automatically imported by the Next.js integration.

import * as Sentry from "@sentry/nextjs";
import { env } from "./env.mjs";

Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry
  debug: process.env.NODE_ENV === "development",
  
  // Performance monitoring for server-side
  integrations: [
    // Http integration for tracking HTTP requests
    Sentry.httpIntegration({
      ignoreIncomingRequests: (url: string) => {
        // Ignore health checks and static assets
        return url.includes('/api/health') || 
               url.includes('/_next/static') || 
               url.includes('/favicon.ico') ||
               url.includes('/_vercel');
      },
    }),
    
    // Console integration for capturing console errors
    Sentry.consoleIntegration({
      levels: ['error'],
    }),
    
    // Node profiling integration (optional)
    ...(process.env.NODE_ENV === "production" ? [
      Sentry.browserProfilingIntegration(),
    ] : []),
  ],
  
  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
  
  // Filter out known non-critical errors
  beforeSend(event) {
    // Skip health check errors
    if (event.request?.url?.includes('/api/health')) {
      return null;
    }
    
    // Skip known Next.js development errors
    if (process.env.NODE_ENV === "development") {
      if (event.exception?.values?.[0]?.value?.includes('ENOENT')) {
        return null;
      }
    }
    
    return event;
  },
  
  // Set server context
  initialScope: {
    tags: {
      platform: "server",
      runtime: "nodejs",
      version: process.env.npm_package_version || "unknown",
    },
  },
});