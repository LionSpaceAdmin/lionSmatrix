'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';
import { 
  LazyCodeVeilCanvas,
  LazyAITerminal,
  LazyWrapper,
  useProgressiveAnimation
} from '@/components/lazy/LazyComponents';

// Hero section with lighter dynamic import
const HeroSection = dynamic(
  () => import('@/components/organisms/HeroSection').then(mod => ({ default: mod.HeroSection })),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cyan-400 font-mono text-lg animate-pulse">Initializing Command Center...</div>
      </div>
    )
  }
);

export default function CommandCenterPage() {
  const [language, setLanguage] = useState('en');
  const [componentsLoaded, setComponentsLoaded] = useState(false);
  const { shouldAnimate } = useProgressiveAnimation(componentsLoaded);
  
  useEffect(() => {
    // Set initial language based on user preference or browser
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(savedLang);
    document.documentElement.lang = savedLang;
    document.documentElement.dir = (savedLang === 'he' || savedLang === 'ar') ? 'rtl' : 'ltr';
    
    // Mark components as ready for loading after initial setup
    const timer = setTimeout(() => setComponentsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1220] text-white relative">
      {/* Background Canvas - loads first but with lower priority */}
      <LazyWrapper>
        <LazyCodeVeilCanvas />
      </LazyWrapper>
      
      {/* Language switcher - small component, loads immediately */}
      <LanguageSwitcher />
      
      {/* Hero section - critical content, prioritized */}
      <LazyWrapper
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-cyan-400 font-mono text-lg animate-pulse">Initializing Command Center...</div>
          </div>
        }
      >
        <HeroSection />
      </LazyWrapper>
      
      {/* Terminal - heavy interactive component, loads after hero */}
      {componentsLoaded && (
        <LazyWrapper>
          <LazyAITerminal />
        </LazyWrapper>
      )}
    </div>
  );
}
