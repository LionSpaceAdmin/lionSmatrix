"use client";

import { useState } from 'react';
import { callGeminiWithBackoff } from '@/lib/api';

export default function StrategicAssessmentTab() {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAssessThreat = async () => {
    if (!topic) return;
    setIsLoading(true);
    const userPrompt = `Generate a strategic threat assessment for the following topic: "${topic}"`;
    const systemPrompt = "You are a senior geopolitical intelligence and psychological operations (PSYOP) analyst. Using real-time information from Google Search, generate a comprehensive strategic threat assessment. Structure your report using the following markdown headers: '## Current Situation Summary (SITREP)', '## Key Actors & Intent', '## Primary Narratives & Propaganda Themes', '## Vulnerable Audiences', and '## Recommended Counter-Narrative Angles'.";
    const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        tools: [{ "google_search": {} }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
    };
     try {
        const res = await callGeminiWithBackoff(payload);
        const candidate = res.candidates?.[0];
        if (candidate && candidate.content?.parts?.[0]?.text) {
            setResult(candidate.content.parts[0].text);
        } else { throw new Error("Invalid response from server during strategic assessment."); }
    } catch (error) {
        setResult("An error occurred while generating the strategic report. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div id="strategic-assessment-content" className="tab-content">
        <h2 data-i18n-key="strategic_assessment_title" className="font-headline text-3xl text-center mb-2 text-[#B8FFF2]">Strategic Threat Assessment</h2>
        <p data-i18n-key="strategic_assessment_subtitle" className="text-center text-gray-400 mb-6">Enter a high-level topic or operational area to generate a comprehensive intelligence report.</p>
        <input type="text" id="strategic-topic-input" className="w-full p-3 bg-[#0E0E10] border border-gray-700 rounded-md text-white font-body focus:ring-2 focus:ring-[#B8FFF2] focus:outline-none" data-i18n-key="strategic_assessment_placeholder" placeholder="e.g., Russian influence operations in Africa, Iranian propaganda in South America..." value={topic} onChange={(e) => setTopic(e.target.value)} />
        <div className="flex justify-center mt-4">
            <button id="assess-threat-button" className="gemini-button text-lg text-[#B8FFF2] py-3 px-10 rounded-md" data-i18n-key="strategic_assessment_button" onClick={handleAssessThreat} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Threat Report'}
            </button>
        </div>
        <div id="ai-result-container" className="ai-result mt-6 min-h-[150px] text-left p-4 bg-black bg-opacity-20 rounded-md border border-gray-800">
            <p className="text-gray-500">{result}</p>
        </div>
    </div>
  );
}
