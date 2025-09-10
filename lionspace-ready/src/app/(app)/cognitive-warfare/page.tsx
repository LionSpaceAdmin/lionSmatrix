'use client';

export default function CognitiveWarfarePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-terminal-border pb-4">
        <h1 className="text-2xl font-bold text-terminal-cyan font-mono">
          COGNITIVE WARFARE CENTER
        </h1>
        <p className="text-terminal-muted font-mono text-sm mt-1">
          Counter-narrative operations and influence analysis
        </p>
      </div>

      {/* Warning Banner */}
      <div className="bg-terminal-red/10 border border-terminal-red rounded p-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-terminal-red" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-terminal-red font-mono text-sm font-bold">
            CLASSIFIED OPERATIONS MODULE
          </span>
        </div>
        <p className="text-terminal-red font-mono text-xs mt-2">
          Access restricted to authorized personnel only
        </p>
      </div>

      {/* Placeholder Content */}
      <div className="bg-terminal-secondary rounded border border-terminal-border p-8">
        <div className="text-center mb-6">
          <div className="text-terminal-cyan font-mono text-lg mb-4">
            COGNITIVE WARFARE OPERATIONS
          </div>
          <div className="text-terminal-muted font-mono text-sm">
            Advanced counter-narrative and influence operation tools
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-terminal-bg rounded p-4 text-center">
            <div className="text-terminal-cyan font-mono font-bold mb-2">
              NARRATIVE TRACKING
            </div>
            <div className="text-terminal-text font-mono text-sm">
              Monitor and analyze information campaigns
            </div>
          </div>
          <div className="bg-terminal-bg rounded p-4 text-center">
            <div className="text-terminal-cyan font-mono font-bold mb-2">
              INFLUENCE MAPPING
            </div>
            <div className="text-terminal-text font-mono text-sm">
              Track influence networks and key actors
            </div>
          </div>
          <div className="bg-terminal-bg rounded p-4 text-center">
            <div className="text-terminal-cyan font-mono font-bold mb-2">
              COUNTER-OPS
            </div>
            <div className="text-terminal-text font-mono text-sm">
              Deploy counter-narrative strategies
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button className="terminal-button px-6 py-3 font-mono font-bold">
            REQUEST ACCESS
          </button>
        </div>
      </div>
    </div>
  );
}