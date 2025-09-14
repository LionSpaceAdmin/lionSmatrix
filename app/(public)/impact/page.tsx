'use client'

import { useState } from 'react'
import { TrendingUp, Users, Shield, Target, Globe, ChevronDown, ChevronUp, BarChart3, Eye, AlertTriangle } from 'lucide-react'
import dynamic from 'next/dynamic'
import { EnhancedTerminalBackground } from '@/components/organisms/EnhancedTerminalBackground'

// Lazy load chart component for better performance
const ImpactChart = dynamic(() => import('@/components/charts/ImpactChart').then(mod => ({ default: mod.ImpactChart })), {
  loading: () => (
    <div className="h-64 bg-terminal-secondary border border-terminal-border rounded-lg animate-pulse" />
  ),
  ssr: false
})

export default function ImpactPage() {
  const [expandedMethodology, setExpandedMethodology] = useState(false)

  // Mock data - in production this would come from API
  const impactMetrics = {
    narrativesAddressed: 1247,
    factChecksPublished: 3891,
    globalReach: 2847293,
    threatsNeutralized: 156,
    platformsMonitored: 23,
    languagesSupported: 8,
    communityCrontributors: 15673,
    averageResponseTime: 4.7 // hours
  }

  const monthlyData = [
    { month: 'Jan', narratives: 89, factChecks: 234, threats: 12 },
    { month: 'Feb', narratives: 127, factChecks: 378, threats: 18 },
    { month: 'Mar', narratives: 156, factChecks: 445, threats: 23 },
    { month: 'Apr', narratives: 198, factChecks: 523, threats: 19 },
    { month: 'May', narratives: 234, factChecks: 612, threats: 27 },
    { month: 'Jun', narratives: 267, factChecks: 698, threats: 31 },
    { month: 'Jul', narratives: 298, factChecks: 756, threats: 26 },
    { month: 'Aug', narratives: 234, factChecks: 634, threats: 22 },
    { month: 'Sep', narratives: 287, factChecks: 723, threats: 29 },
    { month: 'Oct', narratives: 312, factChecks: 789, threats: 34 },
    { month: 'Nov', narratives: 289, factChecks: 712, threats: 28 },
    { month: 'Dec', narratives: 267, factChecks: 687, threats: 25 }
  ]

  const impactStories = [
    {
      title: "Election Integrity Protection",
      description: "Identified and countered coordinated bot network targeting 2024 elections",
      impact: "Protected 2.3M voters from false information",
      timeframe: "October 2024"
    },
    {
      title: "Health Misinformation Campaign",
      description: "Exposed fake medical professionals spreading vaccine misinformation",
      impact: "Prevented spread to 1.8M social media users",
      timeframe: "September 2024"
    },
    {
      title: "Climate Data Verification",
      description: "Debunked viral climate data manipulation claims with satellite verification",
      impact: "Restored trust for 950K concerned citizens",
      timeframe: "August 2024"
    }
  ]

  return (
    <main className="relative min-h-screen">
      {/* Enhanced Terminal Background with Intelligence Mode for Impact Analysis */}
      <EnhancedTerminalBackground 
        intensity="low"
        mode="intelligence"
        className="fixed inset-0 z-0"
      />
      
      {/* Content */}
      <div className="relative z-10 bg-terminal-bg/60">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-terminal-cyan mb-4">
            GLOBAL IMPACT
          </h1>
          <p className="text-xl text-terminal-muted max-w-3xl mx-auto">
            Transparency in action: Real metrics from our fight against disinformation 
            and the measurable impact on global information integrity.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-terminal-cyan" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-terminal-text mb-1">
              {impactMetrics.narrativesAddressed.toLocaleString()}
            </div>
            <div className="text-sm text-terminal-muted">Narratives Addressed</div>
          </div>

          <div className="p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <Shield className="w-8 h-8 text-terminal-cyan" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-terminal-text mb-1">
              {impactMetrics.factChecksPublished.toLocaleString()}
            </div>
            <div className="text-sm text-terminal-muted">Fact-Checks Published</div>
          </div>

          <div className="p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <Globe className="w-8 h-8 text-terminal-cyan" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-terminal-text mb-1">
              {(impactMetrics.globalReach / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-terminal-muted">Global Reach</div>
          </div>

          <div className="p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="w-8 h-8 text-terminal-cyan" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-terminal-text mb-1">
              {impactMetrics.threatsNeutralized}
            </div>
            <div className="text-sm text-terminal-muted">Threats Neutralized</div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-4 bg-terminal-secondary/50 border border-terminal-border rounded-lg">
            <div className="text-2xl font-bold font-mono text-terminal-text mb-1">
              {impactMetrics.platformsMonitored}
            </div>
            <div className="text-sm text-terminal-muted">Platforms Monitored</div>
          </div>

          <div className="p-4 bg-terminal-secondary/50 border border-terminal-border rounded-lg">
            <div className="text-2xl font-bold font-mono text-terminal-text mb-1">
              {impactMetrics.languagesSupported}
            </div>
            <div className="text-sm text-terminal-muted">Languages Supported</div>
          </div>

          <div className="p-4 bg-terminal-secondary/50 border border-terminal-border rounded-lg">
            <div className="text-2xl font-bold font-mono text-terminal-text mb-1">
              {impactMetrics.communityCrontributors.toLocaleString()}
            </div>
            <div className="text-sm text-terminal-muted">Community Contributors</div>
          </div>

          <div className="p-4 bg-terminal-secondary/50 border border-terminal-border rounded-lg">
            <div className="text-2xl font-bold font-mono text-terminal-text mb-1">
              {impactMetrics.averageResponseTime}h
            </div>
            <div className="text-sm text-terminal-muted">Avg Response Time</div>
          </div>
        </div>

        {/* Impact Chart */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold font-mono text-terminal-text mb-6">
            Monthly Impact Timeline
          </h2>
          <div className="p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
            <ImpactChart data={monthlyData} />
          </div>
        </div>

        {/* Impact Stories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold font-mono text-terminal-text mb-6">
            Featured Impact Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {impactStories.map((story, index) => (
              <div key={index} className="p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
                <h3 className="text-lg font-bold text-terminal-text mb-3">
                  {story.title}
                </h3>
                <p className="text-sm text-terminal-muted mb-4">
                  {story.description}
                </p>
                <div className="border-t border-terminal-border pt-4">
                  <div className="text-terminal-cyan font-mono text-sm mb-1">
                    {story.impact}
                  </div>
                  <div className="text-xs text-terminal-muted">
                    {story.timeframe}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology Section */}
        <div className="mb-12">
          <div className="p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
            <button
              onClick={() => setExpandedMethodology(!expandedMethodology)}
              className="flex items-center justify-between w-full text-left"
            >
              <h2 className="text-xl font-bold font-mono text-terminal-text">
                Methodology & Data Sources
              </h2>
              {expandedMethodology ? (
                <ChevronUp className="w-5 h-5 text-terminal-muted" />
              ) : (
                <ChevronDown className="w-5 h-5 text-terminal-muted" />
              )}
            </button>
            
            {expandedMethodology && (
              <div className="mt-6 space-y-4 text-terminal-muted">
                <div>
                  <h3 className="text-lg font-bold text-terminal-text mb-2">Data Collection</h3>
                  <p className="mb-4">
                    Our impact metrics are collected through a combination of automated monitoring 
                    systems and human verification processes. All data is anonymized and aggregated 
                    to protect individual privacy while maintaining transparency.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-terminal-text mb-2">Verification Process</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Multi-source verification for all fact-checks</li>
                    <li>Independent review by trained analysts</li>
                    <li>Community peer review system</li>
                    <li>Regular audits by external organizations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-terminal-text mb-2">Impact Measurement</h3>
                  <p className="mb-4">
                    We measure impact through reach metrics, engagement analysis, and follow-up 
                    studies to assess the effectiveness of our interventions. All measurements 
                    follow established academic standards for information intervention research.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-terminal-text mb-2">Transparency Commitment</h3>
                  <p>
                    Detailed methodology papers and raw data (where privacy permits) are available 
                    through our transparency portal. We believe in open science and reproducible 
                    research in the fight against disinformation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center p-8 bg-terminal-secondary border border-terminal-border rounded-lg">
          <h2 className="text-2xl font-bold text-terminal-text mb-4">
            Be Part of the Solution
          </h2>
          <p className="text-terminal-muted mb-6 max-w-2xl mx-auto">
            Join thousands of truth defenders worldwide. Together, we can build a more 
            informed and resilient global information ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/auth/join"
              className="px-6 py-3 bg-terminal-cyan text-terminal-bg font-mono font-bold rounded
                       hover:bg-terminal-cyan/80 transition-colors"
            >
              Join the Fight — Free
            </a>
            <a 
              href="/daily-brief"
              className="px-6 py-3 border border-terminal-border text-terminal-text font-mono rounded
                       hover:border-terminal-cyan hover:text-terminal-cyan transition-colors"
            >
              View Daily Brief
            </a>
          </div>
        </div>
      </div>
      </div>
    </main>
  )
}