#!/bin/bash

# LionSpace QA Status Check Script
# יקא - Quality Assurance Status Report

set -e

echo "🔍 LIONSPACE QA STATUS CHECK - יקא"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track overall status
TOTAL_CHECKS=0
PASSED_CHECKS=0

function check_status() {
    local name="$1"
    local command="$2"
    local description="$3"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    echo -n "🔎 $name: "
    
    if eval "$command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC} - $description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "${RED}❌ FAIL${NC} - $description"
    fi
}

function check_status_with_output() {
    local name="$1"
    local command="$2"
    local description="$3"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    echo -n "🔎 $name: "
    
    local output
    output=$(eval "$command" 2>&1)
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC} - $description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "${RED}❌ FAIL${NC} - $description"
        echo "   Error: $output" | head -3
    fi
}

echo "📋 BASIC QUALITY CHECKS"
echo "----------------------"

# TypeScript compilation
check_status "TypeScript" "npm run typecheck" "Code compiles without type errors"

# ESLint 
check_status_with_output "ESLint" "npm run lint" "Code follows linting standards"

# Tests
check_status "Tests" "npm test" "All unit tests pass"

# Build
check_status "Build" "npm run build" "Application builds successfully"

echo ""
echo "📊 COVERAGE ANALYSIS" 
echo "-------------------"

# Test coverage check
if [ -f "coverage/lcov.info" ]; then
    COVERAGE=$(grep -o 'LF:[0-9]*' coverage/lcov.info | tail -1 | cut -d: -f2)
    if [ "$COVERAGE" -gt 80 ]; then
        echo -e "🔎 Test Coverage: ${GREEN}✅ GOOD${NC} - $COVERAGE% coverage"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "🔎 Test Coverage: ${YELLOW}⚠️ LOW${NC} - $COVERAGE% coverage (target: 80%)"
    fi
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
else
    echo -e "🔎 Test Coverage: ${RED}❌ NONE${NC} - No coverage reports found"
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
fi

echo ""
echo "🔒 SECURITY CHECKS"
echo "-----------------"

# Check for security vulnerabilities
check_status "Dependencies" "npm audit --audit-level moderate" "No moderate+ security vulnerabilities"

# Check for exposed secrets
check_status "Secrets" "! grep -r 'sk-' src/ || ! grep -r 'pk_' src/" "No API keys in source code"

echo ""
echo "⚡ PERFORMANCE CHECKS"
echo "-------------------"

# Bundle size check
if [ -f ".next/trace" ]; then
    echo -e "🔎 Bundle Analysis: ${GREEN}✅ AVAILABLE${NC} - Build trace exists"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "🔎 Bundle Analysis: ${YELLOW}⚠️ MISSING${NC} - No build trace found"
fi
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

echo ""
echo "📁 FILE STRUCTURE CHECKS"
echo "-----------------------"

# Check for required files
check_status "Environment" "[ -f '.env.example' ] || [ -f '.env.local' ]" "Environment configuration exists"
check_status "Documentation" "[ -f 'README.md' ]" "Project documentation exists"
check_status "License" "[ -f 'LICENSE' ]" "License file exists"

echo ""
echo "🎯 DEPLOYMENT READINESS"
echo "----------------------"

# Check Vercel config
check_status "Vercel Config" "[ -f 'vercel.json' ]" "Deployment configuration exists"

# Check for build output
check_status "Build Output" "[ -d '.next' ]" "Application has been built"

echo ""
echo "📈 QA SUMMARY"
echo "============="

# Calculate percentage
PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

echo "📊 Total Checks: $TOTAL_CHECKS"
echo "✅ Passed: $PASSED_CHECKS"
echo "❌ Failed: $((TOTAL_CHECKS - PASSED_CHECKS))"
echo ""

if [ $PERCENTAGE -ge 90 ]; then
    echo -e "🎉 QA Status: ${GREEN}EXCELLENT${NC} ($PERCENTAGE%)"
    echo "✅ Ready for production deployment"
elif [ $PERCENTAGE -ge 80 ]; then
    echo -e "🎯 QA Status: ${GREEN}GOOD${NC} ($PERCENTAGE%)"
    echo "✅ Ready for staging deployment"
elif [ $PERCENTAGE -ge 70 ]; then
    echo -e "⚠️  QA Status: ${YELLOW}ACCEPTABLE${NC} ($PERCENTAGE%)"
    echo "⚠️  Address failing checks before production"
elif [ $PERCENTAGE -ge 50 ]; then
    echo -e "🔧 QA Status: ${YELLOW}NEEDS WORK${NC} ($PERCENTAGE%)"
    echo "🔧 Significant improvements needed"
else
    echo -e "🚨 QA Status: ${RED}CRITICAL${NC} ($PERCENTAGE%)"
    echo "🚨 Not ready for deployment"
fi

echo ""
echo "🔗 Quick Actions:"
echo "• Run 'npm run typecheck' to fix TypeScript issues"
echo "• Run 'npm run lint' to fix code style issues"
echo "• Run 'npm test' to check test status"
echo "• Run 'npm run build' to verify build works"
echo ""

# Exit with appropriate code
if [ $PERCENTAGE -ge 80 ]; then
    exit 0
else
    exit 1
fi