# 🔧 Environment Variables Guide

## 📋 Required Environment Variables

Based on your request, here are the environment variables you need to configure:

### 1. **Install Neon** (Database)
```env
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 2. **Add REDIS_URL** (Cache)
```env
REDIS_URL=redis://localhost:6379
# Or for production:
REDIS_URL=redis://username:password@your-redis-host:6379
```

### 3. **Add NEXT_PUBLIC_SENTRY_DSN** (Error Monitoring)
```env
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

### 4. **Add NEXT_PUBLIC_APP_URL** (Application URL)
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
# For production:
NEXT_PUBLIC_APP_URL=https://lionspace.com
```

### 5. **Add CORS_ALLOWED_ORIGINS** (Security)
```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://lionspace.com
```

### 6. **Add CSP_REPORT_URI** (Content Security Policy)
```env
CSP_REPORT_URI=https://your-csp-report-endpoint.com/report
```

### 7. **Add NEXT_PUBLIC_CDN_DOMAIN** (CDN)
```env
NEXT_PUBLIC_CDN_DOMAIN=cdn.lionspace.com
```

## 🚀 Quick Setup

### Step 1: Create .env.local
```bash
cd apps/web
cp .env.example .env.local
```

### Step 2: Fill in your values
Edit `.env.local` with your actual values:

```env
# Database (Neon)
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require

# Redis Cache
REDIS_URL=redis://localhost:6379

# Sentry Error Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Security
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://lionspace.com
CSP_REPORT_URI=https://your-csp-report-endpoint.com/report

# CDN
NEXT_PUBLIC_CDN_DOMAIN=cdn.lionspace.com
```

### Step 3: Validate configuration
```bash
pnpm run validate:env
```

## 🔍 Where These Variables Are Used

### 1. **DATABASE_URL**
- **File**: `apps/web/lib/env.ts`
- **Usage**: PostgreSQL database connection
- **Required**: Yes (for production)

### 2. **REDIS_URL**
- **File**: `apps/web/lib/env.ts`
- **Usage**: Redis cache connection
- **Required**: No (optional for caching)

### 3. **NEXT_PUBLIC_SENTRY_DSN**
- **Files**: 
  - `apps/web/sentry.client.config.ts`
  - `apps/web/sentry.edge.config.ts`
  - `apps/web/next.config.js`
- **Usage**: Error monitoring and reporting
- **Required**: No (optional for monitoring)

### 4. **NEXT_PUBLIC_APP_URL**
- **Files**:
  - `apps/web/lib/env.ts`
  - `apps/web/lib/security/headers.ts`
- **Usage**: Application base URL for CORS and security
- **Required**: Yes (for production)

### 5. **CORS_ALLOWED_ORIGINS**
- **Files**:
  - `apps/web/lib/security/index.ts`
  - `apps/web/lib/security/headers.ts`
- **Usage**: CORS policy configuration
- **Required**: Yes (for security)

### 6. **CSP_REPORT_URI**
- **File**: `apps/web/lib/security/index.ts`
- **Usage**: Content Security Policy violation reporting
- **Required**: No (optional for security monitoring)

### 7. **NEXT_PUBLIC_CDN_DOMAIN**
- **File**: `apps/web/lib/image-loader.ts`
- **Usage**: CDN domain for static assets
- **Required**: No (optional for performance)

## 🛠️ Service Setup Instructions

### 1. **Neon Database Setup**
1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string
4. Add to `DATABASE_URL`

### 2. **Redis Setup**
```bash
# Local development
docker run -d -p 6379:6379 redis:alpine

# Or use Redis Cloud
# Sign up at https://redis.com/
```

### 3. **Sentry Setup**
1. Go to [Sentry](https://sentry.io/)
2. Create a new project
3. Copy the DSN
4. Add to `NEXT_PUBLIC_SENTRY_DSN`

### 4. **CDN Setup**
1. Set up a CDN service (Cloudflare, AWS CloudFront, etc.)
2. Configure your domain
3. Add to `NEXT_PUBLIC_CDN_DOMAIN`

## 🔒 Security Notes

- **Never commit** `.env.local` to version control
- **Use strong passwords** for all services
- **Rotate secrets** regularly
- **Test in staging** before production

## 📚 Additional Resources

- [Secrets Management Guide](docs/SECRETS_MANAGEMENT.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [Developer Guide](docs/DEVELOPER_GUIDE.md)

## 🆘 Troubleshooting

### Common Issues

1. **Database connection fails**
   - Check `DATABASE_URL` format
   - Verify Neon project is active
   - Check SSL mode

2. **Redis connection fails**
   - Verify Redis is running
   - Check `REDIS_URL` format
   - Test connection: `redis-cli ping`

3. **Sentry not working**
   - Verify DSN format
   - Check project configuration
   - Test error reporting

4. **CORS errors**
   - Check `CORS_ALLOWED_ORIGINS` format
   - Verify domain is included
   - Check browser console

### Validation Commands

```bash
# Check environment variables
pnpm run validate:env

# Test database connection
pnpm run test:db

# Test Redis connection
pnpm run test:redis

# Check all services
pnpm run health:check
```

---

**Last Updated**: January 11, 2025  
**Version**: 1.0.0


