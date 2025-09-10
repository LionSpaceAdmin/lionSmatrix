'use client'

import { useState } from 'react'
import { 
  FileCheck, Plus, X, Search, AlertTriangle, CheckCircle, 
  XCircle, Info, Link2, Calendar, User, Globe, Download,
  Share2, Copy, ExternalLink, Shield, Zap, TrendingUp,
  Database, ChevronDown, ChevronUp, Star, AlertCircle
} from 'lucide-react'

interface Evidence {
  id: string
  type: 'supporting' | 'contradicting' | 'neutral'
  source: string
  sourceUrl: string
  date: string
  content: string
  reliability: number // 1-5
  verified: boolean
}

interface Claim {
  id: string
  text: string
  category: string
  dateSubmitted: string
  verdict: 'true' | 'false' | 'misleading' | 'unverified' | null
  confidence: number // 0-100
  evidence: Evidence[]
  summary: string
}

const categories = [
  'Politics', 'Health', 'Climate', 'Technology', 
  'Economy', 'Social Media', 'Science', 'Education'
]

const mockSuggestedSources = [
  { name: 'Reuters Fact Check', url: 'https://reuters.com/fact-check', trust: 95 },
  { name: 'AP Fact Check', url: 'https://apnews.com/fact-check', trust: 94 },
  { name: 'Snopes', url: 'https://snopes.com', trust: 88 },
  { name: 'FactCheck.org', url: 'https://factcheck.org', trust: 92 },
  { name: 'PolitiFact', url: 'https://politifact.com', trust: 90 }
]

export default function FactCheckPage() {
  const [currentClaim, setCurrentClaim] = useState<Claim>({
    id: `claim-${Date.now()}`,
    text: '',
    category: 'Politics',
    dateSubmitted: new Date().toISOString(),
    verdict: null,
    confidence: 0,
    evidence: [],
    summary: ''
  })
  
  const [showSources, setShowSources] = useState(true)
  const [analysisStep, setAnalysisStep] = useState<'claim' | 'evidence' | 'verdict'>('claim')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const addEvidence = () => {
    const newEvidence: Evidence = {
      id: `ev-${Date.now()}`,
      type: 'neutral',
      source: '',
      sourceUrl: '',
      date: new Date().toISOString().split('T')[0],
      content: '',
      reliability: 3,
      verified: false
    }
    
    setCurrentClaim(prev => ({
      ...prev,
      evidence: [...prev.evidence, newEvidence]
    }))
  }

  const updateEvidence = (id: string, field: keyof Evidence, value: any) => {
    setCurrentClaim(prev => ({
      ...prev,
      evidence: prev.evidence.map(ev => 
        ev.id === id ? { ...ev, [field]: value } : ev
      )
    }))
  }

  const deleteEvidence = (id: string) => {
    setCurrentClaim(prev => ({
      ...prev,
      evidence: prev.evidence.filter(ev => ev.id !== id)
    }))
  }

  const calculateVerdict = () => {
    setIsAnalyzing(true)
    
    // Mock analysis
    setTimeout(() => {
      const supporting = currentClaim.evidence.filter(e => e.type === 'supporting').length
      const contradicting = currentClaim.evidence.filter(e => e.type === 'contradicting').length
      
      let verdict: Claim['verdict'] = 'unverified'
      let confidence = 0
      
      if (currentClaim.evidence.length > 0) {
        if (supporting > contradicting * 2) {
          verdict = 'true'
          confidence = Math.min(95, 60 + supporting * 10)
        } else if (contradicting > supporting * 2) {
          verdict = 'false'
          confidence = Math.min(95, 60 + contradicting * 10)
        } else {
          verdict = 'misleading'
          confidence = 50 + Math.random() * 30
        }
      }
      
      setCurrentClaim(prev => ({
        ...prev,
        verdict,
        confidence: Math.round(confidence),
        summary: generateSummary(verdict, supporting, contradicting)
      }))
      
      setAnalysisStep('verdict')
      setIsAnalyzing(false)
    }, 2000)
  }

  const generateSummary = (verdict: string, supporting: number, contradicting: number) => {
    const templates = {
      true: `This claim is largely accurate based on ${supporting} supporting sources. The evidence strongly corroborates the main assertion.`,
      false: `This claim is false according to ${contradicting} reliable sources. The evidence clearly contradicts the assertion.`,
      misleading: `This claim contains elements of truth but is misleading overall. ${supporting} sources support aspects while ${contradicting} contradict key points.`,
      unverified: 'Insufficient evidence to verify this claim. More sources needed for conclusive fact-check.'
    }
    return templates[verdict as keyof typeof templates] || templates.unverified
  }

  const getVerdictColor = (verdict: Claim['verdict']) => {
    switch (verdict) {
      case 'true': return 'text-green-400 bg-green-500/10 border-green-500/30'
      case 'false': return 'text-red-400 bg-red-500/10 border-red-500/30'
      case 'misleading': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      default: return 'text-terminal-muted bg-terminal-secondary border-terminal-border'
    }
  }

  const getVerdictIcon = (verdict: Claim['verdict']) => {
    switch (verdict) {
      case 'true': return CheckCircle
      case 'false': return XCircle
      case 'misleading': return AlertTriangle
      default: return Info
    }
  }

  const exportPDF = () => {
    console.log('Exporting to PDF...', currentClaim)
    alert('PDF exported! (Mock functionality)')
  }

  const shareLink = () => {
    const shareUrl = `https://lionspace.ai/fact-check/${currentClaim.id}`
    navigator.clipboard.writeText(shareUrl)
    alert('Share link copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Header */}
      <div className="border-b border-terminal-border bg-terminal-secondary/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileCheck className="w-8 h-8 text-terminal-cyan" />
              <div>
                <h1 className="text-2xl font-bold font-mono text-terminal-cyan">
                  FACT-CHECK WINDOW
                </h1>
                <p className="text-xs text-terminal-muted">
                  Build evidence-based fact-checks with confidence scoring
                </p>
              </div>
            </div>
            
            {/* Step Indicator */}
            <div className="flex items-center gap-2">
              {(['claim', 'evidence', 'verdict'] as const).map((step, index) => (
                <div key={step} className="flex items-center">
                  <button
                    onClick={() => setAnalysisStep(step)}
                    className={`px-3 py-1 rounded font-mono text-xs transition-all ${
                      analysisStep === step
                        ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-400'
                        : 'bg-terminal-secondary border border-terminal-border text-terminal-muted'
                    }`}
                  >
                    {index + 1}. {step.toUpperCase()}
                  </button>
                  {index < 2 && (
                    <ChevronDown className="w-4 h-4 text-terminal-muted mx-1 rotate-[-90deg]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Claim Input */}
            {analysisStep === 'claim' && (
              <div className="space-y-6">
                <div className="p-6 rounded-lg bg-terminal-secondary border border-terminal-border">
                  <h2 className="text-lg font-bold font-mono text-terminal-cyan mb-4">
                    ENTER CLAIM TO VERIFY
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-mono text-terminal-muted mb-2">
                        CLAIM TEXT
                      </label>
                      <textarea
                        value={currentClaim.text}
                        onChange={(e) => setCurrentClaim(prev => ({ ...prev, text: e.target.value }))}
                        placeholder="Enter the claim you want to fact-check..."
                        rows={4}
                        className="w-full px-4 py-3 bg-terminal-bg border border-terminal-border 
                                 rounded-lg text-terminal-text font-mono placeholder-terminal-muted
                                 focus:border-terminal-cyan focus:outline-none transition-colors resize-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-mono text-terminal-muted mb-2">
                        CATEGORY
                      </label>
                      <select
                        value={currentClaim.category}
                        onChange={(e) => setCurrentClaim(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 bg-terminal-bg border border-terminal-border 
                                 rounded-lg text-terminal-text font-mono focus:border-terminal-cyan 
                                 focus:outline-none transition-colors"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      onClick={() => setAnalysisStep('evidence')}
                      disabled={!currentClaim.text}
                      className="w-full py-3 rounded-lg bg-cyan-500/20 border-2 border-cyan-500 
                               text-cyan-400 font-mono font-bold hover:bg-cyan-500/30 
                               transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      PROCEED TO EVIDENCE →
                    </button>
                  </div>
                </div>

                {/* AI Suggestions */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-terminal-secondary 
                              border border-yellow-500/30">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-mono font-bold text-yellow-400 mb-2">
                        AI CLAIM ANALYSIS
                      </h3>
                      <ul className="text-sm text-terminal-muted space-y-1">
                        <li>• Check for loaded language and emotional appeals</li>
                        <li>• Identify specific claims that can be verified</li>
                        <li>• Look for missing context or cherry-picked data</li>
                        <li>• Consider the source and potential biases</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Evidence Collection */}
            {analysisStep === 'evidence' && (
              <div className="space-y-6">
                <div className="p-6 rounded-lg bg-terminal-secondary border border-terminal-border">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold font-mono text-terminal-cyan">
                      EVIDENCE COLLECTION
                    </h2>
                    <button
                      onClick={addEvidence}
                      className="px-3 py-1 rounded-lg bg-terminal-bg border border-terminal-border 
                               text-terminal-cyan font-mono text-sm hover:border-terminal-cyan 
                               transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      ADD EVIDENCE
                    </button>
                  </div>

                  {/* Claim Display */}
                  <div className="mb-4 p-3 rounded bg-terminal-bg border border-terminal-border">
                    <p className="text-sm text-terminal-text italic">"{currentClaim.text}"</p>
                  </div>

                  {/* Evidence List */}
                  <div className="space-y-4">
                    {currentClaim.evidence.map((evidence, index) => (
                      <div
                        key={evidence.id}
                        className="p-4 rounded-lg bg-terminal-bg border border-terminal-border space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-mono text-terminal-cyan">
                            EVIDENCE #{index + 1}
                          </span>
                          <button
                            onClick={() => deleteEvidence(evidence.id)}
                            className="p-1 rounded hover:bg-red-500/20 text-terminal-muted 
                                     hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Evidence Type */}
                        <div className="grid grid-cols-3 gap-2">
                          {(['supporting', 'contradicting', 'neutral'] as const).map((type) => (
                            <button
                              key={type}
                              onClick={() => updateEvidence(evidence.id, 'type', type)}
                              className={`py-2 px-3 rounded font-mono text-xs transition-all ${
                                evidence.type === type
                                  ? type === 'supporting' 
                                    ? 'bg-green-500/20 border border-green-500 text-green-400'
                                    : type === 'contradicting'
                                    ? 'bg-red-500/20 border border-red-500 text-red-400'
                                    : 'bg-yellow-500/20 border border-yellow-500 text-yellow-400'
                                  : 'bg-terminal-secondary border border-terminal-border text-terminal-text'
                              }`}
                            >
                              {type.toUpperCase()}
                            </button>
                          ))}
                        </div>

                        {/* Source Info */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-mono text-terminal-muted mb-1">
                              SOURCE NAME
                            </label>
                            <input
                              type="text"
                              value={evidence.source}
                              onChange={(e) => updateEvidence(evidence.id, 'source', e.target.value)}
                              placeholder="Reuters, AP News, etc."
                              className="w-full px-3 py-2 bg-terminal-secondary border border-terminal-border 
                                       rounded text-terminal-text font-mono text-sm 
                                       placeholder-terminal-muted focus:border-terminal-cyan 
                                       focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-terminal-muted mb-1">
                              SOURCE URL
                            </label>
                            <input
                              type="url"
                              value={evidence.sourceUrl}
                              onChange={(e) => updateEvidence(evidence.id, 'sourceUrl', e.target.value)}
                              placeholder="https://..."
                              className="w-full px-3 py-2 bg-terminal-secondary border border-terminal-border 
                                       rounded text-terminal-text font-mono text-sm 
                                       placeholder-terminal-muted focus:border-terminal-cyan 
                                       focus:outline-none transition-colors"
                            />
                          </div>
                        </div>

                        {/* Evidence Content */}
                        <div>
                          <label className="block text-xs font-mono text-terminal-muted mb-1">
                            EVIDENCE CONTENT
                          </label>
                          <textarea
                            value={evidence.content}
                            onChange={(e) => updateEvidence(evidence.id, 'content', e.target.value)}
                            placeholder="Quote or describe the evidence..."
                            rows={3}
                            className="w-full px-3 py-2 bg-terminal-secondary border border-terminal-border 
                                     rounded text-terminal-text font-mono text-sm 
                                     placeholder-terminal-muted focus:border-terminal-cyan 
                                     focus:outline-none transition-colors resize-none"
                          />
                        </div>

                        {/* Reliability Score */}
                        <div>
                          <label className="block text-xs font-mono text-terminal-muted mb-1">
                            RELIABILITY SCORE
                          </label>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((score) => (
                              <button
                                key={score}
                                onClick={() => updateEvidence(evidence.id, 'reliability', score)}
                                className={`p-1 transition-colors ${
                                  score <= evidence.reliability
                                    ? 'text-yellow-400'
                                    : 'text-terminal-muted'
                                }`}
                              >
                                <Star className="w-5 h-5 fill-current" />
                              </button>
                            ))}
                            <span className="text-xs font-mono text-terminal-muted ml-2">
                              ({evidence.reliability}/5)
                            </span>
                          </div>
                        </div>

                        {/* Verification Status */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={evidence.verified}
                            onChange={(e) => updateEvidence(evidence.id, 'verified', e.target.checked)}
                            className="w-4 h-4 bg-terminal-secondary border border-terminal-border rounded 
                                     text-terminal-cyan focus:ring-terminal-cyan"
                          />
                          <span className="text-sm font-mono text-terminal-text">
                            Source verified
                          </span>
                        </label>
                      </div>
                    ))}

                    {currentClaim.evidence.length === 0 && (
                      <div className="text-center py-8">
                        <Database className="w-12 h-12 text-terminal-muted mx-auto mb-4" />
                        <p className="text-terminal-muted font-mono">
                          No evidence added yet
                        </p>
                        <p className="text-xs text-terminal-muted mt-2">
                          Click "ADD EVIDENCE" to start building your fact-check
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setAnalysisStep('claim')}
                      className="flex-1 py-3 rounded-lg bg-terminal-bg border border-terminal-border 
                               text-terminal-text font-mono font-bold hover:border-terminal-cyan 
                               transition-colors"
                    >
                      ← BACK TO CLAIM
                    </button>
                    <button
                      onClick={calculateVerdict}
                      disabled={currentClaim.evidence.length === 0 || isAnalyzing}
                      className="flex-1 py-3 rounded-lg bg-cyan-500/20 border-2 border-cyan-500 
                               text-cyan-400 font-mono font-bold hover:bg-cyan-500/30 
                               transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                               flex items-center justify-center gap-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent 
                                        rounded-full animate-spin" />
                          ANALYZING...
                        </>
                      ) : (
                        <>
                          CALCULATE VERDICT →
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Verdict */}
            {analysisStep === 'verdict' && currentClaim.verdict && (
              <div className="space-y-6">
                {/* Verdict Card */}
                <div className={`p-6 rounded-lg border-2 ${getVerdictColor(currentClaim.verdict)}`}>
                  <div className="flex items-start gap-4">
                    {(() => {
                      const Icon = getVerdictIcon(currentClaim.verdict)
                      return <Icon className="w-12 h-12 flex-shrink-0" />
                    })()}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold font-mono mb-2">
                        VERDICT: {currentClaim.verdict?.toUpperCase()}
                      </h2>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-mono">Confidence Level</span>
                          <span className="text-sm font-mono font-bold">{currentClaim.confidence}%</span>
                        </div>
                        <div className="h-3 bg-terminal-bg/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-500"
                            style={{ width: `${currentClaim.confidence}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-terminal-text">{currentClaim.summary}</p>
                    </div>
                  </div>
                </div>

                {/* Evidence Summary */}
                <div className="p-6 rounded-lg bg-terminal-secondary border border-terminal-border">
                  <h3 className="text-lg font-bold font-mono text-terminal-cyan mb-4">
                    EVIDENCE SUMMARY
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold font-mono text-green-400">
                        {currentClaim.evidence.filter(e => e.type === 'supporting').length}
                      </div>
                      <div className="text-xs text-terminal-muted">SUPPORTING</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold font-mono text-red-400">
                        {currentClaim.evidence.filter(e => e.type === 'contradicting').length}
                      </div>
                      <div className="text-xs text-terminal-muted">CONTRADICTING</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold font-mono text-yellow-400">
                        {currentClaim.evidence.filter(e => e.type === 'neutral').length}
                      </div>
                      <div className="text-xs text-terminal-muted">NEUTRAL</div>
                    </div>
                  </div>

                  {/* Original Claim */}
                  <div className="p-4 rounded bg-terminal-bg border border-terminal-border">
                    <h4 className="text-sm font-mono text-terminal-cyan mb-2">ORIGINAL CLAIM</h4>
                    <p className="text-terminal-text italic">"{currentClaim.text}"</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={exportPDF}
                    className="py-3 rounded-lg bg-terminal-secondary border border-terminal-border 
                             text-terminal-text font-mono font-bold hover:border-terminal-cyan 
                             transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    EXPORT PDF
                  </button>
                  <button
                    onClick={shareLink}
                    className="py-3 rounded-lg bg-cyan-500/20 border-2 border-cyan-500 
                             text-cyan-400 font-mono font-bold hover:bg-cyan-500/30 
                             transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    SHARE LINK
                  </button>
                </div>

                {/* New Fact-Check Button */}
                <button
                  onClick={() => {
                    setCurrentClaim({
                      id: `claim-${Date.now()}`,
                      text: '',
                      category: 'Politics',
                      dateSubmitted: new Date().toISOString(),
                      verdict: null,
                      confidence: 0,
                      evidence: [],
                      summary: ''
                    })
                    setAnalysisStep('claim')
                  }}
                  className="w-full py-3 rounded-lg bg-terminal-bg border border-terminal-border 
                           text-terminal-cyan font-mono font-bold hover:bg-terminal-secondary 
                           transition-colors"
                >
                  START NEW FACT-CHECK
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested Sources */}
            <div className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-mono text-terminal-cyan">
                  SUGGESTED SOURCES
                </h3>
                <button
                  onClick={() => setShowSources(!showSources)}
                  className="text-terminal-muted hover:text-terminal-cyan transition-colors"
                >
                  {showSources ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
              
              {showSources && (
                <div className="space-y-2">
                  {mockSuggestedSources.map((source) => (
                    <a
                      key={source.name}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 rounded bg-terminal-bg border border-terminal-border 
                               hover:border-terminal-cyan transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-terminal-cyan" />
                          <span className="text-xs font-mono text-terminal-text">
                            {source.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-mono text-terminal-muted">
                            {source.trust}%
                          </span>
                          <ExternalLink className="w-3 h-3 text-terminal-muted" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-terminal-secondary 
                          border border-cyan-500/30">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-mono font-bold text-cyan-400 mb-2">
                    FACT-CHECK TIPS
                  </h3>
                  <ul className="text-xs text-terminal-muted space-y-1">
                    <li>• Use multiple independent sources</li>
                    <li>• Check publication dates for relevance</li>
                    <li>• Verify author credentials</li>
                    <li>• Look for primary sources</li>
                    <li>• Consider potential biases</li>
                    <li>• Cross-reference statistics</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border">
              <h3 className="text-sm font-mono text-terminal-cyan mb-3">
                YOUR STATS
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-terminal-muted">Fact-checks today</span>
                  <span className="font-mono text-terminal-text">12</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-terminal-muted">Accuracy rate</span>
                  <span className="font-mono text-green-400">94%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-terminal-muted">Sources verified</span>
                  <span className="font-mono text-terminal-text">47</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-terminal-muted">Global rank</span>
                  <span className="font-mono text-cyan-400">#128</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
