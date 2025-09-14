// This file is used to register instrumentation for the Next.js application.
// See: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // This is where you would initialize server-side instrumentation,
    // such as OpenTelemetry, Sentry, etc.

    console.log('Instrumentation: Registering server-side instrumentation...');

    // Example: Dynamically import and initialize a monitoring service
    // if (process.env.ENABLE_MONITORING === 'true') {
    //   const { initializeServerMonitoring } = await import('./lib/monitoring');
    //   initializeServerMonitoring();
    // }
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // This is where you would initialize edge-side instrumentation.
    console.log('Instrumentation: Registering edge-side instrumentation...');
  }
}
