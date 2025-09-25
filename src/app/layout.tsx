import type { Metadata } from 'next';
import { Space_Mono, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { locales } from '@/lib/i18n/config';
import { SplashGuard } from '@/components/layout/splash-guard';

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
});

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-source-sans-3',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.lionsofzion.org'), // Replace with actual domain
  title: {
    default: 'Lions of Zion: Consciousness Warfare Command',
    template: '%s | Lions of Zion',
  },
  description: 'Join the battle for truth. Become a warrior of consciousness.',
  openGraph: {
    title: 'Lions of Zion',
    description: 'Join the battle for truth. Become a warrior of consciousness.',
    url: 'https://www.lionsofzion.org', // Replace with actual domain
    siteName: 'Lions of Zion',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lions of Zion',
    description: 'Join the battle for truth. Become a warrior of consciousness.',
  },
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
      </head>
      <body className={`${spaceMono.variable} ${sourceSans3.variable} font-body text-white bg-background dark`}>
        <Providers locale={locale}>
          <SplashGuard>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main id="main-content" className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </SplashGuard>
        </Providers>
      </body>
    </html>
  );
}
