export async function register() {
  if (process.env.NODE_ENV === 'development') {
    console.log('Instrumentation registered.');
    // Here you could initialize OpenTelemetry, Sentry, etc.
  }
}
