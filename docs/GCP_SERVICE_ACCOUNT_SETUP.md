# 🔐 Google Cloud Platform Service Account Setup

מדריך מפורט להקמת Service Account עבור פלטפורמת Lions of Zion.

## 📋 תוכן העניינים

1. [יצירת GCP Project](#1-יצירת-gcp-project)
2. [הפעלת APIs נדרשים](#2-הפעלת-apis-נדרשים)
3. [יצירת Service Account](#3-יצירת-service-account)
4. [הורדת מפתח JSON](#4-הורדת-מפתח-json)
5. [הגדרת Environment Variables](#5-הגדרת-environment-variables)
6. [בדיקת החיבור](#6-בדיקת-החיבור)
7. [שיטות אבטחה](#7-שיטות-אבטחה)

---

## 1. יצירת GCP Project

### 🌐 דרך הקונסול:
1. עבור ל-[Google Cloud Console](https://console.cloud.google.com/)
2. לחץ על "Select a project" → "NEW PROJECT"
3. הכנס שם פרויקט: `lions-of-zion-platform`
4. בחר ארגון (אם יש)
5. לחץ "CREATE"

### 💻 דרך CLI:
```bash
# התקנת gcloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# התחברות לחשבון
gcloud auth login

# יצירת פרויקט חדש
gcloud projects create lions-of-zion-platform \
    --name="Lions of Zion Platform" \
    --set-as-default

# קישור לחשבון חיוב (נדרש)
gcloud billing accounts list
gcloud billing projects link lions-of-zion-platform \
    --billing-account=YOUR_BILLING_ACCOUNT_ID
```

---

## 2. הפעלת APIs נדרשים

### 🔧 APIs שצריך להפעיל:

```bash
# הגדרת פרויקט כברירת מחדל
gcloud config set project lions-of-zion-platform

# הפעלת APIs הנדרשים
gcloud services enable \
    aiplatform.googleapis.com \
    vision.googleapis.com \
    translate.googleapis.com \
    storage.googleapis.com \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    cloudresourcemanager.googleapis.com \
    iam.googleapis.com \
    compute.googleapis.com
```

### 🌐 דרך הקונסול:
1. עבור ל-[APIs & Services](https://console.cloud.google.com/apis/dashboard)
2. לחץ "+ ENABLE APIS AND SERVICES"
3. חפש והפעל כל API:
   - **Vertex AI API** - לשירותי AI
   - **Cloud Vision API** - לניתוח תמונות
   - **Cloud Translation API** - לתרגום
   - **Cloud Storage API** - לאחסון קבצים
   - **Cloud Build API** - ל-CI/CD
   - **Cloud Run API** - להרצת containers
   - **IAM API** - לניהול הרשאות

---

## 3. יצירת Service Account

### 💻 דרך CLI (מומלץ):
```bash
# יצירת Service Account
gcloud iam service-accounts create lions-platform-sa \
    --display-name="Lions of Zion Platform Service Account" \
    --description="Service account for Lions of Zion platform operations"

# קבלת email של ה-Service Account
SA_EMAIL=$(gcloud iam service-accounts list \
    --filter="displayName:'Lions of Zion Platform Service Account'" \
    --format="value(email)")

echo "Service Account Email: $SA_EMAIL"
```

### 🌐 דרך הקונסול:
1. עבור ל-[IAM & Admin > Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. לחץ "+ CREATE SERVICE ACCOUNT"
3. מלא פרטים:
   - **Name**: `lions-platform-sa`
   - **Description**: `Service account for Lions of Zion platform`
4. לחץ "CREATE AND CONTINUE"

### 🔐 הקצאת הרשאות:
```bash
# הרשאות בסיסיות
gcloud projects add-iam-policy-binding lions-of-zion-platform \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding lions-of-zion-platform \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/vision.admin"

gcloud projects add-iam-policy-binding lions-of-zion-platform \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/translate.admin"

gcloud projects add-iam-policy-binding lions-of-zion-platform \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/storage.admin"

# הרשאה מינימלית לקריאה (אופציונלי)
gcloud projects add-iam-policy-binding lions-of-zion-platform \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/viewer"
```

### 🌐 דרך הקונסול:
בשלב 2 של יצירת Service Account:
- **Vertex AI User** - `roles/aiplatform.user`
- **Cloud Vision Admin** - `roles/vision.admin`  
- **Cloud Translation Admin** - `roles/translate.admin`
- **Storage Admin** - `roles/storage.admin`

---

## 4. הורדת מפתח JSON

### 💻 דרך CLI:
```bash
# יצירת והורדת מפתח JSON
gcloud iam service-accounts keys create \
    ./gcp-service-account-key.json \
    --iam-account=$SA_EMAIL

# בדיקה שהקובץ נוצר
ls -la gcp-service-account-key.json

# הצגת תוכן (לבדיקה בלבד)
cat gcp-service-account-key.json | jq '.'
```

### 🌐 דרך הקונסול:
1. עבור ל-Service Account שיצרת
2. לחץ על הטאב "KEYS"
3. לחץ "ADD KEY" → "Create new key"
4. בחר "JSON" ולחץ "CREATE"
5. הקובץ יורד אוטומטיט

### 📁 מיקום מומלץ לקובץ:
```bash
# העבר לתיקיית הפרויקט
mv ~/Downloads/lions-of-zion-platform-*.json \
   /path/to/lionspace-platform/gcp-service-account-key.json

# הגדר הרשאות קריאה בלבד
chmod 600 gcp-service-account-key.json

# ודא שהקובץ ב-gitignore
echo "gcp-service-account-key.json" >> .gitignore
```

---

## 5. הגדרת Environment Variables

### 📝 עדכון .env.local:
```bash
# העתק מהתבנית
cp .env.example .env.local

# ערוך את הקובץ
nano .env.local
```

### 🔧 הגדרות נדרשות:
```bash
# GCP Project Configuration
GCP_PROJECT_ID=lions-of-zion-platform
GCP_REGION=us-central1
GCP_ZONE=us-central1-a

# Service Account
GOOGLE_APPLICATION_CREDENTIALS=./gcp-service-account-key.json

# Vertex AI
VERTEX_AI_LOCATION=us-central1
VERTEX_AI_MODEL=gemini-2.5-pro

# Storage
GCS_BUCKET_NAME=lions-of-zion-storage
```

### 🐳 עבור Docker:
```bash
# הוסף ל-docker-compose.yml
volumes:
  - ./gcp-service-account-key.json:/app/gcp-service-account-key.json:ro

environment:
  - GOOGLE_APPLICATION_CREDENTIALS=/app/gcp-service-account-key.json
```

---

## 6. בדיקת החיבור

### 🧪 סקריפט בדיקה:
צור קובץ `scripts/test-gcp-connection.js`:

```javascript
import { GoogleAuth } from 'google-auth-library';
import { VertexAI } from '@google-cloud/vertexai';

async function testGCPConnection() {
  try {
    // בדיקת authentication
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    const client = await auth.getClient();
    const projectId = await auth.getProjectId();
    
    console.log('✅ Authentication successful');
    console.log('📋 Project ID:', projectId);
    
    // בדיקת Vertex AI
    const vertexAI = new VertexAI({
      project: projectId,
      location: 'us-central1'
    });
    
    console.log('✅ Vertex AI client initialized');
    
    // בדיקת Vision API
    const vision = require('@google-cloud/vision');
    const visionClient = new vision.ImageAnnotatorClient();
    
    console.log('✅ Vision API client initialized');
    
    console.log('🎉 All GCP services connected successfully!');
    
  } catch (error) {
    console.error('❌ GCP Connection failed:', error.message);
    process.exit(1);
  }
}

testGCPConnection();
```

### 🏃 הרצת הבדיקה:
```bash
# התקנת dependencies
pnpm add @google-cloud/vertexai @google-cloud/vision google-auth-library

# הרצת הבדיקה
node scripts/test-gcp-connection.js
```

---

## 7. שיטות אבטחה

### 🔒 אבטחת מפתח Service Account:

#### ✅ עשה:
- **אחסן בקובץ منفصל** מחוץ ל-source control
- **הגדר הרשאות 600** (קריאה לבעלים בלבד)
- **השתמש במשתני סביבה** לפרודקשן
- **רוטט מפתחות** כל 90 יום
- **מנטר שימוש** ב-Cloud Audit Logs

#### ❌ אל תעשה:
- **אל תשלח ב-Git** - ודא שב-.gitignore
- **אל תשתף במייל** או בצ'אט
- **אל תשמור בקוד** hardcoded
- **אל תשתמש באותו מפתח** בכל הסביבות

### 🔄 רוטציה של מפתחות:
```bash
# יצירת מפתח חדש
gcloud iam service-accounts keys create \
    ./gcp-service-account-key-new.json \
    --iam-account=$SA_EMAIL

# בדיקה שהמפתח החדש עובד
GOOGLE_APPLICATION_CREDENTIALS=./gcp-service-account-key-new.json \
    node scripts/test-gcp-connection.js

# מחיקת מפתח ישן (רק אחרי שהחדש עובד!)
gcloud iam service-accounts keys list --iam-account=$SA_EMAIL
gcloud iam service-accounts keys delete OLD_KEY_ID \
    --iam-account=$SA_EMAIL
```

### 🏢 עבור פרודקשן:
```bash
# השתמש ב-Secret Manager
gcloud secrets create gcp-service-account-key \
    --data-file=gcp-service-account-key.json

# או ב-Kubernetes Secret
kubectl create secret generic gcp-service-account \
    --from-file=key.json=gcp-service-account-key.json
```

---

## 🚨 פתרון בעיות נפוצות

### ❌ "Permission denied" שגיאות:
```bash
# בדוק שהAPI מופעל
gcloud services list --enabled

# בדוק הרשאות Service Account
gcloud projects get-iam-policy lions-of-zion-platform \
    --flatten="bindings[].members" \
    --filter="bindings.members:$SA_EMAIL"
```

### ❌ "Project not found":
```bash
# ודא שהפרויקט קיים ואתה בעלים
gcloud projects list
gcloud config set project lions-of-zion-platform
```

### ❌ "Invalid credentials":
```bash
# בדוק path למפתח
ls -la $GOOGLE_APPLICATION_CREDENTIALS

# בדוק שהמפתח תקין
cat $GOOGLE_APPLICATION_CREDENTIALS | jq '.type'
```

---

## 📚 משאבים נוספים

- [GCP Service Accounts Documentation](https://cloud.google.com/iam/docs/service-accounts)
- [Vertex AI Authentication](https://cloud.google.com/vertex-ai/docs/authentication)
- [Cloud Vision API Setup](https://cloud.google.com/vision/docs/setup)
- [Best Practices for Service Accounts](https://cloud.google.com/iam/docs/best-practices-service-accounts)

---

## ✅ Checklist הקמה

- [ ] פרויקט GCP נוצר
- [ ] APIs הופעלו (Vertex AI, Vision, Translation, Storage)
- [ ] Service Account נוצר עם הרשאות מתאימות
- [ ] מפתח JSON הורד ואוחסן בבטחה
- [ ] Environment variables הוגדרו
- [ ] Connection test עבר בהצלחה
- [ ] מפתח נוסף ל-.gitignore
- [ ] הרשאות קובץ הוגדרו ל-600

---

*Lions of Zion - Defending Truth in the Information Age* 🦁