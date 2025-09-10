'use client';

import { Component, type ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
          <div className="max-w-2xl mx-auto p-8 text-center">
            <div className="text-6xl mb-8">⚠️</div>
            <h1 className="text-2xl mb-4">SYSTEM ERROR DETECTED</h1>
            <p className="text-lg mb-6 opacity-80">
              A critical error has occurred in the Matrix. Our systems are working to resolve this issue.
            </p>
            <div className="bg-green-400/10 border border-green-400/30 rounded p-4 mb-6 text-left">
              <div className="text-sm opacity-60 mb-2">ERROR DETAILS:</div>
              <div className="text-green-300 font-semibold">
                {this.state.error?.message || 'Unknown system error'}
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-400 text-black px-6 py-3 rounded hover:bg-green-300 transition-colors"
            >
              RELOAD SYSTEM
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}