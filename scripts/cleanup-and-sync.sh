#!/bin/bash

# Lionspace Cleanup and Sync Script
# Complete system cleanup, synchronization, and monitoring

set -e

# Configuration
PROJECT_DIR="/Users/daniel/modern-nextjs-app"
GITHUB_DIR="$PROJECT_DIR/github"
LOG_DIR="$PROJECT_DIR/logs"
BROWSER_APP="/Applications/Chromium.app"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

# Create log directory
mkdir -p "$LOG_DIR"

# Logging function
log() {
    echo -e "${CYAN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_DIR/cleanup.log"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_DIR/cleanup.log"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_DIR/cleanup.log"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_DIR/cleanup.log"
}

# Header
print_header() {
    echo ""
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║            🦁 ${BOLD}LIONSPACE CLEANUP & SYNC${NC} ${CYAN}🦁                  ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Kill all Node.js processes on port 3000
cleanup_node_processes() {
    log "Cleaning up Node.js processes..."
    
    # Find all processes on port 3000
    PIDS=$(lsof -ti :3000 2>/dev/null || true)
    if [ -n "$PIDS" ]; then
        for PID in $PIDS; do
            log "Killing process $PID on port 3000"
            kill -9 $PID 2>/dev/null || true
        done
        success "Killed all processes on port 3000"
    else
        log "No processes found on port 3000"
    fi
    
    # Kill any npm/node dev processes
    pkill -f "npm run dev" 2>/dev/null || true
    pkill -f "next-server" 2>/dev/null || true
    pkill -f "node.*next" 2>/dev/null || true
    
    # Clean PID files
    rm -f "$PROJECT_DIR/.dev-server.pid" 2>/dev/null || true
    rm -f "$PROJECT_DIR/.fswatch.pid" 2>/dev/null || true
    
    success "Node.js processes cleaned up"
}

# Clean Docker containers and volumes
cleanup_docker() {
    log "Cleaning up Docker resources..."
    
    # Stop all project containers
    cd "$PROJECT_DIR"
    docker compose -f .devcontainer/docker-compose.yml down -v 2>/dev/null || true
    
    # Remove orphan containers
    docker container prune -f 2>/dev/null || true
    
    # Clean unused volumes (carefully)
    docker volume prune -f 2>/dev/null || true
    
    # Clean unused networks
    docker network prune -f 2>/dev/null || true
    
    success "Docker resources cleaned up"
}

# Sync configuration from github folder
sync_configurations() {
    log "Syncing configurations from github folder..."
    
    # Copy service account keys if they exist
    if [ -f "$GITHUB_DIR/lionspace-service-account-key.json" ]; then
        cp "$GITHUB_DIR/lionspace-service-account-key.json" "$PROJECT_DIR/"
        log "Copied service account key"
    fi
    
    # Copy OAuth credentials if they exist
    if [ -f "$GITHUB_DIR/google-oauth-credentials-latest.json" ]; then
        cp "$GITHUB_DIR/google-oauth-credentials-latest.json" "$PROJECT_DIR/"
        log "Copied OAuth credentials"
    fi
    
    success "Configurations synced"
}

# Update environment variables
update_env() {
    log "Updating environment variables..."
    
    # Backup existing .env.local if it exists
    if [ -f "$PROJECT_DIR/.env.local" ]; then
        cp "$PROJECT_DIR/.env.local" "$PROJECT_DIR/.env.local.backup.$(date +%Y%m%d_%H%M%S)"
        log "Backed up existing .env.local"
    fi
    
    # Environment is already created, just log it
    if [ -f "$PROJECT_DIR/.env.local" ]; then
        success "Environment variables configured"
    else
        error ".env.local not found"
    fi
}

# Clean and rebuild node_modules if needed
clean_node_modules() {
    log "Checking node_modules..."
    
    cd "$PROJECT_DIR"
    
    # Check if package.json is newer than node_modules
    if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
        warning "node_modules needs update"
        log "Removing old node_modules..."
        rm -rf node_modules
        rm -f package-lock.json
        
        log "Installing dependencies..."
        npm install
        success "Dependencies installed"
    else
        log "node_modules is up to date"
    fi
}

# System health check
health_check() {
    log "Running health checks..."
    
    echo ""
    echo -e "${BOLD}System Health Report:${NC}"
    echo "──────────────────────────────────────"
    
    # Check Docker
    if docker info >/dev/null 2>&1; then
        echo -e "Docker:          ${GREEN}✓ Running${NC}"
    else
        echo -e "Docker:          ${RED}✗ Not running${NC}"
    fi
    
    # Check Node.js
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node -v)
        echo -e "Node.js:         ${GREEN}✓ $NODE_VERSION${NC}"
    else
        echo -e "Node.js:         ${RED}✗ Not installed${NC}"
    fi
    
    # Check npm
    if command -v npm >/dev/null 2>&1; then
        NPM_VERSION=$(npm -v)
        echo -e "npm:             ${GREEN}✓ v$NPM_VERSION${NC}"
    else
        echo -e "npm:             ${RED}✗ Not installed${NC}"
    fi
    
    # Check port 3000
    if lsof -i :3000 >/dev/null 2>&1; then
        echo -e "Port 3000:       ${YELLOW}⚠ In use${NC}"
    else
        echo -e "Port 3000:       ${GREEN}✓ Available${NC}"
    fi
    
    # Check project files
    if [ -f "$PROJECT_DIR/package.json" ]; then
        echo -e "Project files:   ${GREEN}✓ Found${NC}"
    else
        echo -e "Project files:   ${RED}✗ Missing${NC}"
    fi
    
    # Check .env.local
    if [ -f "$PROJECT_DIR/.env.local" ]; then
        echo -e ".env.local:      ${GREEN}✓ Configured${NC}"
    else
        echo -e ".env.local:      ${RED}✗ Missing${NC}"
    fi
    
    # Check DevContainer files
    if [ -f "$PROJECT_DIR/.devcontainer/devcontainer.json" ]; then
        echo -e "DevContainer:    ${GREEN}✓ Configured${NC}"
    else
        echo -e "DevContainer:    ${RED}✗ Missing${NC}"
    fi
    
    echo "──────────────────────────────────────"
    echo ""
}

# Git sync function
sync_git() {
    log "Syncing with Git..."
    
    cd "$PROJECT_DIR"
    
    # Check if it's a git repo
    if [ -d ".git" ]; then
        # Add all changes
        git add -A
        
        # Check if there are changes to commit
        if ! git diff --cached --quiet; then
            log "Committing changes..."
            git commit -m "Auto-sync: Cleanup and configuration update $(date +%Y-%m-%d_%H:%M:%S)"
            success "Changes committed"
        else
            log "No changes to commit"
        fi
    else
        warning "Not a Git repository"
    fi
}

# Main execution
main() {
    print_header
    
    # Parse arguments
    case "${1:-}" in
        --full)
            log "Starting full cleanup and sync..."
            cleanup_node_processes
            cleanup_docker
            sync_configurations
            update_env
            clean_node_modules
            sync_git
            health_check
            success "Full cleanup and sync completed!"
            ;;
        --quick)
            log "Starting quick cleanup..."
            cleanup_node_processes
            health_check
            success "Quick cleanup completed!"
            ;;
        --docker)
            log "Cleaning Docker resources..."
            cleanup_docker
            success "Docker cleanup completed!"
            ;;
        --sync)
            log "Syncing configurations..."
            sync_configurations
            update_env
            sync_git
            success "Sync completed!"
            ;;
        --health)
            health_check
            ;;
        *)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --full    Full cleanup and sync (recommended)"
            echo "  --quick   Quick cleanup (Node processes only)"
            echo "  --docker  Clean Docker resources only"
            echo "  --sync    Sync configurations and Git only"
            echo "  --health  Run health check only"
            echo ""
            echo "Default: --full"
            echo ""
            
            # Run full by default
            $0 --full
            ;;
    esac
}

# Run main function
main "$@"