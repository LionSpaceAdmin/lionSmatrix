# Dev Container Best Practices for Next.js 15.5.2 with Turborepo Monorepo

This guide provides production-ready configurations for Next.js 15.5.2 development containers with Turborepo monorepo support, optimized for performance and featuring specific Apple Silicon optimizations for 2025 development workflows.

## Production-ready devcontainer.json configuration

The optimal Dev Container setup for Next.js 15.5.2 leverages Node.js 22's improved performance features while maintaining compatibility with Turborepo's monorepo architecture. Here's a comprehensive configuration that balances development speed with production readiness:

```json
{
  "name": "Next.js 15.5.2 Turborepo Monorepo",
  "build": {
    "dockerfile": "Dockerfile",
    "args": {
      "NODE_VERSION": "22",
      "PNPM_VERSION": "9.1.0"
    }
  },
  
  "features": {
    "ghcr.io/devcontainers/features/docker-in-docker:2": {},
    "ghcr.io/devcontainers/features/git:1": {
      "version": "latest"
    }
  },

  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "bradlc.vscode-tailwindcss",
        "dsznajder.es7-react-js-snippets",
        "formulahendry.auto-rename-tag",
        "iJS.reactnextjssnippets"
      ],
      "settings": {
        "typescript.preferences.preferTypeOnlyAutoImports": true,
        "editor.codeActionsOnSave": {
          "source.fixAll.eslint": "explicit"
        },
        "editor.formatOnSave": true,
        "turbo.useLocalTurbo": true
      }
    }
  },

  "forwardPorts": [3000, 3001, 3002],
  "portsAttributes": {
    "3000": {
      "label": "Next.js App",
      "onAutoForward": "openPreview"
    }
  },

  "containerEnv": {
    "NEXT_TELEMETRY_DISABLED": "1",
    "TURBO_TELEMETRY_DISABLED": "1",
    "WATCHPACK_POLLING": "true",
    "NODE_OPTIONS": "--max-old-space-size=4096"
  },

  "mounts": [
    "source=${localWorkspaceFolder}/.pnpm-store,target=/usr/local/share/pnpm-store,type=bind,consistency=cached",
    "source=turborepo-cache,target=/workspace/.turbo,type=volume"
  ],

  "postCreateCommand": "corepack enable && pnpm install",
  "postStartCommand": "pnpm dev",
  
  "remoteUser": "node"
}
```

## Docker configuration with automatic dev server

The Docker setup uses a multi-stage build pattern optimized for both development and production, with Node.js 22 and pnpm integration for maximum performance:

```dockerfile
# syntax=docker/dockerfile:1
FROM node:22-slim AS base

# Enable corepack for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Development stage with hot reload support
FROM base AS development

# Install system dependencies for Next.js development
RUN apt-get update && apt-get install -y \
    git curl wget ca-certificates \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Configure pnpm for containers
ARG PNPM_VERSION=9.1.0
RUN corepack prepare pnpm@${PNPM_VERSION} --activate
RUN pnpm config set store-dir /usr/local/share/pnpm-store

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY turbo.json ./

# Install dependencies with cache mount
RUN --mount=type=cache,id=pnpm,target=/usr/local/share/pnpm-store \
    pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Development environment variables
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV WATCHPACK_POLLING=true

EXPOSE 3000

# Start development server
CMD ["pnpm", "dev"]

# Production build stage
FROM base AS builder
COPY package.json pnpm-lock.yaml* ./
RUN --mount=type=cache,id=pnpm,target=/usr/local/share/pnpm-store \
    pnpm install --frozen-lockfile --prod
COPY . .
RUN pnpm build

# Production runtime
FROM node:22-slim AS production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

WORKDIR /app

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

### Docker Compose for development

```yaml
version: '3.8'

services:
  nextjs-dev:
    build:
      context: .
      dockerfile: Dockerfile
      target: development
    container_name: nextjs-turborepo-dev
    ports:
      - "3000:3000"
      - "3001:3001"
      - "3002:3002"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
      - pnpm-store:/usr/local/share/pnpm-store
      - turbo-cache:/app/.turbo
    environment:
      - NODE_ENV=development
      - NEXT_TELEMETRY_DISABLED=1
      - WATCHPACK_POLLING=true
      - CHOKIDAR_USEPOLLING=true
    command: pnpm dev
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  pnpm-store:
  turbo-cache:
```

## Essential VS Code/Cursor extensions (minimal set)

The following six extensions provide comprehensive Next.js development support without bloat:

1. **ESLint** (`dbaeumer.vscode-eslint`) - Integrates Next.js 15's built-in ESLint configuration with real-time linting
2. **Prettier** (`esbenp.prettier-vscode`) - Automatic code formatting with save-on-format for consistent code style
3. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) - Essential for Next.js App Router's static CSS generation
4. **ES7+ React Snippets** (`dsznajder.es7-react-js-snippets`) - Productivity snippets for React development
5. **Auto Rename Tag** (`formulahendry.auto-rename-tag`) - Automatically renames paired JSX tags
6. **Next.js React Snippets** (`iJS.reactnextjssnippets`) - Next.js specific snippets for App Router and Server Components

## Hot reload configuration for containers

Hot reload requires specific configuration to work reliably inside containers. The key is enabling polling for file changes and configuring webpack appropriately:

### next.config.js configuration

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // Enable Turbopack for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
      }
    },
    // Cache Server Components during HMR
    serverComponentsHmrCache: process.env.NODE_ENV === 'development'
  },
  
  // Hot reload configuration for containers
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config) => {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay before rebuilding
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      }
      return config
    }
  })
}

module.exports = nextConfig
```

### Environment variables for file watching

```bash
# Essential for containers
WATCHPACK_POLLING=true
CHOKIDAR_USEPOLLING=true
CHOKIDAR_INTERVAL=2000

# For Windows WSL2 users
WDS_SOCKET_HOST=127.0.0.1
```

## Node.js 22 and pnpm best practices

Node.js 22 brings significant performance improvements that benefit containerized development. Here are the key optimizations:

### pnpm configuration (.npmrc)

```ini
# Container-optimized pnpm settings
shamefully-hoist=false
prefer-workspace-packages=true
prefer-offline=true
store-dir=/usr/local/share/pnpm-store
package-import-method=copy
side-effects-cache=true
```

### Turborepo configuration (turbo.json)

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"],
      "env": ["NODE_ENV", "NEXT_PUBLIC_*"]
    },
    "dev": {
      "cache": false,
      "persistent": true,
      "env": ["NODE_ENV", "NEXT_PUBLIC_*"]
    },
    "lint": {
      "dependsOn": ["^build"],
      "inputs": ["src/**/*.{ts,tsx,js,jsx}"]
    }
  },
  "globalEnv": ["NODE_ENV", "CI"],
  "globalPassThroughEnv": ["VERCEL", "VERCEL_ENV"]
}
```

### Memory optimization for Node.js 22

```json
{
  "containerEnv": {
    "NODE_OPTIONS": "--max-old-space-size=4096 --enable-source-maps",
    "NODE_GC_FLAGS": "--expose-gc --optimize-for-size"
  }
}
```

## Port configuration and browser auto-launch

The configuration supports multiple ports for monorepo applications with automatic browser launching:

```json
{
  "forwardPorts": [3000, 3001, 3002, 9229],
  "portsAttributes": {
    "3000": {
      "label": "Main App",
      "onAutoForward": "openPreview",
      "protocol": "http"
    },
    "3001": {
      "label": "Docs Site",
      "onAutoForward": "openBrowserOnce"
    },
    "3002": {
      "label": "Admin Panel",
      "onAutoForward": "silent"
    },
    "9229": {
      "label": "Node Debugger",
      "onAutoForward": "silent"
    }
  },
  "otherPortsAttributes": {
    "onAutoForward": "ignore"
  }
}
```

### Environment variable management

```json
{
  "containerEnv": {
    "NODE_ENV": "development",
    "NEXT_PUBLIC_API_URL": "http://localhost:3000/api",
    "DATABASE_URL": "${localEnv:DATABASE_URL}"
  },
  "secrets": {
    "OPENAI_API_KEY": {
      "description": "OpenAI API key for AI features"
    },
    "DATABASE_URL": {
      "description": "PostgreSQL connection string"
    }
  }
}
```

## Apple Silicon M-series optimizations

Apple Silicon requires specific configurations for optimal performance. The key is using ARM64 native images when possible and configuring Docker appropriately:

### Platform-specific Dockerfile

```dockerfile
# Multi-platform support for Apple Silicon
FROM --platform=$BUILDPLATFORM node:22-slim AS base

# For Apple Silicon optimization
ARG TARGETPLATFORM
ARG BUILDPLATFORM
RUN echo "Building on $BUILDPLATFORM for $TARGETPLATFORM"
```

### Docker Compose for Apple Silicon

```yaml
services:
  nextjs:
    build:
      context: .
      dockerfile: Dockerfile
      platforms:
        - linux/arm64
        - linux/amd64
    volumes:
      - .:/app:delegated  # Use delegated for better performance
    environment:
      - WATCHPACK_POLLING=true
```

### Performance optimizations for M-series Macs

1. **Use ARM64 native images**: Avoid Rosetta emulation when possible
2. **Enable VirtioFS**: In Docker Desktop settings for better file system performance
3. **Volume mount optimization**: Use `:delegated` or `:cached` flags
4. **Resource allocation**: Allocate at least 8GB RAM and 4 CPUs in Docker Desktop

### Docker Desktop settings for Apple Silicon

```json
{
  "runArgs": [
    "--platform=linux/arm64",
    "--memory=8g",
    "--cpus=4"
  ],
  "hostRequirements": {
    "cpus": 4,
    "memory": "8gb",
    "storage": "32gb"
  }
}
```

## Production-ready optimizations summary

The configurations provided implement these key production optimizations:

1. **Multi-stage Docker builds** separate development and production environments
2. **Volume-based caching** for pnpm store and Turborepo cache improves build times
3. **Non-root user execution** enhances security
4. **Resource limits** prevent container resource exhaustion
5. **Polling-based file watching** ensures reliable hot reload across platforms
6. **ARM64 optimization** for Apple Silicon provides native performance
7. **Environment variable separation** between build-time and runtime
8. **Minimal extension set** reduces IDE overhead while maintaining productivity

These configurations provide a solid foundation for Next.js 15.5.2 development with Turborepo monorepos, balancing developer experience with production readiness and performance optimization.