'use client';

import { useState } from 'react';

// Temporary local components until @lionspace/ui workspace is fixed
const Tabs = ({ children, value, onValueChange, className }: { 
  children: React.ReactNode; 
  value: string; 
  onValueChange: (value: string) => void;
  className?: string;
}) => (
  <div className={className}>{children}</div>
);

const TabsList = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex space-x-1 bg-black/40 border border-green-500/30 rounded-lg p-1 ${className}`}>
    {children}
  </div>
);

const TabsTrigger = ({ children, value, onClick }: { 
  children: React.ReactNode; 
  value: string;
  onClick?: () => void;
}) => (
  <button 
    className="px-4 py-2 text-sm font-mono text-green-400 hover:bg-green-500/20 rounded transition-colors"
    onClick={onClick}
  >
    {children}
  </button>
);

const TabsContent = ({ children, value }: { children: React.ReactNode; value: string }) => (
  <div>{children}</div>
);

const KpiCard = ({ title, value, trend }: { title: string; value: string; trend: number }) => (
  <div className="bg-black/40 border border-green-500/30 rounded-lg p-4">
    <h3 className="text-sm font-mono text-green-400/70 mb-2">{title}</h3>
    <div className="text-2xl font-bold text-green-400 font-mono">{value}</div>
    <div className={`text-sm font-mono ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
      {trend > 0 ? '+' : ''}{trend}%
    </div>
  </div>
);

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-2 font-mono">
            Intelligence Hub
          </h1>
          <p className="text-green-400/70 font-mono">
            Navigate narratives with precision. Verify truth with confidence.
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full overflow-x-auto">
            <TabsTrigger value="analytics" onClick={() => setActiveTab('analytics')}>
              Analytics
            </TabsTrigger>
            <TabsTrigger value="threat-analysis" onClick={() => setActiveTab('threat-analysis')}>
              Threat Analysis
            </TabsTrigger>
            <TabsTrigger value="osint-archive" onClick={() => setActiveTab('osint-archive')}>
              OSINT Archive
            </TabsTrigger>
            <TabsTrigger value="investigation" onClick={() => setActiveTab('investigation')}>
              Investigation
            </TabsTrigger>
          </TabsList>

          {activeTab === 'analytics' && (
            <TabsContent value="analytics">
              <div className="bg-black/50 border border-green-400/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-green-400 mb-4 font-mono">
                  Analytics Dashboard
                </h2>
                <p className="text-green-400/70 mb-6 font-mono">
                  Real-time intelligence analytics and monitoring systems
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <KpiCard title="Data Sources" value="12" trend={5.2} />
                  <KpiCard title="Active Queries" value="8" trend={-2.1} />
                  <KpiCard title="Insights Generated" value="47" trend={12.8} />
                </div>
              </div>
            </TabsContent>
          )}

          {activeTab === 'threat-analysis' && (
            <TabsContent value="threat-analysis">
              <div className="bg-black/50 border border-green-400/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-green-400 mb-4 font-mono">
                  Threat Analysis
                </h2>
                <p className="text-green-400/70 mb-6 font-mono">
                  Advanced threat detection and analysis systems
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/40 border border-green-500/30 rounded-lg p-4">
                    <h3 className="text-lg font-mono text-green-400 mb-2">Active Threats</h3>
                    <div className="text-3xl font-bold text-red-400 font-mono">247</div>
                    <p className="text-green-400/70 text-sm font-mono">Currently monitoring</p>
                  </div>
                  <div className="bg-black/40 border border-green-500/30 rounded-lg p-4">
                    <h3 className="text-lg font-mono text-green-400 mb-2">Risk Level</h3>
                    <div className="text-3xl font-bold text-yellow-400 font-mono">HIGH</div>
                    <p className="text-green-400/70 text-sm font-mono">Elevated state</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}

          {activeTab === 'osint-archive' && (
            <TabsContent value="osint-archive">
              <div className="bg-black/50 border border-green-400/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-green-400 mb-4 font-mono">
                  OSINT Archive
                </h2>
                <p className="text-green-400/70 mb-6 font-mono">
                  Open source intelligence collection and analysis
                </p>
                <div className="bg-black/40 border border-green-500/30 rounded-lg p-4">
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-green-400/30 rounded-md text-green-400 font-mono focus:ring-2 focus:ring-green-400 focus:outline-none mb-4"
                    placeholder="Search intelligence archives..."
                  />
                  <div className="text-green-400/70 font-mono text-sm">
                    Archive contains 15,847 intelligence documents
                  </div>
                </div>
              </div>
            </TabsContent>
          )}

          {activeTab === 'investigation' && (
            <TabsContent value="investigation">
              <div className="bg-black/50 border border-green-400/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-green-400 mb-4 font-mono">
                  Investigation Terminal
                </h2>
                <p className="text-green-400/70 mb-6 font-mono">
                  Deep dive investigation and research assistant
                </p>
                <div className="bg-black rounded-lg p-4 h-96 overflow-y-auto mb-4 border border-green-400/20">
                  <div className="bg-green-400/10 rounded p-3 mb-2">
                    <p className="text-green-400 font-mono">[SYSTEM] Ready to assist with your investigation. What would you like to explore?</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <input
                    type="text"
                    className="flex-grow p-3 bg-black border border-green-400/30 rounded-md text-green-400 font-mono focus:ring-2 focus:ring-green-400 focus:outline-none"
                    placeholder="Enter investigation query..."
                  />
                  <button className="px-6 py-3 bg-green-400/20 border border-green-400 text-green-400 font-mono rounded-md hover:bg-green-400/30 transition-all">
                    EXECUTE
                  </button>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}