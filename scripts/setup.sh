#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Starting project setup for Jules environment..."

# Environment check
echo "📋 Environment verification..."
echo "Node.js: $(node -v)"
echo "npm: $(npm -v)" 
echo "pnpm: $(pnpm -v)"
echo "Git: $(git --version)"
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"

# Install dependencies with frozen lockfile (recommended for CI/Jules)
echo "📦 Installing dependencies with frozen lockfile..."
pnpm install --frozen-lockfile

# Build the project
echo "🔨 Building project..."
pnpm build

# Smoke test - verify everything works
echo "✅ Running smoke tests..."
echo "Node.js version: $(node -v)"
echo "pnpm version: $(pnpm -v)"
echo "Linting code..."
pnpm lint || { echo "⚠️  Linting failed but continuing..."; }
echo "TypeScript check..."
pnpm typecheck
echo "Running tests..."
pnpm test

echo "🎉 Setup completed successfully!"