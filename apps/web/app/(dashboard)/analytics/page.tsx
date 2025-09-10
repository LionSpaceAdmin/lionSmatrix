'use client';

import { 
  Activity, AlertTriangle, Database, Globe, 
  Network, Shield, TrendingDown, TrendingUp, Users, Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [selectedMetric, setSelectedMetric] = useState<string>('threats');
  
  // Simulated real-time data
  const [metrics, setMetrics] = useState({
    threats: { value: 247, change: 12, trend: 'up' },
    narratives: { value: 1842, change: -5, trend: 'down' },
    actors: { value: 89, change: 3, trend: 'up' },
    verifications: { value: 3421, change: 18, trend: 'up' },
    falsePositives: { value: 12, change: -25, trend: 'down' },
    responseTime: { value: 142, change: -8, trend: 'down' }
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        threats: {
          ...prev.threats,
          value: prev.threats.value + Math.floor(Math.random() * 5 - 2)
        },
        responseTime: {
          ...prev.responseTime,
          value: Math.max(50, prev.responseTime.value + Math.floor(Math.random() * 20 - 10))
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const threatDistribution = [
    { category: 'DISINFORMATION', count: 89, severity: 'critical' },
    { category: 'CYBER ATTACKS', count: 56, severity: 'high' },
    { category: 'PROPAGANDA', count: 47, severity: 'high' },
    { category: 'BOT NETWORKS', count: 32, severity: 'medium' },
    { category: 'PHISHING', count: 23, severity: 'medium' }
  ];

  const geographicData = [
    { region: 'North America', threats: 78, accuracy: 92 },
    { region: 'Europe', threats: 65, accuracy: 89 },
    { region: 'Asia Pacific', threats: 124, accuracy: 87 },
    { region: 'Middle East', threats: 95, accuracy: 84 },
    { region: 'Africa', threats: 42, accuracy: 91 },
    { region: 'Latin America', threats: 38, accuracy: 88 }
  ];

  const performanceMetrics = [
    { metric: 'Detection Rate', value: '98.2%', status: 'optimal' },
    { metric: 'False Positive Rate', value: '0.8%', status: 'optimal' },
    { metric: 'Processing Speed', value: '12.4 TB/hr', status: 'normal' },
    { metric: 'System Uptime', value: '99.98%', status: 'optimal' },
    { metric: 'AI Accuracy', value: '94.7%', status: 'normal' },
    { metric: 'Response Time', value: '142ms', status: 'optimal' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-terminal-border pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-terminal-cyan font-mono">
              INTELLIGENCE ANALYTICS
            </h1>
            <p className="text-terminal-muted font-mono text-sm mt-1">
              Real-time threat intelligence and performance metrics
            </p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex gap-2">
            {(['24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 font-mono text-sm rounded transition-all ${
                  timeRange === range
                    ? 'bg-terminal-cyan text-terminal-bg'
                    : 'bg-terminal-secondary text-terminal-text hover:bg-terminal-border'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Object.entries(metrics).map(([key, data]) => (
          <div key={key} onClick={() => setSelectedMetric(key)} className="cursor-pointer">
            <Card className="terminal-card hover:border-terminal-cyan/50 transition-all">
              <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-terminal-muted font-mono uppercase">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                {data.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-terminal-green" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-terminal-red" />
                )}
              </div>
              <div className="text-2xl font-bold text-terminal-cyan font-mono">
                {key === 'responseTime' ? `${data.value}ms` : data.value.toLocaleString()}
              </div>
              <div className={`text-xs font-mono mt-1 ${
                data.trend === 'up' && key !== 'falsePositives' && key !== 'responseTime' 
                  ? 'text-terminal-green' 
                  : data.trend === 'down' && (key === 'falsePositives' || key === 'responseTime')
                  ? 'text-terminal-green'
                  : 'text-terminal-red'
              }`}>
                {data.change > 0 ? '+' : ''}{data.change}%
              </div>
            </CardContent>
          </Card>
          </div>
        ))}
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Distribution */}
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              THREAT DISTRIBUTION
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {threatDistribution.map((threat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      threat.severity === 'critical' ? 'bg-terminal-red' :
                      threat.severity === 'high' ? 'bg-terminal-gold' :
                      'bg-terminal-cyan'
                    }`} />
                    <span className="text-sm font-mono text-terminal-text">
                      {threat.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-terminal-secondary rounded-full h-2">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          threat.severity === 'critical' ? 'bg-terminal-red' :
                          threat.severity === 'high' ? 'bg-terminal-gold' :
                          'bg-terminal-cyan'
                        }`}
                        style={{ width: `${(threat.count / 124) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono text-terminal-cyan min-w-[3ch]">
                      {threat.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Analysis */}
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              GEOGRAPHIC ANALYSIS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {geographicData.map((region, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-terminal-border last:border-0">
                  <div>
                    <div className="text-sm font-mono text-terminal-text">
                      {region.region}
                    </div>
                    <div className="text-xs font-mono text-terminal-muted">
                      Accuracy: {region.accuracy}%
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`text-lg font-bold font-mono ${
                      region.threats > 80 ? 'text-terminal-red' :
                      region.threats > 50 ? 'text-terminal-gold' :
                      'text-terminal-cyan'
                    }`}>
                      {region.threats}
                    </div>
                    <span className="text-xs text-terminal-muted font-mono">
                      THREATS
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="terminal-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              SYSTEM PERFORMANCE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="text-center p-3 bg-terminal-secondary rounded border border-terminal-border">
                  <div className="text-xs text-terminal-muted font-mono mb-2">
                    {metric.metric}
                  </div>
                  <div className={`text-lg font-bold font-mono ${
                    metric.status === 'optimal' ? 'text-terminal-green' :
                    metric.status === 'warning' ? 'text-terminal-gold' :
                    'text-terminal-cyan'
                  }`}>
                    {metric.value}
                  </div>
                  <div className={`text-xs font-mono mt-1 ${
                    metric.status === 'optimal' ? 'text-terminal-green' :
                    metric.status === 'warning' ? 'text-terminal-gold' :
                    'text-terminal-cyan'
                  }`}>
                    {metric.status.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card className="terminal-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-4 h-4 animate-pulse" />
              ACTIVITY TIMELINE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[
                { time: '2 MIN AGO', event: 'Critical threat detected in North America', type: 'threat' },
                { time: '5 MIN AGO', event: 'AI model accuracy improved to 94.7%', type: 'success' },
                { time: '12 MIN AGO', event: 'New bot network identified', type: 'warning' },
                { time: '18 MIN AGO', event: 'System scan completed successfully', type: 'info' },
                { time: '25 MIN AGO', event: 'Disinformation campaign neutralized', type: 'success' },
                { time: '31 MIN AGO', event: 'Anomaly detected in European traffic', type: 'warning' },
                { time: '45 MIN AGO', event: 'Database backup completed', type: 'info' },
                { time: '1 HOUR AGO', event: 'Threat level elevated in Asia Pacific', type: 'threat' }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 py-2 border-l-2 border-terminal-border pl-4 hover:border-terminal-cyan transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    item.type === 'threat' ? 'bg-terminal-red' :
                    item.type === 'warning' ? 'bg-terminal-gold' :
                    item.type === 'success' ? 'bg-terminal-green' :
                    'bg-terminal-cyan'
                  }`} />
                  <div className="flex-1">
                    <div className="text-sm font-mono text-terminal-text">
                      {item.event}
                    </div>
                    <div className="text-xs font-mono text-terminal-muted mt-1">
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}