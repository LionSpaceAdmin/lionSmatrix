# 📋 הוראות לסוכן - עדכון קונפיגורציות LionSpace

## משימה
עדכן את הפרויקט `lionspace-cognitive` עם הקונפיגורציות החדשות המצורפות.

## קבצים מצורפים
1. **lionspace-complete-config-updated.json** - קונפיגורציה מלאה של הפרויקט
2. **lionspace-service-account-key.json** - מפתח Service Account (אל תחשוף בקוד!)
3. **google-oauth-credentials-latest.json** - OAuth credentials
4. **.env.example** - דוגמה למשתני סביבה

## פעולות נדרשות

### 1. עדכון Environment Variables
עדכן או צור קובץ `.env.local` בתיקיית השורש עם המשתנים מ-.env.example

### 2. עדכון NextAuth Configuration
וודא שהקובץ `[...nextauth].js` או `[...nextauth].ts` מכיל:
```javascript
providers: [
  GoogleProvider({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  })
]
```

### 3. עדכון Gemini Configuration
וודא שה-Gemini API מוגדר עם:
```javascript
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
```

### 4. בדיקות Security
- **אל תחשוף** את קובץ `lionspace-service-account-key.json` בקוד
- וודא ש-.gitignore כולל:
  ```
  .env
  .env.local
  *.json
  lionspace-service-account-key.json
  ```

### 5. עדכון Domain Configuration
וודא שכל הקישורים מפנים ל-`https://www.lionsofzion.io`

### 6. צור קובץ DEPLOYMENT.md
צור קובץ עם הוראות פריסה מעודכנות הכולל:
- רשימת Environment Variables נדרשים
- הוראות להגדרת Vercel
- בדיקות לאחר פריסה

## בדיקות נדרשות
- [ ] כל ה-environment variables מוגדרים
- [ ] Google OAuth עובד עם הדומיין החדש
- [ ] Gemini API מגיב לבקשות
- [ ] אין credentials חשופים בקוד
- [ ] הפרויקט עובר build בהצלחה

## הערות חשובות
- **דומיין ראשי:** https://www.lionsofzion.io
- **OAuth Redirect:** https://www.lionsofzion.io/api/auth/callback/google
- **כל המפתחות תקפים נכון ל-2025-09-04**

---
בהצלחה! 🚀