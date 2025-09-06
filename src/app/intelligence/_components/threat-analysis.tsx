'use client';

import { useState } from 'react';
import { useTranslation } from '@/contexts/translation-context';
import { analyzeText, trackNarratives } from '@/lib/api/gemini';

export function ThreatAnalysis() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuickAnalysis = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    try {
      const response = await analyzeText(input);
      setResult(response.text || response.error || 'Analysis failed');
    } catch (_error) {
      setResult('Error performing analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackNarratives = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    try {
      const response = await trackNarratives(input);
      setResult(response.text || response.error || 'Analysis failed');
    } catch (_error) {
      setResult('Error tracking narratives');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/50 border border-green-400/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-green-400 mb-4 font-mono">
          {t('intelligence.threat_analysis_title')}
        </h2>
        <p className="text-gray-400 mb-6">
          {t('intelligence.threat_analysis_subtitle')}
        </p>
        
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 p-3 bg-black border border-green-400/30 rounded-md text-white focus:ring-2 focus:ring-green-400 focus:outline-none resize-none"
          placeholder={t('intelligence.threat_analysis_placeholder')}
        />
        
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleQuickAnalysis}
            disabled={loading}
            className="px-6 py-3 bg-green-400/20 border border-green-400 text-green-400 rounded-md hover:bg-green-400/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('intelligence.threat_analysis_button_quick')}
          </button>
          <button
            onClick={handleTrackNarratives}
            disabled={loading}
            className="px-6 py-3 bg-green-400/20 border border-green-400 text-green-400 rounded-md hover:bg-green-400/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('intelligence.threat_analysis_button_track')}
          </button>
        </div>
      </div>

      {(result || loading) && (
        <div className="bg-black/50 border border-green-400/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-400 mb-4 font-mono">
            Analysis Results
          </h3>
          {loading ? (
            <p className="text-amber-400 animate-pulse">{t('intelligence.loading_text')}</p>
          ) : (
            <div 
              className="text-gray-300 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: result.replace(/##\s*(.*$)/gim, '<h3 class="text-green-400 font-bold mt-4 mb-2">$1</h3>').replace(/\n/g, '<br>') }}
            />
          )}
        </div>
      )}
    </div>
  );
}