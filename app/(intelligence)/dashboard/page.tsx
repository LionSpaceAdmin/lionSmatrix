'use client';

import { useTranslation } from '@/app/_contexts/translation-context';

export default function DashboardPage() {
  const { getCurrentMessage } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-terminal-border pb-4">
        <h1 className="text-2xl font-bold text-terminal-cyan font-mono">
          COMMAND CENTER
        </h1>
        <p className="text-terminal-muted font-mono text-sm mt-1">
          Intelligence operations dashboard
        </p>
      </div>

      {/* Live Intelligence */}
      <div className="bg-terminal-secondary rounded border border-terminal-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-mono text-terminal-cyan">
            LIVE INTELLIGENCE FEED
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-terminal-cyan rounded-full animate-pulse"></div>
            <span className="text-xs text-terminal-muted font-mono">ACTIVE</span>
          </div>
        </div>
        <div className="bg-terminal-bg rounded p-3">
          <p className="text-terminal-text font-mono text-sm">
            {getCurrentMessage()}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'ACTIVE OPERATIONS', value: '12', status: 'operational' },
          { label: 'THREATS DETECTED', value: '3', status: 'warning' },
          { label: 'ANALYSIS COMPLETE', value: '847', status: 'success' },
          { label: 'RESPONSE TIME', value: '2.3s', status: 'optimal' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-terminal-secondary border border-terminal-border rounded p-4"
          >
            <div className="text-xs text-terminal-muted font-mono mb-1">
              {stat.label}
            </div>
            <div className="text-2xl font-bold text-terminal-cyan font-mono">
              {stat.value}
            </div>
            <div className={`text-xs font-mono mt-1 ${
              stat.status === 'warning' ? 'text-terminal-red' :
              stat.status === 'success' ? 'text-green-400' :
              'text-terminal-cyan'
            }`}>
              {stat.status.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-terminal-secondary rounded border border-terminal-border p-4">
        <h3 className="text-lg font-mono text-terminal-cyan mb-4">
          QUICK ACTIONS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="terminal-button p-4 text-left">
            <div className="font-mono font-bold mb-1">RUN ANALYSIS</div>
            <div className="text-xs text-terminal-muted">Execute threat assessment</div>
          </button>
          <button className="terminal-button p-4 text-left">
            <div className="font-mono font-bold mb-1">VIEW REPORTS</div>
            <div className="text-xs text-terminal-muted">Access intelligence reports</div>
          </button>
          <button className="terminal-button p-4 text-left">
            <div className="font-mono font-bold mb-1">MONITOR NETWORKS</div>
            <div className="text-xs text-terminal-muted">Track network activity</div>
          </button>
        </div>
      </div>
    </div>
  );
}