'use client';

import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

export default function IntelligenceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Intelligence module error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-16 h-16 text-terminal-red mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-terminal-red font-mono mb-4">
          SYSTEM ERROR DETECTED
        </h2>
        <p className="text-terminal-muted font-mono text-sm mb-6">
          {error.message || 'An unexpected error occurred in the intelligence module'}
        </p>
        {error.digest && (
          <p className="text-terminal-muted font-mono text-xs mb-6">
            Error ID: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="px-6 py-3 bg-terminal-cyan text-terminal-bg font-mono text-sm uppercase rounded hover:bg-terminal-cyan/80 transition-colors"
        >
          RETRY OPERATION
        </button>
      </div>
    </div>
  );
}