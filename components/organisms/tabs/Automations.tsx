'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/hooks/use-i18n';
import { LionSpaceServices } from '@/services/client-services/lionspace-service';
import { EvidenceLogEntry, Automation } from '@/types/intelligence';

interface AutomationsProps {
  lionSpaceServices: LionSpaceServices;
  onResultUpdate: (content: React.ReactNode) => void;
  onLogEvidence: (entry: EvidenceLogEntry) => void;
}

export function Automations({ lionSpaceServices, onResultUpdate, onLogEvidence }: AutomationsProps) {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [triggerInput, setTriggerInput] = useState('');
  const [actionSelect, setActionSelect] = useState('daily_brief');
  const [scheduleSelect, setScheduleSelect] = useState('hourly');
  const [isCreating, setIsCreating] = useState(false);
  const { t } = useI18n();

  const createAutomation = async () => {
    if (!triggerInput.trim()) {
      onResultUpdate(<p className="text-red-400">Please provide a trigger keyword or condition.</p>);
      return;
    }

    setIsCreating(true);
    
    const actionTexts: Record<string, string> = {
      daily_brief: t('automations_action_brief') || 'Generate Daily Brief',
      sentiment_monitor: t('automations_action_sentiment') || 'Monitor Sentiment Changes',
      weekly_summary: t('automations_action_summary') || 'Create Weekly Summary',
      threat_analysis: 'Automated Threat Analysis',
      news_pulse: 'News Pulse Monitoring',
      influence_tracking: 'Influence Network Tracking'
    };

    const scheduleTexts: Record<string, string> = {
      hourly: 'Every Hour',
      daily: 'Daily at 09:00',
      weekly: 'Weekly on Monday',
      realtime: 'Real-time Monitoring',
      custom: 'Custom Schedule'
    };

    try {
      const newAutomation: Automation = {
        id: Date.now(),
        trigger: triggerInput,
        action: actionSelect,
        actionText: actionTexts[actionSelect] || '',
        schedule: scheduleSelect,
        scheduleText: scheduleTexts[scheduleSelect] || '',
        status: 'active',
        lastRun: 'Never',
        totalRuns: 0,
        successRate: 100,
        createdAt: new Date().toISOString()
      };

      setAutomations(prev => [...prev, newAutomation]);
      setTriggerInput('');
      
      // Log the automation creation
      const entry = await lionSpaceServices.logEvidence(
        'Automation Created',
        `Trigger: ${triggerInput}, Action: ${actionSelect}`,
        `New automation configured successfully`
      );
      onLogEvidence(entry);

      onResultUpdate(
        <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <h3 className="text-green-400 font-mono">AUTOMATION CREATED</h3>
          </div>
          <p className="text-gray-300">Successfully created automation for "{triggerInput}"</p>
          <p className="text-sm text-gray-400 mt-1">
            Action: {actionTexts[actionSelect]} | Schedule: {scheduleTexts[scheduleSelect]}
          </p>
        </div>
      );
    } catch (error) {
      console.error('Error creating automation:', error);
      onResultUpdate(
        <div className="text-center p-4">
          <p className="text-red-400">Failed to create automation. Please try again.</p>
        </div>
      );
    } finally {
      setIsCreating(false);
    }
  };

  const toggleAutomation = async (id: number) => {
    const automation = automations.find(auto => auto.id === id);
    if (!automation) return;

    setAutomations(prev => prev.map(auto => 
      auto.id === id 
        ? { ...auto, status: auto.status === 'active' ? 'paused' : 'active' }
        : auto
    ));

    const action = automation.status === 'active' ? 'paused' : 'resumed';
    onResultUpdate(
      <div className="text-center py-2">
        <p className="text-cyan-400">Automation "{automation.trigger}" has been {action}</p>
      </div>
    );
  };

  const deleteAutomation = async (id: number) => {
    const automation = automations.find(auto => auto.id === id);
    if (!automation) return;

    setAutomations(prev => prev.filter(auto => auto.id !== id));
    
    // Log the deletion
    try {
      const entry = await lionSpaceServices.logEvidence(
        'Automation Deleted',
        `Trigger: ${automation.trigger}`,
        `Automation removed from system`
      );
      onLogEvidence(entry);
    } catch (error) {
      console.error('Error logging automation deletion:', error);
    }

    onResultUpdate(
      <div className="text-center py-2">
        <p className="text-red-400">Automation "{automation.trigger}" has been deleted</p>
      </div>
    );
  };

  const runAutomationNow = async (id: number) => {
    const automation = automations.find(auto => auto.id === id);
    if (!automation) return;

    // Update last run time and increment run count
    setAutomations(prev => prev.map(auto => 
      auto.id === id 
        ? { 
            ...auto, 
            lastRun: new Date().toLocaleTimeString(),
            totalRuns: (auto.totalRuns || 0) + 1
          }
        : auto
    ));

    onResultUpdate(
      <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
          <h3 className="text-blue-400 font-mono">AUTOMATION EXECUTED</h3>
        </div>
        <p className="text-gray-300">Manual execution of "{automation.trigger}" completed</p>
        <p className="text-sm text-gray-400 mt-1">Action: {automation.actionText}</p>
      </div>
    );
  };

  // Simulate automatic execution
  useEffect(() => {
    const interval = setInterval(() => {
      setAutomations(prev => prev.map(auto => {
        if (auto.status === 'active' && Math.random() > 0.7) { // 30% chance to run
          return { 
            ...auto, 
            lastRun: new Date().toLocaleTimeString(),
            totalRuns: (auto.totalRuns || 0) + 1
          };
        }
        return auto;
      }));
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tab-content">
      <h2 data-i18n-key="automations_title" className="font-headline text-3xl text-center mb-2 text-cyan-400">
        {t('automations_title')}
      </h2>
      <p data-i18n-key="automations_subtitle" className="text-center text-gray-400 mb-6">
        {t('automations_subtitle')}
      </p>
      
      {/* Create New Automation */}
      <div className="bg-black/30 p-4 rounded-lg border border-gray-700/50 mb-6">
        <h3 className="font-headline text-xl mb-4 text-gray-300" data-i18n-key="automations_create_title">
          {t('automations_create_title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            value={triggerInput}
            onChange={(e) => setTriggerInput(e.target.value)}
            className="w-full p-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none backdrop-blur-sm"
            data-i18n-key="automations_placeholder_trigger"
            placeholder={t('automations_placeholder_trigger') || 'Enter trigger keyword...'}
          />
          <select
            value={actionSelect}
            onChange={(e) => setActionSelect(e.target.value)}
            className="w-full p-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none backdrop-blur-sm"
          >
            <option value="daily_brief">Generate Daily Brief</option>
            <option value="sentiment_monitor">Monitor Sentiment Changes</option>
            <option value="weekly_summary">Create Weekly Summary</option>
            <option value="threat_analysis">Automated Threat Analysis</option>
            <option value="news_pulse">News Pulse Monitoring</option>
            <option value="influence_tracking">Influence Network Tracking</option>
          </select>
          <select
            value={scheduleSelect}
            onChange={(e) => setScheduleSelect(e.target.value)}
            className="w-full p-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none backdrop-blur-sm"
          >
            <option value="realtime">Real-time Monitoring</option>
            <option value="hourly">Every Hour</option>
            <option value="daily">Daily at 09:00</option>
            <option value="weekly">Weekly on Monday</option>
            <option value="custom">Custom Schedule</option>
          </select>
          <button
            onClick={createAutomation}
            disabled={isCreating || !triggerInput.trim()}
            className="gemini-button text-lg text-cyan-400 py-3 px-6 rounded-md bg-cyan-500/10 border border-cyan-500/50 hover:bg-cyan-400 hover:text-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            data-i18n-key="automations_button_create"
          >
            {isCreating ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Creating...</span>
              </div>
            ) : (
              t('automations_button_create') || 'Create'
            )}
          </button>
        </div>

        {/* Quick Automation Templates */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setTriggerInput("Gaza conflict");
              setActionSelect("news_pulse");
              setScheduleSelect("hourly");
            }}
            className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 px-3 py-1 rounded text-sm transition-all"
          >
            Template: Gaza Monitoring
          </button>
          <button
            onClick={() => {
              setTriggerInput("Jackson Hinkle");
              setActionSelect("influence_tracking");
              setScheduleSelect("daily");
            }}
            className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 px-3 py-1 rounded text-sm transition-all"
          >
            Template: Influencer Tracking
          </button>
        </div>
      </div>

      {/* Active Automations */}
      <div className="bg-black/30 p-4 rounded-lg border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline text-xl text-gray-300" data-i18n-key="automations_active_title">
            {t('automations_active_title')}
          </h3>
          <div className="text-sm text-gray-400 font-mono">
            {automations.filter(a => a.status === 'active').length} active, {automations.filter(a => a.status === 'paused').length} paused
          </div>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
          {automations.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🤖</div>
              <p className="text-gray-500" data-i18n-key="automations_empty">
                {t('automations_empty') || 'No automations configured yet'}
              </p>
            </div>
          ) : (
            automations.map(auto => (
              <div key={auto.id} className="automation-item bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      auto.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'
                    }`}></div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-body text-white font-medium">"{auto.trigger}"</p>
                        <span className={`text-xs px-2 py-1 rounded font-mono ${
                          auto.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {auto.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{auto.actionText}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-500 font-mono">
                        <div>Schedule: {auto.scheduleText}</div>
                        <div>Last run: {auto.lastRun}</div>
                        <div>Total runs: {auto.totalRuns || 0}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => runAutomationNow(auto.id)}
                      className="text-xs px-3 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-all"
                    >
                      Run Now
                    </button>
                    <button
                      onClick={() => toggleAutomation(auto.id)}
                      className={`text-xs px-3 py-1 rounded transition-all ${
                        auto.status === 'active'
                          ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400'
                          : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                      }`}
                    >
                      {auto.status === 'active' ? 'Pause' : 'Resume'}
                    </button>
                    <button
                      onClick={() => deleteAutomation(auto.id)}
                      className="text-xs px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-cyan-900/10 border border-cyan-500/20 rounded-lg">
        <h3 className="text-cyan-400 font-semibold mb-2">🤖 Automation Tips</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Use <strong>Real-time Monitoring</strong> for immediate response to keywords</li>
          <li>• Set up <strong>Daily Brief</strong> automations for routine intelligence updates</li>
          <li>• Use <strong>Influence Tracking</strong> to monitor specific actors continuously</li>
          <li>• All automation activities are automatically logged to the evidence chain</li>
        </ul>
      </div>
    </div>
  );
}