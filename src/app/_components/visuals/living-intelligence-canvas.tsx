'use client';

import React from 'react';

export function LivingIntelligenceCanvas() {
  return (
    <div className="fixed inset-0 z-0">
      {/* Terminal grid background effect */}
      <div 
        className="absolute inset-0 bg-terminal-bg"
        style={{
          backgroundImage: `
            linear-gradient(rgba(110, 231, 183, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(110, 231, 183, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Gradient overlay for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, 
              rgba(110, 231, 183, 0.05) 0%, 
              transparent 40%
            ),
            radial-gradient(circle at 80% 20%, 
              rgba(255, 183, 0, 0.03) 0%, 
              transparent 30%
            ),
            radial-gradient(circle at 20% 80%, 
              rgba(110, 231, 183, 0.03) 0%, 
              transparent 30%
            )
          `
        }}
      />
      
      {/* Animated scanline */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <div 
          className="h-px bg-gradient-to-r from-transparent via-terminal-cyan/20 to-transparent"
          style={{
            animation: 'scan-line 8s linear infinite'
          }}
        />
      </div>
    </div>
  );
}