'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LanguageSwitcher } from '@/app/_components/language-switcher';
import { CommandTerminal } from '@/app/_components/terminal/command-terminal';
import { DataStreamDisplay } from '@/app/_components/terminal/data-stream-display';
import { StatusIndicator, StatusPanel } from '@/app/_components/terminal/status-indicator';
import { IntelligenceCard, IntelligenceGrid, IntelligenceIcons } from '@/app/_components/terminal/intelligence-card';
import Link from 'next/link';
import { 
  Shield, 
  Target, 
  Activity, 
  BarChart3, 
  Terminal,
  Database,
  Globe,
  Lock
} from 'lucide-react';

// Dynamically import LivingIntelligenceCanvas
const LivingIntelligenceCanvas = dynamic(
  () => import('@/app/_components/visuals/living-intelligence-canvas').then(mod => mod.LivingIntelligenceCanvas),
  { 
    loading: () => <div className="fixed inset-0 bg-terminal-bg z-20" />,
    ssr: false 
  }
);

export default function Home() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const systemStatuses = [
    { id: 'core', label: 'CORE SYSTEMS', status: 'online' as const, value: '100%' },
    { id: 'network', label: 'NETWORK', status: 'online' as const, value: '98.7%' },
    { id: 'database', label: 'DATABASE', status: 'online' as const, value: 'ACTIVE' },
    { id: 'security', label: 'SECURITY', status: 'warning' as const, value: 'ALERT' },
  ];

  const intelligenceCards = [
    {
      title: 'ACTIVE THREATS',
      value: '247',
      subtitle: 'Monitoring in real-time',
      trend: { direction: 'up' as const, value: '+12%', label: 'from yesterday' },
      priority: 'high' as const,
      icon: IntelligenceIcons.threat,
      metrics: [
        { label: 'Critical', value: '3' },
        { label: 'High', value: '18' }
      ]
    },
    {
      title: 'NETWORK ANALYSIS',
      value: '92%',
      subtitle: 'Precision rate',
      trend: { direction: 'up' as const, value: '+5%', label: 'improvement' },
      priority: 'medium' as const,
      icon: IntelligenceIcons.analytics,
      metrics: [
        { label: 'Nodes', value: '1,847' },
        { label: 'Edges', value: '12.3K' }
      ]
    },
    {
      title: 'OPERATIONS',
      value: '1,204',
      subtitle: 'Campaigns today',
      trend: { direction: 'neutral' as const, value: '0%', label: 'stable' },
      priority: 'info' as const,
      icon: IntelligenceIcons.activity,
      metrics: [
        { label: 'Success', value: '98.2%' },
        { label: 'Active', value: '42' }
      ]
    }
  ];

  return (
    <main className="relative min-h-screen bg-terminal-bg overflow-hidden font-terminal">
      {/* Living Intelligence Canvas Background */}
      <LivingIntelligenceCanvas />

      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Top Status Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-terminal-secondary/90 backdrop-blur-sm border-b border-terminal-border">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-terminal-cyan" />
                <span className="text-xs font-bold text-terminal-cyan">LIONSPACE</span>
              </div>
              <StatusIndicator status="online" label="SYSTEM ONLINE" size="sm" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-terminal-muted">
                {currentTime.toLocaleTimeString('en-US', { hour12: false })}
              </span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="main-content" className="relative z-30 pt-16 pb-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center py-20">
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 hero-title">
                LIONSPACE
              </h1>
              <p className="text-xl md:text-2xl text-terminal-text mb-2">
                Futuristic Intelligence Terminal
              </p>
              <p className="text-sm text-terminal-cyan">
                NAVIGATE NARRATIVES • VERIFY TRUTH • COMMAND OPERATIONS
              </p>
            </div>

            {/* Main CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/join"
                className="terminal-button px-8 py-3 rounded text-lg font-bold uppercase tracking-wider"
              >
                <Terminal className="inline-block w-5 h-5 mr-2" />
                ACCESS TERMINAL
              </Link>
              <Link
                href="/intelligence"
                className="terminal-button px-8 py-3 rounded text-lg font-bold uppercase tracking-wider"
              >
                <Database className="inline-block w-5 h-5 mr-2" />
                INTELLIGENCE HUB
              </Link>
            </div>

            {/* System Status Panel */}
            <div className="max-w-4xl mx-auto mb-12">
              <StatusPanel 
                title="SYSTEM STATUS"
                statuses={systemStatuses}
                columns={4}
              />
            </div>
          </div>

          {/* Intelligence Grid */}
          <div className="mb-12">
            <h2 className="text-xs text-terminal-muted font-bold uppercase tracking-wider mb-6">
              REAL-TIME INTELLIGENCE
            </h2>
            <IntelligenceGrid cards={intelligenceCards} columns={3} />
          </div>

          {/* Terminal and Data Stream Demo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <div>
              <h3 className="text-xs text-terminal-muted font-bold uppercase tracking-wider mb-4">
                COMMAND INTERFACE
              </h3>
              <CommandTerminal
                title="SYSTEM TERMINAL"
                height="300px"
                welcomeMessage="LionSpace Terminal v2.0.0 - Authenticated&#10;Type 'help' for available commands.&#10;"
                commands={{
                  help: 'Commands: status, scan, analyze, monitor, clear',
                  status: 'All systems operational. Security level: ELEVATED',
                  scan: 'Scanning network... 1,847 nodes detected.',
                  analyze: 'Running analysis protocols... Complete.',
                  monitor: 'Monitoring active. 247 threats tracked.'
                }}
              />
            </div>
            <div>
              <h3 className="text-xs text-terminal-muted font-bold uppercase tracking-wider mb-4">
                DATA STREAM
              </h3>
              <DataStreamDisplay
                title="LIVE OPERATIONS"
                height="300px"
                maxEntries={50}
              />
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="terminal-card rounded-lg p-6">
              <Globe className="w-8 h-8 text-terminal-cyan mb-4" />
              <h3 className="text-lg font-bold text-terminal-text mb-2">
                GLOBAL NETWORK
              </h3>
              <p className="text-sm text-terminal-muted">
                Real-time monitoring across distributed nodes with advanced threat detection.
              </p>
            </div>
            <div className="terminal-card rounded-lg p-6">
              <Lock className="w-8 h-8 text-terminal-cyan mb-4" />
              <h3 className="text-lg font-bold text-terminal-text mb-2">
                SECURE OPERATIONS
              </h3>
              <p className="text-sm text-terminal-muted">
                Military-grade encryption with multi-layer security protocols.
              </p>
            </div>
            <div className="terminal-card rounded-lg p-6">
              <BarChart3 className="w-8 h-8 text-terminal-cyan mb-4" />
              <h3 className="text-lg font-bold text-terminal-text mb-2">
                ADVANCED ANALYTICS
              </h3>
              <p className="text-sm text-terminal-muted">
                AI-powered analysis with predictive intelligence capabilities.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <div className="inline-flex gap-4 flex-wrap justify-center">
              <Link href="/dashboard" className="text-terminal-cyan hover:text-terminal-cyan/80 text-sm uppercase tracking-wider">
                Dashboard
              </Link>
              <span className="text-terminal-border">•</span>
              <Link href="/war-room" className="text-terminal-cyan hover:text-terminal-cyan/80 text-sm uppercase tracking-wider">
                War Room
              </Link>
              <span className="text-terminal-border">•</span>
              <Link href="/intelligence" className="text-terminal-cyan hover:text-terminal-cyan/80 text-sm uppercase tracking-wider">
                Intelligence
              </Link>
              <span className="text-terminal-border">•</span>
              <button 
                onClick={() => setShowTerminal(!showTerminal)}
                className="text-terminal-cyan hover:text-terminal-cyan/80 text-sm uppercase tracking-wider"
              >
                Terminal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Terminal Window */}
      {showTerminal && (
        <div className="fixed bottom-4 right-4 w-96 z-50 shadow-2xl">
          <CommandTerminal
            title="QUICK ACCESS TERMINAL"
            height="250px"
          />
          <button
            onClick={() => setShowTerminal(false)}
            className="absolute top-2 right-2 text-terminal-muted hover:text-terminal-red"
          >
            ×
          </button>
        </div>
      )}
    </main>
  );
}