# 🔐 Secrets Management Guide

## Overview

LionSpace V3 implements a comprehensive secrets management system built on industry best practices for security, validation, and rotation.

## 🏗️ Architecture

### Core Components

1. **SecretsManager** - Central service for all secret operations
2. **Schema Validation** - Zod-based environment validation
3. **Rotation Service** - Automated secret rotation mechanism
4. **Audit Logger** - Tracks all secret access and modifications
5. **Security Utilities** - Helper functions for safe secret handling

## 🚀 Quick Start

### Initial Setup

1. **Copy environment template**:
```bash
cp .env.example .env.local
```

2. **Configure required secrets**:
```env
# Minimum required for development
NODE_ENV=development
NEXTAUTH_SECRET=your-dev-secret-min-32-chars
DATABASE_URL=postgresql://localhost:5432/lionspace_dev
```

3. **Validate configuration**:
```bash
pnpm run validate:env
```

## 📋 Environment Variables

### Required in Production

| Variable | Description | Format |
|----------|-------------|--------|
| `NEXTAUTH_SECRET` | NextAuth.js JWT signing secret | Min 32 chars |
| `NEXTAUTH_URL` | Application URL | Valid URL |
| `DATABASE_URL` | PostgreSQL connection string | PostgreSQL URL |
| `ENCRYPTION_KEY` | Data encryption key | Exactly 32 chars |

### OAuth Providers

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | For Google login |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | For Google login |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | For GitHub login |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret | For GitHub login |

### Optional Services

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_URL` | Redis cache connection | None |
| `SENTRY_DSN` | Error monitoring | None |
| `GEMINI_API_KEY` | AI services | None |

## 🔒 Security Features

### 1. Environment Validation

The system validates all environment variables on startup:

```typescript
import { initializeSecrets } from '@/lib/secrets'

// In instrumentation.ts
await initializeSecrets({
  validateOnStartup: true,
  enableRotation: process.env.NODE_ENV === 'production',
})
```

### 2. Type Safety

Full TypeScript support with Zod validation:

```typescript
import { getSecret, hasSecret } from '@/lib/secrets'

// Type-safe secret access
const apiKey = getSecret('GEMINI_API_KEY')
const hasRedis = hasSecret('REDIS_URL')
```

### 3. Secret Rotation

Automatic rotation monitoring and alerts:

```typescript
// Check rotation status
GET /api/admin/secrets/rotation

// Manual rotation trigger
POST /api/admin/secrets/rotation
{
  "key": "NEXTAUTH_SECRET"
}
```

### Rotation Schedule

| Secret | Rotation Interval | Warning Period |
|--------|------------------|----------------|
| `NEXTAUTH_SECRET` | 90 days | 7 days before |
| `JWT_SECRET` | 30 days | 7 days before |
| `ENCRYPTION_KEY` | 180 days | 14 days before |

### 4. Access Control

- Audit logging of all secret access
- Role-based access to secret management endpoints
- Masked values in logs and errors

## 🛡️ Security Best Practices

### DO's ✅

1. **Use strong secrets**:
   - Minimum 32 characters for signing keys
   - Use cryptographically secure random generation
   - Unique secrets per environment

2. **Regular rotation**:
   - Follow the rotation schedule
   - Update all dependent services
   - Test after rotation

3. **Secure storage**:
   - Never commit secrets to git
   - Use environment variables
   - Encrypt secrets at rest

4. **Access control**:
   - Limit who can access production secrets
   - Use separate accounts for different environments
   - Enable audit logging

### DON'Ts ❌

1. **Never expose secrets**:
   - Don't log secret values
   - Don't include in error messages
   - Don't send to client-side

2. **Avoid weak secrets**:
   - No dictionary words
   - No sequential patterns
   - No default values in production

3. **Don't share secrets**:
   - Each developer gets their own
   - No shared passwords
   - Rotate after team changes

## 🔄 Secret Rotation Process

### Manual Rotation Steps

1. **Generate new secret**:
```bash
# Generate cryptographically secure secret
openssl rand -hex 32
```

2. **Update staging first**:
```bash
# Test in staging environment
vercel env pull .env.staging
# Update secret
vercel env add NEXTAUTH_SECRET staging
```

3. **Deploy and verify**:
```bash
# Deploy to staging
vercel --prod --env staging
# Run health checks
curl https://staging.lionspace.com/api/health/secrets
```

4. **Update production**:
```bash
# If staging passes, update production
vercel env add NEXTAUTH_SECRET production
# Deploy
vercel --prod
```

5. **Verify and document**:
```bash
# Check application health
curl https://lionspace.com/api/health
# Update rotation log
```

### Automated Rotation

Enable automatic rotation monitoring:

```typescript
// config/secrets.ts
export const rotationConfig = {
  enableRotation: true,
  rotationConfigs: [
    {
      key: 'NEXTAUTH_SECRET',
      rotationInterval: 90, // days
      notifyBefore: 7, // days
      autoRotate: false, // require manual approval
    }
  ]
}
```

## 🔍 Monitoring & Alerts

### Health Check Endpoint

```bash
GET /api/health/secrets

Response:
{
  "status": "healthy",
  "environment": "production",
  "secrets": {
    "configured": 15,
    "sensitive": 8
  },
  "validation": {
    "isValid": true,
    "errorCount": 0,
    "warningCount": 0
  }
}
```

### Audit Logs

Access audit logs via admin panel:

```typescript
GET /api/admin/secrets/audit

Response:
[
  {
    "timestamp": "2025-01-11T01:30:00Z",
    "action": "access",
    "key": "DATABASE_URL",
    "user": "admin@lionspace.com"
  }
]
```

## 🚨 Emergency Procedures

### Secret Compromise

If a secret is compromised:

1. **Immediate actions**:
   - Rotate the compromised secret immediately
   - Revoke all active sessions
   - Enable maintenance mode if critical

2. **Investigation**:
   - Review audit logs
   - Check for unauthorized access
   - Identify exposure window

3. **Remediation**:
   - Update all dependent services
   - Notify affected users if required
   - Document incident

### Recovery Process

```bash
# 1. Enable maintenance mode
vercel env add ENABLE_MAINTENANCE_MODE=true production

# 2. Rotate all critical secrets
./scripts/rotate-all-secrets.sh

# 3. Clear all sessions
redis-cli FLUSHDB

# 4. Deploy updated configuration
vercel --prod --force

# 5. Disable maintenance mode
vercel env rm ENABLE_MAINTENANCE_MODE production
```

## 🧪 Testing

### Local Testing

```bash
# Test with development secrets
pnpm test:secrets

# Validate production-like environment
NODE_ENV=production pnpm validate:env
```

### CI/CD Integration

The CI pipeline automatically:
- Scans for exposed secrets
- Validates environment configuration
- Checks for weak secrets
- Monitors rotation schedules

## 📚 API Reference

### SecretsManager

```typescript
class SecretsManager {
  // Get a secret value
  getSecret<K>(key: K): EnvConfig[K] | undefined
  
  // Get with default fallback
  getSecretSafe<K>(key: K, defaultValue: EnvConfig[K]): EnvConfig[K]
  
  // Check if secret exists
  hasSecret(key: keyof EnvConfig): boolean
  
  // List all secrets (excluding sensitive by default)
  listSecrets(includeSensitive?: boolean): SecretMetadata[]
  
  // Validate environment
  validateEnvironment(): Promise<SecretValidationResult>
  
  // Check rotation status
  checkRotationStatus(): Array<RotationStatus>
}
```

### Utility Functions

```typescript
// Safe logging with masked secrets
const logger = SecretUtils.createSafeLogger()
logger.info('Database connected', { url: dbUrl }) // URL will be masked

// Parse connection strings
const dbConfig = SecretUtils.getDatabaseConfig()
const redisConfig = SecretUtils.getRedisConfig()

// Validate API keys
const isValidStripeKey = SecretUtils.validateApiKey(key, 'stripe')
```

## 🔗 Integration Examples

### Database Connection

```typescript
import { SecretUtils } from '@/lib/secrets'

const dbConfig = SecretUtils.getDatabaseConfig()
const pool = new Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.username,
  password: dbConfig.password,
  ssl: dbConfig.ssl,
})
```

### NextAuth Configuration

```typescript
import { getSecret } from '@/lib/secrets'

export const authOptions = {
  secret: getSecret('NEXTAUTH_SECRET'),
  providers: [
    GoogleProvider({
      clientId: getSecret('GOOGLE_CLIENT_ID')!,
      clientSecret: getSecret('GOOGLE_CLIENT_SECRET')!,
    }),
  ],
}
```

### Email Service

```typescript
import { SecretUtils } from '@/lib/secrets'

const smtpConfig = SecretUtils.getSmtpConfig()
if (smtpConfig) {
  const transporter = nodemailer.createTransport(smtpConfig)
}
```

## 🤝 Contributing

When adding new secrets:

1. Update `schema.ts` with validation rules
2. Add to `types.ts` for TypeScript support
3. Document in `.env.example`
4. Update this guide
5. Add rotation configuration if sensitive

## 📞 Support

For secret management issues:
- Check audit logs first
- Review validation errors
- Contact security team for production issues
- File issues at [GitHub Issues](https://github.com/lionspace/v3/issues)

---

Last Updated: January 11, 2025
Version: 1.0.0