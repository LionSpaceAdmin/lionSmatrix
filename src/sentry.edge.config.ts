// This file configures the initialization of Sentry for edge features (middleware, edge functions, edge routes, etc.)
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions

  // Set debug to true if you want to see debug information in your console
  debug: false,

  // Disable automatic error capture for now to avoid spam during development
  enabled: process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SENTRY_DISABLED,

  // Specify the environment
  environment: process.env.NODE_ENV,
});