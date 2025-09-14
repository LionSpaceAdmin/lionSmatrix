'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowRight, Eye, Target, Users, AlertTriangle, TrendingUp, Globe } from 'lucide-react'
import { EnhancedTerminalBackground } from '@/components/organisms/EnhancedTerminalBackground'
import { NarrativeCard } from '@/components/shared/NarrativeCard'
import { ActionGrid } from '@/components/shared/ActionGrid'
import { ThreatStrip } from '@/components/shared/ThreatStrip'
import { AlertBanner } from '@/components/shared/AlertBanner'
import { ProvenanceBadge } from '@/components/shared/ProvenanceBadge'

export default function HomePage() {
  const router = useRouter()
  const [backgroundMode, setBackgroundMode] = useState<'intelligence' | 'defense' | 'analysis' | 'warfare'>('intelligence')

  // Mock data for featured narratives
  const featuredNarratives = [
    {
      id: '1',
      title: 'Coordinated Bot Network Targets Election Integrity',
      description: 'Large-scale bot operation spreading false claims about voting systems detected across multiple platforms.',
      threatLevel: 'critical' as const,
      confidence: 89,
      evidenceCount: 234,
      lastUpdated: new Date(Date.now() - 3600000).toISOString(),
      topics: ['Elections', 'Bots', 'Democracy'],
      impactScore: 87.3,
      region: 'North America'
    },
    {
      id: '2',
      title: 'Deepfake Video of World Leader Goes Viral',
      description: 'AI-generated video falsely showing political leader making inflammatory statements spreads rapidly.',
      threatLevel: 'critical' as const,
      confidence: 94,
      evidenceCount: 156,
      lastUpdated: new Date(Date.now() - 7200000).toISOString(),
      topics: ['Deepfake', 'Politics', 'AI'],
      impactScore: 92.1,
      region: 'Europe'
    },
    {
      id: '3',
      title: 'Health Misinformation Campaign Using Fake Doctors',
      description: 'Coordinated campaign using fake medical professionals to spread vaccine misinformation identified.',
      threatLevel: 'high' as const,
      confidence: 91,
      evidenceCount: 178,
      lastUpdated: new Date(Date.now() - 14400000).toISOString(),
      topics: ['Health', 'Vaccines', 'Impersonation'],
      impactScore: 76.5,
      region: 'Global'
    }
  ]

  const actions = [
    {
      id: 'fact-check',
      title: 'Fact-Check',
      description: 'Verify claims and detect disinformation',
      icon: Shield,
      href: '/dashboard/tools/fact-check',
      variant: 'primary' as const
    },
    {
      id: 'report-fake',
      title: 'Report Fake',
      description: 'Submit suspicious content for analysis',
      icon: AlertTriangle,
      href: '/dashboard/tools/report-research',
      variant: 'secondary' as const
    },
    {
      id: 'daily-brief',
      title: 'Daily Brief',
      description: 'Latest threat intelligence updates',
      icon: TrendingUp,
      href: '/daily-brief',
      variant: 'secondary' as const
    },
    {
      id: 'join-fight',
      title: 'Join the Fight',
      description: 'Become a truth defender',
      icon: Users,
      href: '/auth/join',
      variant: 'primary' as const
    }
  ]

  const currentThreats = [
    {
      id: 'election-2024',
      level: 'critical' as const,
      message: 'Election Interference Campaign Active - Coordinated disinformation targeting democratic processes detected across multiple platforms.',
      timestamp: new Date().toISOString()
    },
    {
      id: 'deepfake-surge',
      level: 'critical' as const,
      message: 'AI-Generated Content Surge - Significant increase in sophisticated deepfake videos spreading false narratives.',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ]

  // Cycle through background modes for demo
  useEffect(() => {
    const modes: Array<'intelligence' | 'defense' | 'analysis' | 'warfare'> = ['intelligence', 'defense', 'analysis', 'warfare']
    let currentIndex = 0
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % modes.length
      setBackgroundMode(modes[currentIndex] || 'intelligence')
    }, 15000) // Change every 15 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="relative min-h-screen">
      {/* Enhanced Terminal Background with Neural Network */}
      <EnhancedTerminalBackground 
        intensity="medium"
        mode={backgroundMode}
        className="fixed inset-0 z-0"
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Threat Strip */}
        <ThreatStrip threats={currentThreats} />

        {/* Alert Banner */}
        <div className="container mx-auto max-w-7xl px-4 pt-4">
          <AlertBanner
            type="error"
            title="Threat Alert"
            message="Critical disinformation campaigns detected"
            className="mb-6"
          />
        </div>

        {/* Hero Section */}
        <section className="container mx-auto max-w-7xl px-4 py-12 md:py-20">
          <div className="text-center mb-12">
            {/* Logo/Brand */}
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-16 h-16 md:w-20 md:h-20 text-terminal-cyan" />
            </div>
            
            {/* Animated network visualization canvas */}
            <div className="relative mb-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-mono text-terminal-cyan mb-4 hero-title">
                LIONS OF ZION
              </h1>
              <div className="text-xl md:text-2xl text-terminal-text font-mono mb-2">
                Military-Grade Defense Against Information Warfare
              </div>
              <div className="text-lg text-terminal-muted">
                Real-time threat analysis • Fact-checking • Community action
              </div>
            </div>

            {/* Trust Cues */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <ProvenanceBadge
                state="verified"
                showDetails={true}
              />
              <div className="flex items-center gap-2 text-sm text-terminal-muted">
                <Globe className="w-4 h-4" />
                <span>Protecting 2.8M+ users globally</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-terminal-muted">
                <Shield className="w-4 h-4" />
                <span>3,891 threats neutralized</span>
              </div>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => router.push('/auth/join')}
                className="px-8 py-4 bg-terminal-cyan text-terminal-bg font-mono font-bold rounded
                         hover:bg-terminal-cyan/80 transition-colors transform hover:scale-105 duration-200
                         flex items-center justify-center gap-2"
              >
                Join the Fight — Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/dashboard/war-machine')}
                className="px-8 py-4 border border-terminal-cyan text-terminal-cyan font-mono font-bold rounded
                         hover:bg-terminal-cyan/10 transition-colors transform hover:scale-105 duration-200
                         flex items-center justify-center gap-2"
              >
                Explore the War Machine
                <Target className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 terminal-card rounded-lg">
              <Eye className="w-12 h-12 text-terminal-cyan mx-auto mb-4" />
              <h3 className="text-xl font-bold text-terminal-text mb-2">Vigilance</h3>
              <p className="text-terminal-muted">
                24/7 monitoring of global information landscapes to detect emerging threats and disinformation campaigns.
              </p>
            </div>
            
            <div className="text-center p-6 terminal-card rounded-lg">
              <Target className="w-12 h-12 text-terminal-cyan mx-auto mb-4" />
              <h3 className="text-xl font-bold text-terminal-text mb-2">Precision</h3>
              <p className="text-terminal-muted">
                Military-grade accuracy in threat assessment using advanced AI and human intelligence analysis.
              </p>
            </div>
            
            <div className="text-center p-6 terminal-card rounded-lg">
              <Users className="w-12 h-12 text-terminal-cyan mx-auto mb-4" />
              <h3 className="text-xl font-bold text-terminal-text mb-2">Unity</h3>
              <p className="text-terminal-muted">
                Building a global alliance of truth defenders and digital citizens committed to information integrity.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Narratives */}
        <section className="container mx-auto max-w-7xl px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-terminal-text font-mono">
              ACTIVE THREATS
            </h2>
            <button
              onClick={() => router.push('/archive')}
              className="text-terminal-cyan hover:text-terminal-cyan/80 transition-colors font-mono
                       flex items-center gap-2"
            >
              View All Narratives
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredNarratives.map(narrative => (
              <NarrativeCard
                key={narrative.id}
                narrative={narrative}
                onFactCheck={() => router.push(`/dashboard/tools/fact-check?narrative=${narrative.id}`)}
                onViewDetails={() => router.push(`/archive/${narrative.id}`)}
              />
            ))}
          </div>
        </section>

        {/* Action Grid */}
        <section className="container mx-auto max-w-7xl px-4 py-12">
          <h2 className="text-3xl font-bold text-terminal-text font-mono mb-8 text-center">
            CHOOSE YOUR WEAPON
          </h2>
          <ActionGrid actions={actions} />
        </section>

        {/* Call to Action */}
        <section className="container mx-auto max-w-7xl px-4 py-16">
          <div className="text-center p-8 terminal-card rounded-lg">
            <h2 className="text-3xl font-bold text-terminal-text mb-4">
              The Information War is Real
            </h2>
            <p className="text-xl text-terminal-muted mb-8 max-w-3xl mx-auto">
              Every day, millions of people are targeted by sophisticated disinformation campaigns. 
              Join our mission to defend truth and protect democratic institutions worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/auth/join')}
                className="px-8 py-4 bg-terminal-cyan text-terminal-bg font-mono font-bold rounded
                         hover:bg-terminal-cyan/80 transition-colors"
              >
                Join the Resistance
              </button>
              <button
                onClick={() => router.push('/about')}
                className="px-8 py-4 border border-terminal-border text-terminal-text font-mono rounded
                         hover:border-terminal-cyan hover:text-terminal-cyan transition-colors"
              >
                Learn Our Mission
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}