'use client'

import { useState } from 'react'
import { ArrowLeft, Share, Download, ExternalLink, Clock, MapPin, AlertTriangle, Shield, CheckCircle, Copy, Link as LinkIcon, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { EvidenceList } from '@/components/shared/EvidenceList'
import { SharePackModule } from '@/components/shared/SharePackModule'
import { ProvenanceBadge } from '@/components/shared/ProvenanceBadge'

// Evidence interface
interface Evidence {
  id: string
  type: 'document' | 'link' | 'image' | 'video' | 'social'
  title: string
  source: string
  url?: string
  date: string
  author?: string
  verified: boolean
  confidence: number
  tags?: string[]
  description?: string
}

interface TimelineEvent {
  date: string
  event: string
  description: string
}

interface Narrative {
  id: string
  title: string
  description: string
  threatLevel: 'critical' | 'high' | 'medium' | 'low'
  confidence: number
  evidenceCount: number
  lastUpdated: string
  createdAt: string
  topics: string[]
  impactScore: number
  region: string
  platforms: string[]
  claim: string
  verdict: string
  verificationStatus: string
  summary: string
  keyFindings: string[]
  timeline: TimelineEvent[]
  evidence: Evidence[]
  methodology: string
  relatedNarratives: string[]
  shareableContent: {
    shortSummary: string
    hashtags: string[]
    callToAction: string
  }
}

interface Props {
  narrative: Narrative
}

export function NarrativeDetailClient({ narrative }: Props) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [copiedText, setCopiedText] = useState('')

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-400 bg-red-400/10 border-red-400/30'
      case 'high':
        return 'text-orange-400 bg-orange-400/10 border-orange-400/30'
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      case 'low':
        return 'text-green-400 bg-green-400/10 border-green-400/30'
      default:
        return 'text-terminal-muted bg-terminal-muted/10 border-terminal-muted/30'
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict.toLowerCase()) {
      case 'false':
        return 'text-red-400 bg-red-400/10 border-red-400/30'
      case 'deepfake':
        return 'text-purple-400 bg-purple-400/10 border-purple-400/30'
      case 'misleading':
        return 'text-orange-400 bg-orange-400/10 border-orange-400/30'
      case 'true':
        return 'text-green-400 bg-green-400/10 border-green-400/30'
      default:
        return 'text-terminal-muted bg-terminal-muted/10 border-terminal-muted/30'
    }
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(label)
      setTimeout(() => setCopiedText(''), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href + '?utm_source=share&utm_medium=link&utm_campaign=narrative_share' : ''

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'evidence', label: 'Evidence', icon: Shield },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'share', label: 'Share Pack', icon: Share }
  ]

  return (
    <main className="min-h-screen bg-terminal-bg">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header Navigation */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-terminal-cyan hover:text-terminal-cyan/80 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono">Back to Archive</span>
          </button>

          {/* Breadcrumb */}
          <div className="text-sm text-terminal-muted font-mono">
            <span>Archive</span>
            <span className="mx-2">/</span>
            <span className="text-terminal-text">{narrative.title}</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-bold text-terminal-text mb-4 leading-tight">
                {narrative.title}
              </h1>
              
              {/* Status Badges */}
              <div className="flex flex-wrap gap-3 mb-4">
                <span className={`px-3 py-1 rounded border text-sm font-mono uppercase ${getThreatLevelColor(narrative.threatLevel)}`}>
                  {narrative.threatLevel} Threat
                </span>
                <span className={`px-3 py-1 rounded border text-sm font-mono uppercase ${getVerdictColor(narrative.verdict)}`}>
                  {narrative.verdict}
                </span>
                <span className="px-3 py-1 rounded border text-sm font-mono text-terminal-cyan bg-terminal-cyan/10 border-terminal-cyan/30">
                  {narrative.confidence}% Confidence
                </span>
              </div>
            </div>

            {/* Provenance Badge */}
            <div className="flex-shrink-0">
              <ProvenanceBadge
                state={narrative.verificationStatus as any}
                showDetails={true}
              />
            </div>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-terminal-secondary border border-terminal-border rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-terminal-muted" />
              <span className="text-sm text-terminal-muted">Region:</span>
              <span className="text-sm text-terminal-text font-mono">{narrative.region}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-terminal-muted" />
              <span className="text-sm text-terminal-muted">Updated:</span>
              <span className="text-sm text-terminal-text font-mono">
                {new Date(narrative.lastUpdated).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-terminal-muted" />
              <span className="text-sm text-terminal-muted">Evidence:</span>
              <span className="text-sm text-terminal-text font-mono">{narrative.evidenceCount} items</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b border-terminal-border">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors font-mono ${
                  activeTab === id
                    ? 'border-terminal-cyan text-terminal-cyan'
                    : 'border-transparent text-terminal-muted hover:text-terminal-text'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Claim and Verdict */}
              <div className="p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
                <h2 className="text-xl font-bold text-terminal-text mb-4">Claim Analysis</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-mono text-terminal-muted uppercase mb-2">Original Claim</h3>
                    <p className="text-terminal-text border-l-4 border-orange-400 pl-4 italic">
                      "{narrative.claim}"
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-mono text-terminal-muted uppercase mb-2">Our Verdict</h3>
                    <p className={`text-lg font-bold ${getVerdictColor(narrative.verdict).includes('red') ? 'text-red-400' : 
                      getVerdictColor(narrative.verdict).includes('purple') ? 'text-purple-400' : 'text-green-400'}`}>
                      {narrative.verdict}
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
                <h2 className="text-xl font-bold text-terminal-text mb-4">Executive Summary</h2>
                <p className="text-terminal-muted leading-relaxed">
                  {narrative.summary}
                </p>
              </div>

              {/* Key Findings */}
              <div className="p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
                <h2 className="text-xl font-bold text-terminal-text mb-4">Key Findings</h2>
                <ul className="space-y-3">
                  {narrative.keyFindings.map((finding, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-terminal-cyan mt-0.5 flex-shrink-0" />
                      <span className="text-terminal-muted">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Platforms and Topics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
                  <h3 className="text-lg font-bold text-terminal-text mb-4">Affected Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    {narrative.platforms.map(platform => (
                      <span key={platform} className="px-3 py-1 bg-terminal-bg border border-terminal-border rounded text-sm font-mono text-terminal-text">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
                  <h3 className="text-lg font-bold text-terminal-text mb-4">Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {narrative.topics.map(topic => (
                      <span key={topic} className="px-3 py-1 bg-terminal-cyan/10 border border-terminal-cyan/30 rounded text-sm font-mono text-terminal-cyan">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Methodology */}
              <div className="p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
                <h2 className="text-xl font-bold text-terminal-text mb-4">Methodology</h2>
                <p className="text-terminal-muted leading-relaxed">
                  {narrative.methodology}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div>
              <EvidenceList 
                evidence={narrative.evidence}
              />
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
              <h2 className="text-xl font-bold text-terminal-text mb-6">Investigation Timeline</h2>
              <div className="space-y-6">
                {narrative.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-terminal-cyan/20 border border-terminal-cyan rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-terminal-cyan" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-terminal-muted font-mono">
                        {new Date(event.date).toLocaleString()}
                      </div>
                      <h3 className="text-lg font-bold text-terminal-text mt-1">
                        {event.event}
                      </h3>
                      <p className="text-terminal-muted mt-1">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'share' && (
            <div>
              <SharePackModule
                content={{
                  title: narrative.title,
                  text: narrative.description,
                  url: shareUrl,
                  hashtags: narrative.shareableContent?.hashtags || []
                }}
              />
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
          <h3 className="text-lg font-bold text-terminal-text mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => copyToClipboard(shareUrl, 'Share Link')}
              className="flex items-center gap-2 px-4 py-2 bg-terminal-cyan text-terminal-bg font-mono rounded hover:bg-terminal-cyan/80 transition-colors"
            >
              {copiedText === 'Share Link' ? <CheckCircle className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
              {copiedText === 'Share Link' ? 'Copied!' : 'Copy Share Link'}
            </button>
            
            <button
              onClick={() => copyToClipboard(narrative.shareableContent.shortSummary, 'Summary')}
              className="flex items-center gap-2 px-4 py-2 border border-terminal-border text-terminal-text font-mono rounded hover:border-terminal-cyan hover:text-terminal-cyan transition-colors"
            >
              {copiedText === 'Summary' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedText === 'Summary' ? 'Copied!' : 'Copy Summary'}
            </button>
            
            <a
              href="/dashboard/tools/fact-check"
              className="flex items-center gap-2 px-4 py-2 border border-terminal-border text-terminal-text font-mono rounded hover:border-terminal-cyan hover:text-terminal-cyan transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open Fact-Check Tool
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}