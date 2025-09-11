// This file configures the initialization of Sentry on the browser/client side.
// It is automatically imported by the Next.js integration.

import * as Sentry from "@sentry/nextjs";
import { env } from "./env.mjs";

Sentry.init({
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,
  environment: env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry
  debug: process.env.NODE_ENV === "development",
  
  // Replay configuration for user session recording (optional)
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0.1,
  
  // Performance monitoring
  integrations: [
    Sentry.replayIntegration({
      // Capture 90% of all sessions for error replay
      sessionSampleRate: 0.1,
      // Capture 100% of sessions with errors for replay
      errorSampleRate: 1.0,
      // Mask all text and input content for privacy
      maskAllText: true,
      blockAllMedia: true,
    }),
    // Web Vitals integration for Core Web Vitals monitoring
    Sentry.browserTracingIntegration({
      // Web Vitals
      enableLongTask: true,
      enableInp: true,
    }),
  ],
  
  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
  
  // User context and tags
  beforeSend(event) {
    // Filter out known non-critical errors
    if (event.exception) {
      const error = event.exception.values?.[0];
      if (error?.value?.includes('Non-Error exception captured')) {
        return null;
      }
      if (error?.value?.includes('ChunkLoadError')) {
        return null;
      }
    }
    return event;
  },
  
  // Set user context
  initialScope: {
    tags: {
      platform: "web",
      version: process.env.npm_package_version || "unknown",
    },
  },
});