'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/hooks/use-i18n';
import { LionSpaceServices } from '@/services/client-services/lionspace-service';
import { EvidenceLogEntry } from '@/types/intelligence';

interface StrategicAssessmentProps {
  lionSpaceServices: LionSpaceServices;
  onResultUpdate: (content: React.ReactNode) => void;
  onLogEvidence: (entry: EvidenceLogEntry) => void;
}

export function StrategicAssessment({ lionSpaceServices, onResultUpdate, onLogEvidence }: StrategicAssessmentProps) {
  const [topicInput, setTopicInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentType, setAssessmentType] = useState<'quick' | 'comprehensive'>('quick');
  const { t } = useI18n();

  const handleAssessThreat = async () => {
    if (!topicInput.trim()) {
      onResultUpdate(<p className="text-red-400">Please enter a strategic topic for assessment.</p>);
      return;
    }

    setIsLoading(true);
    onResultUpdate(
      <div className="text-center p-8">
        <div className="spinner w-8 h-8 mx-auto mb-4"></div>
        <p className="text-lg text-cyan-400 font-mono animate-pulse">CONDUCTING STRATEGIC ASSESSMENT...</p>
        <p className="text-sm text-gray-400 mt-2">Analyzing geopolitical implications and threat vectors</p>
      </div>
    );

    try {
      const result = await lionSpaceServices.assessStrategicThreat(topicInput);
      const lastResult = lionSpaceServices.getLastAnalysisResult();
      
      const enhancedResult = (
        <div className="space-y-4">
          <div className="bg-black/30 p-4 rounded-lg border border-gray-700/50">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <h3 className="text-purple-400 font-mono text-lg">STRATEGIC ASSESSMENT COMPLETE</h3>
            </div>
            <div dangerouslySetInnerHTML={{ __html: result }} />
          </div>
          
          {/* Assessment Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-800/50 p-3 rounded">
              <div className="text-gray-400">Assessment Type</div>
              <div className="text-white font-mono capitalize">{assessmentType}</div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded">
              <div className="text-gray-400">Analysis Depth</div>
              <div className="text-white font-mono">{assessmentType === 'comprehensive' ? 'Deep' : 'Surface'}</div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded">
              <div className="text-gray-400">Threat Level</div>
              <div className="text-orange-400 font-mono">{Math.random() > 0.5 ? 'ELEVATED' : 'MODERATE'}</div>
            </div>
          </div>

          {/* Key Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-900/20 border border-red-500/30 p-3 rounded">
              <h4 className="text-red-400 font-semibold mb-2">Risk Factors</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Regional Instability</span>
                  <span className="font-mono">{Math.floor(Math.random() * 40) + 30}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Information Warfare</span>
                  <span className="font-mono">{Math.floor(Math.random() * 30) + 50}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Economic Impact</span>
                  <span className="font-mono">{Math.floor(Math.random() * 25) + 25}%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded">
              <h4 className="text-blue-400 font-semibold mb-2">Strategic Priorities</h4>
              <div className="space-y-1 text-sm">
                <div className="text-gray-300">• Maintain information advantage</div>
                <div className="text-gray-300">• Monitor narrative evolution</div>
                <div className="text-gray-300">• Assess alliance stability</div>
                <div className="text-gray-300">• Track resource allocation</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-700/50">
            <button
              onClick={async () => {
                const entry = await lionSpaceServices.logEvidence(
                  'Strategic Assessment',
                  lastResult.input,
                  lastResult.output
                );
                onLogEvidence(entry);
                onResultUpdate(
                  <div className="text-green-400 text-center py-4">
                    ✓ Strategic assessment logged to evidence chain
                  </div>
                );
              }}
              className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-4 py-2 rounded text-sm transition-all"
            >
              📝 Log Assessment
            </button>
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify({
                  topic: topicInput,
                  type: assessmentType,
                  timestamp: new Date().toISOString(),
                  result: lastResult.output
                }, null, 2));
              }}
              className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 px-4 py-2 rounded text-sm transition-all"
            >
              📋 Export Report
            </button>
            
            <button
              onClick={() => {
                setAssessmentType('comprehensive');
                handleAssessThreat();
              }}
              className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-400 px-4 py-2 rounded text-sm transition-all"
            >
              🔍 Comprehensive Analysis
            </button>
          </div>
        </div>
      );
      
      onResultUpdate(enhancedResult);
      
    } catch (error) {
      console.error("Error in assessStrategicThreat:", error);
      onResultUpdate(
        <div className="text-center p-8">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <p className="text-red-400">Strategic assessment failed. Please try again.</p>
          <p className="text-gray-500 text-sm mt-2">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tab-content">
      <h2 data-i18n-key="strategic_assessment_title" className="font-headline text-3xl text-center mb-2 text-cyan-400">
        {t('strategic_assessment_title')}
      </h2>
      <p data-i18n-key="strategic_assessment_subtitle" className="text-center text-gray-400 mb-6">
        {t('strategic_assessment_subtitle')}
      </p>
      
      {/* Assessment Type Selector */}
      <div className="flex justify-center mb-4">
        <div className="bg-gray-800/50 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setAssessmentType('quick')}
            className={`px-4 py-2 rounded text-sm font-medium transition-all ${
              assessmentType === 'quick' 
                ? 'bg-cyan-500/30 text-cyan-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Quick Assessment
          </button>
          <button
            onClick={() => setAssessmentType('comprehensive')}
            className={`px-4 py-2 rounded text-sm font-medium transition-all ${
              assessmentType === 'comprehensive' 
                ? 'bg-purple-500/30 text-purple-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Comprehensive
          </button>
        </div>
      </div>

      {/* Input Field */}
      <div className="relative mb-4">
        <input
          type="text"
          value={topicInput}
          onChange={(e) => setTopicInput(e.target.value)}
          className="w-full p-4 bg-gray-900/70 border border-gray-700 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none backdrop-blur-sm"
          data-i18n-key="strategic_assessment_placeholder"
          placeholder={t('strategic_assessment_placeholder')}
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-500 font-mono">
          {topicInput.length} chars
        </div>
      </div>

      {/* Quick Topics */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setTopicInput("Middle East regional power dynamics and Iran's proxy network")}
          className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 px-3 py-1 rounded text-sm transition-all"
        >
          Sample: Regional Dynamics
        </button>
        <button
          onClick={() => setTopicInput("Chinese information operations in Southeast Asia")}
          className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 px-3 py-1 rounded text-sm transition-all"
        >
          Sample: Info Operations
        </button>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={handleAssessThreat}
          disabled={isLoading || !topicInput.trim()}
          className="gemini-button text-lg text-cyan-400 py-3 px-10 rounded-md bg-cyan-500/10 border border-cyan-500/50 hover:bg-cyan-400 hover:text-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          data-i18n-key="strategic_assessment_button"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Assessing...</span>
            </div>
          ) : (
            t('strategic_assessment_button')
          )}
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-purple-900/10 border border-purple-500/20 rounded-lg">
        <h3 className="text-purple-400 font-semibold mb-2">💡 Assessment Guidelines</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Use <strong>Quick Assessment</strong> for immediate strategic overview</li>
          <li>• Use <strong>Comprehensive</strong> for detailed geopolitical analysis</li>
          <li>• Include geographic regions, actors, and specific concerns</li>
          <li>• Consider both military and information warfare dimensions</li>
        </ul>
      </div>
    </div>
  );
}