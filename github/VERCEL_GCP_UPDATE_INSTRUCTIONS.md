# הוראות עדכון Vercel ו-GCP לדומיין lionsofzion.io

## 1. עדכונים נדרשים ב-Vercel Dashboard

### א. הגדרת Environment Variables
נכנס ל: **Settings → Environment Variables**

הוסף את המשתנים הבאים:

```bash
GOOGLE_CLOUD_PROJECT=lionspace
NEXT_PUBLIC_GOOGLE_CLIENT_ID=707897822334-64mvh2c58cffh1qq60i3005jc9a6cop7.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GEMINI_API_KEY=AIzaSyAPuNElhrPLMKrZVEKoxNu6_Cwn_FFXoAg
NEXTAUTH_SECRET=[צריך לייצר עם: openssl rand -base64 32]
NEXTAUTH_URL=https://www.lionsofzion.io
NODE_ENV=production
```

### ב. וידוא דומיין
נכנס ל: **Settings → Domains**

ודא שמוגדר:
- www.lionsofzion.io (primary)
- lionsofzion.io (redirect to www)

### ג. חיבור Repository
נכנס ל: **Settings → Git**

חבר את הריפו:
- GitHub Account: LionSpaceAdmin
- Repository: modern-nextjs-app
- Branch: main

## 2. עדכון OAuth ב-Google Cloud Console

### פתח את הלינק:
https://console.cloud.google.com/apis/credentials?project=lionspace

### עדכן את OAuth 2.0 Client:
1. לחץ על: **707897822334-f9a3fi3kfacnsrjpqt48k38lcqdvan1g.apps.googleusercontent.com**

2. עדכן **Authorized JavaScript origins**:
   - https://lionsofzion.io
   - https://www.lionsofzion.io
   - https://v0-lion-space.vercel.app

3. עדכן **Authorized redirect URIs**:
   - https://lionsofzion.io/api/auth/callback/google
   - https://www.lionsofzion.io/api/auth/callback/google
   - https://v0-lion-space.vercel.app/api/auth/callback/google

4. לחץ **Save**

## 3. השגת Gemini API Key

1. גש ל: https://aistudio.google.com/app/apikey
2. לחץ על **Create API Key**
3. בחר את הפרויקט **lionspace**
4. העתק את ה-API Key
5. הוסף אותו ל-Vercel Environment Variables

## 4. Redeploy ב-Vercel

אחרי כל העדכונים:
1. לך ל-**Deployments** ב-Vercel
2. לחץ על שלוש הנקודות ליד ה-deployment האחרון
3. בחר **Redeploy**
4. המתן לסיום ה-build

## 5. בדיקת התקנה

בדוק ש:
- ✅ האתר עולה ב: https://www.lionsofzion.io
- ✅ Google Login עובד
- ✅ Gemini AI functionality עובד
- ✅ כל ה-environment variables נטענים כמו שצריך

## פקודות שימושיות

```bash
# בדיקת סטטוס Vercel
vercel ls

# בדיקת environment variables
vercel env ls

# בדיקת logs
vercel logs --follow

# Deploy ידני
vercel --prod
```

## תמיכה

אם יש בעיות:
1. בדוק את ה-logs ב-Vercel Dashboard → Functions
2. וודא שכל ה-environment variables מוגדרים נכון
3. וודא ש-OAuth redirect URIs מעודכנים ב-GCP

---
עדכון אחרון: 2025-09-04