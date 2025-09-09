'use client';

import { useEffect } from 'react';
import { useCanvasAnimation } from '@/lib/hooks/use-canvas-animation';

/**
 * Canvas component for animated code/matrix background effect
 * Creates a cyberpunk/terminal aesthetic background animation
 */
export function CodeVeilCanvas() {
  useCanvasAnimation('code-veil');
  
  return (
    <canvas 
      id="code-veil" 
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none opacity-20"
      aria-hidden="true"
    />
  );
}

/**
 * Alternative canvas with custom configuration
 */
export function CustomCodeVeilCanvas({
  id = 'code-veil',
  className = '',
  opacity = 0.2
}: {
  id?: string;
  className?: string;
  opacity?: number;
}) {
  useCanvasAnimation(id);
  
  return (
    <canvas 
      id={id}
      className={`fixed top-0 left-0 w-full h-full z-0 pointer-events-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}

/**
 * Matrix rain effect canvas
 */
export function MatrixRainCanvas() {
  useEffect(() => {
    const canvas = document.getElementById('matrix-rain') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");

    const fontSize = 10;
    const columns = canvas.width / fontSize;

    // Array of drops - one per column
    const drops: number[] = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.floor(Math.random() * -100);
    }

    // Drawing the characters
    function draw() {
      if (!ctx || !canvas) return;
      
      // Black background with slight opacity for trail effect
      ctx.fillStyle = 'rgba(11, 18, 32, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff88';
      ctx.font = fontSize + 'px monospace';

      // Looping over drops
      for (let i = 0; i < drops.length; i++) {
        // Random character from matrix
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)] || 'A';
        
        // x = i * fontSize, y = value of drops[i] * fontSize
        ctx?.fillText(text, i * fontSize, (drops[i] || 0) * fontSize);

        // Send drop back to top randomly after it has crossed the screen
        if (drops[i] && canvas && (drops[i] || 0) * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Increment Y coordinate
        if (drops[i] !== undefined) (drops[i] as number)++;
      }
    }

    const interval = setInterval(draw, 35);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      id="matrix-rain"
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none opacity-10"
      aria-hidden="true"
    />
  );
}

/**
 * Network visualization canvas
 */
export function NetworkCanvas() {
  useEffect(() => {
    const canvas = document.getElementById('network-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Node class
    class Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00ff88';
        ctx.fill();
      }
    }

    // Create nodes
    const nodes: Node[] = [];
    const nodeCount = 50;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ));
    }

    // Animation loop
    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.fillStyle = 'rgba(11, 18, 32, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach(node => {
        node.update();
        node.draw();
      });

      // Draw connections
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeI = nodes[i];
          const nodeJ = nodes[j];
          if (!nodeI || !nodeJ) continue;
          
          const dx = nodeI.x - nodeJ.x;
          const dy = nodeI.y - nodeJ.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(nodeI.x, nodeI.y);
            ctx.lineTo(nodeJ.x, nodeJ.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      id="network-canvas"
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none opacity-20"
      aria-hidden="true"
    />
  );
}

/**
 * Glitch effect canvas overlay
 */
export function GlitchCanvas() {
  useEffect(() => {
    const canvas = document.getElementById('glitch-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function glitch() {
      if (!ctx || !canvas) return;
      
      // Random glitch effect
      if (Math.random() > 0.95) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const w = Math.random() * 200 + 50;
        const h = Math.random() * 20 + 5;
        
        ctx.fillStyle = `rgba(0, 255, ${Math.floor(Math.random() * 155 + 100)}, 0.1)`;
        ctx.fillRect(x, y, w, h);
        
        // Clear after a moment
        setTimeout(() => {
          ctx.clearRect(x, y, w, h);
        }, 100);
      }
      
      requestAnimationFrame(glitch);
    }

    glitch();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      id="glitch-canvas"
      className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}