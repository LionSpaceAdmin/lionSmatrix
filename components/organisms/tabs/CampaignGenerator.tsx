'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/hooks/use-i18n';
import { mergedOsintActors } from '@/lib/data/intelligence-merged';
import { LionSpaceServices } from '@/services/client-services/lionspace-service';

interface CampaignGeneratorProps {
  lionSpaceServices: LionSpaceServices;
  onResultUpdate: (content: React.ReactNode) => void;
}

export function CampaignGenerator({ lionSpaceServices, onResultUpdate }: CampaignGeneratorProps) {
  const [selectedTarget, setSelectedTarget] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useI18n();

  // Convert object to array for dropdown
  const actorsArray = Object.values(mergedOsintActors);

  const handleGenerateCampaign = async () => {
    if (!selectedTarget) {
      onResultUpdate(<p className="text-red-400">Please select a target.</p>);
      return;
    }

    setIsGenerating(true);
    onResultUpdate(
      <div className="text-center p-8">
        <p className="text-lg text-cyan-400 font-mono animate-pulse">GENERATING CAMPAIGN...</p>
      </div>
    );

    try {
      // Use LionSpace services for campaign generation
      const selectedActor = actorsArray.find(actor => actor.Name === selectedTarget);
      const prompt = `Generate a counter-disinformation campaign strategy targeting "${selectedTarget}" who operates on ${selectedActor?.Platform} with ${selectedActor?.Audience} followers. Their narrative is: ${selectedActor?.Narrative}. Their affiliation: ${selectedActor?.Affiliation}. Focus on ethical counter-messaging and fact-based responses.`;
      
      const result = await lionSpaceServices.generateCampaignPlan(selectedTarget);
      
      onResultUpdate(
        <div className="campaign-plan space-y-6 text-white">
          <div className="bg-gray-800/30 border border-green-500/30 rounded-lg p-4">
            <h2 className="text-xl font-bold text-green-400 mb-2">Strategic Campaign Plan</h2>
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">Target: {selectedTarget}</h3>
            <div className="text-sm text-gray-400 mb-4">
              Platform: {selectedActor?.Platform} | Audience: {selectedActor?.Audience?.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-gray-800/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">AI-Generated Strategy</h3>
            <div className="prose prose-invert text-gray-300 whitespace-pre-wrap">
              {typeof result === 'string' ? result : result}
            </div>
          </div>
          
          <div className="bg-gray-800/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Ethical Guidelines</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Focus on factual counter-narratives</li>
              <li>Avoid personal attacks or harassment</li>
              <li>Promote media literacy and critical thinking</li>
              <li>Build community resilience against manipulation</li>
              <li>Respect platform terms of service</li>
            </ul>
          </div>
          
          <div className="bg-gray-800/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-400 mb-3">Recommended Tactics</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Social media rapid response with verified information</li>
              <li>Influencer engagement for authentic voices</li>
              <li>Educational content creation and distribution</li>
              <li>Community organizing and grassroots engagement</li>
              <li>Partnership with fact-checking organizations</li>
            </ul>
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error generating campaign:", error);
      onResultUpdate(
        <div className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="font-semibold">Error generating campaign plan</p>
          <p className="text-sm mt-1">Please try again or check your connection.</p>
        </div>
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-cyan-400 font-mono mb-2">
          {t('Campaign Generator') || 'Campaign Generator'}
        </h2>
        <p className="text-gray-400">
          {t('Generate ethical counter-disinformation campaigns') || 'Generate ethical counter-disinformation campaigns'}
        </p>
      </div>
      
      <div className="bg-gray-800/30 border border-gray-600/50 rounded-lg p-6">
        <label className="block text-white font-semibold mb-3">
          Select Target Actor
        </label>
        <select
          value={selectedTarget}
          onChange={(e) => setSelectedTarget(e.target.value)}
          className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
        >
          <option value="">
            {t('Select a target actor') || 'Select a target actor'}
          </option>
          {actorsArray.map((actor, index) => (
            <option key={index} value={actor.Name}>
              {actor.Name} - {actor.Platform} ({actor.Audience?.toLocaleString()} followers)
            </option>
          ))}
        </select>
        
        {selectedTarget && (
          <div className="mt-4 p-3 bg-gray-700/30 rounded border border-gray-600">
            {(() => {
              const actor = actorsArray.find(a => a.Name === selectedTarget);
              return actor ? (
                <div className="text-sm space-y-1">
                  <p><span className="text-gray-400">Narrative:</span> <span className="text-gray-300">{actor.Narrative}</span></p>
                  <p><span className="text-gray-400">Affiliation:</span> <span className="text-gray-300">{actor.Affiliation}</span></p>
                  <p><span className="text-gray-400">Risk Level:</span> <span className={`font-semibold ${
                    actor.risk === 'CRITICAL' ? 'text-red-400' :
                    actor.risk === 'HIGH' ? 'text-orange-400' :
                    actor.risk === 'MEDIUM' ? 'text-yellow-400' : 'text-blue-400'
                  }`}>{actor.risk}</span></p>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>
      
      <button
        onClick={handleGenerateCampaign}
        disabled={isGenerating || !selectedTarget}
        className="w-full py-3 px-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/50 rounded-lg text-cyan-400 hover:from-cyan-600/30 hover:to-blue-600/30 hover:border-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono text-lg"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            Generating Campaign...
          </span>
        ) : (
          t('Generate Campaign Strategy') || 'Generate Campaign Strategy'
        )}
      </button>
      
      <div className="text-xs text-gray-500 bg-gray-800/20 border border-gray-700 rounded p-3">
        <p className="font-semibold text-yellow-400 mb-1">⚠️ Ethical Use Notice</p>
        <p>This tool is designed for defensive counter-disinformation efforts only. Generated campaigns should focus on factual information, media literacy, and ethical engagement practices.</p>
      </div>
    </div>
  );
}