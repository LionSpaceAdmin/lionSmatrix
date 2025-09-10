import type { Metadata, Viewport } from 'next';
// import { Inter } from 'next/font/google';
import './globals.css';

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.lionsofzion.io'),
  title: {
    default: 'LionSpace Intelligence - Advanced Threat Analysis Platform',
    template: '%s | LionSpace Intelligence'
  },
  description: 'Navigate narratives with precision. Advanced intelligence platform for threat analysis, narrative resistance, and strategic insights.',
  keywords: ['intelligence platform', 'threat analysis', 'narrative resistance', 'strategic insights', 'security analysis', 'data visualization', 'real-time monitoring'],
  authors: [{ name: 'LionSpace Team' }],
  creator: 'LionSpace',
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
    url: 'https://www.lionsofzion.io',
    siteName: 'LionSpace Intelligence',
    title: 'LionSpace Intelligence - Advanced Threat Analysis Platform',
    description: 'Navigate narratives with precision. Advanced intelligence platform for threat analysis and strategic insights.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LionSpace Intelligence Platform',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LionSpace Intelligence',
    description: 'Advanced intelligence platform for threat analysis and strategic insights',
    images: ['/og-image.png'],
    creator: '@lionspace',
  },
  alternates: {
    canonical: 'https://www.lionsofzion.io',
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
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#030712',
};

import { TranslationProvider } from '@/contexts/translation-context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="dark" suppressHydrationWarning>
      <body className="bg-terminal-bg text-terminal-text font-sans dark:bg-terminal-bg dark:text-terminal-text min-h-screen">
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}