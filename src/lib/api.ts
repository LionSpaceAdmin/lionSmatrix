const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export const callGeminiWithBackoff = async (payload: any, attempt = 1, maxAttempts = 5) => {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    try {
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) {
            if (response.status === 429 && attempt < maxAttempts) {
                const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
                await new Promise(res => setTimeout(res, delay));
                return callGeminiWithBackoff(payload, attempt + 1, maxAttempts);
            }
            throw new Error(`Network error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
         if (attempt < maxAttempts) {
            const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
            await new Promise(res => setTimeout(res, delay));
            return callGeminiWithBackoff(payload, attempt + 1, maxAttempts);
        }
        throw error;
    }
};

export const callImagenApi = async (prompt: string, attempt = 1, maxAttempts = 5) => {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
    const payload = { instances: [{ prompt: prompt }], parameters: { "sampleCount": 1 } };
    try {
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
         if (!response.ok) {
            if (response.status === 429 && attempt < maxAttempts) {
                const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
                await new Promise(res => setTimeout(res, delay));
                return callImagenApi(prompt, attempt + 1, maxAttempts);
            }
            throw new Error(`Network error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        if (attempt < maxAttempts) {
            const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
            await new Promise(res => setTimeout(res, delay));
            return callImagenApi(prompt, attempt + 1, maxAttempts);
        }
        throw error;
    }
};
