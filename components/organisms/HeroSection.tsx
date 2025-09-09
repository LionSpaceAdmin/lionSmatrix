'use client';

import { useEffect, useRef } from 'react';
import { useTypewriter } from '@/lib/hooks/use-typewriter';
import { narrativeLines, consoleLines } from '@/lib/data/translations';
import { useI18n } from '@/lib/hooks/use-i18n';

export function HeroSection() {
  const narrativeRef = useRef<HTMLParagraphElement>(null);
  const consoleRef = useRef<HTMLSpanElement>(null);
  const { currentLang, t } = useI18n();

  useTypewriter(
    narrativeRef.current,
    () => narrativeLines[currentLang] || narrativeLines['en'] || [],
    50
  );

  useTypewriter(
    consoleRef.current,
    () => consoleLines[currentLang] || consoleLines['en'] || [],
    60
  );

  return (
    <div className="content-wrapper flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
      <main className="flex flex-col items-center justify-center text-center w-full max-w-4xl flex-grow">
        <h1 
          data-i18n-key="hero_title"
          className="font-headline font-normal text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-8"
          style={{ letterSpacing: '-0.01em' }}
        >
          {t('hero_title')}
        </h1>
        
        <div className="font-body font-light text-lg md:text-xl text-gray-300 min-h-[140px] sm:min-h-[100px] md:min-h-[70px] mb-10 w-full">
          <p ref={narrativeRef} className="typewriter-cursor"></p>
        </div>

        <p 
          data-i18n-key="hero_subtitle"
          className="font-body font-light text-base md:text-lg text-gray-400 mb-10"
        >
          {t('hero_subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a 
            href="/auth"
            data-i18n-key="hero_cta_join"
            className="cta-button text-lg bg-transparent border-2 border-[#B8FFF2] text-[#B8FFF2] py-3 px-10 rounded-md hover:bg-[#B8FFF2] hover:text-[#0B1220] transition-all duration-300"
          >
            {t('hero_cta_join')}
          </a>
          <a 
            href="#ai-section"
            data-i18n-key="hero_cta_activate"
            className="gemini-button text-lg text-[#B8FFF2] py-3 px-10 rounded-md bg-cyan-500/10 border border-cyan-500/50 hover:bg-[#B8FFF2] hover:text-[#0B1220] transition-all duration-300"
          >
            {t('hero_cta_activate')}
          </a>
        </div>
      </main>

      <footer className="w-full py-4 absolute bottom-0">
        <div className="font-headline text-sm text-gray-500 text-center min-h-[20px]">
          <span ref={consoleRef} className="typewriter-cursor"></span>
        </div>
      </footer>
    </div>
  );
}