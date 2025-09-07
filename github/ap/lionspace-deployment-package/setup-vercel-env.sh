#!/bin/bash

# Vercel Environment Variables Setup Script
# ==========================================

echo "🚀 Setting up Vercel Environment Variables..."

# First, link to your project (if not already linked)
echo "📎 Linking to Vercel project..."
vercel link

# Add environment variables
echo "🔧 Adding environment variables..."

# Google Cloud
vercel env add GOOGLE_CLOUD_PROJECT production <<< "lionspace"
vercel env add GOOGLE_CLOUD_PROJECT preview <<< "lionspace"
vercel env add GOOGLE_CLOUD_PROJECT development <<< "lionspace"

# OAuth
vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID production <<< "707897822334-64mvh2c58cffh1qq60i3005jc9a6cop7.apps.googleusercontent.com"
vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID preview <<< "707897822334-64mvh2c58cffh1qq60i3005jc9a6cop7.apps.googleusercontent.com"
vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID development <<< "707897822334-64mvh2c58cffh1qq60i3005jc9a6cop7.apps.googleusercontent.com"

vercel env add GOOGLE_CLIENT_SECRET production <<< "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"
vercel env add GOOGLE_CLIENT_SECRET preview <<< "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"
vercel env add GOOGLE_CLIENT_SECRET development <<< "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"

# Gemini API
vercel env add GEMINI_API_KEY production <<< "AIzaSyAPuNElhrPLMKrZVEKoxNu6_Cwn_FFXoAg"
vercel env add GEMINI_API_KEY preview <<< "AIzaSyAPuNElhrPLMKrZVEKoxNu6_Cwn_FFXoAg"
vercel env add GEMINI_API_KEY development <<< "AIzaSyAPuNElhrPLMKrZVEKoxNu6_Cwn_FFXoAg"

# NextAuth
vercel env add NEXTAUTH_URL production <<< "https://www.lionsofzion.io"
vercel env add NEXTAUTH_URL preview <<< "https://www.lionsofzion.io"
vercel env add NEXTAUTH_URL development <<< "http://localhost:3000"

# Generate NEXTAUTH_SECRET
echo "🔐 Generating NEXTAUTH_SECRET..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
vercel env add NEXTAUTH_SECRET production <<< "$NEXTAUTH_SECRET"
vercel env add NEXTAUTH_SECRET preview <<< "$NEXTAUTH_SECRET"
vercel env add NEXTAUTH_SECRET development <<< "$NEXTAUTH_SECRET"

echo "✅ Generated NEXTAUTH_SECRET: $NEXTAUTH_SECRET"

# Environment
vercel env add NODE_ENV production <<< "production"
vercel env add NODE_ENV preview <<< "preview"
vercel env add NODE_ENV development <<< "development"

echo "✅ All environment variables have been set!"

# List all env vars to confirm
echo "📋 Current environment variables:"
vercel env ls

echo "🚀 Ready to deploy! Run: vercel --prod"