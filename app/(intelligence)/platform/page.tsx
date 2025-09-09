'use client'

import { 
  Activity, AlertTriangle, Brain, Database, Eye, Globe,
  Lock, Network, Radio, Shield, Target, Users, Zap
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, GridItem, GridShell, StatusIndicator } from '@/components/atoms'
import { UnifiedBackground } from '@/components/organisms'

// Dynamic import for heavy visualization components
const IntelligencePanel = dynamic(
  () => import('@/components/organisms/IntelligencePanel'),
  { ssr: false }
)

const NetworkVisualization = dynamic(
  () => import('@/components/organisms/NetworkVisualization').then(mod => ({ default: mod.NetworkVisualization })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-terminal-cyan font-mono">Loading network visualization...</div>
      </div>
    )
  }
)

export default function PlatformPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedActor, setSelectedActor] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<'overview' | 'threats' | 'network'>('overview')
  
  useEffect(() => {
    // Set a small delay to show the loading animation briefly
    const loadTimer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)
    
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => {
      clearTimeout(loadTimer)
      clearInterval(timer)
    }
  }, [])
  
  // Loading state
  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-terminal-bg flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-terminal-cyan mx-auto mb-4 animate-pulse" />
          <div className="text-terminal-cyan font-terminal text-xl">
            INITIALIZING LIONSPACE PLATFORM...
          </div>
          <div className="mt-2 text-terminal-muted text-sm">
            Loading intelligence systems
          </div>
        </div>
      </div>
    )
  }
  
  // Main stats for the platform
  const platformStats = {
    threats: { value: 247, change: '+12%', status: 'rising' },
    narratives: { value: 1842, sources: 47 },
    truthScore: { value: 87, status: 'stable' },
    actors: { value: 14, connections: 47 },
    security: { value: 98, status: 'secure' }
  }
  
  const recentActivity = [
    { 
      type: 'alert', 
      message: 'NEW NARRATIVE DETECTED: CLIMATE MISINFORMATION CAMPAIGN',
      time: '2 MIN AGO',
      severity: 'high'
    },
    { 
      type: 'verification', 
      message: 'VERIFICATION COMPLETE: ECONOMIC DATA MANIPULATION',
      time: '15 MIN AGO',
      severity: 'medium'
    },
    { 
      type: 'threat', 
      message: 'ALERT: COORDINATED BOT NETWORK IDENTIFIED',
      time: '1 HOUR AGO',
      severity: 'critical'
    },
    {
      type: 'analysis',
      message: 'PATTERN ANALYSIS: EMERGING INFLUENCE OPERATION',
      time: '2 HOURS AGO',
      severity: 'medium'
    }
  ]
  
  const threatLevels = [
    { region: 'NORTH AMERICA', level: 'ELEVATED', score: 72 },
    { region: 'EUROPE', level: 'MODERATE', score: 54 },
    { region: 'ASIA PACIFIC', level: 'HIGH', score: 89 },
    { region: 'MIDDLE EAST', level: 'CRITICAL', score: 95 },
    { region: 'AFRICA', level: 'MODERATE', score: 48 }
  ]
  
  return (
    <div className="relative min-h-screen bg-terminal-bg text-terminal-text font-terminal overflow-hidden">
      {/* Unified Background - ONE design for the entire platform */}
      <UnifiedBackground variant="platform" intensity="medium" interactive />
      
      {/* Platform Header */}
      <div className="relative z-30 bg-terminal-secondary/80 backdrop-blur-sm border-b border-terminal-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-terminal-cyan" />
                <h1 className="text-2xl font-bold text-terminal-cyan terminal-glow">
                  LIONSPACE COMMAND
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <StatusIndicator status="online" label="SYSTEM ACTIVE" />
                <span className="text-sm text-terminal-gold">
                  THREAT LEVEL: ELEVATED
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-terminal-muted">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour12: false,
                  timeZone: 'UTC'
                })} UTC
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* View Selector */}
      <div className="relative z-20 bg-terminal-secondary/60 backdrop-blur-sm border-b border-terminal-border">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView('overview')}
              className={`px-4 py-2 text-sm font-terminal transition-all ${
                activeView === 'overview' 
                  ? 'text-terminal-cyan border-b-2 border-terminal-cyan' 
                  : 'text-terminal-text/60 hover:text-terminal-text'
              }`}
            >
              <Eye className="inline w-4 h-4 mr-2" />
              OVERVIEW
            </button>
            <button
              onClick={() => setActiveView('threats')}
              className={`px-4 py-2 text-sm font-terminal transition-all ${
                activeView === 'threats' 
                  ? 'text-terminal-cyan border-b-2 border-terminal-cyan' 
                  : 'text-terminal-text/60 hover:text-terminal-text'
              }`}
            >
              <AlertTriangle className="inline w-4 h-4 mr-2" />
              THREAT ANALYSIS
            </button>
            <button
              onClick={() => setActiveView('network')}
              className={`px-4 py-2 text-sm font-terminal transition-all ${
                activeView === 'network' 
                  ? 'text-terminal-cyan border-b-2 border-terminal-cyan' 
                  : 'text-terminal-text/60 hover:text-terminal-text'
              }`}
            >
              <Network className="inline w-4 h-4 mr-2" />
              NETWORK MAP
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {activeView === 'overview' && (
          <GridShell className="grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Key Metrics Row */}
            <GridItem>
              <Card className="terminal-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-terminal-cyan font-terminal text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    ACTIVE THREATS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-terminal-red terminal-glow-red">
                    {platformStats.threats.value}
                  </div>
                  <p className="text-terminal-text/60 text-xs font-terminal mt-1">
                    {platformStats.threats.change} FROM YESTERDAY
                  </p>
                </CardContent>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card className="terminal-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-terminal-cyan font-terminal text-sm flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    NARRATIVES
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-terminal-cyan terminal-glow">
                    {platformStats.narratives.value}
                  </div>
                  <p className="text-terminal-text/60 text-xs font-terminal mt-1">
                    ACROSS {platformStats.narratives.sources} SOURCES
                  </p>
                </CardContent>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card className="terminal-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-terminal-cyan font-terminal text-sm flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    TRUTH SCORE
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-terminal-gold terminal-glow-gold">
                    {platformStats.truthScore.value}%
                  </div>
                  <p className="text-terminal-text/60 text-xs font-terminal mt-1">
                    GLOBAL ACCURACY
                  </p>
                </CardContent>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card className="terminal-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-terminal-cyan font-terminal text-sm flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    SECURITY
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-terminal-green terminal-glow-green">
                    {platformStats.security.value}%
                  </div>
                  <p className="text-terminal-text/60 text-xs font-terminal mt-1">
                    SYSTEM INTEGRITY
                  </p>
                </CardContent>
              </Card>
            </GridItem>
            
            {/* Activity Feed */}
            <GridItem className="col-span-full lg:col-span-2">
              <Card className="terminal-card h-full">
                <CardHeader>
                  <CardTitle className="text-terminal-cyan font-terminal flex items-center gap-2">
                    <Radio className="w-4 h-4 animate-pulse" />
                    REAL-TIME INTELLIGENCE FEED
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 font-terminal">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex justify-between items-start py-2 border-b border-terminal-border last:border-0">
                        <div className="flex-1">
                          <span className={`text-sm ${
                            activity.severity === 'critical' ? 'text-terminal-red' :
                            activity.severity === 'high' ? 'text-terminal-gold' :
                            'text-terminal-text'
                          }`}>
                            {activity.message}
                          </span>
                        </div>
                        <span className="text-xs text-terminal-text/60 ml-4 whitespace-nowrap">
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </GridItem>
            
            {/* Regional Threat Matrix */}
            <GridItem className="col-span-full lg:col-span-2">
              <Card className="terminal-card h-full">
                <CardHeader>
                  <CardTitle className="text-terminal-cyan font-terminal flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    REGIONAL THREAT MATRIX
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {threatLevels.map((region, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-terminal text-terminal-text">
                          {region.region}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-terminal-secondary rounded-full h-2">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                region.score > 80 ? 'bg-terminal-red' :
                                region.score > 60 ? 'bg-terminal-gold' :
                                'bg-terminal-green'
                              }`}
                              style={{ width: `${region.score}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${
                            region.level === 'CRITICAL' ? 'text-terminal-red' :
                            region.level === 'HIGH' ? 'text-terminal-gold' :
                            region.level === 'ELEVATED' ? 'text-terminal-gold' :
                            'text-terminal-green'
                          }`}>
                            {region.level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </GridItem>
            
            {/* Network Status */}
            <GridItem className="col-span-full">
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="text-terminal-cyan font-terminal flex items-center gap-2">
                    <Network className="w-4 h-4" />
                    NETWORK INTELLIGENCE STATUS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <Users className="w-6 h-6 text-terminal-cyan mx-auto mb-2" />
                      <div className="text-2xl font-bold text-terminal-text">{platformStats.actors.value}</div>
                      <div className="text-xs text-terminal-text/60">ACTORS TRACKED</div>
                    </div>
                    <div className="text-center">
                      <Zap className="w-6 h-6 text-terminal-gold mx-auto mb-2" />
                      <div className="text-2xl font-bold text-terminal-text">{platformStats.actors.connections}</div>
                      <div className="text-xs text-terminal-text/60">CONNECTIONS</div>
                    </div>
                    <div className="text-center">
                      <Database className="w-6 h-6 text-terminal-green mx-auto mb-2" />
                      <div className="text-2xl font-bold text-terminal-text">2.4TB</div>
                      <div className="text-xs text-terminal-text/60">DATA PROCESSED</div>
                    </div>
                    <div className="text-center">
                      <Activity className="w-6 h-6 text-terminal-red mx-auto mb-2" />
                      <div className="text-2xl font-bold text-terminal-text">247ms</div>
                      <div className="text-xs text-terminal-text/60">AVG RESPONSE</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GridItem>
          </GridShell>
        )}
        
        {activeView === 'threats' && (
          <GridShell className="grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Threat Matrix */}
            <GridItem className="col-span-full">
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="text-terminal-cyan font-terminal flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-terminal-red animate-pulse" />
                    ACTIVE THREAT MATRIX
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { 
                        type: 'CYBER ATTACK', 
                        severity: 'CRITICAL',
                        targets: 12,
                        status: 'ACTIVE',
                        mitigation: 45
                      },
                      { 
                        type: 'DISINFORMATION', 
                        severity: 'HIGH',
                        targets: 34,
                        status: 'MONITORING',
                        mitigation: 78
                      },
                      { 
                        type: 'BOT NETWORK', 
                        severity: 'HIGH',
                        targets: 89,
                        status: 'CONTAINED',
                        mitigation: 92
                      },
                      { 
                        type: 'PHISHING CAMPAIGN', 
                        severity: 'MEDIUM',
                        targets: 156,
                        status: 'TRACKING',
                        mitigation: 67
                      },
                      { 
                        type: 'DATA BREACH', 
                        severity: 'CRITICAL',
                        targets: 3,
                        status: 'RESPONSE',
                        mitigation: 23
                      },
                      { 
                        type: 'PROPAGANDA', 
                        severity: 'MEDIUM',
                        targets: 67,
                        status: 'ANALYZING',
                        mitigation: 55
                      }
                    ].map((threat, index) => (
                      <div key={index} className="p-4 bg-terminal-secondary rounded border border-terminal-border hover:border-terminal-red/50 transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-sm font-bold font-mono text-terminal-cyan">
                            {threat.type}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded font-mono ${
                            threat.severity === 'CRITICAL' ? 'bg-terminal-red/20 text-terminal-red' :
                            threat.severity === 'HIGH' ? 'bg-terminal-gold/20 text-terminal-gold' :
                            'bg-terminal-cyan/20 text-terminal-cyan'
                          }`}>
                            {threat.severity}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-xs font-mono">
                          <div className="flex justify-between">
                            <span className="text-terminal-muted">Targets:</span>
                            <span className="text-terminal-text">{threat.targets}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-terminal-muted">Status:</span>
                            <span className={`${
                              threat.status === 'ACTIVE' || threat.status === 'RESPONSE' ? 'text-terminal-red' :
                              threat.status === 'MONITORING' || threat.status === 'TRACKING' ? 'text-terminal-gold' :
                              'text-terminal-green'
                            }`}>{threat.status}</span>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-terminal-muted">Mitigation:</span>
                              <span className="text-terminal-cyan">{threat.mitigation}%</span>
                            </div>
                            <div className="w-full bg-terminal-bg rounded-full h-1.5">
                              <div 
                                className={`h-full rounded-full ${
                                  threat.mitigation > 75 ? 'bg-terminal-green' :
                                  threat.mitigation > 50 ? 'bg-terminal-gold' :
                                  'bg-terminal-red'
                                }`}
                                style={{ width: `${threat.mitigation}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </GridItem>
            
            {/* Threat Timeline */}
            <GridItem className="col-span-full lg:col-span-2">
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="text-terminal-cyan font-terminal flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    THREAT TIMELINE
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {[
                      { time: '00:02:14', event: 'CRITICAL: Ransomware detected on network segment A7', type: 'critical' },
                      { time: '00:15:32', event: 'HIGH: Coordinated bot attack from 47 IP addresses', type: 'high' },
                      { time: '00:28:45', event: 'MEDIUM: Suspicious data exfiltration attempt blocked', type: 'medium' },
                      { time: '00:45:19', event: 'INFO: Security patch deployed to 234 endpoints', type: 'info' },
                      { time: '01:02:33', event: 'HIGH: New phishing campaign targeting executives', type: 'high' },
                      { time: '01:18:47', event: 'CRITICAL: Zero-day exploit attempt detected', type: 'critical' },
                      { time: '01:34:52', event: 'SUCCESS: Threat neutralized by automated response', type: 'success' },
                      { time: '01:45:08', event: 'MEDIUM: Anomalous traffic pattern identified', type: 'medium' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-terminal-secondary/50 rounded border-l-2 border-terminal-border hover:border-terminal-cyan transition-all">
                        <span className="text-xs font-mono text-terminal-muted whitespace-nowrap">
                          {item.time}
                        </span>
                        <div className={`w-2 h-2 rounded-full mt-1 ${
                          item.type === 'critical' ? 'bg-terminal-red animate-pulse' :
                          item.type === 'high' ? 'bg-terminal-gold' :
                          item.type === 'medium' ? 'bg-terminal-cyan' :
                          item.type === 'success' ? 'bg-terminal-green' :
                          'bg-terminal-text/50'
                        }`} />
                        <span className={`text-sm font-mono flex-1 ${
                          item.type === 'critical' ? 'text-terminal-red' :
                          item.type === 'high' ? 'text-terminal-gold' :
                          item.type === 'success' ? 'text-terminal-green' :
                          'text-terminal-text'
                        }`}>
                          {item.event}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </GridItem>
            
            {/* Threat Intelligence */}
            <GridItem className="col-span-full lg:col-span-1">
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="text-terminal-cyan font-terminal flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    DEFENSE STATUS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { system: 'FIREWALL', status: 'ACTIVE', health: 98 },
                      { system: 'IDS/IPS', status: 'ACTIVE', health: 95 },
                      { system: 'ENDPOINT', status: 'UPDATING', health: 87 },
                      { system: 'SANDBOX', status: 'ACTIVE', health: 100 },
                      { system: 'AI SHIELD', status: 'LEARNING', health: 92 },
                      { system: 'HONEYPOT', status: 'ACTIVE', health: 100 }
                    ].map((defense, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-mono text-terminal-text">
                            {defense.system}
                          </span>
                          <span className={`text-xs font-mono ${
                            defense.status === 'ACTIVE' ? 'text-terminal-green' :
                            defense.status === 'UPDATING' || defense.status === 'LEARNING' ? 'text-terminal-gold' :
                            'text-terminal-red'
                          }`}>
                            {defense.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-terminal-secondary rounded-full h-2">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                defense.health > 90 ? 'bg-terminal-green' :
                                defense.health > 70 ? 'bg-terminal-gold' :
                                'bg-terminal-red'
                              }`}
                              style={{ width: `${defense.health}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-terminal-cyan min-w-[3ch]">
                            {defense.health}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </GridItem>
          </GridShell>
        )}
        
        {activeView === 'network' && (
          <div className="space-y-6">
            <NetworkVisualization interactive={true} showLabels={true} />
            
            {/* Network Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="terminal-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-terminal-cyan" />
                    <span className="text-xs text-terminal-muted font-mono">TOTAL ACTORS</span>
                  </div>
                  <div className="text-2xl font-bold text-terminal-cyan font-mono">14</div>
                </CardContent>
              </Card>
              
              <Card className="terminal-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Network className="w-4 h-4 text-terminal-gold" />
                    <span className="text-xs text-terminal-muted font-mono">CONNECTIONS</span>
                  </div>
                  <div className="text-2xl font-bold text-terminal-gold font-mono">47</div>
                </CardContent>
              </Card>
              
              <Card className="terminal-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-terminal-red" />
                    <span className="text-xs text-terminal-muted font-mono">CRITICAL NODES</span>
                  </div>
                  <div className="text-2xl font-bold text-terminal-red font-mono">3</div>
                </CardContent>
              </Card>
              
              <Card className="terminal-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-terminal-green" />
                    <span className="text-xs text-terminal-muted font-mono">MONITORED</span>
                  </div>
                  <div className="text-2xl font-bold text-terminal-green font-mono">98%</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      
      {/* Intelligence Panel Overlay (when actor selected) */}
      {selectedActor && (
        <IntelligencePanel actor={selectedActor} onClose={() => setSelectedActor(null)} />
      )}
    </div>
  )
}