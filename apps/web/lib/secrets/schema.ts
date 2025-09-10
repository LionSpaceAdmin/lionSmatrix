import { z } from 'zod'

// Base environment schema
const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  
  // Application
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32),
  
  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_POOL_SIZE: z.coerce.number().min(1).max(50).default(10),
  
  // Redis
  REDIS_URL: z.string().url().optional(),
  REDIS_PASSWORD: z.string().optional(),
  
  // External APIs
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  TWITTER_CLIENT_ID: z.string().optional(),
  TWITTER_CLIENT_SECRET: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  
  // Security
  ENCRYPTION_KEY: z.string().length(32).optional(),
  JWT_SECRET: z.string().min(32).optional(),
  JWT_SIGNING_KEY: z.string().min(32).optional(),
  JWT_ENCRYPTION_KEY: z.string().min(32).optional(),
  JWT_MAX_AGE: z.coerce.number().optional(),
  
  // Feature Flags
  ENABLE_ANALYTICS: z.coerce.boolean().default(false),
  ENABLE_DEBUG: z.coerce.boolean().default(false),
  ENABLE_MAINTENANCE_MODE: z.coerce.boolean().default(false),
})

// Development-specific schema (more lenient)
const developmentEnvSchema = baseEnvSchema.partial({
  NEXTAUTH_SECRET: true,
  DATABASE_URL: true,
}).extend({
  NEXTAUTH_SECRET: z.string().min(8).default('dev-secret-key-change-in-production'),
  DATABASE_URL: z.string().default('postgresql://localhost:5432/lionspace_dev'),
})

// Production schema (strict requirements)
const productionEnvSchema = baseEnvSchema.extend({
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  DATABASE_URL: z.string().url(),
  ENCRYPTION_KEY: z.string().length(32),
})

// Staging schema (between dev and prod)
const stagingEnvSchema = baseEnvSchema.extend({
  NEXTAUTH_URL: z.string().url(),
})

export const getEnvSchema = (environment: string) => {
  switch (environment) {
    case 'development':
      return developmentEnvSchema
    case 'staging':
      return stagingEnvSchema
    case 'production':
      return productionEnvSchema
    default:
      return baseEnvSchema
  }
}

export type EnvConfig = z.infer<typeof baseEnvSchema>