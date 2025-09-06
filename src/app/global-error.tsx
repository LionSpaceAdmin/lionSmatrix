'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-black text-green-500 flex items-center justify-center">
          <div className="max-w-md w-full p-8 border border-green-500 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-red-500">System Critical Error</h2>
            <p className="mb-4 font-mono text-sm">
              {error.message || 'An unexpected error occurred'}
            </p>
            {error.digest && (
              <p className="text-xs opacity-50 mb-4">Error ID: {error.digest}</p>
            )}
            <button
              onClick={reset}
              className="px-4 py-2 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition-colors"
            >
              Attempt Recovery
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}