'use client';

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative">
        <div className="w-12 h-12 border-2 border-terminal-cyan border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-2 border-terminal-gold border-r-transparent rounded-full animate-spin animate-reverse"></div>
      </div>
      <span className="ml-4 text-terminal-text font-mono text-sm">
        INITIALIZING MATRIX...
      </span>
    </div>
  );
}