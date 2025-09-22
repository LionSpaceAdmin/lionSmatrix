"use client";

import { useEffect, useRef } from 'react';
import { useI18n } from '@/hooks/use-i18n';

export default function HeroSection() {
  const { setLanguage } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const narrativeLineRef = useRef<HTMLParagraphElement>(null);
  const consoleTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let particles: any[] = [];
        let wordBank = ['Jackson Hinkle', 'MAGA Communism', 'Hezbollah', 'Hamas', 'Moscow', 'Rumble', 'The Dive', 'Propaganda', 'Axis of Resistance', 'Disinformation', 'Grayzone', 'RT', 'Sana’a', 'Nasrallah'];

        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 12000);
            for (let i = 0; i < numberOfParticles; i++) {
                const z = Math.random() * 0.7 + 0.3;
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * z * 0.8,
                    vy: (Math.random() - 0.5) * z * 0.2,
                    z: z,
                    text: wordBank[Math.floor(Math.random() * wordBank.length)],
                    highlightTTL: 0
                });
            }
        }

        const animate = () => {
            ctx.fillStyle = 'rgba(11, 18, 32, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x > canvas.width + 50) p.x = -50; else if (p.x < -50) p.x = canvas.width + 50;
                if (p.y > canvas.height + 50) p.y = -50; else if (p.y < -50) p.y = canvas.height + 50;

                ctx.font = `${12 * p.z}px 'Space Mono', monospace`;

                if (p.highlightTTL > 0) {
                    ctx.fillStyle = `rgba(255, 99, 132, ${p.z * 0.9})`; // Red highlight
                    p.highlightTTL--;
                } else {
                    ctx.fillStyle = `rgba(184, 255, 242, ${p.z * 0.5})`; // Default cyan
                }
                ctx.fillText(p.text, p.x, p.y);
            });
            requestAnimationFrame(animate);
        }

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if(!mediaQuery.matches) { init(); animate(); }
        else {
            init();
            ctx.fillStyle = 'rgba(11, 18, 32, 1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                 ctx.font = `${12 * p.z}px 'Space Mono', monospace`;
                 ctx.fillStyle = `rgba(184, 255, 242, ${p.z * 0.5})`;
                 ctx.fillText(p.text, p.x, p.y);
            });
        }
        window.addEventListener('resize', init);
      }
    }

    const narrativeLines = [
        "His following soared from ~417,000 to over 2.3 million...",
        "He acts as a 'multiplier' for Russian and Iranian propaganda.",
        "He embraced Iran’s 'Axis of Resistance.'",
        "He interviewed Hamas politburo member Dr. Basem Naim.",
        "On stage in Yemen, he shouted 'Death to America.'"
    ];

    const consoleLines = ["Analyzing source…", "Flag detected…", "Botnet trace initiated…", "Signal anomaly detected…", "Coordinated amplification detected…", "Evidence links compiled…"];

    async function typewriter(element: HTMLElement | null, lines: string[]) {
        if (!element) return;
        let lineIndex = 0;
        while (true) {
            const line = lines[lineIndex];
            let speed = 50 + Math.random() * 30;
            for (let i = 0; i < line.length; i++) {
                element.textContent = line.substring(0, i + 1);
                if (['.', ','].includes(line[i])) {
                     await new Promise(res => setTimeout(res, 400));
                }
                await new Promise(res => setTimeout(res, speed));
            }
            await new Promise(res => setTimeout(res, 1500));

            for (let i = line.length; i > 0; i--) {
                element.textContent = line.substring(0, i - 1);
                await new Promise(res => setTimeout(res, 20));
            }
            await new Promise(res => setTimeout(res, 300));
            lineIndex = (lineIndex + 1) % lines.length;
        }
    }

    const narrativeLineEl = narrativeLineRef.current;
    const consoleTextEl = consoleTextRef.current;

    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        typewriter(narrativeLineEl, narrativeLines);
        setTimeout(() => typewriter(consoleTextEl, consoleLines), 2500);
    } else {
        if (narrativeLineEl) narrativeLineEl.textContent = narrativeLines[1];
        if (consoleTextEl) consoleTextEl.textContent = consoleLines[2];
        document.querySelectorAll('.typewriter-cursor').forEach(el => el.classList.remove('typewriter-cursor'));
    }
  }, []);

  return (
    <div className="content-wrapper flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
        <main className="flex flex-col items-center justify-center text-center w-full max-w-4xl flex-grow">
            <div className="absolute top-4 right-4 z-20">
                <button onClick={() => setLanguage('en')} className="text-sm font-headline text-gray-400 hover:text-white px-2 bg-transparent">EN</button>
                <span className="text-gray-500">|</span>
                <button onClick={() => setLanguage('he')} className="text-sm font-headline text-gray-400 hover:text-white px-2 bg-transparent">HE</button>
            </div>
            <h1 data-i18n-key="hero_title" className="font-headline font-normal text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-8" style={{ letterSpacing: '-0.01em' }}>Truth is pattern. AI sees it.</h1>

            <div id="narrative-container" className="font-body font-light text-lg md:text-xl text-gray-300 min-h-[140px] sm:min-h-[100px] md:min-h-[70px] mb-10 w-full">
                <p ref={narrativeLineRef} className="typewriter-cursor"></p>
            </div>

            <p data-i18n-key="hero_subtitle" className="font-body font-light text-base md:text-lg text-gray-400 mb-10">Join the battle for truth. Become a warrior of consciousness.</p>

            <div className="flex flex-col sm:flex-row gap-4">
                <a href="/auth" id="cta-link" data-i18n-key="hero_cta_join" className="cta-button text-lg bg-transparent border-2 border-[#B8FFF2] text-[#B8FFF2] py-3 px-10 rounded-md">
                    Analyze & Engage
                </a>
                <a href="#ai-section" className="gemini-button text-lg text-[#B8FFF2] py-3 px-10 rounded-md" data-i18n-key="hero_cta_activate">
                    Activate AI Terminal
                </a>
            </div>
        </main>

        <footer className="w-full py-4 absolute bottom-0">
            <div id="console-footer" className="font-headline text-sm text-gray-500 text-center min-h-[20px]">
                <span ref={consoleTextRef} className="typewriter-cursor"></span>
            </div>
        </footer>
    </div>
  );
}
