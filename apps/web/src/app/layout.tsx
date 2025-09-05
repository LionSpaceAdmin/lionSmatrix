import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LionSpace - Intelligence Platform for Truth Verification',
  description: 'Navigate narratives with precision. Verify truth with confidence.',
  keywords: 'truth verification, narrative resistance, intelligence platform, fact-checking',
  authors: [{ name: 'LionSpace Team' }],
  openGraph: {
    title: 'LionSpace',
    description: 'Intelligence Platform for Truth Verification',
    url: 'https://lionspace.ai',
    siteName: 'LionSpace',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#00ff41',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground font-sans dark:bg-background dark:text-foreground`}>
        {children}
      </body>
    </html>
  );
}