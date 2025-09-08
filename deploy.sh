#!/bin/bash
echo "🚀 Starting Vercel deployment..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm i -g vercel
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod --yes

echo "✅ Deployment complete!"
