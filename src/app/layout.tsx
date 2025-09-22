import type { Metadata } from 'next';
import { Space_Mono, Source_Sans_3 } from 'next/font/google';
import './globals.css';

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
  title: 'LionSpace: Consciousness Warfare Command',
  description: 'Join the battle for truth. Become a warrior of consciousness.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head></head>
      <body className={`${spaceMono.variable} ${sourceSans3.variable} font-body text-white`}>
        <canvas id="code-veil"></canvas>
        <div className="content-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}
