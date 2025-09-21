import type { Metadata } from 'next';
import { Space_Mono } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';
import { isRTL } from '@/lib/i18n';
import Link from 'next/link';

const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: {
    default: "Zion&apos;s Shield",
    template: "%s | Zion&apos;s Shield",
  },
  description: 'A collective defense platform against digital threats. We identify, analyze, and combat coordinated misinformation campaigns in real-time.',
  openGraph: {
    title: "Zion&apos;s Shield",
    description: 'A collective defense platform against digital threats.',
    url: 'https://zions-shield.com',
    siteName: "Zion&apos;s Shield",
    images: [
      {
        url: 'https://zions-shield.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Zion&apos;s Shield",
    description: 'A collective defense platform against digital threats.',
    images: ['https://zions-shield.com/twitter-image.png'],
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const direction = isRTL(locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} className="dark" suppressHydrationWarning>
      <head>
        {/* Add skip-to-content link here */}
        <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
      </head>
      <body className={`${spaceMono.className} dark`}>
        <Providers locale={locale}>
          <header className="p-4 border-b border-terminal-border">
            {/* Basic Header Content */}
            <nav>
              <Link href="/" className="text-terminal-green text-xl font-bold">Zion&apos;s Shield</Link>
            </nav>
          </header>
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          <footer className="p-4 border-t border-terminal-border text-center text-terminal-muted text-sm">
            {/* Basic Footer Content */}
            <p>&copy; {new Date().getFullYear()} Zion&apos;s Shield. All rights reserved.</p>
            <nav className="mt-2">
              <Link href="/legal/privacy" className="text-terminal-cyan hover:underline mx-2">Privacy Policy</Link>
              <Link href="/legal/terms" className="text-terminal-cyan hover:underline mx-2">Terms of Service</Link>
            </nav>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
