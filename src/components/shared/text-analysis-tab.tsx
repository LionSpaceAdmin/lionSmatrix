"use client";

import { useState } from 'react';
import { callGeminiWithBackoff } from '@/lib/api';

export default function TextAnalysisTab() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickAnalysis = async () => {
    if (!text) return;
    setIsLoading(true);
    const systemPrompt = "You are a psychological warfare analyst. Analyze the provided text for manipulation tactics. Provide a concise, one-paragraph summary of your findings and list the primary propaganda techniques used.";
    const payload = { contents: [{ parts: [{ text }] }], systemInstruction: { parts: [{ text: systemPrompt }] }, };
    try {
        const res = await callGeminiWithBackoff(payload);
        const candidate = res.candidates?.[0];
        if (candidate && candidate.content?.parts?.[0]?.text) {
            setResult(candidate.content.parts[0].text);
        } else { throw new Error("Invalid response from server."); }
    } catch (error) {
        setResult("An error occurred. Please try again later.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleTrackNarratives = async () => {
    if (!text) return;
    setIsLoading(true);
    const systemPrompt = "Act as a senior OSINT analyst. Use Google Search to find the competing narratives about the provided topic. Structure your report with the following markdown headers: '## The Factual Narrative', '## The Primary Disinformation Narrative', and '## Emerging Conspiracy Theories'. Provide a concise summary for each.";
    const payload = { contents: [{ parts: [{ text: `Find competing narratives for the topic: "${text}"` }] }], tools: [{ "google_search": {} }], systemInstruction: { parts: [{ text: systemPrompt }] }, };
    try {
        const res = await callGeminiWithBackoff(payload);
        const candidate = res.candidates?.[0];
         if (candidate && candidate.content?.parts?.[0]?.text) {
            setResult(candidate.content.parts[0].text);
        } else { throw new Error("Invalid response from server."); }
    } catch (error) {
        setResult("An error occurred while tracking narratives. Please try again later.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div id="text-analysis-content" className="tab-content">
        <h2 data-i18n-key="threat_analysis_title" className="font-headline text-3xl text-center mb-2 text-[#B8FFF2]">Threat Analysis & Narrative Tracking</h2>
        <p data-i18n-key="threat_analysis_subtitle" className="text-center text-gray-400 mb-6">Paste a topic or suspicious text. Get a quick analysis or a full real-time narrative report.</p>
        <textarea id="text-input" className="w-full h-32 p-3 bg-[#0E0E10] border border-gray-700 rounded-md text-white font-body focus:ring-2 focus:ring-[#B8FFF2] focus:outline-none" data-i18n-key="threat_analysis_placeholder" placeholder="Paste text or topic here..." value={text} onChange={(e) => setText(e.target.value)}></textarea>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center">
            <button id="analyze-button" className="gemini-button text-lg text-[#B8FFF2] py-3 px-10 rounded-md" data-i18n-key="threat_analysis_button_quick" onClick={handleQuickAnalysis} disabled={isLoading}>
                {isLoading ? 'Analyzing...' : 'Quick Analysis'}
            </button>
            <button id="narrative-button" className="gemini-button text-lg text-[#B8FFF2] py-3 px-10 rounded-md" data-i18n-key="threat_analysis_button_track" onClick={handleTrackNarratives} disabled={isLoading}>
                {isLoading ? 'Tracking...' : 'Track Competing Narratives'}
            </button>
        </div>
        <div id="ai-result-container" className="ai-result mt-6 min-h-[150px] text-left p-4 bg-black bg-opacity-20 rounded-md border border-gray-800">
            <p className="text-gray-500">{result}</p>
        </div>
    </div>
  );
}
