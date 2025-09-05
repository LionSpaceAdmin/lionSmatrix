'use client';

import { useState } from 'react';
import { useTranslation } from '@/contexts/translation-context';
// import { osintActors } from '@/lib/data/osint-actors';
// import { generateCampaign } from '@/lib/api/gemini';

// Placeholder data for now
const osintActors = [
  { id: '1', name: 'Target Alpha', type: 'State Actor' },
  { id: '2', name: 'Target Beta', type: 'Hacktivist Group' },
  { id: '3', name: 'Target Gamma', type: 'Criminal Network' },
];

const generateCampaign = async (target: string) => {
  // Placeholder implementation
  return { text: `Generated campaign plan for ${target}` };
};

export function CampaignGenerator() {
  const { t } = useTranslation();
  const [selectedTarget, setSelectedTarget] = useState('');
  const [campaignPlan, setCampaignPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateCampaign = async () => {
    if (!selectedTarget) return;
    
    setLoading(true);
    try {
      const response = await generateCampaign(selectedTarget);
      setCampaignPlan(response.text || 'Failed to generate campaign');
    } catch (error) {
      setCampaignPlan('Error generating campaign plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/50 border border-green-400/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-green-400 mb-4 font-mono">
          {t('intelligence.campaign_generator_title')}
        </h2>
        <p className="text-gray-400 mb-6">
          {t('intelligence.campaign_generator_subtitle')}
        </p>

        <select
          value={selectedTarget}
          onChange={(e) => setSelectedTarget(e.target.value)}
          className="w-full p-3 mb-4 bg-black border border-green-400/30 rounded-md text-white focus:ring-2 focus:ring-green-400 focus:outline-none"
        >
          <option value="">{t('intelligence.campaign_generator_select_target')}</option>
          {osintActors.map((actor) => (
            <option key={actor.name} value={actor.name}>
              {actor.name} - {actor.platform} ({actor.audience.toLocaleString()} followers)
            </option>
          ))}
        </select>

        <button
          onClick={handleGenerateCampaign}
          disabled={!selectedTarget || loading}
          className="w-full px-6 py-3 bg-green-400/20 border border-green-400 text-green-400 rounded-md hover:bg-green-400/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('intelligence.campaign_generator_button')}
        </button>
      </div>

      {(campaignPlan || loading) && (
        <div className="bg-black/50 border border-green-400/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-400 mb-4 font-mono">
            Campaign Plan: {selectedTarget}
          </h3>
          {loading ? (
            <p className="text-amber-400 animate-pulse">{t('intelligence.loading_text')}</p>
          ) : (
            <div 
              className="text-gray-300 whitespace-pre-wrap campaign-plan"
              dangerouslySetInnerHTML={{ 
                __html: campaignPlan
                  .replace(/##\s*(.*$)/gim, '<h3 class="text-green-400 font-bold mt-4 mb-2">$1</h3>')
                  .replace(/###\s*(.*$)/gim, '<h4 class="text-green-400/80 font-semibold mt-3 mb-1">$1</h4>')
                  .replace(/^\d+\.\s*(.*$)/gim, '<p class="ml-4 mb-2">• $1</p>')
                  .replace(/\n/g, '<br>') 
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}