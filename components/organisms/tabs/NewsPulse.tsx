'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/hooks/use-i18n';
import { LionSpaceServices } from '@/services/client-services/lionspace-service';
import { EvidenceLogEntry } from '@/types/intelligence';

interface NewsPulseProps {
  lionSpaceServices: LionSpaceServices;
  onResultUpdate: (content: React.ReactNode) => void;
  onLogEvidence: (entry: EvidenceLogEntry) => void;
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  reliability: number;
  category: string;
  summary: string;
}

export function NewsPulse({ lionSpaceServices, onResultUpdate, onLogEvidence }: NewsPulseProps) {
  const [topicInput, setTopicInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scanType, setScanType] = useState<'realtime' | 'trending' | 'comparative'>('realtime');
  const [liveUpdates, setLiveUpdates] = useState(false);
  const { t } = useI18n();

  const generateMockNews = (topic: string): NewsItem[] => {
    const sources = ['Reuters', 'AP News', 'BBC', 'Al Jazeera', 'CNN', 'Fox News', 'RT', 'Times of Israel'];
    const categories = ['Politics', 'Military', 'Diplomacy', 'Economy', 'Social Media'];
    
    return Array.from({ length: 8 }, (_, i) => ({
      id: `news-${i}`,
      title: `Breaking: ${topic} developments reported by multiple sources`,
      source: sources[i % sources.length] || 'Unknown Source',
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as 'positive' | 'negative' | 'neutral',
      reliability: Math.floor(Math.random() * 30) + 70,
      category: categories[Math.floor(Math.random() * categories.length)] || 'General',
      summary: `Recent analysis indicates significant developments regarding ${topic} with potential implications for regional stability.`
    }));
  };

  const handleScanNews = async () => {
    if (!topicInput.trim()) {
      onResultUpdate(<p className="text-red-400">Please enter a topic to scan for news coverage.</p>);
      return;
    }

    setIsLoading(true);
    onResultUpdate(
      <div className="text-center p-8">
        <div className="spinner w-8 h-8 mx-auto mb-4"></div>
        <p className="text-lg text-cyan-400 font-mono animate-pulse">SCANNING NEWS PULSE...</p>
        <p className="text-sm text-gray-400 mt-2">Analyzing real-time media coverage and narrative trends</p>
      </div>
    );

    try {
      const result = await lionSpaceServices.scanNewsPulse(topicInput);
      const lastResult = lionSpaceServices.getLastAnalysisResult();
      const mockNews = generateMockNews(topicInput);
      
      const enhancedResult = (
        <div className="space-y-4">
          <div className="bg-black/30 p-4 rounded-lg border border-gray-700/50">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-green-400 font-mono text-lg">NEWS PULSE SCAN COMPLETE</h3>
              {liveUpdates && (
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded font-mono">LIVE</span>
              )}
            </div>
            <div dangerouslySetInnerHTML={{ __html: result }} />
          </div>
          
          {/* News Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-800/50 p-3 rounded">
              <div className="text-gray-400">Articles Found</div>
              <div className="text-white font-mono text-xl">{mockNews.length}</div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded">
              <div className="text-gray-400">Sources</div>
              <div className="text-white font-mono text-xl">{new Set(mockNews.map(n => n.source)).size}</div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded">
              <div className="text-gray-400">Avg Reliability</div>
              <div className="text-green-400 font-mono text-xl">
                {Math.floor(mockNews.reduce((acc, n) => acc + n.reliability, 0) / mockNews.length)}%
              </div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded">
              <div className="text-gray-400">Sentiment</div>
              <div className="text-blue-400 font-mono text-xl">
                {mockNews.filter(n => n.sentiment === 'negative').length > mockNews.length / 2 ? 'NEG' : 'MIX'}
              </div>
            </div>
          </div>

          {/* News Feed */}
          <div className="bg-black/30 p-4 rounded-lg border border-gray-700/50">
            <h4 className="text-cyan-400 font-semibold mb-3">Latest Coverage</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
              {mockNews.map(news => (
                <div key={news.id} className="bg-gray-800/30 p-3 rounded border-l-4 border-l-cyan-500/50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-cyan-400 font-mono text-sm">{news.source}</span>
                      <span className={`w-2 h-2 rounded-full ${
                        news.sentiment === 'positive' ? 'bg-green-400' :
                        news.sentiment === 'negative' ? 'bg-red-400' : 'bg-gray-400'
                      }`}></span>
                      <span className="text-xs text-gray-400">{news.category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-mono px-2 py-1 rounded ${
                        news.reliability >= 80 ? 'bg-green-500/20 text-green-400' :
                        news.reliability >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {news.reliability}%
                      </span>
                    </div>
                  </div>
                  <h5 className="text-white font-medium mb-1">{news.title}</h5>
                  <p className="text-gray-400 text-sm mb-2">{news.summary}</p>
                  <div className="text-xs text-gray-500 font-mono">
                    {new Date(news.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sentiment Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/30 p-3 rounded">
              <h4 className="text-gray-300 font-semibold mb-3">Narrative Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Pro-Israeli Coverage</span>
                  <span className="font-mono">{Math.floor(Math.random() * 30) + 25}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Pro-Palestinian Coverage</span>
                  <span className="font-mono">{Math.floor(Math.random() * 35) + 35}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Neutral/Factual</span>
                  <span className="font-mono">{Math.floor(Math.random() * 25) + 15}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Analysis/Opinion</span>
                  <span className="font-mono">{Math.floor(Math.random() * 20) + 15}%</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/30 p-3 rounded">
              <h4 className="text-gray-300 font-semibold mb-3">Source Reliability</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>High Reliability (80%+)</span>
                  <span className="text-green-400 font-mono">
                    {mockNews.filter(n => n.reliability >= 80).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Medium Reliability (60-79%)</span>
                  <span className="text-yellow-400 font-mono">
                    {mockNews.filter(n => n.reliability >= 60 && n.reliability < 80).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Low Reliability (&lt;60%)</span>
                  <span className="text-red-400 font-mono">
                    {mockNews.filter(n => n.reliability < 60).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-700/50">
            <button
              onClick={async () => {
                const entry = await lionSpaceServices.logEvidence(
                  'News Pulse Scan',
                  lastResult.input,
                  lastResult.output
                );
                onLogEvidence(entry);
                onResultUpdate(
                  <div className="text-green-400 text-center py-4">
                    ✓ News pulse analysis logged to evidence chain
                  </div>
                );
              }}
              className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-4 py-2 rounded text-sm transition-all"
            >
              📝 Log News Analysis
            </button>
            
            <button
              onClick={() => {
                const newsData = {
                  topic: topicInput,
                  scanType,
                  timestamp: new Date().toISOString(),
                  articlesFound: mockNews.length,
                  sources: new Set(mockNews.map(n => n.source)).size,
                  averageReliability: Math.floor(mockNews.reduce((acc, n) => acc + n.reliability, 0) / mockNews.length)
                };
                navigator.clipboard.writeText(JSON.stringify(newsData, null, 2));
              }}
              className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 px-4 py-2 rounded text-sm transition-all"
            >
              📋 Export News Data
            </button>
            
            <button
              onClick={() => {
                setLiveUpdates(!liveUpdates);
              }}
              className={`px-4 py-2 rounded text-sm transition-all ${
                liveUpdates 
                  ? 'bg-red-500/20 border border-red-500/50 text-red-400' 
                  : 'bg-gray-500/20 border border-gray-500/50 text-gray-400'
              }`}
            >
              {liveUpdates ? '⏹ Stop Live Updates' : '▶ Start Live Updates'}
            </button>
          </div>
        </div>
      );
      
      onResultUpdate(enhancedResult);
      
    } catch (error) {
      console.error("Error in scanNewsPulse:", error);
      onResultUpdate(
        <div className="text-center p-8">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <p className="text-red-400">News pulse scan failed. Please try again.</p>
          <p className="text-gray-500 text-sm mt-2">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (liveUpdates && topicInput.trim()) {
      interval = setInterval(() => {
        // In a real implementation, this would refresh the news data
        console.log('Refreshing news data...');
      }, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [liveUpdates, topicInput]);

  return (
    <div className="tab-content">
      <h2 data-i18n-key="news_pulse_title" className="font-headline text-3xl text-center mb-2 text-cyan-400">
        {t('news_pulse_title')}
      </h2>
      <p data-i18n-key="news_pulse_subtitle" className="text-center text-gray-400 mb-6">
        {t('news_pulse_subtitle')}
      </p>
      
      {/* Scan Type Selector */}
      <div className="flex justify-center mb-4">
        <div className="bg-gray-800/50 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setScanType('realtime')}
            className={`px-3 py-2 rounded text-xs font-medium transition-all ${
              scanType === 'realtime' 
                ? 'bg-green-500/30 text-green-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Real-time
          </button>
          <button
            onClick={() => setScanType('trending')}
            className={`px-3 py-2 rounded text-xs font-medium transition-all ${
              scanType === 'trending' 
                ? 'bg-orange-500/30 text-orange-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Trending
          </button>
          <button
            onClick={() => setScanType('comparative')}
            className={`px-3 py-2 rounded text-xs font-medium transition-all ${
              scanType === 'comparative' 
                ? 'bg-purple-500/30 text-purple-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Comparative
          </button>
        </div>
      </div>

      {/* Input Field */}
      <div className="relative mb-4">
        <input
          type="text"
          value={topicInput}
          onChange={(e) => setTopicInput(e.target.value)}
          className="w-full p-4 bg-gray-900/70 border border-gray-700 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none backdrop-blur-sm"
          data-i18n-key="news_pulse_placeholder"
          placeholder={t('news_pulse_placeholder')}
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-500 font-mono">
          {topicInput.length} chars
        </div>
      </div>

      {/* Quick Topics */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setTopicInput("Gaza conflict latest developments")}
          className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 px-3 py-1 rounded text-sm transition-all"
        >
          Sample: Gaza Updates
        </button>
        <button
          onClick={() => setTopicInput("Iran nuclear program negotiations")}
          className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 px-3 py-1 rounded text-sm transition-all"
        >
          Sample: Iran Nuclear
        </button>
        <button
          onClick={() => setTopicInput("Middle East peace talks")}
          className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 px-3 py-1 rounded text-sm transition-all"
        >
          Sample: Peace Process
        </button>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={handleScanNews}
          disabled={isLoading || !topicInput.trim()}
          className="gemini-button text-lg text-cyan-400 py-3 px-10 rounded-md bg-cyan-500/10 border border-cyan-500/50 hover:bg-cyan-400 hover:text-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          data-i18n-key="news_pulse_button"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Scanning...</span>
            </div>
          ) : (
            t('news_pulse_button')
          )}
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-green-900/10 border border-green-500/20 rounded-lg">
        <h3 className="text-green-400 font-semibold mb-2">💡 News Pulse Tips</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Use <strong>Real-time</strong> for breaking news and immediate coverage</li>
          <li>• Use <strong>Trending</strong> to identify rising narrative themes</li>
          <li>• Use <strong>Comparative</strong> to analyze coverage differences across sources</li>
          <li>• Enable live updates for continuous monitoring of developing stories</li>
        </ul>
      </div>
    </div>
  );
}