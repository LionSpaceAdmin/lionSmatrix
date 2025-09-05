'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  z: number;
  text: string;
  highlightTTL: number;
}

export function AnalysisCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  
  const wordBank = [
    'Jackson Hinkle', 'MAGA Communism', 'Hezbollah', 'Hamas', 
    'Moscow', 'Rumble', 'The Dive', 'Propaganda', 
    'Axis of Resistance', 'Disinformation', 'Grayzone', 
    'RT', "Sana'a", 'Nasrallah'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = [];
      
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 12000);
      
      for (let i = 0; i < numberOfParticles; i++) {
        const z = Math.random() * 0.7 + 0.3;
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * z * 0.8,
          vy: (Math.random() - 0.5) * z * 0.2,
          z: z,
          text: wordBank[Math.floor(Math.random() * wordBank.length)],
          highlightTTL: 0
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(11, 18, 32, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x > canvas.width + 50) p.x = -50;
        else if (p.x < -50) p.x = canvas.width + 50;
        if (p.y > canvas.height + 50) p.y = -50;
        else if (p.y < -50) p.y = canvas.height + 50;

        ctx.font = `${12 * p.z}px 'Space Mono', monospace`;

        if (p.highlightTTL > 0) {
          ctx.fillStyle = `rgba(255, 99, 132, ${p.z * 0.9})`;
          p.highlightTTL--;
        } else {
          ctx.fillStyle = `rgba(184, 255, 242, ${p.z * 0.5})`;
        }
        ctx.fillText(p.text, p.x, p.y);
      });

      requestAnimationFrame(animate);
    };

    // Highlight random keywords periodically
    const highlightInterval = setInterval(() => {
      const keywordsToHighlight = [...wordBank].sort(() => 0.5 - Math.random()).slice(0, 2);
      particlesRef.current.forEach(p => {
        if (keywordsToHighlight.includes(p.text)) {
          p.highlightTTL = 100;
        }
      });
    }, 7000);

    init();
    animate();

    const handleResize = () => init();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(highlightInterval);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      id="code-veil"
      className="fixed top-0 left-0 w-full h-full z-0"
    />
  );
}