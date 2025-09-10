'use client';

import { useTranslation } from '@/contexts/translation-context';
import { IntelligenceMatrix } from '../intelligence/IntelligenceMatrix';
import { AITerminal } from '@/app/_components/terminal/AITerminal';
import { useEffect, useState } from 'react';

export function LandingHero() {
  const { getCurrentMessage } = useTranslation();
  const [narrativeText, setNarrativeText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [consoleText, setConsoleText] = useState('');

  // Narrative lines for general intelligence platform
  const narrativeLines = [
    "Detecting coordinated inauthentic behavior patterns...",
    "Cross-platform narrative analysis in progress...",
    "Social media manipulation networks identified...",
    "Influence operations tracking active campaigns...",
    "Counter-intelligence protocols are online..."
  ];

  const consoleLines = [
    "Analyzing source…",
    "Flag detected…",
    "Botnet trace initiated…",
    "Signal anomaly detected…",
    "Coordinated amplification detected…",
    "Evidence links compiled…"
  ];

  // Typewriter effect
  useEffect(() => {
    const typewriterEffect = async () => {
      let lineIndex = 0;
      
      while (true) {
        const line = narrativeLines[lineIndex];
        let speed = 50 + Math.random() * 30;

        // Clear current text
        setNarrativeText('');
        
        // Type out character by character
        for (let i = 0; i < line.length; i++) {
          setNarrativeText(line.substring(0, i + 1));
          
          if (['.', ','].includes(line[i])) {
            await new Promise(resolve => setTimeout(resolve, 400));
          }
          
          await new Promise(resolve => setTimeout(resolve, speed));
        }

        // Wait before starting next line
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Clear text with backspace effect
        for (let i = line.length; i >= 0; i--) {
          setNarrativeText(line.substring(0, i));
          await new Promise(resolve => setTimeout(resolve, 20));
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        
        lineIndex = (lineIndex + 1) % narrativeLines.length;
        setCurrentLineIndex(lineIndex);
      }
    };

    typewriterEffect();
  }, []);

  // Console footer effect
  useEffect(() => {
    const consoleEffect = async () => {
      let lineIndex = 0;
      
      while (true) {
        const line = consoleLines[lineIndex];
        
        setConsoleText('');
        
        for (let i = 0; i < line.length; i++) {
          setConsoleText(line.substring(0, i + 1));
          await new Promise(resolve => setTimeout(resolve, 80));
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
        
        lineIndex = (lineIndex + 1) % consoleLines.length;
      }
    };

    consoleEffect();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{backgroundColor: '#0B1220'}}>
      {/* Canvas Background Placeholder */}
      <div className="fixed inset-0 w-full h-full z-0">
        <IntelligenceMatrix />
      </div>

      {/* Content Wrapper */}
      <div className="content-wrapper relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-8">
        
        {/* Main Hero Content */}
        <main className="max-w-4xl mx-auto">
          
          {/* Main Title */}
          <h1 className="font-headline font-normal text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-8" style={{letterSpacing: '-0.01em'}}>
            Truth is pattern. AI sees it.
          </h1>
          
          {/* Narrative Container with Typewriter */}
          <div className="font-body font-light text-lg md:text-xl text-gray-300 min-h-[140px] sm:min-h-[100px] md:min-h-[70px] mb-10 w-full">
            <p className="typewriter-cursor">
              {narrativeText}
            </p>
          </div>

          {/* Subtitle */}
          <p className="font-body font-light text-base md:text-lg text-gray-400 mb-10">
            Join the battle for truth. Become a warrior of consciousness.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/auth" 
              className="cta-button text-lg bg-transparent border-2 border-[#B8FFF2] text-[#B8FFF2] py-3 px-10 rounded-md"
            >
              Analyze & Engage
            </a>
            <a 
              href="#ai-section" 
              className="gemini-button text-lg text-[#B8FFF2] py-3 px-10 rounded-md"
            >
              Activate AI Terminal
            </a>
          </div>
        </main>

        {/* Console Footer */}
        <footer className="w-full py-4 absolute bottom-0">
          <div className="font-headline text-sm text-gray-500 text-center min-h-[20px]">
            <span className="typewriter-cursor">
              {consoleText}
            </span>
          </div>
        </footer>
      </div>
      
      {/* AI Terminal Section */}
      <AITerminal />
    </div>
  );
}