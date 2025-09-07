#!/usr/bin/env python3
"""
בדיקת חיבורים ל-APIs: Vercel, v0.dev, GCP
סקריפט זה בודק את הזמינות והגישה לכל השירותים החיוניים
"""

import os
import json
import requests
import subprocess
from datetime import datetime
from typing import Dict, List, Optional

class APIChecker:
    def __init__(self):
        self.results = []
        self.start_time = datetime.now()
        
    def log_result(self, service: str, status: str, message: str, details: Optional[Dict] = None):
        """רושם תוצאה של בדיקה"""
        result = {
            'service': service,
            'status': status,  # 'success', 'warning', 'error'
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'details': details or {}
        }
        self.results.append(result)
        
        # הדפסה עם צבעים
        color = {
            'success': '\033[92m✓\033[0m',
            'warning': '\033[93m⚠\033[0m', 
            'error': '\033[91m✗\033[0m'
        }
        print(f"{color.get(status, '•')} {service}: {message}")
        
    def check_vercel_cli(self):
        """בדיקת Vercel CLI"""
        try:
            result = subprocess.run(['vercel', '--version'], 
                                  capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                version = result.stdout.strip()
                self.log_result('Vercel CLI', 'success', f'מותקן - {version}')
                
                # בדיקת התחברות
                auth_result = subprocess.run(['vercel', 'whoami'], 
                                           capture_output=True, text=True, timeout=10)
                if auth_result.returncode == 0:
                    user = auth_result.stdout.strip()
                    self.log_result('Vercel Auth', 'success', f'מחובר כ-{user}')
                else:
                    self.log_result('Vercel Auth', 'warning', 'לא מחובר - צריך להריץ vercel login')
            else:
                self.log_result('Vercel CLI', 'error', 'לא מותקן או לא פועל')
        except FileNotFoundError:
            self.log_result('Vercel CLI', 'error', 'לא מותקן - הרץ: npm install -g vercel')
        except subprocess.TimeoutExpired:
            self.log_result('Vercel CLI', 'error', 'בדיקה נכשלה - timeout')
            
    def check_gcp_cli(self):
        """בדיקת GCP CLI"""
        try:
            result = subprocess.run(['gcloud', '--version'], 
                                  capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                version_info = result.stdout.split('\n')[0]
                self.log_result('GCP CLI', 'success', f'מותקן - {version_info}')
                
                # בדיקת Authentication
                auth_result = subprocess.run(['gcloud', 'auth', 'list', '--format=json'], 
                                           capture_output=True, text=True, timeout=10)
                if auth_result.returncode == 0:
                    try:
                        auth_data = json.loads(auth_result.stdout)
                        active_accounts = [acc for acc in auth_data if acc.get('status') == 'ACTIVE']
                        if active_accounts:
                            account = active_accounts[0]['account']
                            self.log_result('GCP Auth', 'success', f'מחובר כ-{account}')
                        else:
                            self.log_result('GCP Auth', 'warning', 'לא מחובר - צריך להריץ gcloud auth login')
                    except json.JSONDecodeError:
                        self.log_result('GCP Auth', 'warning', 'לא ניתן לפרש מידע authentication')
                
                # בדיקת Project
                project_result = subprocess.run(['gcloud', 'config', 'get-value', 'project'], 
                                              capture_output=True, text=True, timeout=10)
                if project_result.returncode == 0 and project_result.stdout.strip():
                    project = project_result.stdout.strip()
                    self.log_result('GCP Project', 'success', f'פרויקט מוגדר: {project}')
                else:
                    self.log_result('GCP Project', 'warning', 'אין פרויקט מוגדר - הגדר עם: gcloud config set project PROJECT_ID')
                    
            else:
                self.log_result('GCP CLI', 'error', 'לא מותקן או לא פועל')
        except FileNotFoundError:
            self.log_result('GCP CLI', 'error', 'לא מותקן - התקן מhttps://cloud.google.com/sdk/docs/install')
        except subprocess.TimeoutExpired:
            self.log_result('GCP CLI', 'error', 'בדיקה נכשלה - timeout')
            
    def check_vercel_api(self):
        """בדיקת Vercel API"""
        token = os.getenv('VERCEL_TOKEN')
        if not token:
            self.log_result('Vercel API', 'warning', 'אין VERCEL_TOKEN - הגדר עם: vercel env add VERCEL_TOKEN')
            return
            
        try:
            headers = {'Authorization': f'Bearer {token}'}
            response = requests.get('https://api.vercel.com/v2/user', headers=headers, timeout=10)
            
            if response.status_code == 200:
                user_data = response.json()
                username = user_data.get('username', 'Unknown')
                self.log_result('Vercel API', 'success', f'API זמין - משתמש: {username}')
                
                # בדיקת Projects
                projects_response = requests.get('https://api.vercel.com/v9/projects', 
                                               headers=headers, timeout=10)
                if projects_response.status_code == 200:
                    projects = projects_response.json().get('projects', [])
                    self.log_result('Vercel Projects', 'success', f'{len(projects)} פרויקטים זמינים')
                else:
                    self.log_result('Vercel Projects', 'warning', 'לא ניתן לגשת לפרויקטים')
                    
            elif response.status_code == 401:
                self.log_result('Vercel API', 'error', 'Token לא תקין')
            else:
                self.log_result('Vercel API', 'error', f'שגיאה: {response.status_code}')
        except requests.RequestException as e:
            self.log_result('Vercel API', 'error', f'שגיאת חיבור: {str(e)}')
            
    def check_v0_access(self):
        """בדיקת גישה ל-v0.dev"""
        try:
            # בדיקה בסיסית של זמינות האתר עם headers מתאימים
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
            response = requests.get('https://v0.dev', headers=headers, timeout=15)
            if response.status_code == 200:
                self.log_result('v0.dev Site', 'success', 'האתר זמין')
                
                # בדיקת API token אם קיים
                v0_token = os.getenv('V0_API_KEY')
                if v0_token:
                    self.log_result('v0.dev API', 'success', 'Token מוגדר - נדרש לבדוק API access')
                else:
                    self.log_result('v0.dev API', 'warning', 'אין V0_API_KEY מוגדר')
            elif response.status_code == 429:
                self.log_result('v0.dev Site', 'warning', 'Rate limit זמני - האתר זמין אבל מוגבל')
            else:
                self.log_result('v0.dev Site', 'error', f'שגיאה: {response.status_code}')
        except requests.RequestException as e:
            if "429" in str(e):
                self.log_result('v0.dev Site', 'warning', 'Rate limit זמני - האתר זמין')
            else:
                self.log_result('v0.dev Site', 'error', f'שגיאת חיבור: {str(e)}')
            
    def check_env_variables(self):
        """בדיקת משתני סביבה חיוניים"""
        required_vars = {
            'VERCEL_TOKEN': 'Vercel API access',
            'GCP_PROJECT_ID': 'Google Cloud Project ID',
            'V0_API_KEY': 'v0.dev API access (אופציונלי)',
            'DATABASE_URL': 'Database connection (אופציונלי)',
        }
        
        # נסה לקרוא משתנים מ-.env.local גם
        env_local_vars = {}
        try:
            with open('.env.local', 'r') as f:
                for line in f:
                    line = line.strip()
                    if '=' in line and not line.startswith('#'):
                        key, value = line.split('=', 1)
                        env_local_vars[key] = value
        except FileNotFoundError:
            pass
        
        for var, description in required_vars.items():
            value = os.getenv(var) or env_local_vars.get(var)
            if value:
                # הסתר tokens רגישים
                display_value = value[:8] + '...' if len(value) > 8 else value
                self.log_result(f'ENV: {var}', 'success', f'מוגדר - {display_value}')
            else:
                status = 'warning' if 'אופציונלי' in description else 'error'
                self.log_result(f'ENV: {var}', status, f'לא מוגדר - {description}')
                
    def check_package_json(self):
        """בדיקת package.json לתלויות נדרשות"""
        try:
            with open('package.json', 'r') as f:
                package_data = json.load(f)
                
            required_deps = {
                'next': 'Next.js framework',
                '@vercel/analytics': 'Vercel Analytics',
                '@vercel/speed-insights': 'Vercel Speed Insights',
            }
            
            all_deps = {
                **package_data.get('dependencies', {}),
                **package_data.get('devDependencies', {})
            }
            
            for dep, description in required_deps.items():
                if dep in all_deps:
                    version = all_deps[dep]
                    self.log_result(f'Package: {dep}', 'success', f'מותקן - {version}')
                else:
                    self.log_result(f'Package: {dep}', 'warning', f'לא מותקן - {description}')
                    
        except FileNotFoundError:
            self.log_result('package.json', 'error', 'קובץ לא נמצא')
        except json.JSONDecodeError:
            self.log_result('package.json', 'error', 'קובץ פגום')
            
    def check_next_config(self):
        """בדיקת next.config.ts"""
        config_files = ['next.config.ts', 'next.config.js', 'next.config.mjs']
        found_config = None
        
        for config_file in config_files:
            if os.path.exists(config_file):
                found_config = config_file
                break
                
        if found_config:
            self.log_result('Next.js Config', 'success', f'נמצא: {found_config}')
            
            # בדיקת תוכן בסיסי
            try:
                with open(found_config, 'r') as f:
                    content = f.read()
                    
                if 'experimental' in content:
                    self.log_result('Next.js Experimental', 'success', 'תכונות ניסיוניות מוגדרות')
                else:
                    self.log_result('Next.js Experimental', 'warning', 'אין תכונות ניסיוניות - מומלץ להוסיף')
                    
                if 'turbopack' in content:
                    self.log_result('Turbopack', 'success', 'מוגדר בקונפיגורציה')
                else:
                    # בדיקה ב-package.json scripts
                    try:
                        with open('package.json', 'r') as pkg_f:
                            pkg_data = json.load(pkg_f)
                            scripts = pkg_data.get('scripts', {})
                            dev_script = scripts.get('dev', '')
                            if '--turbopack' in dev_script:
                                self.log_result('Turbopack', 'success', 'מוגדר ב-dev script')
                            else:
                                self.log_result('Turbopack', 'warning', 'לא מוגדר - מומלץ להוסיף')
                    except:
                        self.log_result('Turbopack', 'warning', 'לא מוגדר - מומלץ להוסיף')
                    
            except Exception as e:
                self.log_result('Next.js Config Content', 'warning', f'לא ניתן לקרוא: {str(e)}')
        else:
            self.log_result('Next.js Config', 'warning', 'קובץ קונפיגורציה לא נמצא')
            
    def generate_report(self):
        """יוצר דוח סיכום"""
        end_time = datetime.now()
        duration = (end_time - self.start_time).total_seconds()
        
        print(f"\n{'='*60}")
        print(f"🔍 דוח בדיקת מערכת - {self.start_time.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"⏱️  משך הבדיקה: {duration:.2f} שניות")
        print(f"{'='*60}")
        
        # ספירת תוצאות
        success_count = len([r for r in self.results if r['status'] == 'success'])
        warning_count = len([r for r in self.results if r['status'] == 'warning'])
        error_count = len([r for r in self.results if r['status'] == 'error'])
        
        print(f"✅ הצלחות: {success_count}")
        print(f"⚠️  אזהרות: {warning_count}")
        print(f"❌ שגיאות: {error_count}")
        
        if error_count == 0 and warning_count == 0:
            print(f"\n🎉 כל המערכות פועלות כהלכה!")
        elif error_count == 0:
            print(f"\n✨ המערכת פועלת עם מספר אזהרות")
        else:
            print(f"\n⚠️  יש בעיות שדורשות תשומת לב")
            
        # המלצות לפעולה
        print(f"\n📋 המלצות לפעולה:")
        for result in self.results:
            if result['status'] == 'error':
                print(f"🔴 {result['service']}: {result['message']}")
            elif result['status'] == 'warning':
                print(f"🟡 {result['service']}: {result['message']}")
                
        # שמירת דוח JSON
        report_file = f"system_check_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump({
                'timestamp': self.start_time.isoformat(),
                'duration_seconds': duration,
                'summary': {
                    'success': success_count,
                    'warnings': warning_count,
                    'errors': error_count
                },
                'results': self.results
            }, f, ensure_ascii=False, indent=2)
            
        print(f"\n💾 דוח נשמר ב: {report_file}")
        
    def run_all_checks(self):
        """מריץ את כל הבדיקות"""
        print("🚀 מתחיל בדיקת מערכת...\n")
        
        self.check_vercel_cli()
        self.check_gcp_cli()
        self.check_vercel_api()
        self.check_v0_access()
        self.check_env_variables()
        self.check_package_json()
        self.check_next_config()
        self.check_analytics_setup()
        self.check_deployment_readiness()
        
        self.generate_report()
        
    def check_analytics_setup(self):
        """בדיקת הגדרות Analytics"""
        try:
            # בדיקת layout.tsx לAnalytics components
            with open('src/app/layout.tsx', 'r') as f:
                layout_content = f.read()
                
            if '@vercel/analytics' in layout_content and 'Analytics' in layout_content:
                self.log_result('Vercel Analytics', 'success', 'מוגדר ב-layout')
            else:
                self.log_result('Vercel Analytics', 'warning', 'לא מוגדר ב-layout')
                
            if '@vercel/speed-insights' in layout_content and 'SpeedInsights' in layout_content:
                self.log_result('Speed Insights', 'success', 'מוגדר ב-layout')
            else:
                self.log_result('Speed Insights', 'warning', 'לא מוגדר ב-layout')
                
        except FileNotFoundError:
            self.log_result('Layout Check', 'error', 'src/app/layout.tsx לא נמצא')
            
    def check_deployment_readiness(self):
        """בדיקת מוכנות לפריסה"""
        
        # בדיקת .vercel directory
        if os.path.exists('.vercel/project.json'):
            try:
                with open('.vercel/project.json', 'r') as f:
                    vercel_config = json.load(f)
                    project_id = vercel_config.get('projectId', '')
                    if project_id:
                        self.log_result('Vercel Project Link', 'success', f'מחובר לפרויקט: {project_id[:12]}...')
                    else:
                        self.log_result('Vercel Project Link', 'warning', 'אין project ID')
            except:
                self.log_result('Vercel Project Link', 'error', 'שגיאה בקריאת קונפיגורציה')
        else:
            self.log_result('Vercel Project Link', 'warning', 'לא מחובר לפרויקט Vercel')
            
        # בדיקת vercel.json
        if os.path.exists('vercel.json'):
            self.log_result('Vercel Config', 'success', 'vercel.json קיים')
        else:
            self.log_result('Vercel Config', 'warning', 'vercel.json לא קיים')
            
        # בדיקת .vercelignore
        if os.path.exists('.vercelignore'):
            self.log_result('Vercel Ignore', 'success', '.vercelignore מוגדר')
        else:
            self.log_result('Vercel Ignore', 'warning', '.vercelignore חסר')

def main():
    """פונקציה ראשית"""
    checker = APIChecker()
    checker.run_all_checks()

if __name__ == "__main__":
    main()
