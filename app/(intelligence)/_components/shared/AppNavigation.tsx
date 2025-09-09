'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from '@/app/_contexts/translation-context';

interface AppNavigationProps {
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

export function AppNavigation({ onMenuToggle, sidebarOpen }: AppNavigationProps) {
  const { getCurrentMessage, currentLanguage } = useTranslation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-terminal-bg/95 backdrop-blur border-b border-terminal-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Logo + Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded terminal-button-hover text-terminal-cyan"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-terminal-cyan font-bold text-lg font-mono">
              LIONSPACE
            </span>
          </Link>
        </div>

        {/* Center - Live Intelligence Feed */}
        <div className="hidden md:flex items-center flex-1 max-w-2xl mx-4">
          <div className="bg-terminal-secondary/50 rounded px-4 py-2 w-full">
            <div className="flex items-center justify-between">
              <span className="text-xs text-terminal-muted font-mono">
                LIVE INTEL [{currentLanguage.toUpperCase()}]
              </span>
              <div className="w-2 h-2 bg-terminal-cyan rounded-full animate-pulse"></div>
            </div>
            <div className="text-sm text-terminal-text font-mono mt-1 truncate">
              {getCurrentMessage()}
            </div>
          </div>
        </div>

        {/* Right side - User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center space-x-2 p-2 rounded terminal-button-hover"
          >
            <div className="w-8 h-8 bg-terminal-cyan/20 rounded border border-terminal-cyan flex items-center justify-center">
              <span className="text-xs font-mono text-terminal-cyan">OP</span>
            </div>
            <span className="hidden sm:block text-sm text-terminal-text font-mono">
              OPERATOR
            </span>
          </button>

          {/* User dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-terminal-secondary border border-terminal-border rounded shadow-lg">
              <div className="py-1">
                <Link
                  href="/app/settings"
                  className="block px-4 py-2 text-sm text-terminal-text font-mono hover:bg-terminal-bg"
                >
                  SETTINGS
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-terminal-red font-mono hover:bg-terminal-bg"
                  onClick={() => {
                    // TODO: Implement logout
                    console.log('Logout clicked');
                  }}
                >
                  DISCONNECT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}