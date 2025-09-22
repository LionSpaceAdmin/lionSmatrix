"use client";

import { useState } from 'react';
import { callImagenApi } from '@/lib/api';

export default function ImageStudioTab() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateImage = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
        const res = await callImagenApi(prompt);
        if (res.predictions && res.predictions.length > 0 && res.predictions[0].bytesBase64Encoded) {
            const imageUrl = `data:image/png;base64,${res.predictions[0].bytesBase64Encoded}`;
            setResult(`<img src="${imageUrl}" alt="Generated image based on prompt: ${prompt}" className="max-w-full max-h-full object-contain rounded-md">`);
        } else {
            throw new Error("Invalid response from image generation server.");
        }
    } catch (error) {
        setResult("An error occurred while generating the image. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div id="image-studio-content" className="tab-content">
        <h2 data-i18n-key="image_studio_title" className="font-headline text-3xl text-center mb-2 text-[#B8FFF2]">ImageGen Studio</h2>
        <p data-i18n-key="image_studio_subtitle" className="text-center text-gray-400 mb-6">Create compelling visuals for your counter-narrative campaigns. Use prompts from the Campaign Generator or write your own.</p>
        <textarea id="image-prompt-input" className="w-full h-24 p-3 bg-[#0E0E10] border border-gray-700 rounded-md text-white font-body focus:ring-2 focus:ring-[#B8FFF2] focus:outline-none" data-i18n-key="image_studio_placeholder" placeholder="Enter a detailed visual prompt... e.g., 'A stark black and white photo of a single lit candle in the darkness, representing hope against disinformation.'" value={prompt} onChange={(e) => setPrompt(e.target.value)}></textarea>
        <div className="flex justify-center mt-4">
            <button id="generate-image-button" className="gemini-button text-lg text-[#B8FFF2] py-3 px-10 rounded-md" data-i18n-key="image_studio_button" onClick={handleGenerateImage} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Image'}
            </button>
        </div>
        <div id="image-result-container" className="mt-6 min-h-[300px] text-left p-4 bg-black bg-opacity-20 rounded-md border border-gray-800 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: result || '<p data-i18n-key="image_studio_results_placeholder" className="text-gray-500">Generated image will appear here...</p>' }}>
        </div>
    </div>
  );
}
