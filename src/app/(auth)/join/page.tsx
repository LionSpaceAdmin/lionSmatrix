'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function JoinPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text flex items-center justify-center p-8 font-terminal">
      <div className="terminal-card max-w-md w-full space-y-8 p-8 rounded-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-terminal-cyan terminal-glow">JOIN THE RESISTANCE</h1>
          <p className="text-terminal-text/70">FREE MEMBERSHIP - START FIGHTING MISINFORMATION TODAY</p>
        </div>
        
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-terminal-cyan font-terminal">
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="terminal-input mt-1 block w-full px-3 py-2 rounded-md focus-terminal"
                placeholder="warrior@lionspace.ai"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-terminal-cyan font-terminal">
                PASSWORD
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="terminal-input mt-1 block w-full px-3 py-2 rounded-md focus-terminal"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="terminal-button w-full flex justify-center py-3 px-4 rounded-md font-terminal font-bold uppercase tracking-wider focus-terminal"
            >
              Join Now - It&apos;s Free
            </button>
          </div>

          <div className="text-center text-sm font-terminal">
            <span className="text-terminal-text/60">ALREADY A MEMBER? </span>
            <Link href="/login" className="text-terminal-cyan hover:text-terminal-cyan/80 transition-colors">
              SIGN IN
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}