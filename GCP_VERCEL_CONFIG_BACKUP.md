# GCP-Vercel Configuration Backup

**Created**: September 11, 2025  
**Purpose**: Complete backup of all GCP and Vercel configuration files for agent transfer

---

## 📁 File Index

- [GCP-Vercel Configuration Backup](#gcp-vercel-configuration-backup)
  - [📁 File Index](#-file-index)
  - [1. vercel-config.json](#1-vercel-configjson)
  - [2. vercel-deployment-config.json](#2-vercel-deployment-configjson)
  - [3. vercel-gcp-integration.json](#3-vercel-gcp-integrationjson)
  - [4. gcp-complete-config.json](#4-gcp-complete-configjson)
  - [5. .env.example](#5-envexample)
  - [6. env.ts](#6-envts)
  - [7. Dockerfile](#7-dockerfile)
  - [8. instrumentation.ts](#8-instrumentationts)
  - [🔐 Security Notes](#-security-notes)
  - [📊 Quick Reference](#-quick-reference)
    - [Production URLs](#production-urls)
    - [Key Identifiers](#key-identifiers)
    - [Command Quick Start](#command-quick-start)

---

## 1. vercel-config.json

**Path**: `/keys/vercel-config.json`

```json
{
  "token": "NEEDS_UPDATE - Please copy full token from Vercel dashboard",
  "partial_token": "kHqVTQ8sr6ryaJvskfkRu7wJ",
  "team": "lionsteam",
  "created": "2025-09-03",
  "expires": "2026-09-03",
  "description": "LionSpace Military Intelligence Project - Vercel Deployment Token",
  "note": "DO NOT SHARE - For security reasons this token cannot be shown again",
  "usage": {
    "cli": "vercel --token kHqVTQ8sr6ryaJvskfkRu7wJ",
    "env": "VERCEL_TOKEN=kHqVTQ8sr6ryaJvskfkRu7wJ"
  }
}
```

---

## 2. vercel-deployment-config.json

**Path**: `/keys/vercel-deployment-config.json`

```json
{
  "project": {
    "name": "v0-lion-space",
    "id": "prj_A9mGMawMPyOsvlzyGlLfN83dbC8M",
    "url": "https://vercel.com/lionsteam/v0-lion-space"
  },
  "team": {
    "name": "lionsteam",
    "id": "team_EbX6n8DyqyEcEbQtslv5RO9o"
  },
  "token": {
    "value": "aKeFqGf35EtA7WZdEW0AkaI0",
    "created": "2025-09-03",
    "expires": "2026-09-03"
  },
  "git": {
    "repository": "LionSpaceAdmin/modern-nextjs-app",
    "connected": true,
    "auto_deploy": true
  },
  "deployment": {
    "production_url": "https://v0-lion-space-2u8224ciq-lionsteam.vercel.app",
    "team_url": "https://v0-lion-space-lionsteam.vercel.app",
    "last_deployment": "2025-09-05T11:47:00Z",
    "status": "ready"
  },
  "cli_commands": {
    "deploy": "vercel --token aKeFqGf35EtA7WZdEW0AkaI0 --scope lionsteam",
    "list": "vercel ls --token aKeFqGf35EtA7WZdEW0AkaI0 --scope lionsteam",
    "logs": "vercel logs v0-lion-space --token aKeFqGf35EtA7WZdEW0AkaI0 --scope lionsteam"
  }
}
```

---

## 3. vercel-gcp-integration.json

**Path**: `/keys/vercel-gcp-integration.json`

```json
{
  "integration": "Vercel + GCP LionSpace Project",
  "created": "2025-09-03",
  "vercel": {
    "project": "v0-lion-space",
    "team": "lionsteam",
    "github_repo": "LionSpaceAdmin/modern-nextjs-app",
    "production_url": "https://v0-lion-space.vercel.app",
    "environment_variables": {
      "GOOGLE_CLOUD_PROJECT": "lionspace",
      "NEXT_PUBLIC_GOOGLE_CLIENT_ID": "707897822334-f9a3fi3kfacnsrjpqt48k38lcqdvan1g.apps.googleusercontent.com",
      "NEXT_PUBLIC_API_URL": "https://lionspace-backend-707897822334.us-east1.run.app",
      "GOOGLE_CLIENT_SECRET": "[ENCRYPTED]"
    }
  },
  "gcp": {
    "project_id": "lionspace",
    "project_number": "707897822334",
    "billing_account": "hanudani@gmail.com",
    "region": "us-east1",
    "services": {
      "cloud_run": {
        "backend": "https://lionspace-backend-707897822334.us-east1.run.app",
        "frontend": "https://lionspace-frontend-707897822334.us-east1.run.app"
      },
      "oauth": {
        "client_id": "707897822334-f9a3fi3kfacnsrjpqt48k38lcqdvan1g.apps.googleusercontent.com",
        "redirect_uris": [
          "https://lionsofzion.online/api/auth/callback/google",
          "https://v0-lion-space.vercel.app/api/auth/callback/google"
        ]
      }
    }
  },
  "deployment_flow": {
    "frontend": {
      "platform": "Vercel",
      "auto_deploy": "on push to main branch",
      "build_command": "npm run build",
      "output_directory": ".next"
    },
    "backend": {
      "platform": "GCP Cloud Run",
      "deploy_command": "gcloud run deploy lionspace-backend --source . --region us-east1",
      "service_account": "superadmin-sa@lionspace.iam.gserviceaccount.com"
    }
  },
  "commands": {
    "deploy_frontend": "vercel --prod --scope lionsteam",
    "deploy_backend": "gcloud run deploy lionspace-backend --source . --region us-east1 --account hanudani@gmail.com",
    "setup_domain": "vercel domains add lionsofzion.online --scope lionsteam",
    "check_status": "vercel ls --scope lionsteam && gcloud run services list --region us-east1"
  }
}
```

---

## 4. gcp-complete-config.json

**Path**: `/keys/gcp-complete-config.json`

```json
{
  "project": {
    "id": "lionspace",
    "number": "707897822334",
    "name": "LionSpace",
    "region": "us-east1",
    "zone": "us-east1-b",
    "billing": {
      "account": "hanudani@gmail.com",
      "type": "personal_credits",
      "note": "IMPORTANT: Billing must use personal account credits, NOT organizational account"
    }
  },
  "accounts": {
    "organizational": {
      "email": "admin@lionsofzion-official.org",
      "type": "workspace_admin",
      "description": "Organizational Workspace Admin Account",
      "status": "active",
      "credentials_path": "~/.config/gcloud/legacy_credentials/admin@lionsofzion-official.org"
    },
    "personal": {
      "email": "hanudani@gmail.com",
      "type": "personal",
      "description": "Personal development account with GCP credits",
      "status": "active",
      "billing": "PRIMARY - Uses personal GCP credits"
    }
  },
  "service_accounts": {
    "superadmin": {
      "email": "superadmin-sa@lionspace.iam.gserviceaccount.com",
      "name": "SuperAdmin Service Account",
      "roles": [
        "roles/owner",
        "roles/iam.serviceAccountAdmin",
        "roles/storage.admin",
        "roles/run.admin",
        "roles/cloudsql.admin"
      ],
      "key_file": "lionspace-superadmin-sa-key.json"
    },
    "deployment": {
      "email": "deployment-sa@lionspace.iam.gserviceaccount.com",
      "name": "Deployment Service Account",
      "roles": ["roles/run.developer", "roles/storage.objectAdmin", "roles/cloudbuild.builds.editor"]
    }
  },
  "apis_enabled": [
    "compute.googleapis.com",
    "run.googleapis.com",
    "cloudbuild.googleapis.com",
    "storage.googleapis.com",
    "iam.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "oauth2.googleapis.com"
  ],
  "cloud_run_services": {
    "backend": {
      "name": "lionspace-backend",
      "url": "https://lionspace-backend-707897822334.us-east1.run.app",
      "region": "us-east1",
      "memory": "2Gi",
      "cpu": "2",
      "min_instances": 0,
      "max_instances": 10
    },
    "frontend": {
      "name": "lionspace-frontend",
      "url": "https://lionspace-frontend-707897822334.us-east1.run.app",
      "region": "us-east1",
      "memory": "1Gi",
      "cpu": "1",
      "min_instances": 0,
      "max_instances": 5
    }
  },
  "oauth_config": {
    "client_id": "707897822334-f9a3fi3kfacnsrjpqt48k38lcqdvan1g.apps.googleusercontent.com",
    "project_id": "lionspace",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "redirect_uris": [
      "https://lionsofzion.online/api/auth/callback/google",
      "https://v0-lion-space.vercel.app/api/auth/callback/google",
      "http://localhost:3000/api/auth/callback/google"
    ],
    "javascript_origins": ["https://lionsofzion.online", "https://v0-lion-space.vercel.app", "http://localhost:3000"]
  },
  "commands": {
    "switch_to_personal": "gcloud config set account hanudani@gmail.com && gcloud config set project lionspace",
    "switch_to_org": "gcloud config set account admin@lionsofzion-official.org && gcloud config set project lionspace",
    "deploy_backend": "gcloud run deploy lionspace-backend --source . --region us-east1 --account hanudani@gmail.com",
    "view_logs": "gcloud logs read --project=lionspace --limit=50",
    "list_services": "gcloud run services list --region us-east1"
  }
}
```

---

## 5. .env.example

**Path**: `/apps/web/.env.example`

```bash
# ===============================================
# 🏢 LIONSPACE ENTERPRISE CONFIGURATION
# ===============================================
# NextJS Enterprise Application Environment Variables
# This file contains all environment variables for development
# Copy to .env.local and fill in your actual values

# ===============================================
# 🗄️ DATABASE CONFIGURATION
# ===============================================
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lionspace_dev"
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres"
POSTGRES_DB="lionspace_dev"
NEXT_PUBLIC_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lionspace_dev"

# ===============================================
# 🚀 VERCEL PRO CONFIGURATION
# ===============================================
VERCEL_TOKEN=""                    # Your Vercel API token
VERCEL_ORG_ID=""                   # Your Vercel organization ID
VERCEL_PROJECT_ID=""               # Your Vercel project ID
VERCEL_URL=""                      # Your Vercel app URL
VERCEL_ENV="development"           # development | preview | production

# ===============================================
# 🤖 GITHUB PRO CONFIGURATION
# ===============================================
GITHUB_TOKEN=""                    # Your GitHub Personal Access Token
GITHUB_USER=""                     # Your GitHub username
GITHUB_CLIENT_ID=""                # GitHub OAuth App Client ID
GITHUB_CLIENT_SECRET=""            # GitHub OAuth App Client Secret

# ===============================================
# 🔐 NEXTAUTH.JS CONFIGURATION
# ===============================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""                 # Generate: openssl rand -base64 32
AUTH_SECRET=""                     # Same as NEXTAUTH_SECRET

# ===============================================
# 📧 EMAIL CONFIGURATION (Mailhog in Dev)
# ===============================================
EMAIL_FROM="noreply@lionspace.dev"
SMTP_HOST="localhost"
SMTP_PORT="1025"
SMTP_USER=""
SMTP_PASSWORD=""

# ===============================================
# 🧪 TESTING CONFIGURATION
# ===============================================
PLAYWRIGHT_BASE_URL="http://localhost:3000"
PLAYWRIGHT_HEADLESS="true"
TEST_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lionspace_test"

# ===============================================
# 📊 ANALYTICS & MONITORING
# ===============================================
NEXT_PUBLIC_GA_MEASUREMENT_ID=""   # Google Analytics 4
NEXT_PUBLIC_VERCEL_ANALYTICS="true"
NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS="true"

# ===============================================
# 🎨 UI & THEME CONFIGURATION
# ===============================================
NEXT_PUBLIC_APP_NAME="LionSpace Enterprise"
NEXT_PUBLIC_APP_DESCRIPTION="Next.js Enterprise Platform"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ===============================================
# 🔧 DEVELOPMENT CONFIGURATION
# ===============================================
NODE_ENV="development"
NEXT_TELEMETRY_DISABLED="0"        # Set to 1 to disable Next.js telemetry
ANALYZE="false"                    # Set to true to analyze bundle
FORCE_COLOR="1"
NPM_CONFIG_COLOR="always"

# ===============================================
# 🌟 AI & AUTOMATION
# ===============================================
OPENAI_API_KEY=""                  # For AI features (if needed)
ANTHROPIC_API_KEY=""               # For Claude integration (if needed)
NEXT_PUBLIC_GEMINI_API_KEY=""      # Google Gemini API for intelligence analysis
GEMINI_PROJECT_ID=""               # Google Cloud Project ID for Imagen API

# ===============================================
# 📦 PACKAGE MANAGEMENT
# ===============================================
PNPM_HOME="/home/vscode/.local/share/pnpm"
CHOKIDAR_USEPOLLING="true"         # For file watching in containers
WATCHPACK_POLLING="true"           # For webpack file watching

# ===============================================
# 🐳 CONTAINER CONFIGURATION
# ===============================================
DOCKER_BUILDKIT="1"
COMPOSE_DOCKER_CLI_BUILD="1"

# ===============================================
# 🔍 DEBUGGING & LOGGING
# ===============================================
DEBUG="false"
LOG_LEVEL="info"                   # error | warn | info | debug
ENABLE_EXPERIMENTAL_FEATURES="false"

# ===============================================
# 🌐 INTERNATIONALIZATION
# ===============================================
NEXT_PUBLIC_DEFAULT_LOCALE="en"
NEXT_PUBLIC_LOCALES="en,he,ar,es,fr,de,ru,zh"

# ===============================================
# 🧠 REDIS CACHE CONFIGURATION
# ===============================================
REDIS_URL="redis://localhost:6379"
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""
```

---

## 6. env.ts

**Path**: `/apps/web/lib/env.ts`

```typescript
import { z } from "zod"

const server = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),

  // Authentication
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  AUTH_SECRET: z.string().optional(),

  // AI APIs
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

  // Email Configuration
  EMAIL_FROM: z.string().email().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),

  // Analytics
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
  DEBUG: z
    .string()
    .default("false")
    .transform((val) => val === "true"),
  ENABLE_EXPERIMENTAL_FEATURES: z
    .string()
    .default("false")
    .transform((val) => val === "true"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  NEXT_TELEMETRY_DISABLED: z.string().default("1"),
  CHOKIDAR_USEPOLLING: z
    .string()
    .default("false")
    .transform((val) => val === "true"),
  WATCHPACK_POLLING: z
    .string()
    .default("false")
    .transform((val) => val === "true"),
})

const client = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().optional(),
  NEXT_PUBLIC_APP_DESCRIPTION: z.string().optional(),
  NEXT_PUBLIC_VERCEL_ENV: z.string().optional(),
  NEXT_PUBLIC_VERCEL_ANALYTICS: z
    .string()
    .default("true")
    .transform((val) => val === "true"),
  NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS: z
    .string()
    .default("true")
    .transform((val) => val === "true"),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_DATABASE_URL: z.string().optional(),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default("en"),
  NEXT_PUBLIC_LOCALES: z.string().default("en,he,ar,es,fr,de,ru,zh"),
  NEXT_PUBLIC_GEMINI_API_KEY: z.string().optional(),
})

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 */
const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  AUTH_SECRET: process.env.AUTH_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
  GCP_PROJECT_ID: process.env.GCP_PROJECT_ID,
  GCP_REGION: process.env.GCP_REGION,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  DATABASE_URL: process.env.DATABASE_URL,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_PORT: process.env.POSTGRES_PORT,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB: process.env.POSTGRES_DB,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  VERCEL_TOKEN: process.env.VERCEL_TOKEN,
  VERCEL_ORG_ID: process.env.VERCEL_ORG_ID,
  VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,
  // Add other server env vars as needed
}

// Don't add a return type annotation here. That will make it so that if there's an error,
// we don't get a type error in the error below
const merged = server.merge(client)

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ process.env

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === "undefined"

  const parsed = /** @type {MergedSafeParseReturn} */ isServer
    ? merged.safeParse(processEnv) // on server we can validate all env vars
    : client.safeParse(processEnv) // on client we can only validate the ones that are exposed

  if (parsed.success === false) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors)
    throw new Error("Invalid environment variables")
  }

  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined
      // Throw a descriptive error if a server-side env var is accessed on the client
      // Otherweise it'd just be returning `undefined` and be annoying to debug
      if (!isServer && !prop.startsWith("NEXT_PUBLIC_"))
        throw new Error(
          process.env.NODE_ENV === "production"
            ? "❌ Attempted to access a server-side environment variable on the client"
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`
        )
      return target[/** @type {keyof typeof target} */ prop]
    },
  })
}

export { env }
```

---

## 7. Dockerfile

**Path**: `/Dockerfile`

```dockerfile
# Node.js base image
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY turbo.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/*/package*.json ./packages/*/
RUN npm ci

# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

---

## 8. instrumentation.ts

**Path**: `/apps/web/instrumentation.ts`

```typescript
import { registerOTel } from "@vercel/otel"

export function register() {
  registerOTel({
    serviceName: "lionspace-web",
    traceExporter: "otlp-http",
  })
}
```

---

## 🔐 Security Notes

**⚠️ IMPORTANT**: This backup contains sensitive information including:

- API tokens and keys
- Service account credentials
- Project IDs and URLs
- OAuth client information

**Usage Guidelines**:

1. **Never commit this file to version control**
2. **Share only with authorized agents/developers**
3. **Update tokens/keys regularly**
4. **Use secure channels for transmission**

---

## 📊 Quick Reference

### Production URLs

- **Vercel Frontend**: `https://v0-lion-space.vercel.app`
- **GCP Backend**: `https://lionspace-backend-707897822334.us-east1.run.app`
- **Team Dashboard**: `https://vercel.com/lionsteam/v0-lion-space`

### Key Identifiers

- **GCP Project**: `lionspace` (ID: 707897822334)
- **Vercel Team**: `lionsteam`
- **GitHub Repo**: `LionSpaceAdmin/modern-nextjs-app`

### Command Quick Start

```bash
# Deploy to Vercel
vercel --prod --scope lionsteam

# Deploy to GCP
gcloud run deploy lionspace-backend --source . --region us-east1

# Switch GCP account
gcloud config set account hanudani@gmail.com
```

---

**End of Backup**  
_Generated automatically - Last updated: September 11, 2025_
