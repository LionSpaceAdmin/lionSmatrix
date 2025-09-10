import { z } from 'zod'
import { getEnvSchema } from './schema'
import type { 
  Environment, 
  EnvConfig, 
  SecretValidationResult, 
  SecretMetadata,
  SecretsManagerConfig 
} from './types'

class SecretsManager {
  private static instance: SecretsManager
  private config: SecretsManagerConfig
  private validatedEnv: EnvConfig | null = null
  private secretsMetadata: Map<string, SecretMetadata> = new Map()
  private auditLog: Array<{ timestamp: Date; action: string; key: string }> = []

  constructor(config: SecretsManagerConfig) {
    this.config = config
    this.initializeMetadata()
  }

  static getInstance(config?: SecretsManagerConfig): SecretsManager {
    if (!SecretsManager.instance) {
      if (!config) {
        throw new Error('SecretsManager configuration required for first initialization')
      }
      SecretsManager.instance = new SecretsManager(config)
    }
    return SecretsManager.instance
  }

  private initializeMetadata(): void {
    const sensitiveKeys = [
      'NEXTAUTH_SECRET',
      'DATABASE_URL',
      'GOOGLE_CLIENT_SECRET',
      'GITHUB_CLIENT_SECRET',
      'TWITTER_CLIENT_SECRET',
      'GEMINI_API_KEY',
      'ENCRYPTION_KEY',
      'JWT_SECRET',
      'JWT_SIGNING_KEY',
      'JWT_ENCRYPTION_KEY',
      'REDIS_PASSWORD',
    ]

    const requiredInProduction = [
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'DATABASE_URL',
      'ENCRYPTION_KEY',
    ]

    Object.keys(process.env).forEach(key => {
      this.secretsMetadata.set(key, {
        key,
        required: this.config.environment === 'production' 
          ? requiredInProduction.includes(key)
          : false,
        sensitive: sensitiveKeys.includes(key),
        description: this.getSecretDescription(key),
      })
    })
  }

  private getSecretDescription(key: string): string {
    const descriptions: Record<string, string> = {
      NEXTAUTH_SECRET: 'NextAuth.js secret for JWT signing',
      DATABASE_URL: 'PostgreSQL database connection string',
      GOOGLE_CLIENT_SECRET: 'Google OAuth client secret',
      GITHUB_CLIENT_SECRET: 'GitHub OAuth client secret',
      TWITTER_CLIENT_SECRET: 'Twitter OAuth client secret',
      GEMINI_API_KEY: 'Google Gemini AI API key',
      ENCRYPTION_KEY: 'Application encryption key for sensitive data',
      JWT_SECRET: 'JWT token signing secret',
    }
    
    return descriptions[key] || 'Environment variable'
  }

  async validateEnvironment(): Promise<SecretValidationResult> {
    const schema = getEnvSchema(this.config.environment)
    const result = schema.safeParse(process.env)

    if (result.success) {
      this.validatedEnv = result.data
      this.logAction('validation', 'environment', 'success')
      
      return {
        isValid: true,
        errors: [],
        warnings: this.checkForWarnings(),
      }
    }

    const errors = result.error.errors.map(error => ({
      key: error.path.join('.'),
      message: error.message,
      severity: 'error' as const,
    }))

    this.logAction('validation', 'environment', 'failed')

    return {
      isValid: false,
      errors,
      warnings: [],
    }
  }

  private checkForWarnings(): Array<{ key: string; message: string }> {
    const warnings: Array<{ key: string; message: string }> = []

    // Check for default values in production
    if (this.config.environment === 'production') {
      if (this.validatedEnv?.NEXTAUTH_SECRET === 'dev-secret-key-change-in-production') {
        warnings.push({
          key: 'NEXTAUTH_SECRET',
          message: 'Using default development secret in production',
        })
      }
    }

    // Check for weak secrets
    Object.entries(this.validatedEnv || {}).forEach(([key, value]) => {
      if (typeof value === 'string' && this.secretsMetadata.get(key)?.sensitive) {
        if (value.length < 16) {
          warnings.push({
            key,
            message: 'Secret appears to be too short for security',
          })
        }
        
        if (/^(test|dev|demo|example)/i.test(value)) {
          warnings.push({
            key,
            message: 'Secret appears to be a test/development value',
          })
        }
      }
    })

    return warnings
  }

  getSecret<K extends keyof EnvConfig>(key: K): EnvConfig[K] | undefined {
    if (!this.validatedEnv) {
      throw new Error('Environment not validated. Call validateEnvironment() first.')
    }
    
    this.logAction('access', key as string)
    return this.validatedEnv[key]
  }

  getSecretSafe<K extends keyof EnvConfig>(
    key: K, 
    defaultValue: EnvConfig[K]
  ): EnvConfig[K] {
    try {
      return this.getSecret(key) ?? defaultValue
    } catch {
      return defaultValue
    }
  }

  hasSecret(key: keyof EnvConfig): boolean {
    return this.validatedEnv ? this.validatedEnv[key] !== undefined : false
  }

  listSecrets(includeSensitive = false): SecretMetadata[] {
    return Array.from(this.secretsMetadata.values())
      .filter(meta => includeSensitive || !meta.sensitive)
  }

  getSecretMetadata(key: string): SecretMetadata | undefined {
    return this.secretsMetadata.get(key)
  }

  private logAction(action: string, key: string, details?: string): void {
    if (!this.config.enableAuditLog) return

    this.auditLog.push({
      timestamp: new Date(),
      action: `${action}${details ? `:${details}` : ''}`,
      key,
    })

    // Keep only last 1000 entries
    if (this.auditLog.length > 1000) {
      this.auditLog = this.auditLog.slice(-1000)
    }
  }

  getAuditLog(): Array<{ timestamp: Date; action: string; key: string }> {
    return [...this.auditLog]
  }

  // Secret rotation methods
  checkRotationStatus(): Array<{ key: string; needsRotation: boolean; daysUntilExpiry: number }> {
    return this.config.rotationConfigs.map(config => {
      const metadata = this.secretsMetadata.get(config.key)
      const lastRotated = metadata?.lastRotated || new Date(0)
      const daysSinceRotation = Math.floor(
        (Date.now() - lastRotated.getTime()) / (1000 * 60 * 60 * 24)
      )
      
      return {
        key: config.key,
        needsRotation: daysSinceRotation >= config.rotationInterval,
        daysUntilExpiry: Math.max(0, config.rotationInterval - daysSinceRotation),
      }
    })
  }

  async rotateSecret(key: string, newValue: string): Promise<void> {
    // In a real implementation, this would integrate with your secret storage service
    console.warn(`Secret rotation for ${key} would be performed here`)
    
    const metadata = this.secretsMetadata.get(key)
    if (metadata) {
      metadata.lastRotated = new Date()
      this.secretsMetadata.set(key, metadata)
    }
    
    this.logAction('rotation', key)
  }
}

export { SecretsManager }