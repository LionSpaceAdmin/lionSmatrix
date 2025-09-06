'use client';

import { GridShell, GridItem, Card, CardHeader, CardTitle, CardContent } from '@/components/ui/grid';
import { Shield, Activity, BarChart3, FileText, AlertTriangle, CheckCircle2, TrendingUp, Users, Globe, Lock } from 'lucide-react';
import { StatusIndicator } from '@/app/_components/terminal/status-indicator';
import dynamic from 'next/dynamic';

// Dynamically import background effects
const MatrixBackground = dynamic(
  () => import('@/app/_components/visuals/MatrixBackground').then(mod => mod.MatrixBackground),
  { ssr: false }
);

export default function DashboardPage() {
  const metrics = [
    {
      title: 'Active Threats',
      value: '247',
      change: '+12%',
      trend: 'up',
      description: 'from yesterday',
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'red' as const
    },
    {
      title: 'Narratives Tracked',
      value: '1,842',
      change: '47',
      trend: 'neutral',
      description: 'active sources',
      icon: <FileText className="w-5 h-5" />,
      color: 'cyan' as const
    },
    {
      title: 'Truth Score',
      value: '87%',
      change: '+3.2%',
      trend: 'up',
      description: 'global accuracy',
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: 'green' as const
    },
    {
      title: 'Active Operations',
      value: '42',
      change: '98.2%',
      trend: 'neutral',
      description: 'success rate',
      icon: <Activity className="w-5 h-5" />,
      color: 'gold' as const
    },
    {
      title: 'Network Nodes',
      value: '3,247',
      change: '+124',
      trend: 'up',
      description: 'new connections',
      icon: <Globe className="w-5 h-5" />,
      color: 'cyan' as const
    },
    {
      title: 'Security Status',
      value: 'SECURED',
      change: '100%',
      trend: 'neutral',
      description: 'system integrity',
      icon: <Lock className="w-5 h-5" />,
      color: 'green' as const
    }
  ];

  const recentActivity = [
    {
      type: 'threat',
      message: 'New narrative detected: Climate misinformation campaign',
      time: '2 min ago',
      severity: 'high'
    },
    {
      type: 'success',
      message: 'Verification complete: Economic data manipulation confirmed',
      time: '15 min ago',
      severity: 'medium'
    },
    {
      type: 'alert',
      message: 'Alert: Coordinated bot network identified',
      time: '1 hour ago',
      severity: 'high'
    },
    {
      type: 'info',
      message: 'System update: Neural network model v2.4 deployed',
      time: '2 hours ago',
      severity: 'low'
    },
    {
      type: 'success',
      message: 'Campaign neutralized: Disinformation source blocked',
      time: '3 hours ago',
      severity: 'medium'
    }
  ];

  return (
    <div className="relative min-h-screen bg-terminal-bg overflow-hidden font-terminal">
      {/* Background effects */}
      <MatrixBackground />
      
      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-scanline animate-scan opacity-5" />
      </div>

      {/* Main content */}
      <div className="relative z-20 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-terminal-cyan mb-2 terminal-glow">
                  INTELLIGENCE DASHBOARD
                </h1>
                <p className="text-terminal-gold">Real-time narrative analysis and threat monitoring</p>
              </div>
              <StatusIndicator status="online" label="SYSTEM ONLINE" />
            </div>
            
            {/* Quick stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-terminal-secondary/50 border border-terminal-border rounded-lg">
              <div className="text-center">
                <div className="text-xs text-terminal-muted uppercase">Response Time</div>
                <div className="text-lg font-bold text-terminal-cyan">0.42ms</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-terminal-muted uppercase">Uptime</div>
                <div className="text-lg font-bold text-terminal-green">99.98%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-terminal-muted uppercase">Data Processed</div>
                <div className="text-lg font-bold text-terminal-gold">1.2TB</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-terminal-muted uppercase">API Status</div>
                <div className="text-lg font-bold text-terminal-green">ACTIVE</div>
              </div>
            </div>
          </header>

          {/* Metrics Grid */}
          <GridShell className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <GridItem key={index}>
                <Card className="h-full hover:scale-105 transition-transform duration-200 terminal-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <span className={`text-terminal-${metric.color}`}>{metric.icon}</span>
                        {metric.title}
                      </CardTitle>
                      {metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-terminal-green" />}
                      {metric.trend === 'down' && <TrendingUp className="w-4 h-4 text-terminal-red rotate-180" />}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold text-terminal-${metric.color} mb-1`}>
                      {metric.value}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`font-mono ${
                        metric.trend === 'up' ? 'text-terminal-green' : 
                        metric.trend === 'down' ? 'text-terminal-red' : 
                        'text-terminal-muted'
                      }`}>
                        {metric.change}
                      </span>
                      <span className="text-terminal-muted">{metric.description}</span>
                    </div>
                  </CardContent>
                </Card>
              </GridItem>
            ))}
          </GridShell>

          {/* Recent Activity & Live Feed */}
          <GridShell className="grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <GridItem>
              <Card className="h-full terminal-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-terminal-cyan" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="pb-3 border-b border-terminal-border last:border-0 last:pb-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {activity.type === 'threat' && <AlertTriangle className="w-4 h-4 text-terminal-red" />}
                              {activity.type === 'success' && <CheckCircle2 className="w-4 h-4 text-terminal-green" />}
                              {activity.type === 'alert' && <AlertTriangle className="w-4 h-4 text-terminal-gold" />}
                              {activity.type === 'info' && <Activity className="w-4 h-4 text-terminal-cyan" />}
                              <span className={`text-xs font-bold uppercase ${
                                activity.severity === 'high' ? 'text-terminal-red' :
                                activity.severity === 'medium' ? 'text-terminal-gold' :
                                'text-terminal-cyan'
                              }`}>
                                {activity.type}
                              </span>
                            </div>
                            <p className="text-sm text-terminal-text">{activity.message}</p>
                          </div>
                          <span className="text-xs text-terminal-muted whitespace-nowrap ml-2">
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </GridItem>

            {/* Live Data Feed */}
            <GridItem>
              <Card className="h-full terminal-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-terminal-cyan" />
                    Live Data Feed
                    <span className="ml-auto">
                      <StatusIndicator status="online" size="sm" />
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-terminal-secondary/50 rounded border border-terminal-border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-terminal-muted uppercase">Neural Network Processing</span>
                        <span className="text-xs text-terminal-green">ACTIVE</span>
                      </div>
                      <div className="w-full bg-terminal-secondary rounded-full h-2">
                        <div className="bg-terminal-cyan h-2 rounded-full animate-pulse" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-terminal-secondary/50 rounded border border-terminal-border">
                        <div className="text-xs text-terminal-muted uppercase mb-1">Packets/sec</div>
                        <div className="text-lg font-bold text-terminal-cyan">42.7K</div>
                      </div>
                      <div className="p-3 bg-terminal-secondary/50 rounded border border-terminal-border">
                        <div className="text-xs text-terminal-muted uppercase mb-1">Latency</div>
                        <div className="text-lg font-bold text-terminal-green">12ms</div>
                      </div>
                    </div>
                    
                    <div className="font-mono text-xs text-terminal-muted">
                      <div className="mb-1">[2024.01.15 14:32:19] Data sync completed</div>
                      <div className="mb-1">[2024.01.15 14:32:18] Analyzing pattern matrix...</div>
                      <div className="mb-1">[2024.01.15 14:32:17] Neural scan initiated</div>
                      <div>[2024.01.15 14:32:16] Connection established</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GridItem>
          </GridShell>
        </div>
      </div>
    </div>
  );
}