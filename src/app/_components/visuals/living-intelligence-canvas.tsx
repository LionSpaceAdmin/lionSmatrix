'use client';

import React, { useEffect, useRef, useState } from 'react';

interface DataNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulseSpeed: number;
}

interface DataFlow {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  progress: number;
  speed: number;
  opacity: number;
}

export function LivingIntelligenceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const nodesRef = useRef<DataNode[]>([]);
  const flowsRef = useRef<DataFlow[]>([]);
  const gridPulseRef = useRef(0);

  // Initialize dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize nodes and flows
  useEffect(() => {
    const nodeCount = 30;
    const flowCount = 20;

    // Create nodes
    nodesRef.current = Array.from({ length: nodeCount }, (_, i) => ({
      id: `node-${i}`,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      pulseSpeed: Math.random() * 0.02 + 0.01
    }));

    // Create data flows
    flowsRef.current = Array.from({ length: flowCount }, (_, i) => ({
      id: `flow-${i}`,
      x1: Math.random() * dimensions.width,
      y1: 0,
      x2: Math.random() * dimensions.width,
      y2: dimensions.height,
      progress: Math.random(),
      speed: Math.random() * 0.005 + 0.002,
      opacity: Math.random() * 0.3 + 0.1
    }));
  }, [dimensions]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(3, 7, 18, 0.1)';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Draw grid layer (Layer 1)
      drawGrid(ctx);

      // Draw data flows (Layer 2)
      drawDataFlows(ctx);

      // Draw nodes and connections (Layer 3)
      drawNodes(ctx);
      drawConnections(ctx);

      // Update animations
      updateNodes();
      updateFlows();
      gridPulseRef.current += 0.01;

      animationRef.current = requestAnimationFrame(animate);
    };

    const drawGrid = (ctx: CanvasRenderingContext2D) => {
      const gridSize = 40;
      const pulseOpacity = Math.sin(gridPulseRef.current) * 0.02 + 0.03;

      ctx.strokeStyle = `rgba(30, 41, 59, ${pulseOpacity})`;
      ctx.lineWidth = 0.5;

      // Vertical lines
      for (let x = 0; x <= dimensions.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, dimensions.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= dimensions.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(dimensions.width, y);
        ctx.stroke();
      }

      // Add intersection points
      ctx.fillStyle = `rgba(110, 231, 183, ${pulseOpacity * 2})`;
      for (let x = 0; x <= dimensions.width; x += gridSize * 3) {
        for (let y = 0; y <= dimensions.height; y += gridSize * 3) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const drawDataFlows = (ctx: CanvasRenderingContext2D) => {
      flowsRef.current.forEach(flow => {
        const gradient = ctx.createLinearGradient(
          flow.x1, flow.y1 * flow.progress,
          flow.x2, flow.y2 * flow.progress
        );
        
        gradient.addColorStop(0, 'rgba(110, 231, 183, 0)');
        gradient.addColorStop(0.5, `rgba(110, 231, 183, ${flow.opacity})`);
        gradient.addColorStop(1, 'rgba(110, 231, 183, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(flow.x1, flow.y1);
        
        // Create curved path
        const midX = (flow.x1 + flow.x2) / 2;
        const midY = flow.y1 + (flow.y2 - flow.y1) * flow.progress;
        const controlX = midX + Math.sin(flow.progress * Math.PI * 2) * 50;
        
        ctx.quadraticCurveTo(controlX, midY, flow.x2, flow.y2 * flow.progress);
        ctx.stroke();
      });
    };

    const drawNodes = (ctx: CanvasRenderingContext2D) => {
      nodesRef.current.forEach(node => {
        const pulse = Math.sin(gridPulseRef.current * node.pulseSpeed * 100) * 0.3 + 0.7;
        
        // Draw node glow
        const glowGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.size * 10
        );
        glowGradient.addColorStop(0, `rgba(110, 231, 183, ${node.opacity * pulse})`);
        glowGradient.addColorStop(1, 'rgba(110, 231, 183, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 10, 0, Math.PI * 2);
        ctx.fill();

        // Draw node core
        ctx.fillStyle = `rgba(110, 231, 183, ${node.opacity * 1.5})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw node border
        ctx.strokeStyle = `rgba(110, 231, 183, ${node.opacity})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 2, 0, Math.PI * 2);
        ctx.stroke();
      });
    };

    const drawConnections = (ctx: CanvasRenderingContext2D) => {
      const connectionDistance = 150;
      
      nodesRef.current.forEach((node1, i) => {
        nodesRef.current.slice(i + 1).forEach(node2 => {
          const distance = Math.hypot(node2.x - node1.x, node2.y - node1.y);
          
          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.2;
            
            ctx.strokeStyle = `rgba(110, 231, 183, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.stroke();
          }
        });
      });
    };

    const updateNodes = () => {
      nodesRef.current.forEach(node => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges with damping
        if (node.x <= 0 || node.x >= dimensions.width) {
          node.vx *= -0.9;
          node.x = Math.max(0, Math.min(dimensions.width, node.x));
        }
        if (node.y <= 0 || node.y >= dimensions.height) {
          node.vy *= -0.9;
          node.y = Math.max(0, Math.min(dimensions.height, node.y));
        }

        // Add slight random movement
        node.vx += (Math.random() - 0.5) * 0.01;
        node.vy += (Math.random() - 0.5) * 0.01;

        // Limit velocity
        const maxSpeed = 1;
        const speed = Math.hypot(node.vx, node.vy);
        if (speed > maxSpeed) {
          node.vx = (node.vx / speed) * maxSpeed;
          node.vy = (node.vy / speed) * maxSpeed;
        }
      });
    };

    const updateFlows = () => {
      flowsRef.current.forEach(flow => {
        flow.progress += flow.speed;
        
        if (flow.progress > 1) {
          flow.progress = 0;
          flow.x1 = Math.random() * dimensions.width;
          flow.x2 = Math.random() * dimensions.width;
          flow.opacity = Math.random() * 0.3 + 0.1;
        }
      });
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  return (
    <>
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ 
          zIndex: 1,
          opacity: 0.8,
          mixBlendMode: 'screen'
        }}
        aria-hidden="true"
      />
      
      {/* Scan Line Effect */}
      <div className="scanline pointer-events-none" aria-hidden="true" />
      
      {/* Gradient Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(3, 7, 18, 0.4) 100%)',
          zIndex: 2
        }}
        aria-hidden="true"
      />
    </>
  );
}