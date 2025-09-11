import type { Metadata, Viewport } from 'next'
import { Inter, Space_Mono } from 'next/font/google'
import { Providers } from './providers'
import SkipToContent from '@/components/navigation/SkipToContent'
import Header from '@/components/layouts/Header'
import Footer from '@/components/layouts/Footer'
import './globals.css'

// Fonts
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceMono = Space_Mono({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

// Metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://lionsofzion.io'),
  title: {
    default: 'Lions of Zion - Fight Disinformation',
    template: '%s | Lions of Zion'
  },
  description: 'Join the fight against disinformation and influence operations. Real-time threat analysis, fact-checking, and community action.',
  keywords: ['disinformation', 'fact-check', 'truth', 'narrative resistance', 'information warfare'],
  authors: [{ name: 'Lions of Zion' }],
  creator: 'Lions of Zion',
  publisher: 'Lions of Zion',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lionsofzion.io',
    siteName: 'Lions of Zion',
    title: 'Lions of Zion - Fight Disinformation',
    description: 'Join the fight against disinformation and influence operations.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lions of Zion - Truth Defenders',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lions of Zion - Fight Disinformation',
    description: 'Join the fight against disinformation and influence operations.',
    images: ['/og-image.png'],
    creator: '@lionsofzion',
  },
  alternates: {
    canonical: 'https://lionsofzion.io',
    languages: {
      'en-US': '/en',
      'he-IL': '/he',
      'es-ES': '/es',
      'fr-FR': '/fr',
      'de-DE': '/de',
      'ar-SA': '/ar',
    }
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#030712',
}

// Supported locales
const rtlLocales = ['he', 'ar']

interface RootLayoutProps {
  children: React.ReactNode
  params: { locale?: string }
}

export default function RootLayout({
  children,
  params
}: RootLayoutProps) {
  const locale = params.locale || 'en'
  const dir = rtlLocales.includes(locale) ? 'rtl' : 'ltr'
  
  return (
    <html 
      lang={locale} 
      dir={dir} 
      className={`${inter.variable} ${spaceMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <SkipToContent />
        <Providers locale={locale}>
          <div className="relative flex min-h-screen flex-col">
            <Header locale={locale} />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer locale={locale} />
          </div>
        </Providers>
      </body>
    </html>
  )
}
