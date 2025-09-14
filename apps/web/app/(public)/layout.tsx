import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lions of Zion',
  description: 'Military-grade defense against disinformation campaigns. Truth is pattern. AI sees it.',
  openGraph: {
    title: 'Lions of Zion',
    description: 'Truth is pattern. AI sees it. Join the battle for truth.',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
