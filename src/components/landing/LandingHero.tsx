'use client'

import React from 'react'
import { Shield, ChevronRight, Zap, Globe, Lock } from 'lucide-react'

interface LandingHeroProps {
  onGetStarted: () => void
}

const LandingHero: React.FC<LandingHeroProps> = ({ onGetStarted }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-7xl mx-auto text-center z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-terminal-cyan/10 border border-terminal-cyan/30 rounded-full mb-8">
          <Zap className="w-4 h-4 text-terminal-cyan" />
          <span className="text-sm text-terminal-cyan font-medium">
            ADVANCED INTELLIGENCE PLATFORM
          </span>
        </div>
        
        {/* Main headline */}
        <h1 className="text-5xl sm:text-7xl font-bold mb-6">
          <span className="bg-gradient-to-r from-terminal-cyan to-terminal-gold bg-clip-text text-transparent">
            LIONSPACE
          </span>
          <br />
          <span className="text-terminal-text">
            INTELLIGENCE
          </span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-xl sm:text-2xl text-terminal-muted mb-4 max-w-3xl mx-auto">
          Fighting misinformation through advanced AI and human intelligence
        </p>
        
        <p className="text-lg text-terminal-text/80 mb-12 max-w-2xl mx-auto">
          Join the resistance against digital deception. Access real-time threat analysis, 
          narrative tracking, and coordinated response strategies.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={onGetStarted}
            className="group px-8 py-4 bg-terminal-cyan text-terminal-bg font-bold rounded-lg border-2 border-terminal-cyan hover:bg-transparent hover:text-terminal-cyan transition-all duration-200 flex items-center justify-center gap-2 shadow-glow-cyan"
          >
            <span>GET STARTED - IT&apos;S FREE</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="px-8 py-4 border-2 border-terminal-gold text-terminal-gold font-bold rounded-lg hover:bg-terminal-gold hover:text-terminal-bg transition-all duration-200">
            WATCH DEMO
          </button>
        </div>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="group">
            <div className="p-6 bg-terminal-secondary/20 border border-terminal-border rounded-lg hover:border-terminal-cyan transition-colors">
              <Globe className="w-10 h-10 text-terminal-cyan mx-auto mb-4" />
              <h3 className="text-lg font-bold text-terminal-text mb-2">
                Global Monitoring
              </h3>
              <p className="text-sm text-terminal-muted">
                Real-time intelligence gathering across all digital platforms
              </p>
            </div>
          </div>
          
          <div className="group">
            <div className="p-6 bg-terminal-secondary/20 border border-terminal-border rounded-lg hover:border-terminal-cyan transition-colors">
              <Shield className="w-10 h-10 text-terminal-cyan mx-auto mb-4" />
              <h3 className="text-lg font-bold text-terminal-text mb-2">
                Advanced Protection
              </h3>
              <p className="text-sm text-terminal-muted">
                AI-powered threat detection and narrative analysis
              </p>
            </div>
          </div>
          
          <div className="group">
            <div className="p-6 bg-terminal-secondary/20 border border-terminal-border rounded-lg hover:border-terminal-cyan transition-colors">
              <Lock className="w-10 h-10 text-terminal-cyan mx-auto mb-4" />
              <h3 className="text-lg font-bold text-terminal-text mb-2">
                Secure Platform
              </h3>
              <p className="text-sm text-terminal-muted">
                End-to-end encryption and military-grade security
              </p>
            </div>
          </div>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 pt-8 border-t border-terminal-border/30">
          <p className="text-sm text-terminal-muted mb-4">TRUSTED BY LEADING ORGANIZATIONS</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50">
            <div className="text-terminal-cyan font-mono text-sm">NATO_INTEL</div>
            <div className="text-terminal-cyan font-mono text-sm">CYBER_COMMAND</div>
            <div className="text-terminal-cyan font-mono text-sm">GLOBAL_WATCH</div>
            <div className="text-terminal-cyan font-mono text-sm">DIGITAL_DEFENSE</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingHero