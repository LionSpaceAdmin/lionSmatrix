#!/bin/bash

# Lionspace Sync & Monitoring Service
# Provides real-time file synchronization and health monitoring

set -e

PROJECT_DIR="/Users/daniel/modern-nextjs-app"
LOG_DIR="$PROJECT_DIR/logs"
SYNC_LOG="$LOG_DIR/sync.log"
MONITOR_PID_FILE="$PROJECT_DIR/.monitor.pid"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Logging function
log_event() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$SYNC_LOG"
    echo -e "${CYAN}[SYNC]${NC} $1"
}

# Git sync function
sync_git() {
    cd "$PROJECT_DIR"
    
    # Check if there are changes
    if [[ -n $(git status -s 2>/dev/null) ]]; then
        log_event "Git changes detected"
        
        # Auto-stash uncommitted changes
        git stash push -m "Auto-stash at $(date '+%Y-%m-%d %H:%M:%S')" 2>/dev/null || true
        
        # Pull latest changes
        git pull --rebase 2>/dev/null || {
            log_event "Git pull failed, likely offline or no remote"
        }
        
        # Pop stash if exists
        git stash pop 2>/dev/null || true
    fi
}

# Health check function
health_check() {
    local status="healthy"
    local issues=""
    
    # Check if dev server is running
    if [ -f "$PROJECT_DIR/.dev-server.pid" ]; then
        PID=$(cat "$PROJECT_DIR/.dev-server.pid")
        if ! ps -p "$PID" > /dev/null 2>&1; then
            status="warning"
            issues="Dev server not running. "
        fi
    fi
    
    # Check if port 3000 is responding
    if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
        status="warning"
        issues="${issues}Port 3000 not responding. "
    fi
    
    # Check disk space
    DISK_USAGE=$(df -h "$PROJECT_DIR" | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -gt 90 ]; then
        status="critical"
        issues="${issues}Disk usage critical (${DISK_USAGE}%). "
    elif [ "$DISK_USAGE" -gt 80 ]; then
        status="warning"
        issues="${issues}Disk usage high (${DISK_USAGE}%). "
    fi
    
    # Check node_modules
    if [ ! -d "$PROJECT_DIR/node_modules" ]; then
        status="error"
        issues="${issues}node_modules missing. "
    fi
    
    # Log health status
    if [ "$status" = "healthy" ]; then
        log_event "Health check: ✅ All systems operational"
    else
        log_event "Health check: ⚠️  Status: $status - Issues: $issues"
    fi
    
    return 0
}

# File watcher with auto-sync
watch_and_sync() {
    log_event "Starting file watcher and sync service"
    
    # Check if fswatch is available
    if ! command -v fswatch &> /dev/null; then
        log_event "Installing fswatch..."
        brew install fswatch 2>/dev/null || {
            log_event "Failed to install fswatch. Please install manually: brew install fswatch"
            return 1
        }
    }
    
    # Watch for changes
    fswatch -r \
        --exclude "node_modules" \
        --exclude ".next" \
        --exclude ".git" \
        --exclude "logs" \
        "$PROJECT_DIR/src" \
        "$PROJECT_DIR/public" \
        "$PROJECT_DIR/package.json" | while read -r file; do
        
        filename=$(basename "$file")
        dirname=$(dirname "$file")
        
        # Log the change
        log_event "File changed: ${file#$PROJECT_DIR/}"
        
        # Auto-format if it's a source file
        if [[ "$file" =~ \.(ts|tsx|js|jsx)$ ]]; then
            # Run prettier if available
            if command -v prettier &> /dev/null; then
                prettier --write "$file" 2>/dev/null || true
            fi
            
            # Run eslint fix if available
            if [ -f "$PROJECT_DIR/node_modules/.bin/eslint" ]; then
                "$PROJECT_DIR/node_modules/.bin/eslint" --fix "$file" 2>/dev/null || true
            fi
        fi
        
        # Trigger git sync every 10 changes
        CHANGE_COUNT=$((CHANGE_COUNT + 1))
        if [ $((CHANGE_COUNT % 10)) -eq 0 ]; then
            sync_git
        fi
    done
}

# Performance monitoring
monitor_performance() {
    while true; do
        # Get Next.js process stats
        if [ -f "$PROJECT_DIR/.dev-server.pid" ]; then
            PID=$(cat "$PROJECT_DIR/.dev-server.pid")
            if ps -p "$PID" > /dev/null 2>&1; then
                # Get CPU and memory usage
                STATS=$(ps -o %cpu,%mem,rss -p "$PID" | tail -n 1)
                CPU=$(echo "$STATS" | awk '{print $1}')
                MEM=$(echo "$STATS" | awk '{print $2}')
                RSS=$(echo "$STATS" | awk '{print $3}')
                
                # Log if high usage
                if (( $(echo "$CPU > 80" | bc -l) )); then
                    log_event "⚠️  High CPU usage: ${CPU}%"
                fi
                
                if (( $(echo "$MEM > 10" | bc -l) )); then
                    log_event "⚠️  High memory usage: ${MEM}% (${RSS}KB)"
                fi
            fi
        fi
        
        # Run health check every 5 minutes
        health_check
        
        sleep 300
    done
}

# Database backup (if using DevContainer)
backup_database() {
    if docker ps | grep -q "lionspace.*postgres"; then
        log_event "Creating database backup..."
        
        BACKUP_DIR="$PROJECT_DIR/backups"
        mkdir -p "$BACKUP_DIR"
        
        TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
        BACKUP_FILE="$BACKUP_DIR/lionspace_${TIMESTAMP}.sql"
        
        docker exec $(docker ps -qf "name=lionspace.*postgres") \
            pg_dump -U postgres lionspace_dev > "$BACKUP_FILE" 2>/dev/null && {
            log_event "Database backed up to: $BACKUP_FILE"
            
            # Keep only last 5 backups
            ls -t "$BACKUP_DIR"/*.sql 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null
        } || {
            log_event "Database backup failed"
        }
    fi
}

# Auto-recovery function
auto_recovery() {
    log_event "Checking for recovery needs..."
    
    # Check if dev server crashed
    if [ -f "$PROJECT_DIR/.dev-server.pid" ]; then
        PID=$(cat "$PROJECT_DIR/.dev-server.pid")
        if ! ps -p "$PID" > /dev/null 2>&1; then
            log_event "Dev server crashed, attempting restart..."
            
            cd "$PROJECT_DIR"
            npm run dev > "$PROJECT_DIR/.dev-server.log" 2>&1 &
            echo $! > "$PROJECT_DIR/.dev-server.pid"
            
            log_event "Dev server restarted with PID: $!"
        fi
    fi
    
    # Check and fix permissions
    if [ ! -w "$PROJECT_DIR/node_modules" ] 2>/dev/null; then
        log_event "Fixing node_modules permissions..."
        sudo chown -R $(whoami) "$PROJECT_DIR/node_modules" 2>/dev/null || true
    fi
}

# Main monitoring loop
main() {
    echo $$ > "$MONITOR_PID_FILE"
    
    log_event "═══════════════════════════════════════════"
    log_event "Lionspace Sync & Monitor Service Started"
    log_event "═══════════════════════════════════════════"
    
    # Start background services
    monitor_performance &
    PERF_PID=$!
    
    # Run initial sync
    sync_git
    
    # Run initial health check
    health_check
    
    # Start auto-recovery loop
    while true; do
        auto_recovery
        backup_database
        sleep 60
    done &
    RECOVERY_PID=$!
    
    # Start file watcher (foreground)
    watch_and_sync
    
    # Cleanup on exit
    trap "kill $PERF_PID $RECOVERY_PID 2>/dev/null; rm -f $MONITOR_PID_FILE" EXIT
}

# Check if already running
if [ -f "$MONITOR_PID_FILE" ]; then
    OLD_PID=$(cat "$MONITOR_PID_FILE")
    if ps -p "$OLD_PID" > /dev/null 2>&1; then
        echo -e "${YELLOW}Monitor already running with PID: $OLD_PID${NC}"
        exit 0
    else
        rm -f "$MONITOR_PID_FILE"
    fi
fi

main "$@"