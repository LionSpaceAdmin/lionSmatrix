import { SecretsManager } from './manager'
import type { Environment, SecretsManagerConfig } from './types'

// Default configuration
const createDefaultConfig = (environment: Environment): SecretsManagerConfig => ({
  environment,
  validateOnStartup: true,
  enableRotation: environment === 'production',
  enableAuditLog: environment !== 'development',
  rotationConfigs: [
    {
      key: 'NEXTAUTH_SECRET',
      rotationInterval: 90, // 90 days
      notifyBefore: 7,
      autoRotate: false, // Manual approval required
    },
    {
      key: 'JWT_SECRET',
      rotationInterval: 30, // 30 days
      notifyBefore: 7,
      autoRotate: false,
    },
    {
      key: 'ENCRYPTION_KEY',
      rotationInterval: 180, // 6 months
      notifyBefore: 14,
      autoRotate: false,
    },
  ],
})

// Initialize the secrets management system
export async function initializeSecrets(customConfig?: Partial<SecretsManagerConfig>) {
  const environment = (process.env.NODE_ENV as Environment) || 'development'
  const config = {
    ...createDefaultConfig(environment),
    ...customConfig,
  }

  // Initialize manager
  const manager = SecretsManager.getInstance(config)

  // Validate environment on startup
  if (config.validateOnStartup) {
    const validation = await manager.validateEnvironment()
    
    if (!validation.isValid) {
      console.error('❌ Environment validation failed:')
      validation.errors.forEach(error => {
        console.error(`  - ${error.key}: ${error.message}`)
      })
      
      if (environment === 'production') {
        process.exit(1)
      }
    }

    if (validation.warnings.length > 0) {
      console.warn('⚠️ Environment validation warnings:')
      validation.warnings.forEach(warning => {
        console.warn(`  - ${warning.key}: ${warning.message}`)
      })
    }

    if (validation.isValid && validation.warnings.length === 0) {
      console.info('✅ Environment validation passed')
    }
  }

  return {
    manager,
  }
}

// Export everything for easy access
export { SecretsManager } from './manager'
export type { Environment, EnvConfig, SecretValidationResult } from './types'

// Environment validation at module level
export async function validateEnvironment() {
  const manager = SecretsManager.getInstance()
  return await manager.validateEnvironment()
}

// Convenience functions for common operations
export const getSecret = <K extends keyof import('./types').EnvConfig>(key: K) => {
  try {
    const manager = SecretsManager.getInstance()
    return manager.getSecret(key)
  } catch {
    return undefined
  }
}

export const getSecretSafe = <K extends keyof import('./types').EnvConfig>(
  key: K, 
  defaultValue: import('./types').EnvConfig[K]
) => {
  try {
    const manager = SecretsManager.getInstance()
    return manager.getSecretSafe(key, defaultValue)
  } catch {
    return defaultValue
  }
}

export const hasSecret = (key: keyof import('./types').EnvConfig) => {
  try {
    const manager = SecretsManager.getInstance()
    return manager.hasSecret(key)
  } catch {
    return false
  }
}