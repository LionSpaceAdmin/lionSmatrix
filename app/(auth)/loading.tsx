export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-terminal-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <div className="text-terminal-cyan font-mono">
          AUTHENTICATING...
        </div>
      </div>
    </div>
  );
}