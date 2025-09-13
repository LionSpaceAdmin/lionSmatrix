# 🚀 Lions of Zion Deployment Configuration

עדכן והגדר בהתבסס על הנתונים שסופקו ב-JSON.

## 📊 פרטי פרויקט מעודכנים

### 🏢 **GCP Project: lionspace**
- **Project ID**: `lionspace`
- **Project Number**: `707897822334`
- **Region**: `us-east1`
- **Zone**: `us-east1-b`

### 👤 **חשבונות משתמש**
- **ארגוני**: `admin@lionsofzion-official.org` (Workspace Admin)
- **אישי**: `hanudani@gmail.com` (Personal GCP Credits - חיוב ראשי)

### 🔑 **Service Account**
- **Email**: `superadmin-sa@lionspace.iam.gserviceaccount.com`
- **Client ID**: `106343873869122378740`
- **Private Key ID**: `f9f4da2ea443b9721d7f669aeba193d927ed44c6`

### 🌐 **OAuth Configuration**
- **Client ID**: `707897822334-64mvh2c58cffh1qq60i3005jc9a6cop7.apps.googleusercontent.com`
- **Client Secret**: `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`

### 🔗 **Redirect URIs** (מעודכן)
```
https://www.lionsofzion.io/api/auth/callback/google
https://lionsofzion.io/api/auth/callback/google  
https://v0-lion-space.vercel.app/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

### 🌍 **JavaScript Origins**
```
https://www.lionsofzion.io
https://lionsofzion.io
https://v0-lion-space.vercel.app
http://localhost:3000
```

## 🔧 **API Keys & Tokens**

### 🤖 **AI Services**
- **Gemini API**: `AIzaSyAPuNElhrPLMKrZVEKoxNu6_Cwn_FFXoAg`

### 🚀 **Vercel**
- **Token**: `kHqVTQ8sr6ryaJvskfkRu7wJ`


### 🔗 **GitHub Integration**
- **Account**: `LionSpaceAdmin`
- **Repository**: `lionSmatrix`
- **URL**: `https://github.com/LionSpaceAdmin/lionSmatrix`

## 🌐 **Production URLs**
- **Primary**: `https://www.lionsofzion.io`
- **Alternative**: `https://lionsofzion.io`
- **Vercel Preview**: `https://v0-lion-space.vercel.app`

## ⚠️ **הערות חשובות**

### 💳 **חיוב**
- **חשבון חיוב**: `hanudani@gmail.com`
- **סוג**: Personal GCP Credits
- **⚠️ חשוב**: יש להשתמש ב-Personal Credits ולא באקונט הארגוני

### 🔒 **Service Account Key**
צריך ליצור ולהוריד את מפתח ה-Service Account:
```bash
gcloud iam service-accounts keys create \
    ./lionspace-service-account-key.json \
    --iam-account=superadmin-sa@lionspace.iam.gserviceaccount.com
```

### 📁 **מיקום קבצים**
- **Service Account Key**: `./lionspace-service-account-key.json`
- **Environment File**: `./.env.local`

## 🛠️ **פקודות הגדרה**

### 1. עדכון GCP Context
```bash
gcloud config set project lionspace
gcloud config set compute/region us-east1
gcloud config set compute/zone us-east1-b
```

### 2. יצירת Service Account Key
```bash
gcloud iam service-accounts keys create \
    ./lionspace-service-account-key.json \
    --iam-account=superadmin-sa@lionspace.iam.gserviceaccount.com
```

### 3. בדיקת הגדרות
```bash
# בדיקת OAuth
curl -X POST https://oauth2.googleapis.com/token \
  -d "client_id=707897822334-64mvh2c58cffh1qq60i3005jc9a6cop7.apps.googleusercontent.com" \
  -d "client_secret=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"

# בדיקת Gemini API
curl -X POST \
  "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyAPuNElhrPLMKrZVEKoxNu6_Cwn_FFXoAg" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Test"}]}]}'
```

## 🚦 **סטטוס הגדרה**

- ✅ **GCP Project** מוכן
- ✅ **OAuth Client** מעודכן
- ✅ **Redirect URIs** מוגדרים
- ✅ **API Keys** מוכנים
- ⚠️ **Service Account Key** דורש הורדה
- ✅ **Environment Variables** מעודכנים

## 🔄 **צעדים הבאים**

1. **הורד Service Account Key** מ-GCP Console
2. **בדוק חיבור** ל-APIs
3. **הרץ בדיקות** אינטגרציה
4. **פרוס לסביבת ייצור** בVercel

---

*עדכן על ידי: @Dev Environment Manager*
*תאריך: ספטמבר 2025*