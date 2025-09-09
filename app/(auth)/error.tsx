'use client';

import { useEffect } from 'react';

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Authentication error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
      <div className="text-center max-w-md">
        <h2 className="text-xl font-bold text-terminal-red font-mono mb-4">
          AUTHENTICATION ERROR
        </h2>
        <p className="text-terminal-muted font-mono text-sm mb-6">
          {error.message || 'Failed to authenticate. Please try again.'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-terminal-cyan text-terminal-bg font-mono text-sm rounded hover:bg-terminal-cyan/80 transition-colors"
        >
          RETRY
        </button>
      </div>
    </div>
  );
}