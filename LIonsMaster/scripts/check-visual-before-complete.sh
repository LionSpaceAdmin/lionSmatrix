#!/bin/bash

# Visual Verification Pre-Completion Check
# This script MUST run before marking any UI task as complete

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}     Visual Verification Pre-Completion Check     ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo ""

# Check if visual verification is required
if [ "$REQUIRE_VISUAL_VERIFICATION" != "true" ]; then
    echo -e "${YELLOW}⚠️  Visual verification is disabled. Set REQUIRE_VISUAL_VERIFICATION=true${NC}"
    exit 0
fi

# Function to check if server is running
# The server should ALWAYS be running on port 3000 in our dev environment
check_server() {
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
        echo -e "${GREEN}✓ Dev server is running on port 3000${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Dev server not responding on port 3000${NC}"
        echo -e "${YELLOW}   The server should always be running in our environment${NC}"
        return 1
    fi
}

# Function to take screenshot
take_screenshot() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local screenshot_dir="visual-evidence/$(date +%Y-%m-%d)"
    mkdir -p "$screenshot_dir"
    
    echo -e "${BLUE}📸 Taking screenshot...${NC}"
    
    if command -v playwright &> /dev/null; then
        npx playwright screenshot \
            --wait-for-timeout=2000 \
            --full-page \
            http://localhost:3000 \
            "$screenshot_dir/screenshot_${timestamp}.png"
        
        echo -e "${GREEN}✓ Screenshot saved: $screenshot_dir/screenshot_${timestamp}.png${NC}"
        return 0
    else
        echo -e "${RED}✗ Playwright not found. Install with: npm install -D @playwright/test${NC}"
        return 1
    fi
}

# Function to run E2E tests
run_e2e_tests() {
    echo -e "${BLUE}🧪 Running E2E tests...${NC}"
    
    if [ -f "playwright.config.ts" ]; then
        if pnpm e2e:headless; then
            echo -e "${GREEN}✓ E2E tests passed${NC}"
            return 0
        else
            echo -e "${RED}✗ E2E tests failed${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  No E2E tests configured${NC}"
        return 0
    fi
}

# Function to check accessibility
check_accessibility() {
    echo -e "${BLUE}♿ Checking accessibility...${NC}"
    
    # Run lighthouse accessibility audit
    if command -v lighthouse &> /dev/null; then
    lighthouse http://localhost:3000 \
            --only-categories=accessibility \
            --output=json \
            --output-path=visual-reports/accessibility-$(date +%Y%m%d_%H%M%S).json \
            --chrome-flags="--headless" \
            --quiet
        
        echo -e "${GREEN}✓ Accessibility check complete${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Lighthouse not installed. Skipping accessibility check${NC}"
        return 0
    fi
}

# Main verification flow
VERIFICATION_PASSED=true

# Step 1: Check if server is running (should always be running on port 3000)
if ! check_server; then
    echo -e "${RED}✗ Dev server is not accessible on port 3000${NC}"
    echo -e "${YELLOW}Please ensure 'pnpm dev' is running in another terminal${NC}"
    echo -e "${YELLOW}In our dev environment, the server should always be running${NC}"
    VERIFICATION_PASSED=false
fi

# Step 2: Take screenshots
if [ "$AUTO_SCREENSHOT_VALIDATION" == "true" ]; then
    if ! take_screenshot; then
        VERIFICATION_PASSED=false
    fi
fi

# Step 3: Run E2E tests
if [ "$MANDATORY_BROWSER_TESTING" == "true" ]; then
    if ! run_e2e_tests; then
        VERIFICATION_PASSED=false
    fi
fi

# Step 4: Check accessibility
if [ "$REQUIRE_ACCESSIBILITY_CHECK" == "true" ]; then
    if ! check_accessibility; then
        VERIFICATION_PASSED=false
    fi
fi

# Step 5: Generate report
REPORT_FILE="visual-reports/verification-$(date +%Y%m%d_%H%M%S).txt"
mkdir -p visual-reports

{
    echo "Visual Verification Report"
    echo "=========================="
    echo "Date: $(date)"
    echo "Server Status: $(check_server && echo 'Running' || echo 'Not Running')"
    echo "Screenshots Taken: $([ "$AUTO_SCREENSHOT_VALIDATION" == "true" ] && echo 'Yes' || echo 'No')"
    echo "E2E Tests: $([ "$MANDATORY_BROWSER_TESTING" == "true" ] && echo 'Executed' || echo 'Skipped')"
    echo "Accessibility: $([ "$REQUIRE_ACCESSIBILITY_CHECK" == "true" ] && echo 'Checked' || echo 'Skipped')"
    echo "Overall Status: $([ "$VERIFICATION_PASSED" == "true" ] && echo 'PASSED' || echo 'FAILED')"
} > "$REPORT_FILE"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"

# Final result
if [ "$VERIFICATION_PASSED" == "true" ]; then
    echo -e "${GREEN}✅ VISUAL VERIFICATION PASSED${NC}"
    echo -e "${GREEN}You may now mark the task as complete${NC}"
    exit 0
else
    echo -e "${RED}❌ VISUAL VERIFICATION FAILED${NC}"
    echo -e "${RED}Cannot mark task as complete without visual proof${NC}"
    
    if [ "$BLOCK_COMPLETION_WITHOUT_VISUAL_PROOF" == "true" ]; then
        exit 1
    else
        echo -e "${YELLOW}⚠️  Warning: Continuing despite failures (enforcement disabled)${NC}"
        exit 0
    fi
fi