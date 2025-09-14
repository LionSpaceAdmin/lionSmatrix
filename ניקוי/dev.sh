#!/bin/bash

# 🦁 LionSpace Development Launcher
# =================================

echo "🦁 Starting LionSpace Development..."

# Load environment
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Create directories
mkdir -p logs logs/browser logs/crashes

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    echo "Loading nvm..."
    nvm use --lts
fi

# Kill existing processes
echo -e "${YELLOW}Cleaning up...${NC}"
pkill -f "next dev" 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in project directory${NC}"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -d "apps/web/node_modules" ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
    cd apps/web && npm install && cd ../..
fi

# Start Next.js
echo -e "${BLUE}🚀 Starting Next.js server...${NC}"
cd apps/web
npm run dev 2>&1 | tee ../../logs/next.log &
NEXT_PID=$!
cd ../..

# Wait for server
echo -e "${YELLOW}⏳ Waiting for server...${NC}"
COUNT=0
while ! curl -s http://localhost:3000 > /dev/null 2>&1; do
    sleep 1
    COUNT=$((COUNT+1))
    if [ $COUNT -gt 30 ]; then
        echo -e "${RED}❌ Server failed to start${NC}"
        cat logs/next.log
        exit 1
    fi
done

echo -e "${GREEN}✅ Server is running!${NC}"

# Open browser with DevTools
echo -e "${BLUE}🌐 Opening Chrome with DevTools...${NC}"
open -a "Google Chrome" http://localhost:3000 \
    --args \
    --auto-open-devtools-for-tabs \
    --enable-logging \
    --v=1

echo ""
echo -e "${GREEN}✅ LionSpace is running at http://localhost:3000${NC}"
echo ""
echo "📊 Logs: tail -f logs/next.log"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"

# Trap Ctrl+C
trap 'echo -e "\n${YELLOW}Stopping...${NC}"; kill $NEXT_PID 2>/dev/null; exit 0' INT

# Wait
wait $NEXT_PID