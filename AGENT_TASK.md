# 🤖 משימה לסוכן AI - מימוש מלא של פרויקט LionSpace

## הוראות לסוכן

אתה נמצא בפרויקט Next.js 15.5.2 שכבר מוגדר עם כל התשתית אבל חסר בו כל הקוד. 
**המשימה שלך:** לממש את כל הפיצ'רים החסרים בפרויקט.

### 📍 מיקום הפרויקט
```
/Users/daniel/LionSpace-Project/
```

### 🎯 המשימה המלאה

**בצע את כל הצעדים הבאים בסדר:**

## שלב 1: התקנת Dependencies
```bash
cd /Users/daniel/LionSpace-Project
npm install next-auth @auth/prisma-adapter @google/generative-ai framer-motion @radix-ui/react-icons @radix-ui/react-dropdown-menu @radix-ui/react-avatar @radix-ui/react-dialog lucide-react
```

## שלב 2: יצירת Google OAuth Authentication

### 2.1 צור את `/src/lib/auth-options.ts`:
```typescript
import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token
      }
      return token
    }
  },
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/auth/error',
  }
}
```

### 2.2 צור את `/src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth-options'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### 2.3 צור את `/src/app/providers.tsx`:
```typescript
'use client'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

### 2.4 עדכן את `/src/app/layout.tsx` - הוסף את Providers

## שלב 3: יצירת Gemini AI Integration

### 3.1 צור את `/src/lib/gemini.ts`:
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateAIResponse(prompt: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text()
}
```

### 3.2 צור את `/src/app/api/chat/route.ts`:
```typescript
import { generateAIResponse } from '@/lib/gemini'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    const response = await generateAIResponse(message)
    return NextResponse.json({ response })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}
```

## שלב 4: יצירת Landing Page מרשים

### 4.1 עדכן את `/src/app/page.tsx`:
```typescript
import { Button } from '@/components/ui/button'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Lions of Zion
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            חוויית AI מתקדמת עם אינטגרציה של Google Cloud
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => signIn('google')}>
              התחבר עם Google
            </Button>
            <Link href="/chat">
              <Button size="lg" variant="outline">
                התחל צ'אט עם AI
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            title="🤖 Gemini AI" 
            description="צ'אט חכם עם מודל השפה המתקדם של Google"
          />
          <FeatureCard 
            title="🔐 אימות מאובטח" 
            description="התחברות מהירה ובטוחה עם חשבון Google"
          />
          <FeatureCard 
            title="☁️ Google Cloud" 
            description="תשתית ענן מתקדמת לביצועים מעולים"
          />
        </div>
      </section>
    </div>
  )
}
```

## שלב 5: יצירת Chat Interface

### 5.1 צור את `/src/components/ChatInterface.tsx`:
```typescript
'use client'
import { useState } from 'react'
import { Send } from 'lucide-react'

export function ChatInterface() {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    
    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-center text-gray-500">AI חושב...</div>}
      </div>

      {/* Input Area */}
      <div className="border-t p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="הקלד הודעה..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}
```

### 5.2 צור את `/src/app/chat/page.tsx`:
```typescript
import { ChatInterface } from '@/components/ChatInterface'

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Gemini AI Chat</h1>
      <ChatInterface />
    </div>
  )
}
```

## שלב 6: יצירת Dashboard

### 6.1 צור את `/src/app/dashboard/page.tsx`:
```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ברוך הבא, {session.user?.name}!</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="צ'אטים אחרונים" count={0} />
        <DashboardCard title="הודעות שנשלחו" count={0} />
        <DashboardCard title="זמן שימוש" count="0 דקות" />
      </div>
    </div>
  )
}
```

## שלב 7: יצירת Middleware להגנה

### 7.1 צור את `/src/middleware.ts`:
```typescript
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/',
  },
})

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*']
}
```

## שלב 8: יצירת Navigation Component

### 8.1 צור את `/src/components/Navigation.tsx`:
```typescript
'use client'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Menu, X, User } from 'lucide-react'
import { useState } from 'react'

export function Navigation() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            🦁 Lions of Zion
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="hover:text-blue-600">בית</Link>
            <Link href="/chat" className="hover:text-blue-600">צ'אט AI</Link>
            {session && (
              <Link href="/dashboard" className="hover:text-blue-600">לוח בקרה</Link>
            )}
            
            {session ? (
              <div className="flex items-center gap-3">
                <img src={session.user?.image || ''} alt="" className="w-8 h-8 rounded-full" />
                <button onClick={() => signOut()} className="text-red-600">
                  התנתק
                </button>
              </div>
            ) : (
              <button onClick={() => signIn('google')} className="bg-blue-600 text-white px-4 py-2 rounded">
                התחבר
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
```

## שלב 9: עדכון Layout הראשי

עדכן את `/src/app/layout.tsx`:
- הוסף את Navigation component
- הוסף את Providers wrapper
- הוסף metadata נכון

## שלב 10: בדיקות סופיות

### רשימת בדיקות:
1. ✅ בדוק שהאתר עולה ב-localhost:3000
2. ✅ בדוק שGoogle OAuth עובד
3. ✅ בדוק שהצ'אט עם Gemini AI מחזיר תשובות
4. ✅ בדוק שהדשבורד מוגן (רק למשתמשים מחוברים)
5. ✅ בדוק שהאתר responsive במובייל
6. ✅ בדוק שאין שגיאות בקונסול

## שלב 11: Commit ו-Push

```bash
git add .
git commit -m "Implement complete LionSpace application with OAuth, Gemini AI, and Dashboard"
git push origin main
```

---

## 📝 הערות חשובות לסוכן:

1. **כל משתני הסביבה כבר מוגדרים** - אל תיצור .env חדש
2. **האתר כבר פעיל ב-lionsofzion.io** - השינויים יופיעו אוטומטית
3. **השתמש ב-TypeScript** - הפרויקט מוגדר עם strict mode
4. **השתמש ב-Tailwind CSS** - כבר מוגדר בפרויקט
5. **בדוק את הקוד לפני push** - auto-deploy פעיל

## 🎯 סיכום המשימה:
בצע את כל 11 השלבים בסדר. בסוף התהליך צריך להיות אתר מלא עם:
- ✅ Google OAuth login
- ✅ Gemini AI chat
- ✅ Dashboard למשתמשים
- ✅ Landing page מעוצב
- ✅ Navigation responsive

**בהצלחה! התחל מהשלב הראשון.**