// This file configures the initialization of Sentry on the browser/client side
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Replay may only be enabled for the client-side
  integrations: [
    Sentry.replayIntegration({
      // Capture 10% of all sessions,
      // plus 100% of sessions with an error
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions

  // Session replay
  replaysSessionSampleRate: 0.1, // This will capture 10% of all sessions
  replaysOnErrorSampleRate: 1.0, // This will capture 100% of sessions with an error

  // Set debug to true if you want to see debug information in your console
  debug: false,

  // Disable automatic error capture for now to avoid spam during development
  enabled: process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SENTRY_DISABLED,

  // Specify the environment
  environment: process.env.NODE_ENV,
});