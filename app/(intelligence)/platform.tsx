'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { 
  Activity, AlertTriangle, Brain, Database, Eye, Globe,
  Lock, Network, Radio, Shield, Target, Users, Zap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, GridItem, GridShell } from '@/app/_components/ui/grid'
import { StatusIndicator } from '@/app/_components/terminal/status-indicator'
import UnifiedBackground from '@/app/_components/backgrounds/UnifiedBackground'

// Dynamic import for heavy visualization component
const IntelligencePanel = dynamic(
  () => import('@/app/_components/visuals/IntelligencePanel'),
  { ssr: false }
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
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-terminal-gold mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-terminal-cyan mb-2">THREAT ANALYSIS MODULE</h2>
            <p className="text-terminal-text/60">Advanced threat detection and analysis coming soon</p>
          </div>
        )}
        
        {activeView === 'network' && (
          <div className="text-center py-12">
            <Network className="w-16 h-16 text-terminal-cyan mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-terminal-cyan mb-2">NETWORK VISUALIZATION</h2>
            <p className="text-terminal-text/60">Interactive network mapping coming soon</p>
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