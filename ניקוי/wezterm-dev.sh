#!/bin/bash

# 🦁 LionSpace WezTerm Development Launcher
# ==========================================

echo "🦁 Starting LionSpace with WezTerm..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in lionspace-platform directory${NC}"
    echo "Please run from: ~/Development/lionspace-platform"
    exit 1
fi

# Create logs directory
mkdir -p logs logs/browser logs/crashes

# Kill existing processes
echo -e "${YELLOW}🧹 Cleaning up existing processes...${NC}"
pkill -f "next dev" 2>/dev/null || true
pkill -f "node" 2>/dev/null || true
pkill -f "Google Chrome" 2>/dev/null || true

# Function to open WezTerm with command
open_wezterm() {
    local title=$1
    local cmd=$2
    
    /Applications/WezTerm.app/Contents/MacOS/wezterm cli spawn \
        --new-window \
        --cwd "$(pwd)" \
        -- bash -c "echo '🦁 $title' && $cmd"
}

# Function to wait for server
wait_for_server() {
    echo -e "${YELLOW}⏳ Waiting for Next.js server...${NC}"
    local count=0
    while ! curl -s http://localhost:3000 > /dev/null 2>&1; do
        sleep 1
        count=$((count+1))
        if [ $count -gt 60 ]; then
            echo -e "${RED}❌ Server failed to start after 60 seconds${NC}"
            exit 1
        fi
    done
    echo -e "${GREEN}✅ Server is ready!${NC}"
}

# Start Next.js in WezTerm
echo -e "${BLUE}🚀 Starting Next.js in WezTerm...${NC}"
/Applications/WezTerm.app/Contents/MacOS/wezterm start \
    --cwd "$(pwd)/apps/web" \
    -- bash -c "echo '🦁 LionSpace Next.js Server' && npm run dev 2>&1 | tee ../../logs/next.log" &

WEZTERM_PID=$!

# Wait for server
wait_for_server

# Open Chrome with DevTools
echo -e "${BLUE}🌐 Opening Chrome with DevTools...${NC}"
open -a "Google Chrome" http://localhost:3000 \
    --args \
    --auto-open-devtools-for-tabs \
    --enable-logging \
    --v=1 \
    --enable-crash-reporter \
    --crash-dumps-dir="$(pwd)/logs/crashes" \
    --log-level=0 \
    --enable-automation &

# Start browser monitor in another WezTerm tab
echo -e "${BLUE}👁️ Starting browser monitor...${NC}"
/Applications/WezTerm.app/Contents/MacOS/wezterm cli spawn \
    --cwd "$(pwd)" \
    -- bash -c "./browser-monitor.sh" &

echo ""
echo -e "${GREEN}✅ LionSpace is running!${NC}"
echo ""
echo "📊 Windows opened:"
echo "  • WezTerm: Next.js server"
echo "  • WezTerm: Browser monitor"
echo "  • Chrome: http://localhost:3000 with DevTools"
echo ""
echo "📁 Logs location:"
echo "  • Next.js: logs/next.log"
echo "  • Browser: logs/browser/"
echo "  • Crashes: logs/crashes/"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Trap exit signal
trap 'echo -e "\n${YELLOW}Stopping all services...${NC}"; pkill -f "next dev"; pkill -f "wezterm"; pkill -f "Google Chrome"; exit 0' INT

# Keep script running
while true; do
    sleep 1
done