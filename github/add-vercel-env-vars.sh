#!/bin/bash

TOKEN="JFeW7iNtX4Df366VOpQbw9Yw"
PROJECT_ID="prj_LwPFmHxwerfCSbJbDFi5R248IaIr"

echo "🚀 Adding environment variables to Vercel project..."

# Function to add env var
add_env_var() {
    local key=$1
    local value=$2
    local target=$3
    
    echo "Adding $key to $target..."
    curl -X POST "https://api.vercel.com/v10/projects/$PROJECT_ID/env" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"key\": \"$key\",
            \"value\": \"$value\",
            \"type\": \"encrypted\",
            \"target\": [\"$target\"]
        }" 2>/dev/null | jq -r '.key' 2>/dev/null
}

# Add all environment variables
echo "📦 Adding GOOGLE_CLOUD_PROJECT..."
add_env_var "GOOGLE_CLOUD_PROJECT" "lionspace" "production"
add_env_var "GOOGLE_CLOUD_PROJECT" "lionspace" "preview"
add_env_var "GOOGLE_CLOUD_PROJECT" "lionspace" "development"

echo "🔐 Adding NEXT_PUBLIC_GOOGLE_CLIENT_ID..."
add_env_var "NEXT_PUBLIC_GOOGLE_CLIENT_ID" "707897822334-64mvh2c58cffh1qq60i3005jc9a6cop7.apps.googleusercontent.com" "production"
add_env_var "NEXT_PUBLIC_GOOGLE_CLIENT_ID" "707897822334-64mvh2c58cffh1qq60i3005jc9a6cop7.apps.googleusercontent.com" "preview"
add_env_var "NEXT_PUBLIC_GOOGLE_CLIENT_ID" "707897822334-64mvh2c58cffh1qq60i3005jc9a6cop7.apps.googleusercontent.com" "development"

echo "🔑 Adding GOOGLE_CLIENT_SECRET..."
add_env_var "GOOGLE_CLIENT_SECRET" "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" "production"
add_env_var "GOOGLE_CLIENT_SECRET" "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" "preview"
add_env_var "GOOGLE_CLIENT_SECRET" "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" "development"

echo "🤖 Adding GEMINI_API_KEY..."
add_env_var "GEMINI_API_KEY" "AIzaSyAPuNElhrPLMKrZVEKoxNu6_Cwn_FFXoAg" "production"
add_env_var "GEMINI_API_KEY" "AIzaSyAPuNElhrPLMKrZVEKoxNu6_Cwn_FFXoAg" "preview"
add_env_var "GEMINI_API_KEY" "AIzaSyAPuNElhrPLMKrZVEKoxNu6_Cwn_FFXoAg" "development"

echo "🌐 Adding NEXTAUTH_URL..."
add_env_var "NEXTAUTH_URL" "https://www.lionsofzion.io" "production"
add_env_var "NEXTAUTH_URL" "https://www.lionsofzion.io" "preview"
add_env_var "NEXTAUTH_URL" "http://localhost:3000" "development"

echo "🔐 Generating and adding NEXTAUTH_SECRET..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
add_env_var "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET" "production"
add_env_var "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET" "preview"
add_env_var "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET" "development"

echo "📝 Adding NODE_ENV..."
add_env_var "NODE_ENV" "production" "production"
add_env_var "NODE_ENV" "preview" "preview"
add_env_var "NODE_ENV" "development" "development"

echo ""
echo "✅ All environment variables have been added!"
echo "🔐 Generated NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
echo ""
echo "📝 Save this NEXTAUTH_SECRET in a secure place!"