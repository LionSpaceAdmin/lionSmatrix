#!/bin/bash

# 🦁 LionSpace Development Launcher
# ==================================

echo "🦁 Starting LionSpace Development Environment..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Create logs directory
mkdir -p logs logs/browser logs/crashes

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "Google Chrome" 2>/dev/null || true

# Function to wait for server
wait_for_server() {
    echo -e "${YELLOW}⏳ Waiting for Next.js server to start...${NC}"
    while ! curl -s http://localhost:3000 > /dev/null 2>&1; do
        sleep 1
    done
    echo -e "${GREEN}✅ Server is ready!${NC}"
}

# Start Next.js in background
echo -e "${BLUE}🚀 Starting Next.js server...${NC}"
cd apps/web
npm run dev 2>&1 | tee ../../logs/next.log &
NEXT_PID=$!

# Wait for server to be ready
wait_for_server

# Open Chrome with DevTools and logging
echo -e "${BLUE}🌐 Opening Chrome with DevTools...${NC}"
open -a "Google Chrome" http://localhost:3000 \
    --args \
    --auto-open-devtools-for-tabs \
    --enable-logging \
    --v=1 \
    --enable-crash-reporter \
    --crash-dumps-dir=$(pwd)/logs/crashes \
    --log-level=0 \
    --enable-automation \
    2>&1 | tee logs/browser/chrome.log &

echo -e "${GREEN}✅ LionSpace is running!${NC}"
echo ""
echo "📊 Logs:"
echo "  Next.js: logs/next.log"
echo "  Browser: logs/browser/chrome.log"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
trap 'echo "Stopping..."; kill $NEXT_PID; pkill -f "Google Chrome"; exit 0' INT
wait $NEXT_PID