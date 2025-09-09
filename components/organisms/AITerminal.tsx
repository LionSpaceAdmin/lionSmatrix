'use client';

import { useState, useCallback } from 'react';
import { TabNavigation } from '@/components/molecules/TabNavigation';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ThreatAnalysis } from './tabs/ThreatAnalysis';
import { StrategicAssessment } from './tabs/StrategicAssessment';
import { InfluenceMapper } from './tabs/InfluenceMapper';
import { NewsPulse } from './tabs/NewsPulse';
import { Automations } from './tabs/Automations';
import { OSINTArchive } from './tabs/OSINTArchive';
import { EvidenceLogEntry } from '@/types/intelligence';
import { LionSpaceServices } from '@/services/client-services/lionspace-service';
import { useI18n } from '@/lib/hooks/use-i18n';

const tabs = [
  { id: 'analytics', label: 'Analytics', i18nKey: 'tab_analytics' },
  { id: 'evidence-log', label: 'Evidence Log', i18nKey: 'tab_evidence_log' },
  { id: 'daily-brief', label: 'Daily Brief', i18nKey: 'tab_daily_brief' },
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

// Evidence Log Component
function EvidenceLog({ entries }: { entries: EvidenceLogEntry[] }) {
  const { t } = useI18n();
  return (
    <div className="tab-content">
      <h2 className="font-headline text-2xl mb-4 text-[#B8FFF2]">
        {t('evidence_log_title')}
      </h2>
      <p className="text-gray-400 mb-6">{t('evidence_log_subtitle')}</p>
      {entries.length === 0 ? (
        <p className="text-gray-500">{t('evidence_log_empty')}</p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <div key={index} className="bg-black/30 p-4 rounded border border-gray-700/50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[#00ff88] font-mono text-sm">{entry.type}</span>
                <span className="text-gray-400 text-xs font-mono">{entry.timestamp}</span>
              </div>
              <p className="text-gray-300 text-sm">{entry.summary}</p>
              <p className="text-gray-500 text-xs mt-2">Hash: {entry.hash.substring(0, 16)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Placeholder component for tabs under development
function TabPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="tab-content">
      <h2 className="font-headline text-2xl mb-4 text-[#B8FFF2]">{title}</h2>
      <p className="text-gray-400 mb-6">{description}</p>
      <div className="bg-black/30 p-8 rounded-lg border border-gray-700/50 text-center">
        <div className="text-4xl mb-4">🚧</div>
        <p className="text-gray-500">Component under development</p>
      </div>
    </div>
  );
}

export function AITerminal() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [evidenceLog, setEvidenceLog] = useState<EvidenceLogEntry[]>([]);
  const [resultContainer, setResultContainer] = useState<React.ReactNode>(null);
  const [lionSpaceServices] = useState(() => new LionSpaceServices());
  const { t } = useI18n();

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'analytics' || tabId === 'evidence-log') {
      setResultContainer(null);
    } else {
      setResultContainer(
        <p className="text-gray-500" data-i18n-key="results_placeholder">
          {t('results_placeholder')}
        </p>
      );
    }
  }, [t]);

  const addToEvidenceLog = useCallback((entry: EvidenceLogEntry) => {
    setEvidenceLog(prev => [entry, ...prev]);
  }, []);

  const updateResultContainer = useCallback((content: React.ReactNode) => {
    setResultContainer(content);
  }, []);

  return (
    <div id="ai-section" className="w-full relative z-10 bg-[#0B1220] py-20">
      <div className="ai-terminal max-w-7xl mx-auto p-6 sm:p-8 rounded-lg shadow-2xl border border-cyan-500/20 bg-gray-900/70 backdrop-blur-lg">
        {/* Terminal Header */}
        <div className="terminal-header flex items-center justify-between mb-6 pb-4 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-[#00ff88] font-mono text-sm">
              lionspace@intelligence:~$ active
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400 font-mono">SYSTEM ONLINE</span>
            </div>
            <div className="text-xs text-gray-500 font-mono">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
          variant="terminal"
        />

        {/* Tab Contents */}
        <div className="tab-contents">
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          
          {activeTab === 'evidence-log' && (
            <EvidenceLog entries={evidenceLog} />
          )}
          
          {activeTab === 'daily-brief' && (
            <TabPlaceholder 
              title={t('daily_brief_title')} 
              description={t('daily_brief_subtitle')}
            />
          )}
          
          {activeTab === 'strategic-assessment' && (
            <StrategicAssessment 
              lionSpaceServices={lionSpaceServices}
              onResultUpdate={updateResultContainer}
              onLogEvidence={addToEvidenceLog}
            />
          )}
          
          {activeTab === 'influence-mapper' && (
            <InfluenceMapper 
              lionSpaceServices={lionSpaceServices}
              onResultUpdate={updateResultContainer}
              onLogEvidence={addToEvidenceLog}
            />
          )}
          
          {activeTab === 'text-analysis' && (
            <ThreatAnalysis 
              lionSpaceServices={lionSpaceServices}
              onResultUpdate={updateResultContainer}
              onLogEvidence={addToEvidenceLog}
            />
          )}
          
          {activeTab === 'news-pulse' && (
            <NewsPulse 
              lionSpaceServices={lionSpaceServices}
              onResultUpdate={updateResultContainer}
              onLogEvidence={addToEvidenceLog}
            />
          )}
          
          {activeTab === 'automations' && (
            <Automations 
              lionSpaceServices={lionSpaceServices}
              onResultUpdate={updateResultContainer}
              onLogEvidence={addToEvidenceLog}
            />
          )}
          
          {activeTab === 'osint-archive' && (
            <OSINTArchive />
          )}
          
          {activeTab === 'campaign-generator' && (
            <TabPlaceholder 
              title={t('campaign_generator_title')} 
              description={t('campaign_generator_subtitle')}
            />
          )}
          
          {activeTab === 'image-studio' && (
            <TabPlaceholder 
              title={t('image_studio_title')} 
              description={t('image_studio_subtitle')}
            />
          )}
          
          {activeTab === 'video-analysis' && (
            <TabPlaceholder 
              title={t('video_analysis_title')} 
              description={t('video_analysis_subtitle')}
            />
          )}
          
          {activeTab === 'audio-analysis' && (
            <TabPlaceholder 
              title={t('audio_analysis_title')} 
              description={t('audio_analysis_subtitle')}
            />
          )}
          
          {activeTab === 'trust-verification' && (
            <TabPlaceholder 
              title={t('trust_verification_title')} 
              description={t('trust_verification_subtitle')}
            />
          )}
          
          {activeTab === 'investigation' && (
            <TabPlaceholder 
              title={t('investigation_title')} 
              description={t('investigation_subtitle')}
            />
          )}
        </div>

        {/* Results Container */}
        {!['investigation', 'image-studio', 'analytics', 'evidence-log', 'text-analysis', 'strategic-assessment', 'influence-mapper', 'news-pulse', 'automations', 'osint-archive'].includes(activeTab) && (
          <div className="ai-result mt-6 min-h-[200px] text-left p-6 bg-black/30 rounded-lg border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#00ff88] font-mono text-sm uppercase tracking-wider">
                Analysis Output
              </h3>
              {resultContainer && (
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Processing Complete</span>
                </div>
              )}
            </div>
            <div className="terminal-output">
              {resultContainer}
            </div>
          </div>
        )}

        {/* Terminal Footer */}
        <div className="terminal-footer mt-6 pt-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
            <div className="flex items-center space-x-4">
              <span>Evidence Entries: {evidenceLog.length}</span>
              <span>Active Session: {Math.floor(Math.random() * 3600) + 1}s</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Secure Connection</span>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact version of AITerminal for embedded use
 */
export function CompactAITerminal({ 
  selectedTab = 'analytics',
  onTabChange
}: {
  selectedTab?: string;
  onTabChange?: (tabId: string) => void;
}) {
  const [activeTab, setActiveTab] = useState(selectedTab);
  
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  }, [onTabChange]);

  const compactTabs = tabs.slice(0, 6);

  return (
    <div className="compact-ai-terminal bg-gray-900/70 backdrop-blur-lg border border-cyan-500/20 rounded-lg p-4">
      <TabNavigation 
        tabs={compactTabs} 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        variant="minimal"
      />
      
      <div className="mt-4">
        {activeTab === 'analytics' && (
          <div className="text-center text-gray-400 py-8">
            <div className="text-2xl mb-2">📊</div>
            <p>Analytics Dashboard</p>
          </div>
        )}
      </div>
    </div>
  );
}