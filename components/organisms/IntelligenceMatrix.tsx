'use client';

import React, { useEffect, useRef } from 'react';

export function IntelligenceMatrix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ensure canvas sits behind and doesn't capture interactions
    canvas.style.pointerEvents = 'none';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '0';

    const matrixChars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
    const fontSize = 18;
    let rows: number;
    let drops: number[] = [];

    function setupMatrix() {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const cssWidth = window.innerWidth;
      const cssHeight = window.innerHeight;
      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
      canvas.style.width = cssWidth + 'px';
      canvas.style.height = cssHeight + 'px';
      // scale drawing to CSS pixels
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rows = Math.floor(cssHeight / fontSize); // one drop per row
      drops = [];
      for (let i = 0; i < rows; i++) {
        drops[i] = -Math.random() * 100;
      }
    }

    function drawMatrix() {
      if (!canvas || !ctx) return;
      ctx.fillStyle = 'rgba(11, 18, 32, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = fontSize + "px 'Space Mono', monospace";
      for (let i = 0; i < rows; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        if (!text) continue;
        ctx.fillStyle = '#B8FFF2';
        ctx.shadowColor = '#B8FFF2';
        ctx.shadowBlur = 8;
        
        const dropX = drops[i];
        if (dropX !== undefined) {
          ctx.fillText(text, dropX, (i + 1) * fontSize);
          
          const isRTL = document.documentElement.dir === 'rtl';
          const step = fontSize * (0.7 + Math.random() * 0.7);
          drops[i] = dropX + (isRTL ? -step : step);
          if (!isRTL && drops[i]! > parseFloat(canvas.style.width)) {
            drops[i] = -Math.random() * 100;
          }
          if (isRTL && drops[i]! < 0) {
            drops[i] = parseFloat(canvas.style.width) + Math.random() * 100;
          }
        }
      }
      animationFrameIdRef.current = requestAnimationFrame(drawMatrix);
    }

    const matrixMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    function startMatrix() {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      setupMatrix();
      if (!matrixMediaQuery.matches) {
        drawMatrix();
      } else if (canvas && ctx) {
        ctx.fillStyle = 'rgba(11, 18, 32, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    startMatrix();

    // Handle resize
    const handleResize = () => startMatrix();
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      id="code-veil"
      className="absolute inset-0"
    />
  );
}