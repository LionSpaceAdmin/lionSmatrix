#!/bin/bash

# Lionspace Development Environment Launcher
# Complete integrated launcher with Docker, sync, and monitoring

set -e

# Configuration
PROJECT_NAME="Lionspace"
PROJECT_DIR="/Users/daniel/modern-nextjs-app"
LOG_DIR="$PROJECT_DIR/logs"
PID_FILE="$PROJECT_DIR/.dev-server.pid"
LOG_FILE="$PROJECT_DIR/.dev-server.log"
CONTAINER_NAME="lionspace-dev"
BROWSER_APP="/Applications/Chromium.app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Ensure we're in the project directory
cd "$PROJECT_DIR"

# Functions
print_header() {
    echo ""
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                  🦁 ${BOLD}LIONSPACE LAUNCHER${NC} ${CYAN}🦁                  ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_process() {
    echo -e "${MAGENTA}⟳${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        print_warning "Docker is not running. Starting Docker Desktop..."
        open -a "Docker" 2>/dev/null || open -a "Docker Desktop" 2>/dev/null || {
            print_error "Docker Desktop not found. Please install Docker Desktop first."
            exit 1
        }
        
        # Wait for Docker to start
        echo -n "Waiting for Docker to start"
        for i in {1..30}; do
            if docker info >/dev/null 2>&1; then
                echo ""
                print_status "Docker started successfully"
                return 0
            fi
            echo -n "."
            sleep 2
        done
        echo ""
        print_error "Docker failed to start within 60 seconds"
        exit 1
    else
        print_status "Docker is running"
    fi
}

# Check if VS Code is installed
check_vscode() {
    if [ -d "/Applications/Visual Studio Code.app" ]; then
        print_status "VS Code found"
        return 0
    else
        print_warning "VS Code not found"
        return 1
    fi
}

# Stop existing services
stop_existing_services() {
    # Stop existing Node server
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            print_process "Stopping existing development server (PID: $PID)..."
            kill "$PID" 2>/dev/null || true
            sleep 2
            rm -f "$PID_FILE"
        fi
    fi
    
    # Kill any orphan Next.js processes
    pkill -f "next-server" 2>/dev/null || true
    pkill -f "npm run dev" 2>/dev/null || true
    
    # Stop Docker containers if using DevContainer
    if [ "$USE_DEVCONTAINER" = "true" ]; then
        print_process "Stopping existing Docker containers..."
        docker compose -f .devcontainer/docker-compose.yml down 2>/dev/null || true
    fi
}

# Start DevContainer environment
start_devcontainer() {
    print_header
    print_info "Starting DevContainer environment..."
    
    check_docker
    
    # Build and start containers
    print_process "Building Docker images..."
    docker compose -f .devcontainer/docker-compose.yml build
    
    print_process "Starting containers..."
    docker compose -f .devcontainer/docker-compose.yml up -d
    
    # Wait for containers to be ready
    print_process "Waiting for services to be ready..."
    sleep 5
    
    # Check container status
    if docker compose -f .devcontainer/docker-compose.yml ps | grep -q "running"; then
        print_status "DevContainer started successfully"
        
        # Show service URLs
        echo ""
        echo -e "${GREEN}Services available:${NC}"
        echo -e "  ${BOLD}• Application:${NC}     http://localhost:3000"
        echo -e "  ${BOLD}• Database Admin:${NC}  http://localhost:8080"
        echo -e "  ${BOLD}• PostgreSQL:${NC}      localhost:5432"
        echo -e "  ${BOLD}• Redis:${NC}           localhost:6379"
        echo ""
        
        # Open in VS Code with DevContainer
        if check_vscode; then
            print_process "Opening in VS Code with DevContainer..."
            # First open VS Code with the project
            code "$PROJECT_DIR"
            sleep 2
            # Then trigger the "Reopen in Container" command
            print_info "In VS Code: Press Cmd+Shift+P and run 'Dev Containers: Reopen in Container'"
            print_info "Or click the green button in the bottom-left corner and select 'Reopen in Container'"
        fi
    else
        print_error "Failed to start DevContainer"
        docker compose -f .devcontainer/docker-compose.yml logs
        exit 1
    fi
}

# Start local development environment
start_local() {
    print_header
    print_info "Starting local development environment..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    NODE_VERSION=$(node -v)
    print_status "Node.js $NODE_VERSION found"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
        print_process "Installing dependencies..."
        npm install
    fi
    
    # Create log directory
    mkdir -p "$LOG_DIR"
    
    # Start development server
    print_process "Starting Next.js development server..."
    nohup npm run dev > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    
    # Wait for server to start
    echo -n "Waiting for server to start"
    for i in {1..30}; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            echo ""
            print_status "Development server started successfully"
            break
        fi
        echo -n "."
        sleep 1
    done
    echo ""
    
    # Open in VS Code if available
    if check_vscode; then
        print_process "Opening project in VS Code..."
        code "$PROJECT_DIR"
    fi
    
    # Open browser
    print_process "Opening application in browser..."
    if [ -d "$BROWSER_APP" ]; then
        open -a "$BROWSER_APP" "http://localhost:3000"
    else
        open "http://localhost:3000"
    fi
    
    echo ""
    echo -e "${GREEN}Local development environment is ready!${NC}"
    echo -e "  ${BOLD}• Application:${NC}  http://localhost:3000"
    echo -e "  ${BOLD}• Server PID:${NC}   $(cat $PID_FILE)"
    echo -e "  ${BOLD}• Logs:${NC}         $LOG_FILE"
    echo ""
}

# Monitor and sync function
monitor_and_sync() {
    print_info "Starting file sync monitor..."
    
    # Create a simple file watcher using fswatch if available
    if command -v fswatch &> /dev/null; then
        fswatch -o "$PROJECT_DIR/src" "$PROJECT_DIR/public" | while read f; do
            echo -e "${CYAN}[$(date '+%H:%M:%S')]${NC} Files changed, Next.js will auto-reload..."
        done &
        FSWATCH_PID=$!
        echo $FSWATCH_PID > "$PROJECT_DIR/.fswatch.pid"
        print_status "File monitor started"
    else
        print_warning "fswatch not found. Install with: brew install fswatch"
    fi
}

# Status check function
check_status() {
    echo ""
    echo -e "${BOLD}System Status:${NC}"
    echo "──────────────────────────────"
    
    # Check Docker
    if docker info >/dev/null 2>&1; then
        echo -e "Docker:        ${GREEN}Running${NC}"
        
        # Check containers
        CONTAINERS=$(docker compose -f .devcontainer/docker-compose.yml ps --format json 2>/dev/null | jq -r '.Name' 2>/dev/null)
        if [ -n "$CONTAINERS" ]; then
            echo -e "Containers:    ${GREEN}Active${NC}"
        else
            echo -e "Containers:    ${YELLOW}Not running${NC}"
        fi
    else
        echo -e "Docker:        ${RED}Not running${NC}"
    fi
    
    # Check Node server
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            echo -e "Dev Server:    ${GREEN}Running (PID: $PID)${NC}"
        else
            echo -e "Dev Server:    ${RED}Stopped${NC}"
        fi
    else
        echo -e "Dev Server:    ${YELLOW}Not started${NC}"
    fi
    
    # Check port 3000
    if lsof -i :3000 > /dev/null 2>&1; then
        echo -e "Port 3000:     ${GREEN}In use${NC}"
    else
        echo -e "Port 3000:     ${YELLOW}Available${NC}"
    fi
    
    echo "──────────────────────────────"
    echo ""
}

# Cleanup function
cleanup() {
    print_warning "Shutting down..."
    
    # Stop file monitor
    if [ -f "$PROJECT_DIR/.fswatch.pid" ]; then
        kill $(cat "$PROJECT_DIR/.fswatch.pid") 2>/dev/null || true
        rm -f "$PROJECT_DIR/.fswatch.pid"
    fi
    
    # Stop dev server
    if [ -f "$PID_FILE" ]; then
        kill $(cat "$PID_FILE") 2>/dev/null || true
        rm -f "$PID_FILE"
    fi
    
    print_status "Cleanup complete"
    exit 0
}

# Trap cleanup on exit
trap cleanup EXIT INT TERM

# Main menu
show_menu() {
    echo ""
    echo -e "${BOLD}Choose launch mode:${NC}"
    echo "──────────────────────────────"
    echo "1) Local Development (Quick)"
    echo "2) DevContainer (Full stack with DB)"
    echo "3) Status Check"
    echo "4) Stop All Services"
    echo "5) Exit"
    echo "──────────────────────────────"
    echo -n "Enter choice [1-5]: "
}

# Parse command line arguments
if [ "$1" = "--local" ]; then
    stop_existing_services
    start_local
    monitor_and_sync
    check_status
    exit 0
elif [ "$1" = "--devcontainer" ]; then
    USE_DEVCONTAINER=true
    stop_existing_services
    start_devcontainer
    check_status
    exit 0
elif [ "$1" = "--status" ]; then
    check_status
    exit 0
elif [ "$1" = "--stop" ]; then
    stop_existing_services
    print_status "All services stopped"
    exit 0
elif [ "$1" = "--help" ]; then
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --local        Start local development environment"
    echo "  --devcontainer Start DevContainer environment"
    echo "  --status       Check status of all services"
    echo "  --stop         Stop all services"
    echo "  --help         Show this help message"
    echo ""
    echo "Without options, shows interactive menu"
    exit 0
fi

# Interactive mode
print_header

while true; do
    show_menu
    read -r choice
    
    case $choice in
        1)
            stop_existing_services
            start_local
            monitor_and_sync
            check_status
            echo ""
            echo -e "${GREEN}Press Ctrl+C to stop${NC}"
            wait
            ;;
        2)
            USE_DEVCONTAINER=true
            stop_existing_services
            start_devcontainer
            check_status
            echo ""
            echo -e "${GREEN}Press Ctrl+C to stop${NC}"
            wait
            ;;
        3)
            check_status
            ;;
        4)
            stop_existing_services
            print_status "All services stopped"
            ;;
        5)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please enter 1-5."
            ;;
    esac
done