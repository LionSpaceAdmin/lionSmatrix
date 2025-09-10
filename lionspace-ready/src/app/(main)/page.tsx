'use client';

import { Suspense } from 'react';
import { TranslationProvider } from '@/contexts/translation-context';
import { LandingHero } from './_components/landing/LandingHero';
import { LoadingSpinner } from './_components/shared/LoadingSpinner';

export default function HomePage() {
  return (
    <TranslationProvider>
      <div className="min-h-screen bg-black text-white">
        <Suspense fallback={<LoadingSpinner />}>
          <LandingHero />
        </Suspense>
      </div>
    </TranslationProvider>
  );
}