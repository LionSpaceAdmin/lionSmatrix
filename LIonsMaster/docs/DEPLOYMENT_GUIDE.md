# Lions of Zion - Deployment Guide

## 📋 Pre-Deployment Checklist

### Environment Setup
- [ ] All environment variables configured
- [ ] API endpoints verified
- [ ] Database connections tested
- [ ] Third-party services configured
- [ ] SSL certificates ready
- [ ] Domain names configured

### Code Quality
- [ ] All tests passing
- [ ] No console errors
- [ ] TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Bundle size optimized
- [ ] Images optimized

### Security
- [ ] Environment variables secured
- [ ] API keys rotated
- [ ] CORS configured
- [ ] CSP headers set
- [ ] Rate limiting enabled
- [ ] Input validation complete

## 🚀 Deployment Options

### 1. Vercel (Recommended)

#### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lions-of-zion/platform)

#### Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Environment Variables in Vercel
1. Go to Project Settings → Environment Variables
2. Add the following:

```env
NEXT_PUBLIC_API_URL=https://api.lionsofzion.com
NEXT_PUBLIC_GEMINI_API_KEY=your-key
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

### 2. Docker Deployment

#### Build Docker Image

```dockerfile
# Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
    depends_on:
      - redis
      - postgres
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: lionsofzion
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  redis_data:
  postgres_data:
```

### 3. AWS Deployment

#### Using AWS Amplify

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure AWS
amplify configure

# Initialize Amplify
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

#### Using EC2 with PM2

```bash
# On EC2 instance
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Clone repository
git clone https://github.com/lions-of-zion/platform.git
cd platform

# Install dependencies
npm ci

# Build application
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'lions-of-zion',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
```

### 4. Kubernetes Deployment

#### Kubernetes Manifests

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lions-of-zion
  labels:
    app: lions-of-zion
spec:
  replicas: 3
  selector:
    matchLabels:
      app: lions-of-zion
  template:
    metadata:
      labels:
        app: lions-of-zion
    spec:
      containers:
      - name: app
        image: lionsofzion/platform:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: NEXT_PUBLIC_API_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: api-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: lions-of-zion-service
spec:
  selector:
    app: lions-of-zion
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

## 🔧 Configuration

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/lionsofzion
server {
    listen 80;
    server_name lionsofzion.com www.lionsofzion.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name lionsofzion.com www.lionsofzion.com;

    ssl_certificate /etc/letsencrypt/live/lionsofzion.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lionsofzion.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # CSP Header
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.lionsofzion.com;" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static assets
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache STATIC;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /static {
        proxy_pass http://localhost:3000;
        proxy_cache STATIC;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

### CDN Configuration (CloudFlare)

1. **DNS Settings**
   - Add A record pointing to your server IP
   - Enable CloudFlare proxy (orange cloud)

2. **Page Rules**
   - `/*` - Cache Level: Standard
   - `/api/*` - Cache Level: Bypass
   - `/_next/static/*` - Cache Level: Cache Everything, Edge Cache TTL: 1 month

3. **Firewall Rules**
   - Rate limiting: 100 requests per minute per IP
   - Block countries: Based on your requirements
   - Challenge suspicious requests

## 📊 Monitoring

### Health Check Endpoint

```typescript
// app/api/health/route.ts
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version
  }
  
  return Response.json(health)
}
```

### Monitoring Setup

#### Sentry

```bash
npm install @sentry/nextjs

npx @sentry/wizard@latest -i nextjs
```

#### DataDog

```javascript
// datadog.config.js
module.exports = {
  apiKey: process.env.DD_API_KEY,
  site: 'datadoghq.com',
  service: 'lions-of-zion',
  env: process.env.NODE_ENV,
  version: process.env.npm_package_version,
  sampleRate: 1.0,
  trackInteractions: true,
  defaultPrivacyLevel: 'mask-user-input'
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use secrets management (AWS Secrets Manager, Vault)
   - Rotate keys regularly

2. **Headers**
   - Set security headers (CSP, HSTS, etc.)
   - Use helmet.js for Express apps
   - Configure CORS properly

3. **Dependencies**
   - Run `npm audit` regularly
   - Use Dependabot for updates
   - Pin dependency versions

4. **Data Protection**
   - Encrypt sensitive data
   - Use HTTPS everywhere
   - Implement rate limiting

## 🚨 Rollback Procedures

### Vercel Rollback
```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Docker Rollback
```bash
# Tag previous version
docker tag app:latest app:rollback

# Deploy previous version
docker-compose down
docker-compose up -d app:rollback
```

### Database Rollback
```bash
# Create backup before deployment
pg_dump lionsofzion > backup_$(date +%Y%m%d).sql

# Rollback if needed
psql lionsofzion < backup_20250110.sql
```

## 📈 Post-Deployment

### Verification Checklist
- [ ] Application loads correctly
- [ ] All routes accessible
- [ ] Authentication working
- [ ] API connections successful
- [ ] Analytics tracking
- [ ] Error monitoring active
- [ ] Performance metrics acceptable
- [ ] SSL certificate valid

### Performance Monitoring
- Set up Lighthouse CI
- Configure Web Vitals tracking
- Monitor server resources
- Set up alerting for issues

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node version
   - Clear cache: `rm -rf .next node_modules`
   - Verify environment variables

2. **Memory Issues**
   - Increase Node memory: `NODE_OPTIONS=--max-old-space-size=4096`
   - Optimize bundle size
   - Implement code splitting

3. **Database Connection**
   - Check connection string
   - Verify network access
   - Check connection pool settings

## 📞 Support

- GitHub Issues: https://github.com/lions-of-zion/platform/issues
- Email: support@lionsofzion.com
- Documentation: https://docs.lionsofzion.com
