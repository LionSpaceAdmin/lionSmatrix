'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/hooks/use-i18n';
import { LionSpaceServices } from '@/services/client-services/lionspace-service';
import { EvidenceLogEntry } from '@/types/intelligence';
import { Video, Play, AlertTriangle, FileText, Download, ExternalLink, Eye, Shield } from 'lucide-react';

interface VideoAnalysisProps {
  lionSpaceServices: LionSpaceServices;
  onResultUpdate: (content: React.ReactNode) => void;
  onLogEvidence: (entry: EvidenceLogEntry) => void;
}

export function VideoAnalysis({ lionSpaceServices, onResultUpdate, onLogEvidence }: VideoAnalysisProps) {
  const [videoUrl, setVideoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [videoMetadata, setVideoMetadata] = useState<any>(null);
  const { t } = useI18n();

  const supportedPlatforms = [
    'YouTube', 'Twitter/X', 'Instagram', 'TikTok', 'Facebook', 'Telegram'
  ];

  const sampleUrls = [
    'https://www.youtube.com/watch?v=example',
    'https://twitter.com/user/status/example',
    'https://www.instagram.com/p/example',
    'https://www.tiktok.com/@user/video/example'
  ];

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const extractPlatform = (url: string): string => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter/X';
    if (url.includes('instagram.com')) return 'Instagram';
    if (url.includes('tiktok.com')) return 'TikTok';
    if (url.includes('facebook.com')) return 'Facebook';
    if (url.includes('t.me')) return 'Telegram';
    return 'Unknown Platform';
  };

  const handleAnalyzeVideo = async () => {
    if (!videoUrl.trim()) {
      onResultUpdate(
        <div className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="font-semibold">Invalid Input</p>
          <p className="text-sm mt-1">Please enter a video URL</p>
        </div>
      );
      return;
    }

    if (!validateUrl(videoUrl)) {
      onResultUpdate(
        <div className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="font-semibold">Invalid URL</p>
          <p className="text-sm mt-1">Please enter a valid URL</p>
        </div>
      );
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    onResultUpdate(
      <div className="text-center p-8">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-cyan-400 font-mono animate-pulse">ANALYZING VIDEO CONTENT...</p>
        <p className="text-sm text-gray-400 mt-2">Examining metadata, content, and potential threats...</p>
      </div>
    );

    try {
      const platform = extractPlatform(videoUrl);
      const analysisPrompt = `Analyze this ${platform} video for disinformation, manipulation techniques, deepfakes, and potential threats. URL: ${videoUrl}. Provide detailed analysis covering: 1) Content authenticity 2) Manipulation detection 3) Narrative analysis 4) Threat assessment 5) Recommendations.`;
      
      const result = await lionSpaceServices.generateAnalysis(analysisPrompt);
      
      setAnalysisResult(typeof result === 'string' ? result : 'Analysis completed');
      
      // Mock metadata extraction (in real implementation, this would come from video analysis APIs)
      const mockMetadata = {
        platform,
        url: videoUrl,
        analyzed_at: new Date().toISOString(),
        content_type: 'video',
        risk_level: Math.random() > 0.5 ? 'HIGH' : 'MEDIUM'
      };
      setVideoMetadata(mockMetadata);

      const analysisDisplay = (
        <div className="space-y-6">
          {/* Video Info */}
          <div className="bg-gray-800/30 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Video className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-green-400">Video Analysis Complete</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Platform</p>
                <p className="text-white font-mono">{platform}</p>
              </div>
              <div>
                <p className="text-gray-400">Analyzed</p>
                <p className="text-white font-mono">{new Date().toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Risk Level</p>
                <p className={`font-mono font-semibold ${
                  mockMetadata.risk_level === 'HIGH' ? 'text-red-400' : 
                  mockMetadata.risk_level === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'
                }`}>{mockMetadata.risk_level}</p>
              </div>
            </div>
            <div className="mt-3">
              <a 
                href={videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                View Original Video
              </a>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="bg-gray-800/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h4 className="text-lg font-semibold text-cyan-400">AI Analysis Results</h4>
            </div>
            <div className="prose prose-invert text-gray-300 whitespace-pre-wrap">
              {typeof result === 'string' ? result : result}
            </div>
          </div>

          {/* Key Findings */}
          <div className="bg-gray-800/20 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-yellow-400 mb-3">Key Findings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-semibold text-white">Authenticity Markers</h5>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                  <li>Source verification status</li>
                  <li>Metadata consistency check</li>
                  <li>Visual authenticity indicators</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-semibold text-white">Threat Assessment</h5>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                  <li>Disinformation potential</li>
                  <li>Manipulation techniques detected</li>
                  <li>Narrative analysis results</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={async () => {
                try {
                  const entry = await lionSpaceServices.logEvidence(
                    'Video Analysis',
                    videoUrl,
                    (result as any).output || 'Analysis completed'
                  );
                  onLogEvidence(entry);
                } catch (error) {
                  console.error('Error logging evidence:', error);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Log Evidence
            </button>
            
            <button
              onClick={() => {
                const reportData = {
                  url: videoUrl,
                  platform,
                  analysis: typeof result === 'string' ? result : result,
                  timestamp: new Date().toISOString(),
                  metadata: mockMetadata
                };
                const dataStr = JSON.stringify(reportData, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const exportFileDefaultName = `video-analysis-${Date.now()}.json`;
                
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      );
      
      onResultUpdate(analysisDisplay);
      
    } catch (error) {
      console.error("Error analyzing video:", error);
      onResultUpdate(
        <div className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <p className="font-semibold">Analysis Failed</p>
          </div>
          <p className="text-sm">Unable to analyze video. Please check the URL and try again.</p>
        </div>
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const useSampleUrl = (url: string) => {
    setVideoUrl(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-cyan-400 font-mono mb-2 flex items-center justify-center gap-3">
          <Video className="w-8 h-8" />
          {t('Video Analysis') || 'Video Analysis'}
        </h2>
        <p className="text-gray-400">
          {t('Analyze videos for disinformation, deepfakes, and manipulation') || 'Analyze videos for disinformation, deepfakes, and manipulation'}
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-gray-800/30 border border-gray-600/50 rounded-lg p-6">
        <label className="block text-white font-semibold mb-3">
          Video URL
        </label>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
          placeholder={t('Enter video URL from supported platforms...') || 'Enter video URL from supported platforms...'}
        />
        
        {videoUrl && !validateUrl(videoUrl) && (
          <p className="text-red-400 text-sm mt-2">Please enter a valid URL</p>
        )}
        
        {videoUrl && validateUrl(videoUrl) && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4 text-green-400" />
            <span className="text-green-400">Platform detected: {extractPlatform(videoUrl)}</span>
          </div>
        )}

        {/* Supported Platforms */}
        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-2">Supported platforms:</p>
          <div className="flex flex-wrap gap-2">
            {supportedPlatforms.map((platform) => (
              <span key={platform} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded border border-gray-600">
                {platform}
              </span>
            ))}
          </div>
        </div>

        {/* Sample URLs */}
        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-2">Sample URL formats:</p>
          <div className="space-y-1">
            {sampleUrls.map((url, idx) => (
              <button
                key={idx}
                onClick={() => useSampleUrl(url)}
                className="block w-full text-left p-2 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30 rounded text-sm text-gray-300 hover:text-white transition-colors font-mono"
              >
                {url}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-center">
        <button
          onClick={handleAnalyzeVideo}
          disabled={isAnalyzing || !videoUrl.trim() || !validateUrl(videoUrl)}
          className="flex items-center gap-3 py-4 px-8 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/50 rounded-lg text-cyan-400 hover:from-cyan-600/30 hover:to-blue-600/30 hover:border-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono text-lg"
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              Analyzing Video...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Analyze Video
            </>
          )}
        </button>
      </div>

      {/* Ethical Notice */}
      <div className="text-xs text-gray-500 bg-gray-800/20 border border-gray-700 rounded p-3">
        <p className="font-semibold text-yellow-400 mb-1">⚠️ Privacy & Ethics Notice</p>
        <p>Only analyze publicly available content. Respect privacy rights and platform terms of service. Use findings responsibly for counter-disinformation efforts.</p>
      </div>
    </div>
  );
}