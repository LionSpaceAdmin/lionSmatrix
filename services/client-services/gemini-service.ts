// Gemini API Service with retry logic
export class GeminiService {
  private apiKey: string;

  constructor(apiKey: string = '') {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  }

  async callGemini(payload: any, attempt: number = 1, maxAttempts: number = 5): Promise<any> {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${this.apiKey}`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 429 && attempt < maxAttempts) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          await new Promise(res => setTimeout(res, delay));
          return this.callGemini(payload, attempt + 1, maxAttempts);
        }
        throw new Error(`Network error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (attempt < maxAttempts) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        await new Promise(res => setTimeout(res, delay));
        return this.callGemini(payload, attempt + 1, maxAttempts);
      }
      throw error;
    }
  }

  async callImagen(prompt: string, attempt: number = 1, maxAttempts: number = 5): Promise<any> {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${this.apiKey}`;
    const payload = {
      instances: [{ prompt }],
      parameters: { sampleCount: 1 }
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 429 && attempt < maxAttempts) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          await new Promise(res => setTimeout(res, delay));
          return this.callImagen(prompt, attempt + 1, maxAttempts);
        }
        throw new Error(`Network error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (attempt < maxAttempts) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        await new Promise(res => setTimeout(res, delay));
        return this.callImagen(prompt, attempt + 1, maxAttempts);
      }
      throw error;
    }
  }

  async generateHash(data: any): Promise<string> {
    const msgUint8 = new TextEncoder().encode(JSON.stringify(data));
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
}
