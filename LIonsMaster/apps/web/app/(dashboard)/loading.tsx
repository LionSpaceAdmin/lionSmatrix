export default function IntelligenceLoading() {
  return (
    <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-terminal-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <div className="text-terminal-cyan font-mono text-xl">
          LOADING INTELLIGENCE SYSTEMS...
        </div>
        <div className="mt-2 text-terminal-muted text-sm font-mono">
          Initializing secure connection
        </div>
      </div>
    </div>
  );
}