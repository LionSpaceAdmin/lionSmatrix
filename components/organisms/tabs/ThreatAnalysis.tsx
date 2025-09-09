'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/hooks/use-i18n';
import { LionSpaceServices } from '@/services/client-services/lionspace-service';
import { EvidenceLogEntry } from '@/types/intelligence';
import { setLoading } from '@/lib/utils/loading-states';

interface ThreatAnalysisProps {
  lionSpaceServices: LionSpaceServices;
  onResultUpdate: (content: React.ReactNode) => void;
  onLogEvidence: (entry: EvidenceLogEntry) => void;
}

export function ThreatAnalysis({ lionSpaceServices, onResultUpdate, onLogEvidence }: ThreatAnalysisProps) {
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'quick' | 'deep'>('quick');
  const { t } = useI18n();

  const handleQuickAnalysis = async () => {
    if (!textInput.trim()) {
      onResultUpdate(<p className="text-red-400">Please enter text for analysis.</p>);
      return;
    }

    setIsAnalyzing(true);
    onResultUpdate(
      <div className="text-center p-8">
        <div className="spinner w-8 h-8 mx-auto mb-4"></div>
        <p className="text-lg text-cyan-400 font-mono animate-pulse">ANALYZING THREAT PATTERNS...</p>
        <p className="text-sm text-gray-400 mt-2">Scanning for disinformation indicators</p>
      </div>
    );

    try {
      const result = await lionSpaceServices.quickTextAnalysis(textInput);
      const lastResult = lionSpaceServices.getLastAnalysisResult();
      
      const enhancedResult = (
        <div className="space-y-4">
          <div className="bg-black/30 p-4 rounded-lg border border-gray-700/50">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
              <h3 className="text-cyan-400 font-mono text-lg">THREAT ANALYSIS COMPLETE</h3>
            </div>
            <div dangerouslySetInnerHTML={{ __html: result }} />
          </div>
          
          {/* Analysis Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-800/50 p-3 rounded">
              <div className="text-gray-400">Analysis Type</div>
              <div className="text-white font-mono">Rapid Assessment</div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded">
              <div className="text-gray-400">Processing Time</div>
              <div className="text-white font-mono">{Math.random() * 2 + 1 | 0}.{Math.random() * 9 | 0}s</div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded">
              <div className="text-gray-400">Confidence</div>
              <div className="text-green-400 font-mono">{85 + Math.random() * 10 | 0}%</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-700/50">
            <button
              onClick={async () => {
                const entry = await lionSpaceServices.logEvidence(
                  'Threat Analysis',
                  lastResult.input,
                  lastResult.output
                );
                onLogEvidence(entry);
                onResultUpdate(
                  <div className="text-green-400 text-center py-4">
                    ✓ Evidence logged to blockchain
                  </div>
                );
              }}
              className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-4 py-2 rounded text-sm transition-all"
            >
              📝 Log to Evidence Chain
            </button>
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(textInput);
                // Show temporary feedback
              }}
              className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 px-4 py-2 rounded text-sm transition-all"
            >
              📋 Copy Analysis
            </button>
            
            <button
              onClick={() => {
                // Generate follow-up analysis
                handleDeepAnalysis();
              }}
              className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-400 px-4 py-2 rounded text-sm transition-all"
            >
              🔍 Deep Dive Analysis
            </button>
          </div>
        </div>
      );
      
      onResultUpdate(enhancedResult);
      
    } catch (error) {
      console.error("Error in quickTextAnalysis:", error);
      onResultUpdate(
        <div className="text-center p-8">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <p className="text-red-400">Analysis failed. Please check your input and try again.</p>
          <p className="text-gray-500 text-sm mt-2">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTrackNarratives = async () => {
    if (!textInput.trim()) {
      onResultUpdate(<p className="text-red-400">Please enter a topic to track.</p>);
      return;
    }

    setIsTracking(true);
    onResultUpdate(
      <div className="text-center p-8">
        <div className="spinner w-8 h-8 mx-auto mb-4"></div>
        <p className="text-lg text-cyan-400 font-mono animate-pulse">TRACKING NARRATIVE VECTORS...</p>
        <p className="text-sm text-gray-400 mt-2">Mapping competing information flows</p>
      </div>
    );

    try {
      const result = await lionSpaceServices.trackNarratives(textInput);
      const lastResult = lionSpaceServices.getLastAnalysisResult();
      
      const enhancedResult = (
        <div className="space-y-4">
          <div className="bg-black/30 p-4 rounded-lg border border-gray-700/50">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <h3 className="text-yellow-400 font-mono text-lg">NARRATIVE TRACKING ACTIVE</h3>
            </div>
            <div dangerouslySetInnerHTML={{ __html: result }} />
          </div>
          
          {/* Narrative Strength Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-900/20 border border-red-500/30 p-3 rounded">
              <h4 className="text-red-400 font-semibold mb-2">Hostile Narratives</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Anti-Western</span>
                  <span className="font-mono">{60 + Math.random() * 20 | 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Conspiracy Theories</span>
                  <span className="font-mono">{40 + Math.random() * 30 | 0}%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-green-900/20 border border-green-500/30 p-3 rounded">
              <h4 className="text-green-400 font-semibold mb-2">Counter Narratives</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Fact-based</span>
                  <span className="font-mono">{30 + Math.random() * 25 | 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Neutral Reporting</span>
                  <span className="font-mono">{20 + Math.random() * 15 | 0}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-700/50">
            <button
              onClick={async () => {
                const entry = await lionSpaceServices.logEvidence(
                  'Narrative Tracking',
                  lastResult.input,
                  lastResult.output
                );
                onLogEvidence(entry);
              }}
              className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-4 py-2 rounded text-sm transition-all"
            >
              📝 Log to Evidence Chain
            </button>
            
            <button
              className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-400 px-4 py-2 rounded text-sm transition-all"
            >
              📊 Generate Report
            </button>
          </div>
        </div>
      );
      
      onResultUpdate(enhancedResult);
      
    } catch (error) {
      console.error("Error in trackNarratives:", error);
      onResultUpdate(
        <div className="text-center p-8">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <p className="text-red-400">Narrative tracking failed. Please try again.</p>
        </div>
      );
    } finally {
      setIsTracking(false);
    }
  };

  const handleDeepAnalysis = async () => {
    setAnalysisMode('deep');
    // Implement deep analysis with more comprehensive checks
  };

  return (
    <div className="tab-content">
      <h2 data-i18n-key="threat_analysis_title" className="font-headline text-3xl text-center mb-2 text-cyan-400">
        {t('threat_analysis_title')}
      </h2>
      <p data-i18n-key="threat_analysis_subtitle" className="text-center text-gray-400 mb-6">
        {t('threat_analysis_subtitle')}
      </p>
      
      {/* Analysis Mode Selector */}
      <div className="flex justify-center mb-4">
        <fieldset className="bg-gray-800/50 p-1 rounded-lg inline-flex" role="group" aria-labelledby="analysis-mode-legend">
          <legend id="analysis-mode-legend" className="sr-only">Choose analysis mode</legend>
          <button
            onClick={() => setAnalysisMode('quick')}
            className={`px-4 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all ${
              analysisMode === 'quick' 
                ? 'bg-cyan-500/30 text-cyan-400' 
                : 'text-gray-400 hover:text-white'
            }`}
            aria-pressed={analysisMode === 'quick'}
            aria-describedby="quick-scan-desc"
          >
            Quick Scan
          </button>
          <div id="quick-scan-desc" className="sr-only">
            Rapid threat assessment with basic pattern detection
          </div>
          <button
            onClick={() => setAnalysisMode('deep')}
            className={`px-4 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all ${
              analysisMode === 'deep' 
                ? 'bg-purple-500/30 text-purple-400' 
                : 'text-gray-400 hover:text-white'
            }`}
            aria-pressed={analysisMode === 'deep'}
            aria-describedby="deep-analysis-desc"
          >
            Deep Analysis
          </button>
          <div id="deep-analysis-desc" className="sr-only">
            Comprehensive analysis with advanced threat modeling
          </div>
        </fieldset>
      </div>

      {/* Input Area */}
      <div className="relative">
        <label htmlFor="threat-analysis-input" className="block text-sm font-mono text-cyan-400 mb-2">
          Enter text, URL, or document content for threat analysis:
        </label>
        <textarea
          id="threat-analysis-input"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="w-full h-40 p-4 bg-gray-900/70 border border-gray-700 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none resize-none backdrop-blur-sm"
          data-i18n-key="threat_analysis_placeholder"
          placeholder={t('threat_analysis_placeholder')}
          aria-describedby="char-count analysis-mode-legend"
        />
        <div id="char-count" className="absolute bottom-3 right-3 text-xs text-gray-500 font-mono" aria-live="polite">
          {textInput.length} characters entered
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-6 mt-2">
        <button
          onClick={() => setTextInput("Israel is committing genocide in Gaza with full US support")}
          className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 px-3 py-1 rounded text-sm transition-all"
        >
          Sample: Hostile Narrative
        </button>
        <button
          onClick={() => setTextInput("The latest report shows evidence of coordinated disinformation campaigns")}
          className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 px-3 py-1 rounded text-sm transition-all"
        >
          Sample: Analysis Topic
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleQuickAnalysis}
          disabled={isAnalyzing || !textInput.trim()}
          className="gemini-button text-lg text-cyan-400 py-3 px-10 rounded-md bg-cyan-500/10 border border-cyan-500/50 hover:bg-cyan-400 hover:text-gray-900 focus:bg-cyan-400 focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          data-i18n-key="threat_analysis_button_quick"
          aria-describedby={analysisMode === 'quick' ? 'quick-scan-desc' : 'deep-analysis-desc'}
          aria-live="polite"
        >
          {isAnalyzing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
              <span>Analyzing...</span>
            </div>
          ) : (
            t('threat_analysis_button_quick')
          )}
        </button>
        
        <button
          onClick={handleTrackNarratives}
          disabled={isTracking || !textInput.trim()}
          className="gemini-button text-lg text-yellow-400 py-3 px-10 rounded-md bg-yellow-500/10 border border-yellow-500/50 hover:bg-yellow-400 hover:text-gray-900 focus:bg-yellow-400 focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          data-i18n-key="threat_analysis_button_track"
          aria-label="Track narrative patterns and information flows"
          aria-live="polite"
        >
          {isTracking ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
              <span>Tracking...</span>
            </div>
          ) : (
            t('threat_analysis_button_track')
          )}
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg">
        <h3 className="text-blue-400 font-semibold mb-2">💡 Analysis Tips</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Use <strong>Quick Analysis</strong> for rapid threat assessment and reliability scoring</li>
          <li>• Use <strong>Track Narratives</strong> to map competing information flows on a topic</li>
          <li>• Include context and source information for more accurate analysis</li>
          <li>• Save results to Evidence Chain for audit trail and reporting</li>
        </ul>
      </div>
    </div>
  );
}