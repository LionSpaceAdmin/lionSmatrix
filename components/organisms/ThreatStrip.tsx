'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function ThreatStrip() {
  return (
    <div className="bg-red-500/10 border-y border-red-500/30 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
          <span className="text-red-400 font-mono text-sm">
            THREAT LEVEL: ELEVATED - 47 Active Threats Detected
          </span>
        </div>
        <button className="text-red-400/60 hover:text-red-400 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default ThreatStrip;