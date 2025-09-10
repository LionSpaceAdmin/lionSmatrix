'use client';

import { Suspense } from 'react';
import { LandingHero } from './(main)/_components/landing/LandingHero';
import { LoadingSpinner } from './(main)/_components/shared/LoadingSpinner';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Suspense fallback={<LoadingSpinner />}>
        <LandingHero />
      </Suspense>
    </div>
  );
}