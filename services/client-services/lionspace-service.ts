import { GeminiService } from './gemini-service';
import { markdownToHtml } from '@/lib/utils/markdown-parser';
import { AnalysisResult, EvidenceLogEntry, ChatMessage } from '@/types/intelligence';

export class LionSpaceServices {
  private geminiService: GeminiService;
  private lastAnalysisResult: AnalysisResult = { input: null, output: null, type: null };
  private evidenceLog: EvidenceLogEntry[] = [];

  constructor(apiKey: string = '') {
    this.geminiService = new GeminiService(apiKey);
  }

  async generateDailyBrief(): Promise<string> {
    const userPrompt = "Generate a daily intelligence brief on the top 3-5 global disinformation narratives of the last 24 hours.";
    const systemPrompt = "You are a senior intelligence analyst. Use Google Search to identify the top 3-5 global disinformation narratives from the past 24 hours. For each narrative, provide a concise summary, identify the key actors spreading it, and suggest 2-3 brief counter-messaging points. Structure the entire response in markdown, starting with a main title '## Daily Intelligence Brief' followed by '###' for each narrative.";
    
    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      tools: [{ "google_search": {} }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };
    
    const result = await this.geminiService.callGemini(payload);
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) throw new Error("Invalid response from Daily Brief service.");
    
    this.lastAnalysisResult = { input: userPrompt, output: text, type: 'Daily Brief' };
    return markdownToHtml(text);
  }

  async quickTextAnalysis(text: string): Promise<string> {
    const systemPrompt = "You are a disinformation analysis AI. Analyze the provided text. Return your analysis as a JSON object with the following schema: {\"reliability_score\": number, \"red_flags\": string[], \"counter_narrative\": string}. The reliability_score is a number between 0 (highly unreliable) and 100 (highly reliable). red_flags is an array of strings, each describing a detected manipulation tactic or logical fallacy. counter_narrative is a concise, factual statement to counter the main point of the text.";
    
    const payload = {
      contents: [{ parts: [{ text: `Analyze this text: "${text}"` }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            "reliability_score": { "type": "NUMBER" },
            "red_flags": { "type": "ARRAY", "items": { "type": "STRING" } },
            "counter_narrative": { "type": "STRING" }
          }
        }
      },
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };
    
    const result = await this.geminiService.callGemini(payload);
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) throw new Error("Invalid response from Text Analysis service.");
    
    this.lastAnalysisResult = { input: text, output: responseText, type: 'Text Analysis' };
    
    try {
      const parsedJson = JSON.parse(responseText);
      return this.renderAnalysisResult(parsedJson);
    } catch(e) {
      console.error("Failed to parse analysis JSON:", e);
      return `<p class="text-red-400">Error rendering analysis. Raw output:</p><pre>${responseText}</pre>`;
    }
  }

  async trackNarratives(topic: string): Promise<string> {
    const systemPrompt = "Act as a senior OSINT analyst. Use Google Search to find the competing narratives about the provided topic. Structure your report with the following markdown headers: '## The Factual Narrative', '## The Primary Disinformation Narrative', and '## Emerging Conspiracy Theories'. Provide a concise summary for each.";
    
    const payload = {
      contents: [{ parts: [{ text: `Find competing narratives for the topic: "${topic}"` }] }],
      tools: [{ "google_search": {} }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };
    
    const result = await this.geminiService.callGemini(payload);
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) throw new Error("Invalid response from Narrative Tracking service.");
    
    this.lastAnalysisResult = { input: topic, output: responseText, type: 'Narrative Tracking' };
    return markdownToHtml(responseText);
  }

  async assessStrategicThreat(topic: string): Promise<string> {
    const userPrompt = `Generate a strategic threat assessment for the following topic: "${topic}"`;
    const systemPrompt = "You are a senior geopolitical intelligence and psychological operations (PSYOP) analyst. Using real-time information from Google Search, generate a comprehensive strategic threat assessment. Structure your report using the following markdown headers: '## Current Situation Summary (SITREP)', '## Key Actors & Intent', '## Primary Narratives & Propaganda Themes', '## Vulnerable Audiences', and '## Recommended Counter-Narrative Angles'.";
    
    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      tools: [{ "google_search": {} }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };
    
    const result = await this.geminiService.callGemini(payload);
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) throw new Error("Invalid response from Strategic Assessment service.");
    
    this.lastAnalysisResult = { input: topic, output: text, type: 'Strategic Assessment' };
    return markdownToHtml(text);
  }

  async mapInfluenceNetwork(target: string, topic: string): Promise<string> {
    const userPrompt = `Map the influence network for target "${target}" regarding the topic "${topic}"`;
    const systemPrompt = "You are an intelligence analyst specializing in network analysis. Use Google Search to identify and map the influence network around the specified target and topic. Structure your report with: '## Network Overview', '## Primary Connections', '## Secondary Actors', '## Information Flow Patterns', and '## Key Amplifiers'. Include estimated audience reach where possible.";
    
    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      tools: [{ "google_search": {} }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };
    
    const result = await this.geminiService.callGemini(payload);
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) throw new Error("Invalid response from Influence Mapper service.");
    
    this.lastAnalysisResult = { input: `${target} - ${topic}`, output: text, type: 'Influence Mapping' };
    return markdownToHtml(text);
  }

  async generateCampaignPlan(target: string): Promise<string> {
    const userPrompt = `Generate a counter-campaign plan targeting the disinformation actor: "${target}"`;
    const systemPrompt = "You are a strategic communications expert. Create a comprehensive counter-campaign plan to neutralize the target's disinformation efforts. Structure your plan with: '## Executive Summary', '## Target Analysis', '## Strategic Objectives', '## Key Messages', '## Tactical Recommendations', '## Metrics for Success'. Focus on ethical, fact-based approaches.";
    
    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };
    
    const result = await this.geminiService.callGemini(payload);
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) throw new Error("Invalid response from Campaign Generator service.");
    
    this.lastAnalysisResult = { input: target, output: text, type: 'Campaign Plan' };
    return markdownToHtml(text);
  }

  async verifyTrustAndAudit(text: string): Promise<string> {
    const systemPrompt = "You are a red team analyst tasked with challenging and verifying intelligence assessments. Critically examine the provided text for potential biases, logical fallacies, unsupported claims, and alternative interpretations. Structure your audit with: '## Reliability Assessment', '## Identified Weaknesses', '## Alternative Interpretations', '## Information Gaps', and '## Confidence Level'. Be rigorous and skeptical.";
    
    const payload = {
      contents: [{ parts: [{ text: `Audit and verify this analysis: "${text}"` }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };
    
    const result = await this.geminiService.callGemini(payload);
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) throw new Error("Invalid response from Trust Verification service.");
    
    this.lastAnalysisResult = { input: text.substring(0, 100) + '...', output: responseText, type: 'Trust Verification' };
    return markdownToHtml(responseText);
  }

  async analyzeVideo(videoUrl: string): Promise<string> {
    const systemPrompt = "You are a video analysis expert. Analyze the video content for propaganda techniques, manipulation tactics, and narrative framing. If you cannot directly access the video, use available information about it. Structure your analysis with: '## Content Summary', '## Detected Techniques', '## Narrative Analysis', '## Credibility Assessment'.";
    
    const payload = {
      contents: [{ parts: [{ text: `Analyze this video for propaganda and manipulation: ${videoUrl}` }] }],
      tools: [{ "google_search": {} }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };
    
    const result = await this.geminiService.callGemini(payload);
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) throw new Error("Invalid response from Video Analysis service.");
    
    this.lastAnalysisResult = { input: videoUrl, output: text, type: 'Video Analysis' };
    return markdownToHtml(text);
  }

  async analyzeAudio(audioBase64: string, mimeType: string): Promise<string> {
    const systemPrompt = "You are an expert intelligence analyst. First, transcribe the provided audio. Then, analyze the transcribed text for propaganda, manipulation tactics, and its core narrative message. Structure your response in markdown with '## Transcription' and '## Analysis' sections.";
    
    const payload = {
      contents: [{
        parts: [
          { text: "Transcribe and analyze this audio file for propaganda." },
          { inlineData: { mimeType: mimeType, data: audioBase64 } }
        ]
      }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };
    
    const result = await this.geminiService.callGemini(payload);
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) throw new Error("Invalid response from Audio Analysis service.");
    
    this.lastAnalysisResult = { input: `Audio file (${mimeType})`, output: text, type: 'Audio Analysis' };
    return markdownToHtml(text);
  }

  async generateImage(prompt: string): Promise<string> {
    const result = await this.geminiService.callImagen(prompt);
    
    if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
      return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
    } else {
      console.error("Imagen API Response Error:", result);
      throw new Error("Invalid response from image generation server.");
    }
  }

  async conversationalQuery(history: ChatMessage[]): Promise<string> {
    const systemPrompt = "You are an expert OSINT assistant. Use Google Search to answer the user's questions based on real-time information. Keep your answers concise and factual. If you use external information, cite your sources.";
    
    const payload = {
      contents: history,
      tools: [{ "google_search": {} }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };
    
    const result = await this.geminiService.callGemini(payload);
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) throw new Error("Invalid response from Conversational Investigation service.");
    
    return markdownToHtml(text);
  }

  async logEvidence(analysisType: string, input: any, output: any): Promise<EvidenceLogEntry> {
    const userPrompt = `Summarize the following intelligence finding for a blockchain audit log. Be extremely concise. Input: "${JSON.stringify(input)}". Finding: "${output}"`;
    const systemPrompt = `You are a log summarization bot. Create a brief, one-sentence summary of the provided intelligence finding.`;
    
    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };
    
    const result = await this.geminiService.callGemini(payload);
    const summary = result.candidates?.[0]?.content?.parts?.[0]?.text || "Summary generation failed.";

    const logData = {
      timestamp: new Date().toISOString(),
      type: analysisType,
      summary: summary.trim(),
      input,
      output
    };

    const hash = await this.geminiService.generateHash(logData);
    
    const newEntry = { ...logData, hash };
    this.evidenceLog.unshift(newEntry);
    return newEntry;
  }

  async scanNewsPulse(topic: string): Promise<string> {
    const userPrompt = `Scan recent news about "${topic}" and provide a summary of the top 3-5 articles from the last 24 hours.`;
    const systemPrompt = "You are a news aggregation AI. Use Google Search to find and summarize the most relevant news articles on the given topic from the past day. For each article, provide the title, source, and a brief summary. Format the response in markdown.";
    
    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      tools: [{ "google_search": {} }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };
    
    const result = await this.geminiService.callGemini(payload);
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) throw new Error("Invalid response from News Pulse service.");
    
    this.lastAnalysisResult = { input: topic, output: text, type: 'News Pulse' };
    return markdownToHtml(text);
  }

  async generateAnalysis(text: string): Promise<string> {
    const systemPrompt = "You are an intelligence analyst. Analyze the provided text for key insights, patterns, and potential threats. Structure your analysis with: '## Summary', '## Key Findings', '## Risk Assessment', and '## Recommendations'.";
    
    const payload = {
      contents: [{ parts: [{ text: `Analyze this content: "${text}"` }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };
    
    const result = await this.geminiService.callGemini(payload);
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) throw new Error("Invalid response from Analysis service.");
    
    this.lastAnalysisResult = { input: text, output: responseText, type: 'General Analysis' };
    return markdownToHtml(responseText);
  }

  private renderAnalysisResult(data: any): string {
    const scoreColor = data.reliability_score < 40 ? 'text-red-400' : 
                      data.reliability_score < 70 ? 'text-yellow-400' : 
                      'text-green-400';
    
    const flagsHtml = data.red_flags.map((flag: string) => `<li>${flag}</li>`).join('');

    return `
      <div class="reliability-score ${scoreColor}">${data.reliability_score}</div>
      <p class="reliability-label">Reliability Score</p>
      <h2>Red Flags Detected</h2>
      <ul>${flagsHtml}</ul>
      <h2>Suggested Counter-Narrative</h2>
      <p>${data.counter_narrative}</p>
    `;
  }

  getLastAnalysisResult(): AnalysisResult {
    return this.lastAnalysisResult;
  }

  getEvidenceLog(): EvidenceLogEntry[] {
    return this.evidenceLog;
  }
}