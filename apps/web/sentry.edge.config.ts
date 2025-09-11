// This file configures the initialization of Sentry for edge runtime.
// The Edge Runtime is used by Edge API Routes and Middleware.

import * as Sentry from "@sentry/nextjs";
import { env } from "./env.mjs";

Sentry.init({
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,
  environment: env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry
  debug: process.env.NODE_ENV === "development",
  
  // Edge runtime specific configuration
  integrations: [
    // Only include integrations that work in Edge Runtime
    Sentry.consoleIntegration({
      levels: ['error'],
    }),
  ],
  
  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
  
  // Filter out middleware-specific noise
  beforeSend(event) {
    // Skip health check errors in middleware
    if (event.request?.url?.includes('/api/health')) {
      return null;
    }
    
    return event;
  },
  
  // Set edge context
  initialScope: {
    tags: {
      platform: "edge",
      runtime: "edge",
      version: process.env.npm_package_version || "unknown",
    },
  },
});