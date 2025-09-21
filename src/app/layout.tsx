import type { Metadata } from 'next';
import { Space_Mono } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';
import { isRTL, locales } from '@/lib/i18n';

const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: {
    default: "Zion's Shield",
    template: "%s | Zion's Shield",
  },
  description: 'A collective defense platform against digital threats. We identify, analyze, and combat coordinated misinformation campaigns in real-time.',
  openGraph: {
    title: "Zion's Shield",
    description: 'A collective defense platform against digital threats.',
    url: 'https://zions-shield.com',
    siteName: "Zion's Shield",
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
    title: "Zion's Shield",
    description: 'A collective defense platform against digital threats.',
    images: ['https://zions-shield.com/twitter-image.png'],
  },
};

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
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
              <a href="/" className="text-terminal-green text-xl font-bold">Zion's Shield</a>
            </nav>
          </header>
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          <footer className="p-4 border-t border-terminal-border text-center text-terminal-muted text-sm">
            {/* Basic Footer Content */}
            <p>&copy; {new Date().getFullYear()} Zion's Shield. All rights reserved.</p>
            <nav className="mt-2">
              <a href="/legal/privacy" className="text-terminal-cyan hover:underline mx-2">Privacy Policy</a>
              <a href="/legal/terms" className="text-terminal-cyan hover:underline mx-2">Terms of Service</a>
            </nav>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
