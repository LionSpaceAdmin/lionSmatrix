'use client';

import { useState, useEffect, useRef } from 'react';
import { OSINTActor, DeepDive } from '@/types/intelligence';
import { useI18n } from '@/lib/hooks/use-i18n';

interface DossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  actor: OSINTActor | null;
  deepDive?: DeepDive;
  onGenerateAISummary: () => Promise<void>;
  onLaunchResearch: () => void;
}

export function DossierModal({ 
  isOpen, 
  onClose, 
  actor, 
  deepDive,
  onGenerateAISummary,
  onLaunchResearch 
}: DossierModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !actor) return null;

  const handleGenerateAISummary = async () => {
    setIsGenerating(true);
    try {
      await onGenerateAISummary();
      // In a real implementation, you would set the AI summary here
      // setAiSummary(result);
    } finally {
      setIsGenerating(false);
    }
  };

  const getRiskColor = (narrative: string) => {
    if (narrative.toLowerCase().includes('pro-iran') || narrative.toLowerCase().includes('hamas')) {
      return 'text-red-400';
    }
    if (narrative.toLowerCase().includes('anti-israel') || narrative.toLowerCase().includes('anti-west')) {
      return 'text-orange-400';
    }
    return 'text-yellow-400';
  };

  const formatAudience = (audience: number) => {
    if (audience >= 1000000) {
      return `${(audience / 1000000).toFixed(1)}M`;
    }
    if (audience >= 1000) {
      return `${(audience / 1000).toFixed(0)}K`;
    }
    return audience.toLocaleString();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-title"
    >
      <div 
        ref={modalRef}
        className="w-full max-w-4xl h-full max-h-[90vh] bg-gray-900/95 border border-cyan-500/50 rounded-lg shadow-2xl flex flex-col animate-slideIn"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <h2 
              id="dossier-title"
              className="font-headline text-2xl text-cyan-400"
              data-i18n-key="dossier_title"
            >
              {t('dossier_title')}: {actor.Name}
            </h2>
            {/* Risk indicator */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                actor.Narrative.toLowerCase().includes('pro-iran') ? 'bg-red-500' :
                actor.Narrative.toLowerCase().includes('anti-israel') ? 'bg-orange-500' :
                'bg-yellow-500'
              }`}></div>
              <span className="text-xs text-gray-400 font-mono">ACTIVE</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800/50 rounded"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto text-gray-300 flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-lg border border-gray-700/50">
                <h3 className="text-lg font-headline text-cyan-400 mb-3">Basic Intelligence</h3>
                <div className="space-y-2">
                  <p>
                    <strong className="text-cyan-400">Platform:</strong> 
                    <span className="ml-2 font-mono">{actor.Platform}</span>
                  </p>
                  <p>
                    <strong className="text-cyan-400">Audience Size:</strong> 
                    <span className="ml-2 font-mono text-lg">{formatAudience(actor.Audience)}</span>
                  </p>
                  <p>
                    <strong className="text-cyan-400">Primary Narrative:</strong> 
                    <span className={`ml-2 ${getRiskColor(actor.Narrative)}`}>{actor.Narrative}</span>
                  </p>
                  <p>
                    <strong className="text-cyan-400">Known Affiliation:</strong> 
                    <span className="ml-2">{actor.Affiliation}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Threat Assessment */}
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-lg border border-gray-700/50">
                <h3 className="text-lg font-headline text-cyan-400 mb-3">Threat Assessment</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Influence Level:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-700 rounded-full">
                        <div className={`h-2 rounded-full ${
                          actor.Audience > 1000000 ? 'bg-red-500 w-full' :
                          actor.Audience > 500000 ? 'bg-orange-500 w-4/5' :
                          'bg-yellow-500 w-3/5'
                        }`}></div>
                      </div>
                      <span className="text-sm font-mono">
                        {actor.Audience > 1000000 ? 'HIGH' :
                         actor.Audience > 500000 ? 'MED' : 'LOW'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Activity Status:</span>
                    <span className="text-green-400 font-mono">ACTIVE</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Last Updated:</span>
                    <span className="text-gray-400 font-mono text-sm">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Dive Report */}
          {deepDive?.report && (
            <div className="mb-6">
              <div className="bg-black/30 p-4 rounded-lg border border-gray-700/50">
                <h3 className="text-lg font-headline text-cyan-400 mb-3">Intelligence Report</h3>
                <div 
                  className="prose prose-invert prose-cyan max-w-none"
                  dangerouslySetInnerHTML={{ __html: deepDive.report }} 
                />
              </div>
            </div>
          )}
          
          {/* AI Summary */}
          {aiSummary && (
            <div className="mb-6">
              <div className="bg-black/30 p-4 rounded-lg border border-green-500/30">
                <h3 className="text-lg font-headline text-green-400 mb-3">
                  AI-Generated Summary
                </h3>
                <p className="text-gray-300">{aiSummary}</p>
              </div>
            </div>
          )}

          {/* Network Connections (if available) */}
          <div className="bg-black/30 p-4 rounded-lg border border-gray-700/50">
            <h3 className="text-lg font-headline text-cyan-400 mb-3">Network Analysis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Connections</h4>
                <div className="space-y-1 text-sm">
                  <div className="text-gray-300">• Cross-platform coordination detected</div>
                  <div className="text-gray-300">• Narrative synchronization patterns</div>
                  <div className="text-gray-300">• Amplification network identified</div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Activity Patterns</h4>
                <div className="space-y-1 text-sm">
                  <div className="text-gray-300">• Peak activity: 14:00-18:00 UTC</div>
                  <div className="text-gray-300">• Content frequency: High</div>
                  <div className="text-gray-300">• Engagement rate: Above average</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="p-4 mt-auto border-t border-gray-700 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleGenerateAISummary}
            disabled={isGenerating}
            className="gemini-button w-full text-lg text-cyan-400 py-3 px-10 rounded-md bg-cyan-500/10 border border-cyan-500/50 hover:bg-cyan-400 hover:text-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            data-i18n-key="dossier_button_summary"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </div>
            ) : (
              t('dossier_button_summary')
            )}
          </button>
          <button 
            onClick={onLaunchResearch}
            className="gemini-button w-full text-lg text-cyan-400 py-3 px-10 rounded-md bg-cyan-500/10 border border-cyan-500/50 hover:bg-cyan-400 hover:text-gray-900 transition-all"
            data-i18n-key="dossier_button_research"
          >
            {t('dossier_button_research')}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Mini dossier card for quick preview
 */
export function MiniDossierCard({ 
  actor, 
  onClick 
}: { 
  actor: OSINTActor; 
  onClick: () => void;
}) {
  const formatAudience = (audience: number) => {
    if (audience >= 1000000) return `${(audience / 1000000).toFixed(1)}M`;
    if (audience >= 1000) return `${(audience / 1000).toFixed(0)}K`;
    return audience.toLocaleString();
  };

  return (
    <div 
      onClick={onClick}
      className="bg-black/30 border border-gray-700/50 rounded-lg p-4 cursor-pointer hover:border-cyan-500/50 transition-all duration-200 hover:bg-black/50"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-headline text-cyan-400 text-lg">{actor.Name}</h4>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500 font-mono">LIVE</span>
        </div>
      </div>
      
      <div className="space-y-1 text-sm text-gray-400">
        <p>Platform: <span className="text-gray-300">{actor.Platform}</span></p>
        <p>Audience: <span className="text-cyan-400 font-mono">{formatAudience(actor.Audience)}</span></p>
        <p className="text-gray-300 text-xs mt-2 line-clamp-2">{actor.Narrative}</p>
      </div>
    </div>
  );
}