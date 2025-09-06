'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Tabs, TabsList, TabsTrigger, TabsContent, KpiCard } from '@/components/ui/tabs';
import { Shield, Activity, BarChart3, FileText, AlertTriangle, Brain, Search, Database, TrendingUp, Globe, Network } from 'lucide-react';
import { StatusIndicator } from '@/app/_components/terminal/status-indicator';

// Dynamically import background effects
const MatrixBackground = dynamic(
  () => import('@/app/_components/visuals/MatrixBackground').then(mod => ({ default: mod.MatrixBackground })),
  { ssr: false }
);

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState('analytics');

  const kpiData = [
    { title: 'Data Sources', value: '12', trend: 5.2, icon: <Database className="w-5 h-5" />, color: 'cyan' },
    { title: 'Active Queries', value: '8', trend: -2.1, icon: <Search className="w-5 h-5" />, color: 'gold' },
    { title: 'Insights Generated', value: '47', trend: 12.8, icon: <Brain className="w-5 h-5" />, color: 'green' },
    { title: 'Threat Level', value: 'MEDIUM', trend: 0, icon: <AlertTriangle className="w-5 h-5" />, color: 'gold' }
  ];

  return (
    <div className="relative min-h-screen bg-terminal-bg overflow-hidden font-terminal">
      {/* Background effects */}
      <MatrixBackground />
      
      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-scanline animate-scan opacity-5" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 py-8">
        <header className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-terminal-cyan mb-2 terminal-glow">
                INTELLIGENCE HUB
              </h1>
              <p className="text-terminal-gold">
                Navigate narratives with precision. Verify truth with confidence.
              </p>
            </div>
            <StatusIndicator status="online" label="SYSTEM ACTIVE" />
          </div>
          
          {/* Global KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpiData.map((kpi, index) => (
              <div key={index} className="terminal-card p-4 hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-terminal-${kpi.color}`}>{kpi.icon}</span>
                  {kpi.trend !== 0 && (
                    <span className={`text-xs font-bold ${kpi.trend > 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>
                      {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
                    </span>
                  )}
                </div>
                <h3 className="text-xs text-terminal-muted uppercase mb-1">{kpi.title}</h3>
                <p className={`text-2xl font-bold text-terminal-${kpi.color}`}>{kpi.value}</p>
              </div>
            ))}
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full overflow-x-auto bg-terminal-secondary/50 border border-terminal-border rounded-lg p-1">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="threat-analysis" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Threat Analysis
            </TabsTrigger>
            <TabsTrigger value="osint-archive" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              OSINT Archive
            </TabsTrigger>
            <TabsTrigger value="campaign-generator" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Campaign Generator
            </TabsTrigger>
            <TabsTrigger value="strategic-assessment" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Strategic Assessment
            </TabsTrigger>
            <TabsTrigger value="influence-mapper" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              Influence Mapper
            </TabsTrigger>
            <TabsTrigger value="news-pulse" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              News Pulse
            </TabsTrigger>
            <TabsTrigger value="investigation" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Investigation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <div className="terminal-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-6 h-6 text-terminal-cyan" />
                <h2 className="text-2xl font-bold text-terminal-cyan uppercase">
                  Analytics Dashboard
                </h2>
              </div>
              <p className="text-terminal-muted mb-8">
                Real-time data analytics and pattern recognition system
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-terminal-secondary/50 border border-terminal-cyan/30 rounded-lg">
                  <div className="text-3xl font-bold text-terminal-cyan mb-2">12</div>
                  <div className="text-xs text-terminal-muted uppercase">Data Sources</div>
                  <div className="text-sm text-terminal-green">↑ 5.2%</div>
                </div>
                <div className="p-4 bg-terminal-secondary/50 border border-terminal-gold/30 rounded-lg">
                  <div className="text-3xl font-bold text-terminal-gold mb-2">8</div>
                  <div className="text-xs text-terminal-muted uppercase">Active Queries</div>
                  <div className="text-sm text-terminal-red">↓ 2.1%</div>
                </div>
                <div className="p-4 bg-terminal-secondary/50 border border-terminal-green/30 rounded-lg">
                  <div className="text-3xl font-bold text-terminal-green mb-2">47</div>
                  <div className="text-xs text-terminal-muted uppercase">Insights Generated</div>
                  <div className="text-sm text-terminal-green">↑ 12.8%</div>
                </div>
              </div>
              <div className="mt-8 p-4 bg-terminal-secondary/30 border border-terminal-border rounded-lg">
                <div className="text-xs text-terminal-muted uppercase mb-2">Processing Status</div>
                <div className="w-full bg-terminal-secondary rounded-full h-2">
                  <div className="bg-terminal-cyan h-2 rounded-full animate-pulse" style={{ width: '67%' }}></div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="threat-analysis">
            <div className="terminal-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="w-6 h-6 text-terminal-red" />
                <h2 className="text-2xl font-bold text-terminal-red uppercase">
                  Threat Analysis
                </h2>
              </div>
              <p className="text-terminal-muted mb-8">
                Advanced threat detection and risk assessment
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 bg-terminal-red/10 border border-terminal-red/30 rounded-lg">
                  <h3 className="text-lg font-bold text-terminal-red mb-3">Active Threats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-terminal-text">Disinformation Campaign</span>
                      <span className="text-xs text-terminal-red">CRITICAL</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-terminal-text">Bot Network Activity</span>
                      <span className="text-xs text-terminal-gold">HIGH</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-terminal-text">Data Breach Attempt</span>
                      <span className="text-xs text-terminal-gold">MEDIUM</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-terminal-secondary/50 border border-terminal-border rounded-lg">
                  <h3 className="text-lg font-bold text-terminal-cyan mb-3">Threat Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-terminal-muted uppercase">Threats/Hour</div>
                      <div className="text-xl font-bold text-terminal-red">42</div>
                    </div>
                    <div>
                      <div className="text-xs text-terminal-muted uppercase">Blocked</div>
                      <div className="text-xl font-bold text-terminal-green">98.7%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="osint-archive">
            <div className="terminal-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Database className="w-6 h-6 text-terminal-cyan" />
                <h2 className="text-2xl font-bold text-terminal-cyan uppercase">
                  OSINT Archive
                </h2>
              </div>
              <p className="text-terminal-muted mb-8">
                Open Source Intelligence repository and search system
              </p>
              <div className="mb-6">
                <input
                  type="text"
                  className="w-full p-3 bg-terminal-bg border border-terminal-cyan/30 rounded text-terminal-text font-terminal focus:border-terminal-cyan focus:outline-none focus:shadow-glow-cyan transition-all"
                  placeholder="Search intelligence database..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-terminal-secondary/50 border border-terminal-border rounded">
                  <div className="text-2xl font-bold text-terminal-cyan">24,847</div>
                  <div className="text-xs text-terminal-muted uppercase">Total Records</div>
                </div>
                <div className="p-3 bg-terminal-secondary/50 border border-terminal-border rounded">
                  <div className="text-2xl font-bold text-terminal-gold">147</div>
                  <div className="text-xs text-terminal-muted uppercase">New Today</div>
                </div>
                <div className="p-3 bg-terminal-secondary/50 border border-terminal-border rounded">
                  <div className="text-2xl font-bold text-terminal-green">98.3%</div>
                  <div className="text-xs text-terminal-muted uppercase">Verified</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="campaign-generator">
            <div className="terminal-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-6 h-6 text-terminal-gold" />
                <h2 className="text-2xl font-bold text-terminal-gold uppercase">
                  Campaign Generator
                </h2>
              </div>
              <p className="text-terminal-muted mb-8">
                Strategic campaign planning and execution tools
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  className="w-full p-3 bg-terminal-bg border border-terminal-gold/30 rounded text-terminal-text font-terminal focus:border-terminal-gold focus:outline-none focus:shadow-glow-gold transition-all"
                  placeholder="Campaign objective..."
                />
                <textarea
                  className="w-full p-3 bg-terminal-bg border border-terminal-gold/30 rounded text-terminal-text font-terminal focus:border-terminal-gold focus:outline-none focus:shadow-glow-gold transition-all h-32 resize-none"
                  placeholder="Target audience and parameters..."
                />
                <button className="w-full py-3 bg-terminal-gold text-terminal-bg font-bold rounded border-2 border-terminal-gold hover:bg-transparent hover:text-terminal-gold transition-colors terminal-button">
                  GENERATE CAMPAIGN
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="strategic-assessment">
            <div className="terminal-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-6 h-6 text-terminal-cyan" />
                <h2 className="text-2xl font-bold text-terminal-cyan uppercase">
                  Strategic Assessment
                </h2>
              </div>
              <p className="text-terminal-muted mb-8">
                Analyze strategic implications and generate comprehensive assessments
              </p>
              <input
                type="text"
                className="w-full p-3 bg-terminal-bg border border-terminal-cyan/30 rounded text-terminal-text font-terminal focus:border-terminal-cyan focus:outline-none focus:shadow-glow-cyan transition-all"
                placeholder="Enter topic or situation for strategic assessment..."
              />
              <button className="mt-4 px-6 py-3 bg-terminal-cyan text-terminal-bg font-bold rounded border-2 border-terminal-cyan hover:bg-transparent hover:text-terminal-cyan transition-colors terminal-button">
                GENERATE ASSESSMENT
              </button>
            </div>
          </TabsContent>

          <TabsContent value="influence-mapper">
            <div className="terminal-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Network className="w-6 h-6 text-terminal-cyan" />
                <h2 className="text-2xl font-bold text-terminal-cyan uppercase">
                  Influence Mapper
                </h2>
              </div>
              <p className="text-terminal-muted mb-8">
                Map influence networks and identify key actors
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  className="w-full p-3 bg-terminal-bg border border-terminal-cyan/30 rounded text-terminal-text font-terminal focus:border-terminal-cyan focus:outline-none focus:shadow-glow-cyan transition-all"
                  placeholder="Target entity or individual..."
                />
                <input
                  type="text"
                  className="w-full p-3 bg-terminal-bg border border-terminal-cyan/30 rounded text-terminal-text font-terminal focus:border-terminal-cyan focus:outline-none focus:shadow-glow-cyan transition-all"
                  placeholder="Topic or domain of influence..."
                />
              </div>
              <button className="mt-4 px-6 py-3 bg-terminal-cyan text-terminal-bg font-bold rounded border-2 border-terminal-cyan hover:bg-transparent hover:text-terminal-cyan transition-colors terminal-button">
                MAP INFLUENCE NETWORK
              </button>
            </div>
          </TabsContent>

          <TabsContent value="news-pulse">
            <div className="terminal-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Globe className="w-6 h-6 text-terminal-gold" />
                <h2 className="text-2xl font-bold text-terminal-gold uppercase">
                  News Pulse
                </h2>
              </div>
              <p className="text-terminal-muted mb-8">
                Real-time news monitoring and sentiment analysis
              </p>
              <input
                type="text"
                className="w-full p-3 bg-terminal-bg border border-terminal-gold/30 rounded text-terminal-text font-terminal focus:border-terminal-gold focus:outline-none focus:shadow-glow-gold transition-all"
                placeholder="Enter keywords or topics to monitor..."
              />
              <button className="mt-4 px-6 py-3 bg-terminal-gold text-terminal-bg font-bold rounded border-2 border-terminal-gold hover:bg-transparent hover:text-terminal-gold transition-colors terminal-button">
                START MONITORING
              </button>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-terminal-green">+24%</div>
                  <div className="text-xs text-terminal-muted uppercase">Positive</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-terminal-gold">52%</div>
                  <div className="text-xs text-terminal-muted uppercase">Neutral</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-terminal-red">-24%</div>
                  <div className="text-xs text-terminal-muted uppercase">Negative</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="investigation">
            <div className="terminal-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Search className="w-6 h-6 text-terminal-cyan" />
                <h2 className="text-2xl font-bold text-terminal-cyan uppercase">
                  Investigation Terminal
                </h2>
              </div>
              <p className="text-terminal-muted mb-8">
                Deep dive investigation and research assistant
              </p>
              <div className="bg-terminal-bg rounded-lg p-4 h-96 overflow-y-auto mb-4 border border-terminal-border terminal-card font-mono text-sm">
                <div className="mb-4">
                  <span className="text-terminal-cyan">&gt; </span>
                  <span className="text-terminal-green">SYSTEM:</span>
                  <span className="text-terminal-text ml-2">Investigation terminal initialized. Ready for queries.</span>
                </div>
                <div className="mb-4">
                  <span className="text-terminal-cyan">&gt; </span>
                  <span className="text-terminal-gold">STATUS:</span>
                  <span className="text-terminal-text ml-2">All systems operational. Database connection established.</span>
                </div>
                <div className="mb-4">
                  <span className="text-terminal-cyan">&gt; </span>
                  <span className="text-terminal-muted">Awaiting input...</span>
                  <span className="terminal-cursor"></span>
                </div>
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  className="flex-grow p-3 bg-terminal-bg border border-terminal-cyan/30 rounded text-terminal-text font-terminal focus:border-terminal-cyan focus:outline-none focus:shadow-glow-cyan transition-all"
                  placeholder="Enter investigation query..."
                />
                <button className="px-6 py-3 bg-terminal-cyan text-terminal-bg font-bold rounded border-2 border-terminal-cyan hover:bg-transparent hover:text-terminal-cyan transition-colors terminal-button">
                  EXECUTE
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}