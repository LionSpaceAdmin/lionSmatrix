'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-green-500 flex items-center justify-center">
      <div className="max-w-md w-full p-8 border border-green-500 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-yellow-500">System Error Detected</h2>
        <p className="mb-4 font-mono text-sm">
          {error.message || 'An error occurred during operation'}
        </p>
        {error.digest && (
          <p className="text-xs opacity-50 mb-4">Error ID: {error.digest}</p>
        )}
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="px-4 py-2 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition-colors"
          >
            Retry Operation
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 border border-green-500 text-green-500 font-bold rounded hover:bg-green-500 hover:text-black transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}