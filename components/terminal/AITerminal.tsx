'use client';

import React, { useState } from 'react';
// import { OSINTArchive } from '../osint/OSINTArchive';

export type TabType = 
  | 'analytics' 
  | 'evidence-log' 
  | 'daily-brief' 
  | 'strategic-assessment'
  | 'influence-mapper'
  | 'text-analysis'
  | 'news-pulse'
  | 'automations'
  | 'osint-archive'
  | 'campaign-generator'
  | 'image-studio'
  | 'video-analysis'
  | 'audio-analysis'
  | 'trust-verification'
  | 'investigation';

interface Tab {
  id: TabType;
  label: string;
  content: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'analytics', label: 'Analytics', content: <AnalyticsContent /> },
  { id: 'evidence-log', label: 'Evidence Log', content: <EvidenceLogContent /> },
  { id: 'daily-brief', label: 'Daily Brief', content: <DailyBriefContent /> },
  { id: 'strategic-assessment', label: 'Strategic Assessment', content: <StrategicAssessmentContent /> },
  { id: 'influence-mapper', label: 'Influence Mapper', content: <InfluenceMapperContent /> },
  { id: 'text-analysis', label: 'Threat Analysis', content: <ThreatAnalysisContent /> },
  { id: 'news-pulse', label: 'Real-time NewsPulse', content: <NewsPulseContent /> },
  { id: 'automations', label: 'Automations', content: <AutomationsContent /> },
  { id: 'osint-archive', label: 'OSINT Archive', content: <div className="text-center text-gray-400 p-8">OSINT Archive implementation coming soon...</div> },
  { id: 'campaign-generator', label: 'Campaign Generator', content: <CampaignGeneratorContent /> },
  { id: 'image-studio', label: 'ImageGen Studio', content: <ImageStudioContent /> },
  { id: 'video-analysis', label: 'Video Analysis', content: <VideoAnalysisContent /> },
  { id: 'audio-analysis', label: 'Audio Analysis', content: <AudioAnalysisContent /> },
  { id: 'trust-verification', label: 'Trust & Verification', content: <TrustVerificationContent /> },
  { id: 'investigation', label: 'Conversational Investigation', content: <InvestigationContent /> }
];

// Placeholder components for each tab
function AnalyticsContent() {
  return (
    <div>
      <h2 className="font-headline text-3xl text-center mb-6 text-[#B8FFF2]">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="kpi-card">
          <div className="kpi-value">4.2h</div>
          <div className="kpi-label">Avg. Time to Counter</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">127</div>
          <div className="kpi-label">Active Narratives</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">89.3%</div>
          <div className="kpi-label">Detection Accuracy</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">2.1M</div>
          <div className="kpi-label">Posts Analyzed</div>
        </div>
      </div>
      <p className="text-center text-gray-400">Analytics dashboard implementation in progress...</p>
    </div>
  );
}

function EvidenceLogContent() {
  return (
    <div>
      <h2 className="font-headline text-3xl text-center mb-2 text-[#B8FFF2]">Immutable Evidence Log</h2>
      <p className="text-center text-gray-400 mb-6">A chronological, cryptographically-secured audit trail of all intelligence findings.</p>
      <div className="max-h-[600px] overflow-y-auto pr-4">
        <p className="text-center text-gray-500">No evidence has been logged yet.</p>
      </div>
    </div>
  );
}

function DailyBriefContent() {
  return (
    <div>
      <h2 className="font-headline text-3xl text-center mb-2 text-[#B8FFF2]">Daily Intelligence Brief</h2>
      <p className="text-center text-gray-400 mb-6">Generate a "ready-to-share" intelligence brief on the top global disinformation threats.</p>
      <div className="flex justify-center mt-4">
        <button className="gemini-button text-lg text-[#B8FFF2] py-3 px-10 rounded-md">
          ✨ Generate Today's Brief
        </button>
      </div>
    </div>
  );
}

function StrategicAssessmentContent() {
  return (
    <div>
      <h2 className="font-headline text-3xl text-center mb-2 text-[#B8FFF2]">Strategic Threat Assessment</h2>
      <p className="text-center text-gray-400 mb-6">Enter a high-level topic or operational area to generate a comprehensive intelligence report.</p>
      <input 
        type="text" 
        className="w-full p-3 bg-[#0E0E10] border border-gray-700 rounded-md text-white font-body focus:ring-2 focus:ring-[#B8FFF2] focus:outline-none" 
        placeholder="e.g., Russian influence operations in Africa, Iranian propaganda in South America..."
      />
      <div className="flex justify-center mt-4">
        <button className="gemini-button text-lg text-[#B8FFF2] py-3 px-10 rounded-md">
          ✨ Generate Threat Report
        </button>
      </div>
    </div>
  );
}

function InfluenceMapperContent() {
  return (
    <div>
      <h2 className="font-headline text-3xl text-center mb-2 text-[#B8FFF2]">Dynamic Influence Mapper</h2>
      <p className="text-center text-gray-400 mb-6">Enter a target and a topic to map their influence network in real-time.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          type="text" 
          className="w-full p-3 bg-[#0E0E10] border border-gray-700 rounded-md text-white font-body focus:ring-2 focus:ring-[#B8FFF2] focus:outline-none" 
          placeholder="Target Entity (e.g., The Grayzone)"
        />
        <input 
          type="text" 
          className="w-full p-3 bg-[#0E0E10] border border-gray-700 rounded-md text-white font-body focus:ring-2 focus:ring-[#B8FFF2] focus:outline-none" 
          placeholder="Topic/Narrative (e.g., Syria conflict)"
        />
      </div>
      <div className="flex justify-center mt-4">
        <button className="gemini-button text-lg text-[#B8FFF2] py-3 px-10 rounded-md">
          ✨ Trace Influence Network
        </button>
      </div>
      <div className="chart-container mt-6">
        <p className="text-center text-gray-400">Chart visualization will appear here</p>
      </div>
    </div>
  );
}

// More placeholder components...
function ThreatAnalysisContent() {
  return <div className="text-center text-gray-400 p-8">Threat Analysis implementation coming soon...</div>;
}

function NewsPulseContent() {
  return <div className="text-center text-gray-400 p-8">Real-time NewsPulse implementation coming soon...</div>;
}

function AutomationsContent() {
  return <div className="text-center text-gray-400 p-8">Automations implementation coming soon...</div>;
}

function CampaignGeneratorContent() {
  return <div className="text-center text-gray-400 p-8">Campaign Generator implementation coming soon...</div>;
}

function ImageStudioContent() {
  return <div className="text-center text-gray-400 p-8">ImageGen Studio implementation coming soon...</div>;
}

function VideoAnalysisContent() {
  return <div className="text-center text-gray-400 p-8">Video Analysis implementation coming soon...</div>;
}

function AudioAnalysisContent() {
  return <div className="text-center text-gray-400 p-8">Audio Analysis implementation coming soon...</div>;
}

function TrustVerificationContent() {
  return <div className="text-center text-gray-400 p-8">Trust & Verification implementation coming soon...</div>;
}

function InvestigationContent() {
  return <div className="text-center text-gray-400 p-8">Conversational Investigation implementation coming soon...</div>;
}

export function AITerminal() {
  const [activeTab, setActiveTab] = useState<TabType>('analytics');

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div id="ai-section" className="w-full relative py-20">
      <div className="ai-terminal max-w-6xl mx-auto p-6 sm:p-8 rounded-lg shadow-2xl">
        
        {/* Tab Navigation */}
        <div className="flex border-b border-b-2 border-transparent mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab text-lg py-2 px-6 border-b-2 border-transparent flex-shrink-0 ${
                activeTab === tab.id ? 'active' : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content active">
          {currentTab?.content}
        </div>
      </div>
    </div>
  );
}