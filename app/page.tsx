'use client'

import UnifiedBackground from '@/app/_components/backgrounds/UnifiedBackground'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text overflow-hidden">
      {/* Animated Background */}
      <UnifiedBackground 
        variant="landing" 
        intensity="high" 
        interactive={true}
      />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          {/* Hero Title */}
          <h1 className="hero-title text-6xl md:text-8xl font-bold mb-6 terminal-glow">
            LIONSPACE
          </h1>
          
          {/* Subtitle */}
          <div className="text-terminal-cyan text-xl md:text-2xl mb-8 font-terminal">
            <span className="typewriter-cursor">INTELLIGENCE PLATFORM</span>
          </div>
          
          {/* Description */}
          <p className="text-terminal-muted text-lg md:text-xl mb-12 max-w-2xl mx-auto font-body leading-relaxed">
            Navigate narratives with precision. Advanced threat analysis and strategic intelligence platform.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/join"
              className="terminal-button px-8 py-3 rounded-lg font-terminal text-sm uppercase tracking-wider transition-all duration-300"
            >
              Enter Platform
            </a>
            
            <a
              href="/matrix"
              className="terminal-button px-8 py-3 rounded-lg font-terminal text-sm uppercase tracking-wider transition-all duration-300"
            >
              Intelligence Matrix
            </a>
          </div>
          
          {/* Status Indicator */}
          <div className="mt-16 flex items-center justify-center gap-3">
            <div className="status-online"></div>
            <span className="text-terminal-cyan text-sm font-terminal">
              SYSTEM OPERATIONAL
            </span>
          </div>
        </div>
      </div>
      
      {/* Terminal Grid Overlay */}
      <div className="terminal-grid pointer-events-none" />
      
      {/* Scan Line Effect */}
      <div className="scanline pointer-events-none" />
    </div>
  );
}