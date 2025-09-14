'use client';

import React from 'react';
import { Shield, Target, Globe, Zap } from 'lucide-react';
import Link from 'next/link';

export function ActionGrid() {
  const actions = [
    { href: '/dashboard/war-machine', icon: Shield, label: 'War Machine', color: 'text-red-400' },
    { href: '/dashboard/tools/fact-check', icon: Target, label: 'Fact Check', color: 'text-yellow-400' },
    { href: '/dashboard/command-center', icon: Globe, label: 'Command', color: 'text-cyan-400' },
    { href: '/daily-brief', icon: Zap, label: 'Daily Brief', color: 'text-green-400' }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.href}
            href={action.href}
            className="p-4 rounded bg-terminal-bg border border-terminal-border 
                     hover:border-terminal-cyan transition-colors text-center group"
          >
            <Icon className={`w-8 h-8 ${action.color} mx-auto mb-2 
                           group-hover:scale-110 transition-transform`} />
            <span className="text-xs font-mono text-terminal-text">
              {action.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default ActionGrid;