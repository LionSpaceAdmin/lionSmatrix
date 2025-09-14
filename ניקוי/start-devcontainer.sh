#!/bin/bash

# 🦁 LionSpace Dev Container Launcher
# ====================================

echo "🦁 Starting LionSpace Dev Container..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "Install it with: brew install --cask docker"
    exit 1
fi

# Check if Docker is running
if ! docker info &>/dev/null; then
    echo "❌ Docker is not running!"
    echo "Please start Docker Desktop"
    exit 1
fi

echo "✅ Docker is ready"

# Build and start the dev container
echo "🐳 Building Dev Container..."
docker-compose -f .devcontainer/docker-compose.yml build

echo "🚀 Starting Dev Container..."
docker-compose -f .devcontainer/docker-compose.yml up -d

echo ""
echo "✅ Dev Container is running!"
echo ""
echo "📊 Access your app at:"
echo "   http://localhost:3000"
echo ""
echo "🔧 To enter the container:"
echo "   docker exec -it lionspace-dev bash"
echo ""
echo "📋 To view logs:"
echo "   docker logs -f lionspace-dev"
echo ""
echo "🛑 To stop:"
echo "   docker-compose -f .devcontainer/docker-compose.yml down"