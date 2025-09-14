#!/bin/bash

# Lions of Zion - Chromium Monitoring Script
# Real-time monitoring and log analysis for browser testing

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOGS_DIR="$PROJECT_ROOT/logs"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Create logs directory structure
create_log_dirs() {
    echo -e "${BLUE}🛡️  Lions of Zion - Chromium Monitor${NC}"
    echo -e "${CYAN}Creating log directories...${NC}"
    
    mkdir -p "$LOGS_DIR"/{crashes,network,console,performance,screenshots,traces}
    
    echo -e "${GREEN}✓ Log directories created:${NC}"
    echo "  📁 $LOGS_DIR/crashes - Crash dumps"
    echo "  📁 $LOGS_DIR/network - Network traffic logs"
    echo "  📁 $LOGS_DIR/console - Browser console logs"
    echo "  📁 $LOGS_DIR/performance - Performance metrics"
    echo "  📁 $LOGS_DIR/screenshots - Screenshots on events"
    echo "  📁 $LOGS_DIR/traces - Execution traces"
}

# Start real-time log monitoring
start_monitoring() {
    echo -e "\n${YELLOW}🔍 Starting real-time log monitoring...${NC}"
    
    # Function to monitor a log file
    monitor_log() {
        local log_file="$1"
        local log_name="$2"
        local color="$3"
        
        if [[ -f "$log_file" ]]; then
            tail -f "$log_file" 2>/dev/null | while IFS= read -r line; do
                timestamp=$(date '+%H:%M:%S')
                echo -e "${color}[$timestamp] [$log_name] $line${NC}"
            done &
        fi
    }
    
    # Monitor different log types
    monitor_log "$LOGS_DIR/chromium-console.log" "CONSOLE" "$CYAN"
    monitor_log "$LOGS_DIR/chromium-rtl-console.log" "RTL-CONSOLE" "$PURPLE"
    monitor_log "$LOGS_DIR/test-results.json" "TESTS" "$GREEN"
    
    # Monitor network logs (JSON format)
    if [[ -f "$LOGS_DIR/chromium-net-log.json" ]]; then
        echo -e "${BLUE}📡 Network log monitoring active${NC}"
    fi
    
    # Monitor crash dumps
    watch_crashes() {
        fswatch -o "$LOGS_DIR/crashes" 2>/dev/null | while read num; do
            echo -e "${RED}🚨 CRASH DETECTED! Check $LOGS_DIR/crashes${NC}"
            ls -la "$LOGS_DIR/crashes"
        done &
    }
    
    if command -v fswatch >/dev/null 2>&1; then
        watch_crashes
    else
        echo -e "${YELLOW}⚠️  Install fswatch for crash monitoring: brew install fswatch${NC}"
    fi
}

# Analyze network logs
analyze_network() {
    echo -e "\n${BLUE}📊 Network Analysis${NC}"
    
    local net_log="$LOGS_DIR/chromium-net-log.json"
    if [[ -f "$net_log" ]]; then
        echo -e "${GREEN}✓ Network log found: $(wc -l < "$net_log") entries${NC}"
        
        # Extract key metrics if jq is available
        if command -v jq >/dev/null 2>&1; then
            echo -e "${CYAN}🔍 Analyzing network requests...${NC}"
            
            # Count request types
            echo "📋 Request Summary:"
            jq -r '.events[] | select(.type == "REQUEST_ALIVE") | .params.url' "$net_log" 2>/dev/null | \
                sed 's|https\?://[^/]*||' | sort | uniq -c | sort -nr | head -10
            
            # Find errors
            echo -e "\n🚨 Network Errors:"
            jq -r '.events[] | select(.type == "HTTP_TRANSACTION_READ_RESPONSE_HEADERS" and .params.headers | contains("HTTP/1.1 4") or contains("HTTP/1.1 5"))' "$net_log" 2>/dev/null || echo "No errors found"
        else
            echo -e "${YELLOW}⚠️  Install jq for detailed analysis: brew install jq${NC}"
        fi
    else
        echo -e "${RED}❌ No network log found${NC}"
    fi
}

# Analyze performance metrics
analyze_performance() {
    echo -e "\n${PURPLE}⚡ Performance Analysis${NC}"
    
    local trace_file="$LOGS_DIR/chromium-startup-trace.json"
    if [[ -f "$trace_file" ]]; then
        echo -e "${GREEN}✓ Startup trace found: $(wc -c < "$trace_file") bytes${NC}"
        
        # Basic trace analysis
        if command -v jq >/dev/null 2>&1; then
            echo "🚀 Startup Metrics:"
            jq -r '.traceEvents[] | select(.name == "firstContentfulPaint" or .name == "firstMeaningfulPaint") | "\(.name): \(.ts/1000)ms"' "$trace_file" 2>/dev/null || echo "No paint metrics found"
        fi
    else
        echo -e "${YELLOW}⚠️  No startup trace found${NC}"
    fi
    
    # Check test results for performance data
    local test_results="$LOGS_DIR/test-results.json"
    if [[ -f "$test_results" ]]; then
        echo -e "${GREEN}✓ Test results available${NC}"
        
        if command -v jq >/dev/null 2>&1; then
            echo "📊 Test Performance Summary:"
            jq -r '.suites[].specs[] | "Test: \(.title) - Duration: \(.duration)ms"' "$test_results" 2>/dev/null | head -5
        fi
    fi
}

# Clean old logs
cleanup_logs() {
    echo -e "\n${YELLOW}🧹 Cleaning old logs...${NC}"
    
    # Remove logs older than 7 days
    find "$LOGS_DIR" -name "*.log" -mtime +7 -delete 2>/dev/null || true
    find "$LOGS_DIR" -name "*.json" -mtime +7 -delete 2>/dev/null || true
    
    # Clean crash dumps older than 3 days
    find "$LOGS_DIR/crashes" -mtime +3 -delete 2>/dev/null || true
    
    echo -e "${GREEN}✓ Cleanup completed${NC}"
}

# Generate monitoring report
generate_report() {
    echo -e "\n${BLUE}📋 Generating Monitoring Report${NC}"
    
    local report_file="$LOGS_DIR/monitoring-report-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$report_file" << EOF
# Lions of Zion - Chromium Monitoring Report
Generated: $(date)

## Log Files Status
EOF

    for log_type in crashes network console performance screenshots traces; do
        local log_dir="$LOGS_DIR/$log_type"
        if [[ -d "$log_dir" ]]; then
            local file_count=$(find "$log_dir" -type f | wc -l)
            echo "- **$log_type**: $file_count files" >> "$report_file"
        fi
    done
    
    echo "" >> "$report_file"
    echo "## Recent Activity" >> "$report_file"
    
    # Add recent log entries
    for log_file in "$LOGS_DIR"/*.log; do
        if [[ -f "$log_file" ]]; then
            echo "### $(basename "$log_file")" >> "$report_file"
            echo '```' >> "$report_file"
            tail -10 "$log_file" >> "$report_file" 2>/dev/null || echo "No recent entries" >> "$report_file"
            echo '```' >> "$report_file"
            echo "" >> "$report_file"
        fi
    done
    
    echo -e "${GREEN}✓ Report saved: $report_file${NC}"
}

# Main execution
main() {
    case "${1:-monitor}" in
        "setup")
            create_log_dirs
            ;;
        "monitor")
            create_log_dirs
            start_monitoring
            echo -e "\n${GREEN}🔍 Monitoring active. Press Ctrl+C to stop.${NC}"
            sleep infinity
            ;;
        "analyze")
            analyze_network
            analyze_performance
            ;;
        "cleanup")
            cleanup_logs
            ;;
        "report")
            generate_report
            ;;
        *)
            echo "Usage: $0 {setup|monitor|analyze|cleanup|report}"
            echo ""
            echo "Commands:"
            echo "  setup   - Create log directory structure"
            echo "  monitor - Start real-time log monitoring"
            echo "  analyze - Analyze collected logs"
            echo "  cleanup - Clean old log files"
            echo "  report  - Generate monitoring report"
            exit 1
            ;;
    esac
}

# Trap cleanup
trap 'echo -e "\n${YELLOW}🛑 Monitoring stopped${NC}"; exit 0' INT TERM

main "$@"