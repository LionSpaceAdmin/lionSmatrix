# syntax=docker/dockerfile:1
# Lions of Zion - Next.js 15.5.2 Production Dockerfile

# Base image with Node.js 22
FROM --platform=$BUILDPLATFORM node:22-slim AS base

# Enable corepack for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Configure pnpm
ARG PNPM_VERSION=9.1.0
RUN corepack prepare pnpm@${PNPM_VERSION} --activate

# Dependencies stage
FROM base AS deps

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml* ./
COPY pnpm-workspace.yaml* ./

# Copy all package.json files from workspace
COPY apps/web/package.json ./apps/web/
COPY packages/*/package.json ./packages/*/

# Install dependencies with cache mount
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod=false

# Builder stage
FROM base AS builder

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules

# Copy source code
COPY . .

# Copy environment variables for build
ARG NEXT_PUBLIC_APP_ENV=production
ARG NEXT_PUBLIC_PLATFORM_NAME="Lions of Zion"
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SUPPORTED_LOCALES="en,he,es,fr,de,ar"
ARG NEXT_PUBLIC_DEFAULT_LOCALE="en"

ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV
ENV NEXT_PUBLIC_PLATFORM_NAME=$NEXT_PUBLIC_PLATFORM_NAME
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SUPPORTED_LOCALES=$NEXT_PUBLIC_SUPPORTED_LOCALES
ENV NEXT_PUBLIC_DEFAULT_LOCALE=$NEXT_PUBLIC_DEFAULT_LOCALE

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1
ENV TURBO_TELEMETRY_DISABLED=1

# Build the application
RUN pnpm build --filter=web

# Production runtime stage
FROM node:22-slim AS runner

# Create nextjs user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

WORKDIR /app

# Copy runtime dependencies
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Install curl for health check
RUN apt-get update && apt-get install -y curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

USER nextjs

EXPOSE 3000

# Start the application
CMD ["node", "apps/web/server.js"]