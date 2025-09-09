'use client';

import { useEffect, useRef } from 'react';

interface ThreatMapProps {
  data?: {
    threats: Array<{
      id: string;
      lat: number;
      lng: number;
      severity: 'critical' | 'high' | 'medium' | 'low';
      type: string;
    }>;
    connections: Array<{
      from: string;
      to: string;
      type: 'attack' | 'communication' | 'data';
    }>;
  };
}

export function ThreatMap({ data }: ThreatMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 400;

    // Clear canvas
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#065f46';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw threats
    data.threats?.forEach(threat => {
      const x = (threat.lng + 180) * (canvas.width / 360);
      const y = (90 - threat.lat) * (canvas.height / 180);

      // Threat point
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      
      // Color based on severity
      switch (threat.severity) {
        case 'critical':
          ctx.fillStyle = '#dc2626';
          break;
        case 'high':
          ctx.fillStyle = '#ea580c';
          break;
        case 'medium':
          ctx.fillStyle = '#facc15';
          break;
        default:
          ctx.fillStyle = '#22c55e';
      }
      
      ctx.fill();
      
      // Pulsing effect
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.strokeStyle = ctx.fillStyle;
      ctx.globalAlpha = 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    // Draw connections
    data.connections?.forEach(conn => {
      const fromThreat = data.threats.find(t => t.id === conn.from);
      const toThreat = data.threats.find(t => t.id === conn.to);
      
      if (fromThreat && toThreat) {
        const x1 = (fromThreat.lng + 180) * (canvas.width / 360);
        const y1 = (90 - fromThreat.lat) * (canvas.height / 180);
        const x2 = (toThreat.lng + 180) * (canvas.width / 360);
        const y2 = (90 - toThreat.lat) * (canvas.height / 180);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        
        // Connection type styling
        switch (conn.type) {
          case 'attack':
            ctx.strokeStyle = '#dc2626';
            ctx.setLineDash([5, 5]);
            break;
          case 'communication':
            ctx.strokeStyle = '#3b82f6';
            ctx.setLineDash([2, 2]);
            break;
          default:
            ctx.strokeStyle = '#10b981';
            ctx.setLineDash([]);
        }
        
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  }, [data]);

  return (
    <div className="bg-gray-950 rounded-lg p-4">
      <h3 className="text-green-400 font-mono text-sm mb-3">GLOBAL THREAT MAP</h3>
      <canvas 
        ref={canvasRef}
        className="w-full rounded border border-green-900/50"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-600 rounded-full"></div>
          <span className="text-xs text-green-600 font-mono">CRITICAL</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
          <span className="text-xs text-green-600 font-mono">HIGH</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-xs text-green-600 font-mono">MEDIUM</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-xs text-green-600 font-mono">LOW</span>
        </div>
      </div>
    </div>
  );
}