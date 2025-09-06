'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AnalyticsDashboard } from './_components/analytics-dashboard';
import { ThreatAnalysis } from './_components/threat-analysis';
import { OsintArchive } from './_components/osint-archive';
import { CampaignGenerator } from './_components/campaign-generator';

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="min-h-screen bg-terminal-bg font-terminal">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-terminal-cyan mb-2 terminal-glow">
            INTELLIGENCE HUB
          </h1>
          <p className="text-terminal-text/70 font-terminal">
            NAVIGATE NARRATIVES WITH PRECISION • VERIFY TRUTH WITH CONFIDENCE
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full overflow-x-auto">
            <TabsTrigger value="analytics">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="threat-analysis">
              Threat Analysis
            </TabsTrigger>
            <TabsTrigger value="osint-archive">
              OSINT Archive
            </TabsTrigger>
            <TabsTrigger value="campaign-generator">
              Campaign Generator
            </TabsTrigger>
            <TabsTrigger value="strategic-assessment">
              Strategic Assessment
            </TabsTrigger>
            <TabsTrigger value="influence-mapper">
              Influence Mapper
            </TabsTrigger>
            <TabsTrigger value="news-pulse">
              News Pulse
            </TabsTrigger>
            <TabsTrigger value="investigation">
              Investigation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="threat-analysis">
            <ThreatAnalysis />
          </TabsContent>

          <TabsContent value="osint-archive">
            <OsintArchive />
          </TabsContent>

          <TabsContent value="campaign-generator">
            <CampaignGenerator />
          </TabsContent>

          <TabsContent value="strategic-assessment">
            <div className="terminal-card rounded-lg p-6">
              <h2 className="text-2xl font-bold text-terminal-cyan mb-4 font-terminal terminal-glow">
                STRATEGIC ASSESSMENT
              </h2>
              <p className="text-terminal-text/70 mb-6 font-terminal">
                ANALYZE STRATEGIC IMPLICATIONS AND GENERATE COMPREHENSIVE ASSESSMENTS
              </p>
              <input
                type="text"
                className="terminal-input w-full p-3 rounded-md focus-terminal"
                placeholder="Enter topic or situation for strategic assessment..."
              />
              <button className="terminal-button mt-4 px-6 py-3 rounded-md font-terminal font-bold uppercase tracking-wider">
                Generate Assessment
              </button>
            </div>
          </TabsContent>

          <TabsContent value="influence-mapper">
            <div className="terminal-card rounded-lg p-6">
              <h2 className="text-2xl font-bold text-terminal-cyan mb-4 font-terminal terminal-glow">
                INFLUENCE MAPPER
              </h2>
              <p className="text-terminal-text/70 mb-6 font-terminal">
                MAP INFLUENCE NETWORKS AND IDENTIFY KEY ACTORS
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  className="terminal-input w-full p-3 rounded-md focus-terminal"
                  placeholder="Target entity or individual..."
                />
                <input
                  type="text"
                  className="terminal-input w-full p-3 rounded-md focus-terminal"
                  placeholder="Topic or domain of influence..."
                />
              </div>
              <button className="terminal-button mt-4 px-6 py-3 rounded-md font-terminal font-bold uppercase tracking-wider">
                Map Influence Network
              </button>
            </div>
          </TabsContent>

          <TabsContent value="news-pulse">
            <div className="terminal-card rounded-lg p-6">
              <h2 className="text-2xl font-bold text-terminal-cyan mb-4 font-terminal terminal-glow">
                NEWS PULSE
              </h2>
              <p className="text-terminal-text/70 mb-6 font-terminal">
                REAL-TIME NEWS MONITORING AND SENTIMENT ANALYSIS
              </p>
              <input
                type="text"
                className="terminal-input w-full p-3 rounded-md focus-terminal"
                placeholder="Enter keywords or topics to monitor..."
              />
              <button className="terminal-button mt-4 px-6 py-3 rounded-md font-terminal font-bold uppercase tracking-wider">
                Start Monitoring
              </button>
            </div>
          </TabsContent>

          <TabsContent value="investigation">
            <div className="terminal-card rounded-lg p-6">
              <h2 className="text-2xl font-bold text-terminal-cyan mb-4 font-terminal terminal-glow">
                INVESTIGATION
              </h2>
              <p className="text-terminal-text/70 mb-6 font-terminal">
                DEEP DIVE INVESTIGATION AND RESEARCH ASSISTANT
              </p>
              <div className="bg-terminal-bg rounded-lg p-4 h-96 overflow-y-auto mb-4 border border-terminal-border">
                <div className="bg-terminal-cyan/10 rounded p-3 mb-2 border border-terminal-cyan/30">
                  <p className="text-terminal-cyan font-terminal">READY TO ASSIST WITH YOUR INVESTIGATION. WHAT WOULD YOU LIKE TO EXPLORE?</p>
                </div>
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  className="terminal-input flex-grow p-3 rounded-md focus-terminal"
                  placeholder="Ask a question or describe what you're investigating..."
                />
                <button className="terminal-button px-6 py-3 rounded-md font-terminal font-bold uppercase tracking-wider">
                  Send
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}