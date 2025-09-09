import { useEffect, useRef } from 'react';

/**
 * Hook for canvas-based animations
 * @param canvasId - ID of the canvas element
 * @param animationType - Type of animation to run
 */
export function useCanvasAnimation(
  canvasId: string,
  animationType: 'code-rain' | 'network' | 'particles' | 'matrix' = 'code-rain'
) {
  const animationRef = useRef<number | undefined>(undefined);
  const isActiveRef = useRef<boolean>(true);

  useEffect(() => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
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

    // Animation implementations
    const animations = {
      'code-rain': () => codeRainAnimation(ctx, canvas),
      'network': () => networkAnimation(ctx, canvas),
      'particles': () => particlesAnimation(ctx, canvas),
      'matrix': () => matrixAnimation(ctx, canvas)
    };

    // Start animation
    const startAnimation = animations[animationType];
    if (startAnimation) {
      startAnimation();
    }

    return () => {
      isActiveRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasId, animationType]);

  // Code rain animation
  function codeRainAnimation(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    // Initialize drops
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.floor(Math.random() * -100);
    }

    function draw() {
      if (!isActiveRef.current) return;

      // Semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(11, 18, 32, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff88';
      ctx.font = fontSize + 'px Space Mono, monospace';

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx?.fillText(char || '', i * fontSize, (drops[i] || 0) * fontSize);

        if (drops[i] && canvas && (drops[i] || 0) * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        if (drops[i] !== undefined) (drops[i] as number)++;
      }

      animationRef.current = requestAnimationFrame(draw);
    }

    draw();
  }

  // Network visualization animation
  function networkAnimation(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    class Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00ff88';
        ctx.fill();
      }
    }

    const nodes: Node[] = [];
    const nodeCount = Math.min(50, Math.floor(canvas.width * canvas.height / 15000));
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node());
    }

    function animate() {
      if (!isActiveRef.current) return;

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
          const dx = (nodes[i]?.x || 0) - (nodes[j]?.x || 0);
          const dy = (nodes[i]?.y || 0) - (nodes[j]?.y || 0);
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx?.moveTo(nodes[i]?.x || 0, nodes[i]?.y || 0);
            ctx?.lineTo(nodes[j]?.x || 0, nodes[j]?.y || 0);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();
  }

  // Particles animation
  function particlesAnimation(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.life = 0;
        this.maxLife = Math.random() * 100 + 50;
        this.size = Math.random() * 3 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        if (this.life > this.maxLife) {
          this.life = 0;
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
        }
      }

      draw() {
        const alpha = 1 - (this.life / this.maxLife);
        ctx.globalAlpha = alpha * 0.3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#00ffff';
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    const particles: Particle[] = [];
    const particleCount = Math.min(100, Math.floor(canvas.width * canvas.height / 8000));
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      if (!isActiveRef.current) return;

      ctx.fillStyle = 'rgba(11, 18, 32, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();
  }

  // Matrix-style animation
  function matrixAnimation(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    const chars = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops: Array<{ y: number; speed: number; chars: string[] }> = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = {
        y: Math.random() * -100,
        speed: Math.random() * 3 + 1,
        chars: []
      };
    }

    function draw() {
      if (!isActiveRef.current) return;

      ctx.fillStyle = 'rgba(11, 18, 32, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + 'px Space Mono, monospace';

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        
        // Add new character
        if (drop?.chars && drop.chars.length < 20) {
          drop.chars.push(chars[Math.floor(Math.random() * chars.length)] || 'A');
        } else {
          drop?.chars.shift();
          drop?.chars.push(chars[Math.floor(Math.random() * chars.length)] || 'A');
        }

        // Draw characters with fading effect
        drop?.chars?.forEach((char, index) => {
          const alpha = 1 - (index / (drop?.chars?.length || 1));
          const y = (drop?.y || 0) + (index * fontSize);
          
          if (y > 0 && y < canvas.height) {
            ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
            ctx.fillText(char, i * fontSize, y);
          }
        });

        if (drop) drop.y += drop.speed || 0;

        if (drop && drop.y > canvas.height + (drop.chars?.length || 0) * fontSize) {
          drop.y = Math.random() * -100;
          drop.chars = [];
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    }

    draw();
  }
}

/**
 * Hook for interactive canvas animations that respond to mouse movement
 */
export function useInteractiveCanvasAnimation(canvasId: string) {
  const mouseRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [canvasId]);

  return mouseRef.current;
}