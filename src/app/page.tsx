'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Shield, 
  Target, 
  Activity, 
  BarChart3, 
  Terminal,
  Globe,
  Lock,
  ChevronRight,
  Zap,
  Users,
  AlertTriangle
} from 'lucide-react'
import { LanguageSwitcher } from '@/app/_components/language-switcher'
import { CommandTerminal } from '@/app/_components/terminal/command-terminal'
import { DataStreamDisplay } from '@/app/_components/terminal/data-stream-display'
import { StatusIndicator, StatusPanel } from '@/app/_components/terminal/status-indicator'
import { NavigationHeader } from '@/components/terminal-ui/layout/navigation-header'
import { RemoveGreenCircle } from './remove-green-circle'

// LivingIntelligenceCanvas removed to fix green circle issue

// Intelligence metrics data
const intelligenceMetrics = [
  {
    id: 'cyber-threats',
    title: 'CYBER THREATS',
    value: '2,847',
    change: 12.5,
    trend: 'up' as const,
    subtitle: 'Real-time monitoring of global cyber threat landscape',
    priority: 'high' as const,
    icon: <Shield className="w-6 h-6" />,
    metrics: [
      { label: 'Threats Blocked', value: '2,847' },
      { label: 'Success Rate', value: '99.8%' }
    ]
  },
  {
    id: 'social-intel',
    title: 'SOCIAL MEDIA INTEL',
    value: '15,234',
    change: -3.2,
    trend: 'down' as const,
    subtitle: 'Monitoring disinformation campaigns across platforms',
    priority: 'medium' as const,
    icon: <Target className="w-6 h-6" />,
    metrics: [
      { label: 'Posts Analyzed', value: '15,234' },
      { label: 'Flags Raised', value: '127' }
    ]
  },
  {
    id: 'field-ops',
    title: 'FIELD OPERATIONS',
    value: '42',
    change: 0,
    trend: 'neutral' as const,
    subtitle: 'Live operational intelligence and mission updates',
    priority: 'high' as const,
    icon: <Activity className="w-6 h-6" />,
    metrics: [
      { label: 'Success', value: '98.2%' },
      { label: 'Active', value: '42' }
    ]
  }
]

// Feature cards data
const features = [
  {
    name: 'Global Monitoring',
    description: 'Real-time intelligence gathering across digital platforms worldwide',
    icon: <Globe className="w-8 h-8" />,
    status: 'ACTIVE',
    link: '/intelligence'
  },
  {
    name: 'Secure Operations',
    description: 'End-to-end encrypted communication and data protection protocols',
    icon: <Lock className="w-8 h-8" />,
    status: 'SECURED',
    link: '/war-room'
  },
  {
    name: 'Advanced Analytics',
    description: 'AI-powered analysis and threat detection algorithms',
    icon: <BarChart3 className="w-8 h-8" />,
    status: 'ANALYZING',
    link: '/dashboard'
  },
  {
    name: 'Neural Processing',
    description: 'Deep learning models for pattern recognition and prediction',
    icon: <Zap className="w-8 h-8" />,
    status: 'PROCESSING',
    link: '/intelligence'
  },
  {
    name: 'Team Coordination',
    description: 'Secure collaboration tools for distributed operations',
    icon: <Users className="w-8 h-8" />,
    status: 'SYNCED',
    link: '/war-room'
  },
  {
    name: 'Threat Detection',
    description: 'Automated monitoring and alerting for emerging threats',
    icon: <AlertTriangle className="w-8 h-8" />,
    status: 'MONITORING',
    link: '/intelligence'
  }
]

export default function Home() {
  const [showTerminal, setShowTerminal] = useState(false)

  const systemStatuses = [
    { id: 'core', label: 'CORE SYSTEMS', status: 'online' as const, value: '100%' },
    { id: 'network', label: 'NETWORK', status: 'online' as const, value: '98.7%' },
    { id: 'database', label: 'DATABASE', status: 'online' as const, value: 'ACTIVE' },
    { id: 'security', label: 'SECURITY', status: 'online' as const, value: 'SECURED' }
  ]

  return (
    <>
      <style jsx global>{`
        /* Force remove any large green elements */
        div[style*="background-color: rgb(110, 231, 183)"],
        div[style*="backgroundColor: rgb(110, 231, 183)"],
        div[style*="#6EE7B7"],
        div.fixed.inset-0[style*="background"],
        div[style*="borderRadius: '50%'"][style*="position: fixed"],
        div[style*="border-radius: 50%"][style*="position: fixed"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
      `}</style>
      
      <main className="relative min-h-screen bg-terminal-bg overflow-hidden font-terminal">
        {/* Green circle fix removed */}
      
      {/* Background effects - DISABLED */}

      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation Header */}
      <NavigationHeader />

      {/* Main Content */}
      <div id="main-content" className="relative z-30 pt-16">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-terminal-cyan mb-4">
              LIONSPACE INTELLIGENCE
            </h1>
            <p className="text-xl text-terminal-gold mb-2">Advanced Operations Platform</p>
            <p className="text-lg text-terminal-muted mb-8 max-w-2xl mx-auto">
              Fighting misinformation through advanced AI and human intelligence. Join the resistance against digital deception.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => setShowTerminal(true)}
                className="px-6 py-3 bg-terminal-cyan text-terminal-bg font-bold rounded border-2 border-terminal-cyan hover:bg-transparent hover:text-terminal-cyan transition-colors"
              >
                Initialize System
              </button>
              <Link href="/docs" className="px-6 py-3 border-2 border-terminal-cyan text-terminal-cyan font-bold rounded hover:bg-terminal-cyan hover:text-terminal-bg transition-colors">
                View Documentation
              </Link>
            </div>
            
            {/* Command Terminal Integration */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3 justify-center">
                <Terminal className="w-4 h-4 text-terminal-cyan" />
                <span className="text-sm text-terminal-cyan font-bold">COMMAND INTERFACE</span>
              </div>
              <CommandTerminal onCommand={async (command: string) => {
                setShowTerminal(!showTerminal)
                return `Command '${command}' executed`
              }} />
            </div>
          </div>
        </section>

        {/* System Status Section */}
        <section className="relative py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <StatusPanel
              title="SYSTEM STATUS"
              statuses={systemStatuses}
              columns={4}
            />
          </div>
        </section>

        {/* Intelligence Metrics Grid */}
        <section className="relative py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-base font-semibold leading-7 text-terminal-gold uppercase tracking-wider">
                REAL-TIME INTELLIGENCE
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-terminal-cyan sm:text-4xl">
                Operations Dashboard
              </p>
              <p className="mt-4 text-lg text-terminal-muted">
                Monitor global threats and coordinate response strategies
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {intelligenceMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className={`p-6 border-2 rounded-lg hover:scale-105 transition-transform duration-200 ${
                    metric.priority === 'high' ? 'border-terminal-red bg-terminal-red/10' : 
                    metric.priority === 'medium' ? 'border-terminal-gold bg-terminal-gold/10' : 
                    'border-terminal-cyan bg-terminal-cyan/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-terminal-cyan">
                        {metric.icon}
                        <h3 className="text-sm font-bold uppercase tracking-wider">
                          {metric.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-3xl font-bold text-terminal-text">
                        {metric.value}
                      </p>
                      {metric.change !== 0 && (
                        <p className={`mt-1 text-sm ${metric.trend === 'up' ? 'text-terminal-green' : metric.trend === 'down' ? 'text-terminal-red' : 'text-terminal-muted'}`}>
                          {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'} {Math.abs(metric.change)}%
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-terminal-muted">
                    {metric.subtitle}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-terminal-line">
                    {metric.metrics.map((m, idx) => (
                      <div key={idx}>
                        <p className="text-xs text-terminal-muted uppercase">{m.label}</p>
                        <p className="text-sm font-bold text-terminal-cyan">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid with TailwindUI Pattern */}
        <section className="relative py-20 px-4 bg-terminal-secondary/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-base font-semibold leading-7 text-terminal-gold uppercase tracking-wider">
                SYSTEM CAPABILITIES
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-terminal-cyan sm:text-4xl">
                Advanced Intelligence Features
              </p>
              <p className="mt-4 text-lg text-terminal-muted">
                Comprehensive toolkit for modern intelligence operations
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Link key={feature.name} href={feature.link}>
                  <div className="p-6 border-2 border-terminal-cyan rounded-lg h-full hover:bg-terminal-secondary/50 transition-all duration-200 cursor-pointer group">
                    <div className="flex flex-col h-full">
                      <div className="text-terminal-cyan group-hover:text-terminal-gold transition-colors">
                        {feature.icon}
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-terminal-text group-hover:text-terminal-cyan transition-colors">
                        {feature.name}
                      </h3>
                      <p className="mt-2 text-sm text-terminal-muted flex-grow">
                        {feature.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-mono text-terminal-green">
                          STATUS: {feature.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-terminal-cyan group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-8 border-2 border-terminal-gold rounded-lg bg-gradient-to-br from-terminal-secondary/80 to-terminal-bg">
              <Shield className="w-16 h-16 text-terminal-gold mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-terminal-cyan mb-4">
                Join the Resistance
              </h2>
              <p className="text-lg text-terminal-text mb-8 max-w-2xl mx-auto">
                Become part of an elite network of digital defenders. Access advanced tools, 
                real-time intelligence, and join the fight against misinformation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/join" className="px-8 py-4 bg-terminal-gold text-terminal-bg font-bold rounded border-2 border-terminal-gold hover:bg-transparent hover:text-terminal-gold transition-colors inline-flex items-center gap-2">
                  JOIN NOW - IT&apos;S FREE
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link href="/war-room" className="px-8 py-4 border-2 border-terminal-gold text-terminal-gold font-bold rounded hover:bg-terminal-gold hover:text-terminal-bg transition-colors">
                  ENTER WAR ROOM
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Data Stream Display */}
        {showTerminal && (
          <section className="relative py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <DataStreamDisplay />
            </div>
          </section>
        )}
      </div>
      </main>
    </>
  )
}