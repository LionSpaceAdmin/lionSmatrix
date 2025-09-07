#!/bin/bash
# setup-development-environment.sh
# סקריפט התקנה אוטומטי לסביבת פיתוח מסונכרנת

set -e

echo "🚀 מתחיל התקנת סביבת הפיתוח המסונכרנת..."

# צבעים לפלט יפה
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# בדיקת תנאים מוקדמים
check_prerequisites() {
    log_info "בודק תנאים מוקדמים..."
    
    # בדיקת Node.js
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        log_success "Node.js מותקן: $NODE_VERSION"
    else
        log_error "Node.js לא מותקן"
        exit 1
    fi
    
    # בדיקת npm
    if command -v npm >/dev/null 2>&1; then
        NPM_VERSION=$(npm --version)
        log_success "npm מותקן: $NPM_VERSION"
    else
        log_error "npm לא מותקן"
        exit 1
    fi
}

# התקנת תלויות Node.js
install_node_dependencies() {
    log_info "מתקין תלויות Node.js..."
    
    # התקנת תלויות פרויקט
    npm install
    
    # התקנת Vercel CLI גלובלית
    if ! command -v vercel >/dev/null 2>&1; then
        log_info "מתקין Vercel CLI..."
        npm install -g vercel
        log_success "Vercel CLI הותקן בהצלחה"
    else
        log_success "Vercel CLI כבר מותקן"
    fi
    
    # התקנת חבילות Vercel נוספות
    if ! npm list @vercel/analytics >/dev/null 2>&1; then
        log_info "מתקין @vercel/analytics..."
        npm install @vercel/analytics @vercel/speed-insights
        log_success "חבילות Vercel הותקנו בהצלחה"
    else
        log_success "חבילות Vercel כבר מותקנות"
    fi
}

# בדיקת GCP CLI
check_gcp_cli() {
    log_info "בודק GCP CLI..."
    
    if command -v gcloud >/dev/null 2>&1; then
        GCLOUD_VERSION=$(gcloud --version | head -n1)
        log_success "GCP CLI מותקן: $GCLOUD_VERSION"
        
        # בדיקת authentication
        if gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
            ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
            log_success "מחובר ל-GCP כ: $ACTIVE_ACCOUNT"
        else
            log_warning "לא מחובר ל-GCP - הרץ: gcloud auth login"
        fi
        
        # בדיקת פרויקט
        if gcloud config get-value project >/dev/null 2>&1; then
            PROJECT_ID=$(gcloud config get-value project)
            log_success "פרויקט GCP מוגדר: $PROJECT_ID"
        else
            log_warning "אין פרויקט GCP מוגדר - הרץ: gcloud config set project PROJECT_ID"
        fi
    else
        log_warning "GCP CLI לא מותקן - יותקן אוטומטית ב-devcontainer"
    fi
}

# יצירת קבצי קונפיגורציה
create_config_files() {
    log_info "יוצר קבצי קונפיגורציה..."
    
    # יצירת .env.local אם לא קיים
    if [ ! -f ".env.local" ]; then
        log_info "יוצר .env.local..."
        cp .env.local.example .env.local 2>/dev/null || {
            cat > .env.local << EOF
# Vercel Configuration
VERCEL_ENV=development
VERCEL_URL=localhost:3000

# GCP Configuration  
GCP_PROJECT_ID=lionspace
GCP_REGION=us-central1

# Next.js Configuration
NEXT_PUBLIC_VERCEL_ENV=development
EOF
        }
        log_success ".env.local נוצר"
    else
        log_success ".env.local כבר קיים"
    fi
    
    # הוספת .env.local ל-.gitignore
    if ! grep -q "\.env\.local" .gitignore 2>/dev/null; then
        echo ".env.local" >> .gitignore
        log_success ".env.local נוסף ל-.gitignore"
    fi
}

# הרצת בדיקות מערכת
run_system_checks() {
    log_info "מריץ בדיקות מערכת..."
    
    if [ -f "scripts/check_integrations.py" ]; then
        python scripts/check_integrations.py
    else
        log_warning "סקריפט בדיקות לא נמצא"
    fi
}

# הצגת מידע לסיום
show_completion_info() {
    echo ""
    echo "🎉 התקנת סביבת הפיתוח הושלמה בהצלחה!"
    echo ""
    echo "📋 הוראות לשימוש:"
    echo "1. להתחברות ל-Vercel: vercel login"
    echo "2. לקישור הפרויקט: vercel link"
    echo "3. להתחברות ל-GCP: gcloud auth login"
    echo "4. להגדרת פרויקט GCP: gcloud config set project lionspace"
    echo "5. להרצת השרת: npm run dev"
    echo ""
    echo "🔗 קישורים שימושיים:"
    echo "- Vercel Dashboard: https://vercel.com/dashboard"
    echo "- v0.dev: https://v0.dev"
    echo "- GCP Console: https://console.cloud.google.com"
    echo ""
    echo "📚 תיעוד נוסף זמין ב:"
    echo "- VERCEL_V0_GCP_INTEGRATION_PLAN.md"
    echo "- README.md"
}

# הרצת כל השלבים
main() {
    check_prerequisites
    install_node_dependencies
    check_gcp_cli
    create_config_files
    run_system_checks
    show_completion_info
}

# הרצה רק אם זה הסקריפט הראשי
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
