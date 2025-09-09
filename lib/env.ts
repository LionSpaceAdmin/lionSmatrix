import { z } from 'zod';

const envSchema = z.object({
  // Application Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().default('LionSpace Intelligence'),
  NEXT_PUBLIC_APP_DESCRIPTION: z.string().default('Advanced Intelligence Platform'),
  NEXT_PUBLIC_VERCEL_ENV: z.string().optional(),
  
  // Authentication & Security
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  JWT_SECRET: z.string().min(32).optional(),
  ENCRYPTION_KEY: z.string().optional(),
  API_SECRET_KEY: z.string().optional(),
  
  // Google OAuth
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  
  // AI & External Services
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  
  // Google Cloud Platform
  GOOGLE_CLOUD_PROJECT: z.string().optional(),
  GCP_PROJECT_ID: z.string().optional(),
  GCP_REGION: z.string().optional(),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),
  
  // Database Configuration
  DATABASE_URL: z.string().optional(),
  POSTGRES_HOST: z.string().optional(),
  POSTGRES_PORT: z.string().optional(),
  POSTGRES_USER: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  POSTGRES_DB: z.string().optional(),
  
  // Redis Cache
  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
  
  // Payment Processing (Stripe)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  
  // Email Services
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  FROM_EMAIL: z.string().email().optional(),
  
  // Monitoring & Analytics
  SENTRY_DSN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),
  
  // Vercel Configuration
  VERCEL_ENV: z.string().optional(),
  VERCEL_URL: z.string().optional(),
  VERCEL_TOKEN: z.string().optional(),
  VERCEL_ORG_ID: z.string().optional(),
  VERCEL_PROJECT_ID: z.string().optional(),
  
  // External APIs
  GITHUB_TOKEN: z.string().optional(),
  DISCORD_WEBHOOK_URL: z.string().url().optional(),
  
  // Development Flags
  DEBUG: z.string().default('false').transform((val) => val === 'true'),
  ENABLE_EXPERIMENTAL_FEATURES: z.string().default('false').transform((val) => val === 'true'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  NEXT_TELEMETRY_DISABLED: z.string().default('1'),
  CHOKIDAR_USEPOLLING: z.string().default('false').transform((val) => val === 'true'),
  WATCHPACK_POLLING: z.string().default('false').transform((val) => val === 'true'),
  
  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
  NEXT_PUBLIC_ENABLE_PWA: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
  NEXT_PUBLIC_MAINTENANCE_MODE: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
});

type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    const missingVars = error.issues.map((e) => e.path.join('.'));
    console.error('❌ Invalid environment variables:', missingVars);
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid environment configuration');
    }
  }
  env = {} as Env;
}

export { env };