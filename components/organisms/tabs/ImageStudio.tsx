'use client';

import { useState, useRef } from 'react';
import { useI18n } from '@/lib/hooks/use-i18n';
import { LionSpaceServices } from '@/services/client-services/lionspace-service';
import { Image, Download, Trash2, Palette, Sparkles, AlertTriangle } from 'lucide-react';

interface ImageStudioProps {
  lionSpaceServices: LionSpaceServices;
}

export function ImageStudio({ lionSpaceServices }: ImageStudioProps) {
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageHistory, setImageHistory] = useState<Array<{url: string, prompt: string, timestamp: Date}>>([]);
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const samplePrompts = [
    "Counter-disinformation infographic with clean design and factual data",
    "Educational poster about media literacy and critical thinking",
    "Social media banner promoting fact-checking and verification",
    "Cybersecurity awareness graphic with terminal aesthetic",
    "Information warfare defense diagram with network visualization",
    "Truth vs misinformation comparison chart"
  ];

  const handleGenerateImage = async () => {
    if (!promptInput.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // Add ethical guidelines to prompt
      const ethicalPrompt = `${promptInput} (educational, factual, professional, appropriate for counter-disinformation work)`;
      const imageUrl = await lionSpaceServices.generateImage(ethicalPrompt);
      
      setGeneratedImage(imageUrl);
      
      // Add to history
      setImageHistory(prev => [{
        url: imageUrl,
        prompt: promptInput,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]); // Keep last 10 images
      
    } catch (error) {
      console.error("Error generating image:", error);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async (imageUrl: string, filename?: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `lionspace-generated-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const clearImage = () => {
    setGeneratedImage(null);
    setError(null);
  };

  const useSamplePrompt = (prompt: string) => {
    setPromptInput(prompt);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-cyan-400 font-mono mb-2 flex items-center justify-center gap-3">
          <Palette className="w-8 h-8" />
          {t('Image Studio') || 'Image Studio'}
        </h2>
        <p className="text-gray-400">
          {t('Generate educational and counter-disinformation visuals') || 'Generate educational and counter-disinformation visuals'}
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-gray-800/30 border border-gray-600/50 rounded-lg p-6">
        <label className="block text-white font-semibold mb-3">
          Image Prompt
        </label>
        <textarea
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          className="w-full h-32 p-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none resize-none"
          placeholder={t('Describe the image you want to generate...') || 'Describe the image you want to generate...'}
        />
        
        {/* Sample Prompts */}
        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-3">Sample prompts:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => useSamplePrompt(prompt)}
                className="text-left p-2 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30 rounded text-sm text-gray-300 hover:text-white transition-colors"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerateImage}
          disabled={isGenerating || !promptInput.trim()}
          className="flex items-center gap-3 py-4 px-8 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/50 rounded-lg text-cyan-400 hover:from-cyan-600/30 hover:to-blue-600/30 hover:border-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono text-lg"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              Generating Visual...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Image
            </>
          )}
        </button>
      </div>

      {/* Result Section */}
      <div className="bg-gray-800/20 border border-gray-600/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Image className="w-5 h-5" />
            Generated Image
          </h3>
          {generatedImage && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadImage(generatedImage)}
                className="flex items-center gap-2 px-3 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded hover:bg-green-600/30 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={clearImage}
                className="flex items-center gap-2 px-3 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded hover:bg-red-600/30 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
          )}
        </div>

        <div className="min-h-[400px] bg-gray-900/50 rounded-lg border border-gray-700 flex items-center justify-center">
          {isGenerating ? (
            <div className="text-center p-8">
              <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg text-cyan-400 font-mono animate-pulse">GENERATING VISUAL...</p>
              <p className="text-sm text-gray-400 mt-2">This may take a few moments...</p>
            </div>
          ) : error ? (
            <div className="text-center p-8">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 font-semibold mb-2">Generation Failed</p>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          ) : generatedImage ? (
            <div className="w-full">
              <img 
                src={generatedImage} 
                alt="Generated" 
                className="max-w-full max-h-[500px] object-contain rounded mx-auto" 
              />
              <div className="mt-4 text-center text-sm text-gray-400">
                Generated from: "{promptInput}"
              </div>
            </div>
          ) : (
            <div className="text-center p-8">
              <Image className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No image generated yet</p>
              <p className="text-gray-600 text-sm">Enter a prompt and click generate to create an image</p>
            </div>
          )}
        </div>
      </div>

      {/* Image History */}
      {imageHistory.length > 0 && (
        <div className="bg-gray-800/20 border border-gray-600/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Generations</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {imageHistory.map((item, idx) => (
              <div
                key={idx}
                className="group relative bg-gray-900/50 rounded border border-gray-700 overflow-hidden cursor-pointer hover:border-green-500/50 transition-colors"
                onClick={() => setGeneratedImage(item.url)}
              >
                <img
                  src={item.url}
                  alt="Previous generation"
                  className="w-full h-24 object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadImage(item.url, `lionspace-${item.timestamp.getTime()}.png`);
                    }}
                    className="p-2 bg-green-600/80 text-white rounded-full hover:bg-green-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-xs text-gray-300 p-1 truncate">
                  {item.prompt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ethical Notice */}
      <div className="text-xs text-gray-500 bg-gray-800/20 border border-gray-700 rounded p-3">
        <p className="font-semibold text-yellow-400 mb-1">⚠️ Ethical Use Guidelines</p>
        <p>Generated images should be used for educational, factual, and defensive purposes only. Avoid creating misleading, harmful, or inappropriate content.</p>
      </div>
    </div>
  );
}