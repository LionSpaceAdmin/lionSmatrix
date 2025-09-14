'use client'

import { useState } from 'react'
import { 
  Target, Plus, Search, Filter, Calendar, Users, 
  Globe, TrendingUp, Copy, Download, Edit, Trash2,
  ChevronRight, Clock, AlertTriangle, CheckCircle,
  FileText, Settings, Zap, Share2, Eye, X
} from 'lucide-react'

interface Campaign {
  id: string
  name: string
  type: 'counter-narrative' | 'fact-check' | 'awareness' | 'response'
  status: 'draft' | 'active' | 'scheduled' | 'completed'
  goals: string[]
  audience: string[]
  channels: string[]
  startDate: string
  endDate: string
  budget?: number
  kpis: {
    reach: number
    engagement: number
    conversions: number
  }
  yamlConfig?: string
}

const mockCampaigns: Campaign[] = [
  {
    id: 'bp-001',
    name: 'Truth About Vaccines',
    type: 'counter-narrative',
    status: 'active',
    goals: ['Combat vaccine misinformation', 'Increase trust in science', 'Share verified data'],
    audience: ['Parents 25-45', 'Healthcare workers', 'Educators'],
    channels: ['Facebook', 'Instagram', 'WhatsApp'],
    startDate: '2025-09-01',
    endDate: '2025-10-01',
    budget: 5000,
    kpis: {
      reach: 250000,
      engagement: 15000,
      conversions: 500
    }
  },
  {
    id: 'bp-002',
    name: 'Election Integrity Defense',
    type: 'fact-check',
    status: 'scheduled',
    goals: ['Fact-check false claims', 'Protect democratic process', 'Educate voters'],
    audience: ['Registered voters', 'First-time voters', 'Election officials'],
    channels: ['Twitter/X', 'YouTube', 'Email'],
    startDate: '2025-09-15',
    endDate: '2025-11-10',
    budget: 10000,
    kpis: {
      reach: 500000,
      engagement: 25000,
      conversions: 1000
    }
  },
  {
    id: 'bp-003',
    name: 'Climate Facts Matter',
    type: 'awareness',
    status: 'draft',
    goals: ['Share climate science', 'Counter denial narratives', 'Promote solutions'],
    audience: ['Students', 'Policy makers', 'Business leaders'],
    channels: ['LinkedIn', 'TikTok', 'Podcasts'],
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    budget: 7500,
    kpis: {
      reach: 300000,
      engagement: 20000,
      conversions: 750
    }
  }
]

const campaignTypes = [
  { value: 'counter-narrative', label: 'Counter-Narrative', color: 'text-cyan-400' },
  { value: 'fact-check', label: 'Fact-Check', color: 'text-green-400' },
  { value: 'awareness', label: 'Awareness', color: 'text-yellow-400' },
  { value: 'response', label: 'Rapid Response', color: 'text-red-400' }
]

const channels = [
  'Twitter/X', 'Facebook', 'Instagram', 'TikTok', 'YouTube',
  'LinkedIn', 'WhatsApp', 'Telegram', 'Email', 'Podcasts'
]

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState(mockCampaigns)
  const [showWizard, setShowWizard] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [showYamlPreview, setShowYamlPreview] = useState(false)
  
  // Wizard form state
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
    name: '',
    type: 'counter-narrative',
    goals: [],
    audience: [],
    channels: [],
    startDate: '',
    endDate: '',
    budget: 0
  })

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = searchQuery === '' || 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || campaign.type === filterType
    return matchesSearch && matchesType
  })

  const generateYaml = (campaign: Partial<Campaign>) => {
    return `# Campaign Blueprint: ${campaign.name}
# Generated: ${new Date().toISOString()}

campaign:
  name: "${campaign.name}"
  type: ${campaign.type}
  status: draft
  
  schedule:
    start_date: ${campaign.startDate}
    end_date: ${campaign.endDate}
    
  goals:
${campaign.goals?.map(goal => `    - "${goal}"`).join('\n')}
    
  targeting:
    audience:
${campaign.audience?.map(aud => `      - "${aud}"`).join('\n')}
    
  channels:
${campaign.channels?.map(ch => `    - platform: "${ch}"
      budget_allocation: ${Math.round((campaign.budget || 0) / (campaign.channels?.length || 1))}
      content_types: ["text", "image", "video"]`).join('\n')}
      
  budget:
    total: ${campaign.budget}
    currency: USD
    
  kpis:
    reach_target: 100000
    engagement_target: 5000
    conversion_target: 100
    
  content_strategy:
    tone: "informative, trustworthy"
    languages: ["en", "es", "fr"]
    hashtags: ["#FactsMatter", "#TruthWins", "#StayInformed"]
    
  monitoring:
    sentiment_analysis: true
    threat_detection: true
    response_time_sla: 30 # minutes
    
  team:
    lead: "Campaign Manager"
    members:
      - "Content Creator"
      - "Fact Checker"
      - "Social Media Manager"
      - "Data Analyst"
`
  }

  const handleCreateCampaign = () => {
    if (newCampaign.name && newCampaign.goals?.length && newCampaign.channels?.length) {
      const campaign: Campaign = {
        id: `bp-${Date.now()}`,
        name: newCampaign.name || '',
        type: newCampaign.type as Campaign['type'] || 'counter-narrative',
        status: 'draft',
        goals: newCampaign.goals || [],
        audience: newCampaign.audience || [],
        channels: newCampaign.channels || [],
        startDate: newCampaign.startDate || '',
        endDate: newCampaign.endDate || '',
        budget: newCampaign.budget || 0,
        kpis: {
          reach: 0,
          engagement: 0,
          conversions: 0
        },
        yamlConfig: generateYaml(newCampaign)
      }
      
      setCampaigns([campaign, ...campaigns])
      setShowWizard(false)
      setWizardStep(1)
      setNewCampaign({
        name: '',
        type: 'counter-narrative',
        goals: [],
        audience: [],
        channels: [],
        startDate: '',
        endDate: '',
        budget: 0
      })
    }
  }

  const exportYaml = (campaign: Campaign) => {
    const yaml = campaign.yamlConfig || generateYaml(campaign)
    const blob = new Blob([yaml], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `campaign-${campaign.id}.yaml`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Header */}
      <div className="border-b border-terminal-border bg-terminal-secondary/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-terminal-cyan" />
              <div>
                <h1 className="text-2xl font-bold font-mono text-terminal-cyan">
                  CAMPAIGN BLUEPRINTS
                </h1>
                <p className="text-xs text-terminal-muted">
                  Strategic campaign planning and execution
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowWizard(true)}
              className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500 
                       text-cyan-400 font-mono text-sm hover:bg-cyan-500/30 
                       transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              NEW CAMPAIGN
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-terminal-muted" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-terminal-secondary border border-terminal-border 
                       rounded-lg text-terminal-text font-mono placeholder-terminal-muted
                       focus:border-terminal-cyan focus:outline-none transition-colors"
            />
          </div>
          
          <div className="flex gap-2">
            {['all', ...campaignTypes.map(t => t.value)].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-3 rounded-lg font-mono text-sm transition-all ${
                  filterType === type
                    ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400'
                    : 'bg-terminal-secondary border border-terminal-border text-terminal-text hover:border-terminal-cyan'
                }`}
              >
                {type === 'all' ? 'ALL' : type.toUpperCase().replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => {
            const typeConfig = campaignTypes.find(t => t.value === campaign.type)
            
            return (
              <div
                key={campaign.id}
                className="relative rounded-lg bg-terminal-secondary border border-terminal-border 
                         hover:border-terminal-cyan transition-all duration-200 overflow-hidden"
              >
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-2 py-1 rounded text-xs font-mono ${
                  campaign.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  campaign.status === 'scheduled' ? 'bg-yellow-500/20 text-yellow-400' :
                  campaign.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                  'bg-terminal-bg text-terminal-muted'
                }`}>
                  {campaign.status.toUpperCase()}
                </div>
                
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold font-mono text-terminal-cyan mb-1">
                      {campaign.name}
                    </h3>
                    <span className={`text-xs font-mono ${typeConfig?.color}`}>
                      {typeConfig?.label}
                    </span>
                  </div>
                  
                  {/* Goals */}
                  <div className="mb-4">
                    <p className="text-xs font-mono text-terminal-muted mb-2">GOALS</p>
                    <ul className="space-y-1">
                      {campaign.goals.slice(0, 2).map((goal, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <ChevronRight className="w-3 h-3 text-terminal-cyan flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-terminal-text line-clamp-1">{goal}</span>
                        </li>
                      ))}
                      {campaign.goals.length > 2 && (
                        <li className="text-xs text-terminal-muted">
                          +{campaign.goals.length - 2} more
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  {/* Channels */}
                  <div className="mb-4">
                    <p className="text-xs font-mono text-terminal-muted mb-2">CHANNELS</p>
                    <div className="flex flex-wrap gap-1">
                      {campaign.channels.slice(0, 3).map((channel) => (
                        <span
                          key={channel}
                          className="px-2 py-1 rounded text-xs bg-terminal-bg border border-terminal-border"
                        >
                          {channel}
                        </span>
                      ))}
                      {campaign.channels.length > 3 && (
                        <span className="px-2 py-1 rounded text-xs bg-terminal-bg border border-terminal-border">
                          +{campaign.channels.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Timeline */}
                  <div className="mb-4 flex items-center gap-2 text-xs text-terminal-muted">
                    <Calendar className="w-3 h-3" />
                    <span>{campaign.startDate} → {campaign.endDate}</span>
                  </div>
                  
                  {/* KPIs */}
                  {campaign.kpis && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center">
                        <p className="text-xs text-terminal-muted">REACH</p>
                        <p className="text-sm font-mono text-terminal-text">
                          {(campaign.kpis.reach / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-terminal-muted">ENGAGE</p>
                        <p className="text-sm font-mono text-terminal-text">
                          {(campaign.kpis.engagement / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-terminal-muted">CONVERT</p>
                        <p className="text-sm font-mono text-terminal-text">
                          {campaign.kpis.conversions}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCampaign(campaign)
                        setShowYamlPreview(true)
                      }}
                      className="flex-1 py-2 rounded bg-terminal-bg border border-terminal-border 
                               text-terminal-cyan font-mono text-xs hover:bg-terminal-secondary 
                               transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      VIEW
                    </button>
                    <button
                      onClick={() => exportYaml(campaign)}
                      className="flex-1 py-2 rounded bg-terminal-bg border border-terminal-border 
                               text-terminal-cyan font-mono text-xs hover:bg-terminal-secondary 
                               transition-colors flex items-center justify-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      YAML
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-terminal-muted mx-auto mb-4" />
            <p className="text-terminal-muted font-mono">No campaigns found</p>
            <button
              onClick={() => setShowWizard(true)}
              className="mt-4 px-6 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500 
                       text-cyan-400 font-mono text-sm hover:bg-cyan-500/30 
                       transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              CREATE YOUR FIRST CAMPAIGN
            </button>
          </div>
        )}
      </div>

      {/* Campaign Creation Wizard */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowWizard(false)}
          />
          
          <div className="relative bg-terminal-bg border border-terminal-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Wizard Header */}
            <div className="sticky top-0 bg-terminal-bg border-b border-terminal-border p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold font-mono text-terminal-cyan">
                NEW CAMPAIGN - STEP {wizardStep}/3
              </h2>
              <button
                onClick={() => {
                  setShowWizard(false)
                  setWizardStep(1)
                }}
                className="p-2 rounded hover:bg-terminal-secondary text-terminal-muted 
                         hover:text-terminal-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Step 1: Basic Info */}
              {wizardStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-mono text-terminal-cyan mb-2">
                      CAMPAIGN NAME *
                    </label>
                    <input
                      type="text"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                      placeholder="Enter campaign name..."
                      className="w-full px-4 py-3 bg-terminal-secondary border border-terminal-border 
                               rounded-lg text-terminal-text font-mono placeholder-terminal-muted
                               focus:border-terminal-cyan focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-mono text-terminal-cyan mb-2">
                      CAMPAIGN TYPE
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {campaignTypes.map((type) => (
                        <label
                          key={type.value}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            newCampaign.type === type.value
                              ? 'bg-cyan-500/20 border-cyan-500'
                              : 'bg-terminal-secondary border-terminal-border hover:border-terminal-cyan'
                          }`}
                        >
                          <input
                            type="radio"
                            name="type"
                            value={type.value}
                            checked={newCampaign.type === type.value}
                            onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value as Campaign['type'] })}
                            className="sr-only"
                          />
                          <span className={`text-sm font-mono ${type.color}`}>
                            {type.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-mono text-terminal-cyan mb-2">
                      CAMPAIGN GOALS (Add at least 1)
                    </label>
                    <div className="space-y-2">
                      {(newCampaign.goals || []).map((goal, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={goal}
                            onChange={(e) => {
                              const goals = [...(newCampaign.goals || [])]
                              goals[idx] = e.target.value
                              setNewCampaign({ ...newCampaign, goals })
                            }}
                            className="flex-1 px-3 py-2 bg-terminal-secondary border border-terminal-border 
                                     rounded text-terminal-text font-mono text-sm placeholder-terminal-muted
                                     focus:border-terminal-cyan focus:outline-none transition-colors"
                          />
                          <button
                            onClick={() => {
                              const goals = [...(newCampaign.goals || [])]
                              goals.splice(idx, 1)
                              setNewCampaign({ ...newCampaign, goals })
                            }}
                            className="p-2 rounded hover:bg-red-500/20 text-terminal-muted 
                                     hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setNewCampaign({ 
                          ...newCampaign, 
                          goals: [...(newCampaign.goals || []), ''] 
                        })}
                        className="px-3 py-2 rounded border border-terminal-border text-terminal-cyan 
                                 font-mono text-sm hover:border-terminal-cyan transition-colors
                                 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        ADD GOAL
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setWizardStep(2)}
                    disabled={!newCampaign.name || !newCampaign.goals?.length}
                    className="w-full py-3 rounded-lg bg-cyan-500/20 border-2 border-cyan-500 
                             text-cyan-400 font-mono font-bold hover:bg-cyan-500/30 
                             transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    NEXT: AUDIENCE & CHANNELS →
                  </button>
                </div>
              )}
              
              {/* Step 2: Audience & Channels */}
              {wizardStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-mono text-terminal-cyan mb-2">
                      TARGET AUDIENCE
                    </label>
                    <div className="space-y-2">
                      {(newCampaign.audience || []).map((aud, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={aud}
                            onChange={(e) => {
                              const audience = [...(newCampaign.audience || [])]
                              audience[idx] = e.target.value
                              setNewCampaign({ ...newCampaign, audience })
                            }}
                            placeholder="e.g., Parents 25-45"
                            className="flex-1 px-3 py-2 bg-terminal-secondary border border-terminal-border 
                                     rounded text-terminal-text font-mono text-sm placeholder-terminal-muted
                                     focus:border-terminal-cyan focus:outline-none transition-colors"
                          />
                          <button
                            onClick={() => {
                              const audience = [...(newCampaign.audience || [])]
                              audience.splice(idx, 1)
                              setNewCampaign({ ...newCampaign, audience })
                            }}
                            className="p-2 rounded hover:bg-red-500/20 text-terminal-muted 
                                     hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setNewCampaign({ 
                          ...newCampaign, 
                          audience: [...(newCampaign.audience || []), ''] 
                        })}
                        className="px-3 py-2 rounded border border-terminal-border text-terminal-cyan 
                                 font-mono text-sm hover:border-terminal-cyan transition-colors
                                 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        ADD AUDIENCE
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-mono text-terminal-cyan mb-2">
                      CHANNELS (Select at least 1)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {channels.map((channel) => (
                        <label
                          key={channel}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            newCampaign.channels?.includes(channel)
                              ? 'bg-cyan-500/20 border-cyan-500'
                              : 'bg-terminal-secondary border-terminal-border hover:border-terminal-cyan'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={newCampaign.channels?.includes(channel) || false}
                            onChange={(e) => {
                              const updatedChannels = e.target.checked
                                ? [...(newCampaign.channels || []), channel]
                                : (newCampaign.channels || []).filter(c => c !== channel)
                              setNewCampaign({ ...newCampaign, channels: updatedChannels })
                            }}
                            className="sr-only"
                          />
                          <span className="text-sm font-mono text-terminal-text">
                            {channel}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setWizardStep(1)}
                      className="flex-1 py-3 rounded-lg bg-terminal-secondary border border-terminal-border 
                               text-terminal-text font-mono font-bold hover:border-terminal-cyan 
                               transition-colors"
                    >
                      ← BACK
                    </button>
                    <button
                      onClick={() => setWizardStep(3)}
                      disabled={!newCampaign.channels?.length}
                      className="flex-1 py-3 rounded-lg bg-cyan-500/20 border-2 border-cyan-500 
                               text-cyan-400 font-mono font-bold hover:bg-cyan-500/30 
                               transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      NEXT: SCHEDULE & BUDGET →
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Schedule & Budget */}
              {wizardStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-mono text-terminal-cyan mb-2">
                        START DATE
                      </label>
                      <input
                        type="date"
                        value={newCampaign.startDate}
                        onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                        className="w-full px-4 py-3 bg-terminal-secondary border border-terminal-border 
                                 rounded-lg text-terminal-text font-mono focus:border-terminal-cyan 
                                 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-terminal-cyan mb-2">
                        END DATE
                      </label>
                      <input
                        type="date"
                        value={newCampaign.endDate}
                        onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                        className="w-full px-4 py-3 bg-terminal-secondary border border-terminal-border 
                                 rounded-lg text-terminal-text font-mono focus:border-terminal-cyan 
                                 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-mono text-terminal-cyan mb-2">
                      BUDGET (USD)
                    </label>
                    <input
                      type="number"
                      value={newCampaign.budget}
                      onChange={(e) => setNewCampaign({ ...newCampaign, budget: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-terminal-secondary border border-terminal-border 
                               rounded-lg text-terminal-text font-mono placeholder-terminal-muted
                               focus:border-terminal-cyan focus:outline-none transition-colors"
                    />
                  </div>
                  
                  {/* Preview */}
                  <div className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border">
                    <h3 className="text-sm font-mono text-terminal-cyan mb-3">CAMPAIGN PREVIEW</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-terminal-muted">Name:</span>
                        <span className="font-mono text-terminal-text">{newCampaign.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-terminal-muted">Type:</span>
                        <span className="font-mono text-terminal-text">{newCampaign.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-terminal-muted">Goals:</span>
                        <span className="font-mono text-terminal-text">{newCampaign.goals?.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-terminal-muted">Channels:</span>
                        <span className="font-mono text-terminal-text">{newCampaign.channels?.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-terminal-muted">Budget:</span>
                        <span className="font-mono text-terminal-text">${newCampaign.budget}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setWizardStep(2)}
                      className="flex-1 py-3 rounded-lg bg-terminal-secondary border border-terminal-border 
                               text-terminal-text font-mono font-bold hover:border-terminal-cyan 
                               transition-colors"
                    >
                      ← BACK
                    </button>
                    <button
                      onClick={handleCreateCampaign}
                      className="flex-1 py-3 rounded-lg bg-cyan-500/20 border-2 border-cyan-500 
                               text-cyan-400 font-mono font-bold hover:bg-cyan-500/30 
                               transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      CREATE CAMPAIGN
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* YAML Preview Modal */}
      {showYamlPreview && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowYamlPreview(false)}
          />
          
          <div className="relative bg-terminal-bg border border-terminal-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-terminal-bg border-b border-terminal-border p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold font-mono text-terminal-cyan">
                YAML CONFIGURATION
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const yaml = selectedCampaign.yamlConfig || generateYaml(selectedCampaign)
                    navigator.clipboard.writeText(yaml)
                    alert('YAML copied to clipboard!')
                  }}
                  className="px-3 py-1 rounded bg-terminal-secondary border border-terminal-border 
                           text-terminal-cyan font-mono text-sm hover:border-terminal-cyan 
                           transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  COPY
                </button>
                <button
                  onClick={() => exportYaml(selectedCampaign)}
                  className="px-3 py-1 rounded bg-terminal-secondary border border-terminal-border 
                           text-terminal-cyan font-mono text-sm hover:border-terminal-cyan 
                           transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  DOWNLOAD
                </button>
                <button
                  onClick={() => setShowYamlPreview(false)}
                  className="p-2 rounded hover:bg-terminal-secondary text-terminal-muted 
                           hover:text-terminal-text transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <pre className="bg-terminal-secondary p-4 rounded-lg overflow-x-auto">
                <code className="text-sm font-mono text-terminal-text">
                  {selectedCampaign.yamlConfig || generateYaml(selectedCampaign)}
                </code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
