'use client';

import { useState, useEffect } from 'react';
import { 
  Brain, Shield, AlertTriangle, Target, Users, 
  Zap, TrendingUp, Radio, Globe, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/_components/ui/grid';

export default function CognitiveWarfarePage() {
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'operations' | 'patterns' | 'countermeasures'>('operations');
  
  // Simulated narrative tracking
  const [narrativeStrength, setNarrativeStrength] = useState(72);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setNarrativeStrength(prev => 
        Math.min(100, Math.max(0, prev + (Math.random() * 10 - 5)))
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const activeOperations = [
    {
      id: 'op-001',
      name: 'OPERATION TRUTHSEEKER',
      status: 'active',
      threat_level: 'critical',
      description: 'Counter-disinformation campaign targeting election interference',
      actors: 14,
      narratives: 8,
      effectiveness: 87,
      regions: ['North America', 'Europe']
    },
    {
      id: 'op-002',
      name: 'PROJECT SENTINEL',
      status: 'monitoring',
      threat_level: 'high',
      description: 'AI-driven propaganda detection and neutralization',
      actors: 23,
      narratives: 12,
      effectiveness: 76,
      regions: ['Asia Pacific']
    },
    {
      id: 'op-003',
      name: 'NARRATIVE SHIELD',
      status: 'active',
      threat_level: 'medium',
      description: 'Protecting critical infrastructure information channels',
      actors: 8,
      narratives: 5,
      effectiveness: 92,
      regions: ['Global']
    }
  ];

  const cognitivePatterns = [
    {
      pattern: 'Emotional Manipulation',
      frequency: 'HIGH',
      techniques: ['Fear amplification', 'Outrage farming', 'False urgency'],
      effectiveness: 78,
      trend: 'increasing'
    },
    {
      pattern: 'Information Flooding',
      frequency: 'CRITICAL',
      techniques: ['Data overload', 'Noise generation', 'Attention diversion'],
      effectiveness: 65,
      trend: 'stable'
    },
    {
      pattern: 'Reality Distortion',
      frequency: 'MEDIUM',
      techniques: ['Deepfakes', 'Context manipulation', 'Historical revision'],
      effectiveness: 82,
      trend: 'increasing'
    },
    {
      pattern: 'Social Fracturing',
      frequency: 'HIGH',
      techniques: ['Polarization', 'Echo chambers', 'Tribal reinforcement'],
      effectiveness: 91,
      trend: 'increasing'
    }
  ];

  const countermeasures = [
    {
      name: 'COGNITIVE FIREWALL',
      type: 'defensive',
      status: 'deployed',
      effectiveness: 94,
      description: 'Real-time narrative filtering and fact-checking system'
    },
    {
      name: 'TRUTH AMPLIFIER',
      type: 'offensive',
      status: 'active',
      effectiveness: 87,
      description: 'Automated factual content promotion and distribution'
    },
    {
      name: 'NEURAL SHIELD',
      type: 'defensive',
      status: 'testing',
      effectiveness: 76,
      description: 'AI-powered psychological manipulation detection'
    },
    {
      name: 'NARRATIVE TRACKER',
      type: 'intelligence',
      status: 'deployed',
      effectiveness: 89,
      description: 'Cross-platform narrative evolution monitoring'
    }
  ];

  const narrativeMetrics = [
    { metric: 'Truth Velocity', value: '2.3x', status: 'improving' },
    { metric: 'Narrative Reach', value: '847K', status: 'expanding' },
    { metric: 'Influence Score', value: '78/100', status: 'stable' },
    { metric: 'Counter Effectiveness', value: '91%', status: 'optimal' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-terminal-border pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-terminal-cyan font-mono flex items-center gap-3">
              <Brain className="w-6 h-6" />
              COGNITIVE WARFARE COMMAND
            </h1>
            <p className="text-terminal-muted font-mono text-sm mt-1">
              Information warfare detection and countermeasure deployment
            </p>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-terminal-red rounded-full animate-pulse" />
              <span className="text-sm font-mono text-terminal-red">
                THREAT LEVEL: CRITICAL
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-terminal-border">
        {(['operations', 'patterns', 'countermeasures'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-mono text-sm uppercase transition-all ${
              activeTab === tab
                ? 'text-terminal-cyan border-b-2 border-terminal-cyan'
                : 'text-terminal-text/60 hover:text-terminal-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Narrative Strength Indicator */}
      <Card className="terminal-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Radio className="w-5 h-5 text-terminal-cyan animate-pulse" />
              <span className="text-sm font-mono text-terminal-cyan uppercase">
                Global Narrative Strength
              </span>
            </div>
            <span className="text-2xl font-bold font-mono text-terminal-cyan">
              {narrativeStrength}%
            </span>
          </div>
          <div className="w-full bg-terminal-secondary rounded-full h-3">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                narrativeStrength > 70 ? 'bg-terminal-green' :
                narrativeStrength > 40 ? 'bg-terminal-gold' :
                'bg-terminal-red'
              }`}
              style={{ width: `${narrativeStrength}%` }}
            />
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {narrativeMetrics.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-terminal-muted font-mono">
                  {item.metric}
                </div>
                <div className="text-lg font-bold text-terminal-cyan font-mono">
                  {item.value}
                </div>
                <div className={`text-xs font-mono ${
                  item.status === 'optimal' ? 'text-terminal-green' :
                  item.status === 'improving' || item.status === 'expanding' ? 'text-terminal-cyan' :
                  'text-terminal-gold'
                }`}>
                  {item.status.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content based on active tab */}
      {activeTab === 'operations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Operations */}
          <div className="lg:col-span-2">
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  ACTIVE OPERATIONS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeOperations.map((op) => (
                    <div
                      key={op.id}
                      className="p-4 bg-terminal-secondary rounded border border-terminal-border hover:border-terminal-cyan/50 transition-all cursor-pointer"
                      onClick={() => setSelectedOperation(op.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold font-mono text-terminal-cyan">
                            {op.name}
                          </h3>
                          <p className="text-sm text-terminal-muted font-mono mt-1">
                            {op.description}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded text-xs font-mono font-bold ${
                          op.threat_level === 'critical' ? 'bg-terminal-red/20 text-terminal-red' :
                          op.threat_level === 'high' ? 'bg-terminal-gold/20 text-terminal-gold' :
                          'bg-terminal-cyan/20 text-terminal-cyan'
                        }`}>
                          {op.threat_level.toUpperCase()}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mt-3">
                        <div>
                          <span className="text-xs text-terminal-muted font-mono">ACTORS</span>
                          <div className="text-lg font-bold text-terminal-text font-mono">{op.actors}</div>
                        </div>
                        <div>
                          <span className="text-xs text-terminal-muted font-mono">NARRATIVES</span>
                          <div className="text-lg font-bold text-terminal-text font-mono">{op.narratives}</div>
                        </div>
                        <div>
                          <span className="text-xs text-terminal-muted font-mono">EFFECTIVENESS</span>
                          <div className="text-lg font-bold text-terminal-green font-mono">{op.effectiveness}%</div>
                        </div>
                        <div>
                          <span className="text-xs text-terminal-muted font-mono">REGIONS</span>
                          <div className="text-sm text-terminal-text font-mono">{op.regions.join(', ')}</div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          op.status === 'active' ? 'bg-terminal-green animate-pulse' :
                          'bg-terminal-gold'
                        }`} />
                        <span className="text-xs font-mono text-terminal-muted uppercase">
                          Status: {op.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'patterns' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cognitivePatterns.map((pattern, index) => (
            <Card key={index} className="terminal-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{pattern.pattern}</span>
                  <span className={`text-xs px-2 py-1 rounded font-mono ${
                    pattern.frequency === 'CRITICAL' ? 'bg-terminal-red/20 text-terminal-red' :
                    pattern.frequency === 'HIGH' ? 'bg-terminal-gold/20 text-terminal-gold' :
                    'bg-terminal-cyan/20 text-terminal-cyan'
                  }`}>
                    {pattern.frequency}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-terminal-muted font-mono">TECHNIQUES</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {pattern.techniques.map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-terminal-secondary rounded text-xs font-mono text-terminal-text">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs text-terminal-muted font-mono">EFFECTIVENESS</span>
                      <div className="text-lg font-bold font-mono text-terminal-cyan">
                        {pattern.effectiveness}%
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {pattern.trend === 'increasing' ? (
                        <TrendingUp className="w-4 h-4 text-terminal-red" />
                      ) : (
                        <Activity className="w-4 h-4 text-terminal-gold" />
                      )}
                      <span className="text-xs font-mono text-terminal-muted uppercase">
                        {pattern.trend}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-terminal-secondary rounded-full h-2">
                    <div
                      className={`h-full rounded-full ${
                        pattern.effectiveness > 80 ? 'bg-terminal-red' :
                        pattern.effectiveness > 60 ? 'bg-terminal-gold' :
                        'bg-terminal-cyan'
                      }`}
                      style={{ width: `${pattern.effectiveness}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'countermeasures' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {countermeasures.map((measure, index) => (
            <Card key={index} className="terminal-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    {measure.name}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded font-mono ${
                    measure.type === 'offensive' ? 'bg-terminal-red/20 text-terminal-red' :
                    measure.type === 'defensive' ? 'bg-terminal-cyan/20 text-terminal-cyan' :
                    'bg-terminal-gold/20 text-terminal-gold'
                  }`}>
                    {measure.type.toUpperCase()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-terminal-muted font-mono mb-3">
                  {measure.description}
                </p>
                
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="text-xs text-terminal-muted font-mono">EFFECTIVENESS</span>
                    <div className="text-2xl font-bold font-mono text-terminal-green">
                      {measure.effectiveness}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      measure.status === 'deployed' || measure.status === 'active' 
                        ? 'bg-terminal-green animate-pulse' 
                        : 'bg-terminal-gold'
                    }`} />
                    <span className="text-sm font-mono text-terminal-text uppercase">
                      {measure.status}
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-terminal-secondary rounded-full h-2">
                  <div
                    className="h-full rounded-full bg-terminal-green"
                    style={{ width: `${measure.effectiveness}%` }}
                  />
                </div>
                
                <button className="w-full mt-4 px-4 py-2 bg-terminal-cyan/10 border border-terminal-cyan/30 rounded text-terminal-cyan font-mono text-sm hover:bg-terminal-cyan/20 transition-all">
                  {measure.status === 'testing' ? 'VIEW RESULTS' : 'MANAGE'}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}