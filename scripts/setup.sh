#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Starting project setup for Lions Matrix environment..."

# Environment check
echo "📋 Environment verification..."
echo "Node.js: $(node -v)"
echo "npm: $(npm -v)" 
echo "pnpm: $(pnpm -v)"
echo "Git: $(git --version)"
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"

# Detect environment
if [[ -n "${CODESPACES:-}" ]]; then
    echo "🌐 Detected GitHub Codespaces environment"
    ENV_TYPE="codespaces"
elif [[ -n "${GITPOD_WORKSPACE_ID:-}" ]]; then
    echo "🌐 Detected Gitpod environment"
    ENV_TYPE="gitpod"
else
    echo "💻 Detected local development environment"
    ENV_TYPE="local"
fi

# Install dependencies with frozen lockfile (recommended for CI/production)
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

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Available development commands:"
echo "  pnpm dev          - Start development server"
echo "  pnpm dev:open     - Start dev server + open browser (local)"
echo "  pnpm dev:auto     - Smart dev server with auto browser detection"
echo "  pnpm storybook:open - Start Storybook + open browser"
echo ""

# Ask if user wants to start dev server
read -p "🚀 Would you like to start the development server with auto browser opening? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌟 Starting development server with automatic browser opening..."
    pnpm dev:auto
else
    echo "👍 Setup complete! Run 'pnpm dev:auto' when ready to start developing."
fi