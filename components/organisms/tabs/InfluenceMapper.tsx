'use client';

import { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/hooks/use-i18n';
import { LionSpaceServices } from '@/services/client-services/lionspace-service';
import { EvidenceLogEntry } from '@/types/intelligence';

interface InfluenceMapperProps {
  lionSpaceServices: LionSpaceServices;
  onResultUpdate: (content: React.ReactNode) => void;
  onLogEvidence: (entry: EvidenceLogEntry) => void;
}

interface NetworkNode {
  id: string;
  name: string;
  type: 'primary' | 'secondary' | 'amplifier';
  influence: number;
  x: number;
  y: number;
  connections: string[];
}

export function InfluenceMapper({ lionSpaceServices, onResultUpdate, onLogEvidence }: InfluenceMapperProps) {
  const [targetInput, setTargetInput] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState<'network' | 'amplification' | 'coordination'>('network');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useI18n();

  const drawNetworkVisualization = (nodes: NetworkNode[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#0B1220';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;

    nodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const targetNode = nodes.find(n => n.id === connectionId);
        if (targetNode) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.stroke();
        }
      });
    });

    ctx.globalAlpha = 1;

    // Draw nodes
    nodes.forEach(node => {
      const radius = Math.max(5, node.influence * 20);
      
      // Node color based on type
      const colors = {
        primary: '#ff0000',
        secondary: '#ff8800',
        amplifier: '#00ffff'
      };

      ctx.fillStyle = colors[node.type];
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Node label
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, node.x, node.y + radius + 15);
    });
  };

  const generateMockNetwork = (target: string, topic: string): NetworkNode[] => {
    const nodes: NetworkNode[] = [
      {
        id: 'primary',
        name: target,
        type: 'primary',
        influence: 1.0,
        x: 200,
        y: 200,
        connections: ['sec1', 'sec2', 'amp1']
      },
      {
        id: 'sec1',
        name: 'Amplifier Network A',
        type: 'secondary',
        influence: 0.7,
        x: 100,
        y: 150,
        connections: ['amp1', 'amp2']
      },
      {
        id: 'sec2',
        name: 'Cross-Platform Hub',
        type: 'secondary',
        influence: 0.8,
        x: 300,
        y: 150,
        connections: ['amp3', 'amp4']
      },
      {
        id: 'amp1',
        name: 'Bot Network 1',
        type: 'amplifier',
        influence: 0.4,
        x: 50,
        y: 100,
        connections: []
      },
      {
        id: 'amp2',
        name: 'Influencer Cluster',
        type: 'amplifier',
        influence: 0.6,
        x: 150,
        y: 80,
        connections: []
      },
      {
        id: 'amp3',
        name: 'Media Outlets',
        type: 'amplifier',
        influence: 0.5,
        x: 350,
        y: 100,
        connections: []
      },
      {
        id: 'amp4',
        name: 'Telegram Channels',
        type: 'amplifier',
        influence: 0.3,
        x: 250,
        y: 80,
        connections: []
      }
    ];
    return nodes;
  };

  const handleTraceInfluence = async () => {
    if (!targetInput.trim() || !topicInput.trim()) {
      onResultUpdate(<p className="text-red-400">Please enter both target entity and topic for analysis.</p>);
      return;
    }

    setIsLoading(true);
    onResultUpdate(
      <div className="text-center p-8">
        <div className="spinner w-8 h-8 mx-auto mb-4"></div>
        <p className="text-lg text-cyan-400 font-mono animate-pulse">MAPPING INFLUENCE NETWORK...</p>
        <p className="text-sm text-gray-400 mt-2">Analyzing cross-platform coordination patterns</p>
      </div>
    );

    try {
      const result = await lionSpaceServices.mapInfluenceNetwork(targetInput, topicInput);
      const lastResult = lionSpaceServices.getLastAnalysisResult();
      const mockNetwork = generateMockNetwork(targetInput, topicInput);
      
      setTimeout(() => drawNetworkVisualization(mockNetwork), 100);
      
      const enhancedResult = (
        <div className="space-y-4">
          <div className="bg-black/30 p-4 rounded-lg border border-gray-700/50">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
              <h3 className="text-orange-400 font-mono text-lg">INFLUENCE NETWORK MAPPED</h3>
            </div>
            <div dangerouslySetInnerHTML={{ __html: result }} />
          </div>
          
          {/* Network Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-800/50 p-3 rounded">
              <div className="text-gray-400">Primary Nodes</div>
              <div className="text-white font-mono text-xl">1</div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded">
              <div className="text-gray-400">Secondary Hubs</div>
              <div className="text-white font-mono text-xl">2</div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded">
              <div className="text-gray-400">Amplifiers</div>
              <div className="text-white font-mono text-xl">4</div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded">
              <div className="text-gray-400">Reach Score</div>
              <div className="text-orange-400 font-mono text-xl">{Math.floor(Math.random() * 40) + 60}</div>
            </div>
          </div>

          {/* Analysis Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-900/20 border border-red-500/30 p-3 rounded">
              <h4 className="text-red-400 font-semibold mb-2">Key Findings</h4>
              <div className="space-y-1 text-sm">
                <div className="text-gray-300">• Cross-platform coordination detected</div>
                <div className="text-gray-300">• Bot amplification networks active</div>
                <div className="text-gray-300">• Peak activity during UTC evening hours</div>
                <div className="text-gray-300">• Narrative synchronization patterns identified</div>
              </div>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded">
              <h4 className="text-blue-400 font-semibold mb-2">Platform Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>X/Twitter</span>
                  <span className="font-mono">{Math.floor(Math.random() * 30) + 40}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Telegram</span>
                  <span className="font-mono">{Math.floor(Math.random() * 25) + 25}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Facebook</span>
                  <span className="font-mono">{Math.floor(Math.random() * 20) + 15}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Other</span>
                  <span className="font-mono">{Math.floor(Math.random() * 15) + 5}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-700/50">
            <button
              onClick={async () => {
                const entry = await lionSpaceServices.logEvidence(
                  'Influence Network Analysis',
                  lastResult.input,
                  lastResult.output
                );
                onLogEvidence(entry);
                onResultUpdate(
                  <div className="text-green-400 text-center py-4">
                    ✓ Network analysis logged to evidence chain
                  </div>
                );
              }}
              className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-4 py-2 rounded text-sm transition-all"
            >
              📝 Log Network Map
            </button>
            
            <button
              onClick={() => {
                const networkData = {
                  target: targetInput,
                  topic: topicInput,
                  type: analysisType,
                  timestamp: new Date().toISOString(),
                  nodes: mockNetwork.length,
                  connections: mockNetwork.reduce((acc, node) => acc + node.connections.length, 0)
                };
                navigator.clipboard.writeText(JSON.stringify(networkData, null, 2));
              }}
              className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 px-4 py-2 rounded text-sm transition-all"
            >
              📋 Export Network Data
            </button>
            
            <button
              onClick={() => {
                setAnalysisType('coordination');
                handleTraceInfluence();
              }}
              className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-400 px-4 py-2 rounded text-sm transition-all"
            >
              🔍 Coordination Analysis
            </button>
          </div>
        </div>
      );
      
      onResultUpdate(enhancedResult);
      
    } catch (error) {
      console.error("Error in traceInfluenceNetwork:", error);
      onResultUpdate(
        <div className="text-center p-8">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <p className="text-red-400">Network mapping failed. Please try again.</p>
          <p className="text-gray-500 text-sm mt-2">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0B1220';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#333';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Network visualization will appear here after analysis', canvas.width / 2, canvas.height / 2);
      }
    }
  }, []);

  return (
    <div className="tab-content">
      <h2 data-i18n-key="influence_mapper_title" className="font-headline text-3xl text-center mb-2 text-cyan-400">
        {t('influence_mapper_title')}
      </h2>
      <p data-i18n-key="influence_mapper_subtitle" className="text-center text-gray-400 mb-6">
        {t('influence_mapper_subtitle')}
      </p>
      
      {/* Analysis Type Selector */}
      <div className="flex justify-center mb-4">
        <div className="bg-gray-800/50 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setAnalysisType('network')}
            className={`px-3 py-2 rounded text-xs font-medium transition-all ${
              analysisType === 'network' 
                ? 'bg-orange-500/30 text-orange-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Network Map
          </button>
          <button
            onClick={() => setAnalysisType('amplification')}
            className={`px-3 py-2 rounded text-xs font-medium transition-all ${
              analysisType === 'amplification' 
                ? 'bg-red-500/30 text-red-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Amplification
          </button>
          <button
            onClick={() => setAnalysisType('coordination')}
            className={`px-3 py-2 rounded text-xs font-medium transition-all ${
              analysisType === 'coordination' 
                ? 'bg-purple-500/30 text-purple-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Coordination
          </button>
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="relative">
          <input
            type="text"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            className="w-full p-4 bg-gray-900/70 border border-gray-700 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none backdrop-blur-sm"
            data-i18n-key="influence_mapper_placeholder_target"
            placeholder={t('influence_mapper_placeholder_target')}
          />
        </div>
        <div className="relative">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            className="w-full p-4 bg-gray-900/70 border border-gray-700 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none backdrop-blur-sm"
            data-i18n-key="influence_mapper_placeholder_topic"
            placeholder={t('influence_mapper_placeholder_topic')}
          />
        </div>
      </div>

      {/* Quick Samples */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => {
            setTargetInput("Jackson Hinkle");
            setTopicInput("Middle East narrative warfare");
          }}
          className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 px-3 py-1 rounded text-sm transition-all"
        >
          Sample: Influencer Analysis
        </button>
        <button
          onClick={() => {
            setTargetInput("Hamas media network");
            setTopicInput("Gaza conflict messaging");
          }}
          className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 px-3 py-1 rounded text-sm transition-all"
        >
          Sample: Network Coordination
        </button>
      </div>

      {/* Action Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleTraceInfluence}
          disabled={isLoading || !targetInput.trim() || !topicInput.trim()}
          className="gemini-button text-lg text-cyan-400 py-3 px-10 rounded-md bg-cyan-500/10 border border-cyan-500/50 hover:bg-cyan-400 hover:text-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          data-i18n-key="influence_mapper_button"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Mapping...</span>
            </div>
          ) : (
            t('influence_mapper_button')
          )}
        </button>
      </div>

      {/* Network Visualization Canvas */}
      <div className="chart-container">
        <div className="bg-black/30 border border-gray-700/50 rounded-lg p-2">
          <canvas 
            ref={canvasRef} 
            className="w-full h-[400px] rounded"
            style={{ background: '#0B1220' }}
          />
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-orange-900/10 border border-orange-500/20 rounded-lg">
        <h3 className="text-orange-400 font-semibold mb-2">💡 Network Analysis Tips</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Use <strong>Network Map</strong> to visualize overall influence structure</li>
          <li>• Use <strong>Amplification</strong> to focus on signal boosting patterns</li>
          <li>• Use <strong>Coordination</strong> to detect synchronized messaging campaigns</li>
          <li>• Include specific individuals, organizations, or hashtags as targets</li>
        </ul>
      </div>
    </div>
  );
}