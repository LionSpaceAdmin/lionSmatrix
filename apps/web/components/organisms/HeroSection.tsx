'use client'

import React from 'react'
import { Shield, ArrowRight, Target, Eye, Users, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeroSectionProps {
  title?: string
  subtitle?: string
  description?: string
  primaryCta?: {
    text: string
    href: string
    onClick?: () => void
  }
  secondaryCta?: {
    text: string
    href: string
    onClick?: () => void
  }
  showStats?: boolean
  className?: string
}

export function HeroSection({
  title = 'LIONS OF ZION',
  subtitle = 'Military-Grade Defense Against Information Warfare',
  description = 'Real-time threat analysis • Fact-checking • Community action',
  primaryCta = {
    text: 'Join the Fight — Free',
    href: '/auth/join'
  },
  secondaryCta = {
    text: 'Explore the War Machine',
    href: '/dashboard/war-machine'
  },
  showStats = true,
  className
}: HeroSectionProps) {
  
  const stats = [
    { icon: Globe, label: 'Protecting 2.8M+ users globally' },
    { icon: Shield, label: '3,891 threats neutralized' },
    { icon: Eye, label: '24/7 global monitoring' }
  ]

  return (
    <section className={cn('text-center py-12 md:py-20', className)}>
      {/* Logo/Brand */}
      <div className="flex items-center justify-center mb-6">
        <Shield className="w-16 h-16 md:w-20 md:h-20 text-terminal-cyan animate-pulse" />
      </div>
      
      {/* Main Heading */}
      <div className="relative mb-8">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-mono text-terminal-cyan mb-4 hero-title tracking-wider">
          {title}
        </h1>
        <div className="text-xl md:text-2xl text-terminal-text font-mono mb-2">
          {subtitle}
        </div>
        <div className="text-lg text-terminal-muted">
          {description}
        </div>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="flex items-center gap-2 text-sm text-terminal-muted">
                <Icon className="w-4 h-4" />
                <span>{stat.label}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <button
          onClick={primaryCta.onClick}
          className={cn(
            'px-8 py-4 bg-terminal-cyan text-terminal-bg font-mono font-bold rounded',
            'hover:bg-terminal-cyan/80 transition-all duration-200',
            'transform hover:scale-105',
            'flex items-center justify-center gap-2',
            'shadow-lg shadow-terminal-cyan/20'
          )}
        >
          {primaryCta.text}
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <button
          onClick={secondaryCta.onClick}
          className={cn(
            'px-8 py-4 border border-terminal-cyan text-terminal-cyan font-mono font-bold rounded',
            'hover:bg-terminal-cyan/10 transition-all duration-200',
            'transform hover:scale-105',
            'flex items-center justify-center gap-2'
          )}
        >
          {secondaryCta.text}
          <Target className="w-5 h-5" />
        </button>
      </div>

      {/* Core Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="text-center p-6 terminal-card rounded-lg backdrop-blur-sm">
          <Eye className="w-12 h-12 text-terminal-cyan mx-auto mb-4" />
          <h3 className="text-xl font-bold text-terminal-text mb-2">Vigilance</h3>
          <p className="text-terminal-muted text-sm">
            24/7 monitoring of global information landscapes to detect emerging threats and disinformation campaigns.
          </p>
        </div>
        
        <div className="text-center p-6 terminal-card rounded-lg backdrop-blur-sm">
          <Target className="w-12 h-12 text-terminal-cyan mx-auto mb-4" />
          <h3 className="text-xl font-bold text-terminal-text mb-2">Precision</h3>
          <p className="text-terminal-muted text-sm">
            Military-grade accuracy in threat assessment using advanced AI and human intelligence analysis.
          </p>
        </div>
        
        <div className="text-center p-6 terminal-card rounded-lg backdrop-blur-sm">
          <Users className="w-12 h-12 text-terminal-cyan mx-auto mb-4" />
          <h3 className="text-xl font-bold text-terminal-text mb-2">Unity</h3>
          <p className="text-terminal-muted text-sm">
            Building a global alliance of truth defenders and digital citizens committed to information integrity.
          </p>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Scanning Line */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-terminal-cyan to-transparent animate-pulse opacity-30" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-terminal-cyan to-transparent animate-pulse opacity-30" />
      </div>
    </section>
  )
}

export default HeroSection