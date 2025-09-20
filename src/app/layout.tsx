import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { Providers } from './providers';
import './globals.css';
import { cn } from '@/lib/utils';

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", "min-h-screen bg-background")}>
        <Providers>
            {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
