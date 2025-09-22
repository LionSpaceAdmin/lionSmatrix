"use client";

import { useState } from 'react';
import AnalyticsDashboard from './analytics-dashboard';
import StrategicAssessmentTab from './strategic-assessment-tab';
import InfluenceMapperTab from './influence-mapper-tab';
import TextAnalysisTab from './text-analysis-tab';
import NewsPulseTab from './news-pulse-tab';
import AutomationsTab from './automations-tab';
import OsintArchiveTab from './osint-archive-tab';
import CampaignGeneratorTab from './campaign-generator-tab';
import ImageStudioTab from './image-studio-tab';
import VideoAnalysisTab from './video-analysis-tab';
import AudioAnalysisTab from './audio-analysis-tab';
import TrustVerificationTab from './trust-verification-tab';
import InvestigationTab from './investigation-tab';

const tabs = [
    { id: 'analytics', label: 'Analytics', i18nKey: 'tab_analytics' },
    { id: 'strategic-assessment', label: 'Strategic Assessment', i18nKey: 'tab_strategic_assessment' },
    { id: 'influence-mapper', label: 'Influence Mapper', i18nKey: 'tab_influence_mapper' },
    { id: 'text-analysis', label: 'Threat Analysis', i18nKey: 'tab_threat_analysis' },
    { id: 'news-pulse', label: 'Real-time NewsPulse', i18nKey: 'tab_news_pulse' },
    { id: 'automations', label: 'Automations', i18nKey: 'tab_automations' },
    { id: 'osint-archive', label: 'OSINT Archive', i18nKey: 'tab_osint_archive' },
    { id: 'campaign-generator', label: 'Campaign Generator', i18nKey: 'tab_campaign_generator' },
    { id: 'image-studio', label: 'ImageGen Studio', i18nKey: 'tab_image_studio' },
    { id: 'video-analysis', label: 'Video Analysis', i18nKey: 'tab_video_analysis' },
    { id: 'audio-analysis', label: 'Audio Analysis', i18nKey: 'tab_audio_analysis' },
    { id: 'trust-verification', label: 'Trust & Verification', i18nKey: 'tab_trust_verification' },
    { id: 'investigation', label: 'Conversational Investigation', i18nKey: 'tab_investigation' },
];

const tabComponents: { [key: string]: React.FC<any> } = {
    analytics: AnalyticsDashboard,
    'strategic-assessment': StrategicAssessmentTab,
    'influence-mapper': InfluenceMapperTab,
    'text-analysis': TextAnalysisTab,
    'news-pulse': NewsPulseTab,
    automations: AutomationsTab,
    'osint-archive': OsintArchiveTab,
    'campaign-generator': CampaignGeneratorTab,
    'image-studio': ImageStudioTab,
    'video-analysis': VideoAnalysisTab,
    'audio-analysis': AudioAnalysisTab,
    'trust-verification': TrustVerificationTab,
    investigation: InvestigationTab,
};

export default function AiTerminal({ onOpenDossier }: { onOpenDossier: (actorName: string) => void }) {
  const [activeTab, setActiveTab] = useState('analytics');
  const ActiveTabComponent = tabComponents[activeTab];

  return (
    <div id="ai-section" className="w-full relative z-10 bg-[#0B1220] py-20">
        <div className="ai-terminal max-w-6xl mx-auto p-6 sm:p-8 rounded-lg shadow-2xl">
            <div className="flex border-b border-b-2 border-transparent mb-6 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        data-tab={tab.id}
                        className={`tab text-lg py-2 px-6 border-b-2 border-transparent flex-shrink-0 ${activeTab === tab.id ? 'active' : ''}`}
                        data-i18n-key={tab.i18nKey}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <ActiveTabComponent onOpenDossier={onOpenDossier} />
        </div>
    </div>
  );
}
