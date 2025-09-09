'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password reset logic
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-terminal-bg text-terminal-text flex items-center justify-center p-8 font-terminal">
        <div className="terminal-card max-w-md w-full space-y-8 p-8 rounded-lg text-center">
          <div className="text-terminal-cyan font-mono text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-terminal-cyan font-terminal">
            RESET REQUEST TRANSMITTED
          </h1>
          <p className="text-terminal-text/70 font-terminal">
            Secure reset instructions have been dispatched to your communication channel.
            Check your encrypted inbox.
          </p>
          <div className="pt-4">
            <Link 
              href="/login"
              className="terminal-button inline-block px-6 py-3 font-terminal font-bold uppercase tracking-wider"
            >
              RETURN TO TERMINAL
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text flex items-center justify-center p-8 font-terminal">
      <div className="terminal-card max-w-md w-full space-y-8 p-8 rounded-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 text-terminal-cyan terminal-glow">
            ACCESS CODE RESET
          </h1>
          <p className="text-terminal-text/70">
            RECOVER YOUR TERMINAL ACCESS
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-terminal-cyan font-terminal">
              REGISTERED COMMUNICATION ID
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
              placeholder="operative@lionspace.ai"
            />
            <p className="text-xs text-terminal-muted mt-2 font-terminal">
              Enter the secure communication ID used during your enrollment
            </p>
          </div>

          <div>
            <button
              type="submit"
              className="terminal-button w-full flex justify-center py-3 px-4 rounded-md font-terminal font-bold uppercase tracking-wider focus-terminal"
            >
              TRANSMIT RESET REQUEST
            </button>
          </div>

          <div className="text-center text-sm font-terminal space-y-2">
            <div>
              <Link href="/login" className="text-terminal-cyan hover:text-terminal-cyan/80 transition-colors">
                RETURN TO LOGIN
              </Link>
            </div>
            <div>
              <span className="text-terminal-text/60">NEED NEW ACCESS? </span>
              <Link href="/join" className="text-terminal-cyan hover:text-terminal-cyan/80 transition-colors">
                REQUEST ENROLLMENT
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}