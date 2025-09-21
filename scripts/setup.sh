#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Starting project setup..."

# Check Node.js version
echo "📋 Checking Node.js version..."
node -v || { echo "❌ Node.js not found"; exit 1; }

# Check pnpm version
echo "📋 Checking pnpm version..."
pnpm -v || { echo "❌ pnpm not found"; exit 1; }

# Install dependencies with frozen lockfile
echo "📦 Installing dependencies..."
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

echo "🎉 Setup completed successfully!"