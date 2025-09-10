# הוראות הגדרת Vercel Token

## פרטי הפרויקט
- **Project ID**: `prj_7Lu8nVA6Jw8vY91qcfVVtNAirWfP`
- **Project Name**: `nextjs-enterprise-boilerplate`
- **Organization**: `lionsteam`

## שלבי ההגדרה

### 1. העתקת המפתח
כאשר תשלח את מפתח ה-Vercel:
1. העתק את המפתח
2. צור קובץ `.env.local` (לא יעלה ל-git)
3. הוסף את השורה: `VERCEL_TOKEN=your-actual-token`

### 2. הגדרת משתני סביבה נוספים
```bash
# העתק מ-.env.example ל-.env.local
cp .env.example .env.local

# ערוך את הקובץ עם הפרטים האמיתיים
```

### 3. התקנת Vercel CLI
```bash
# התקנה גלובלית
npm i -g vercel

# או השימוש ב-pnpm
pnpm add -g vercel
```

### 4. התחברות ל-Vercel
```bash
# התחברות עם הטוקן
vercel login --token your-actual-token

# או
vercel login
# ואז הזן את הטוקן
```

### 5. קישור הפרויקט
```bash
# מתוך תיקיית הפרויקט
vercel link --project=prj_7Lu8nVA6Jw8vY91qcfVVtNAirWfP

# או 
vercel link
# ואז בחר את הפרויקט הקיים
```

### 6. פריסה
```bash
# פריסה לטסט
vercel

# פריסה לייצור
vercel --prod
```

## פרטים טכניים
- Framework: Next.js 15
- Package Manager: pnpm (מומלץ)
- Runtime: Node.js 20
- Region: iad1 (East Coast US)

## אבטחה
- הקובץ `.env.local` לא יעלה ל-git
- משתני הסביבה יוגדרו ב-Vercel dashboard
- Headers אבטחה מוגדרים ב-vercel.json