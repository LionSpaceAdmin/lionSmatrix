import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().default('LionSpace Intelligence'),
  NEXT_PUBLIC_APP_DESCRIPTION: z.string().default('Advanced Intelligence Platform'),
  
  SESSION_SECRET: z.string().min(32).optional(),
  JWT_SECRET: z.string().min(32).optional(),
  
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),
  
  SENTRY_DSN: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  
  NEXT_PUBLIC_ENABLE_ANALYTICS: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  NEXT_PUBLIC_ENABLE_PWA: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  NEXT_PUBLIC_MAINTENANCE_MODE: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
});

type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    const missingVars = error.errors.map((e) => e.path.join('.'));
    console.error('Invalid environment variables:', missingVars);
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid environment configuration');
    }
  }
  env = {} as Env;
}

export { env };