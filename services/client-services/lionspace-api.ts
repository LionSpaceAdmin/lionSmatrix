import { GeminiService } from './gemini-service';
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
    return this.markdownToHtml(text);
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

  private markdownToHtml(md: string): string {
    // Escape HTML tags
    let html = md.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Convert headers
    html = html.replace(/### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/## (.*$)/gim, '<h2>$1</h2>');
    
    // Convert bold text
    html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
    
    // Convert lists
    const lines = html.split('\n');
    let inList = false;
    const newLines = lines.map(line => {
      if (line.startsWith('* ')) {
        if (!inList) {
          inList = true;
          return '<ul><li>' + line.substring(2) + '</li>';
        }
        return '<li>' + line.substring(2) + '</li>';
      } else {
        if (inList) {
          inList = false;
          return '</ul>' + line;
        }
        return line;
      }
    });
    
    if (inList) newLines.push('</ul>');
    
    html = newLines.join('');
    html = html.replace(/\n/g, '<br>');
    
    return html;
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
