import type { z } from 'zod'
import type { getEnvSchema } from './schema'

export type Environment = 'development' | 'staging' | 'production'

export type EnvSchema = ReturnType<typeof getEnvSchema>
export type EnvConfig = z.infer<EnvSchema>

export interface SecretMetadata {
  key: string
  required: boolean
  sensitive: boolean
  description?: string
  lastRotated?: Date
  expiresAt?: Date
}

export interface SecretValidationResult {
  isValid: boolean
  errors: Array<{
    key: string
    message: string
    severity: 'error' | 'warning'
  }>
  warnings: Array<{
    key: string
    message: string
  }>
}

export interface SecretRotationConfig {
  key: string
  rotationInterval: number // in days
  notifyBefore: number // in days
  autoRotate: boolean
}

export interface SecretsManagerConfig {
  environment: Environment
  validateOnStartup: boolean
  enableRotation: boolean
  enableAuditLog: boolean
  rotationConfigs: SecretRotationConfig[]
}