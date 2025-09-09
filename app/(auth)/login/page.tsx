'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      // TODO: Implement real authentication
      router.push('/app/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text flex items-center justify-center p-8 font-terminal">
      <div className="terminal-card max-w-md w-full space-y-8 p-8 rounded-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-terminal-cyan terminal-glow">
            ACCESS TERMINAL
          </h1>
          <p className="text-terminal-text/70">
            ENTER CREDENTIALS TO PROCEED
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-terminal-cyan font-terminal">
                USER ID
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
                placeholder="operator@lionspace.ai"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-terminal-cyan font-terminal">
                ACCESS CODE
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="terminal-input mt-1 block w-full px-3 py-2 rounded-md focus-terminal"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-terminal-cyan focus:ring-terminal-cyan border-terminal-border rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-terminal-text font-terminal">
                REMEMBER SESSION
              </label>
            </div>

            <div className="text-sm">
              <Link href="/reset-password" className="font-terminal text-terminal-cyan hover:text-terminal-cyan/80">
                FORGOT CODE?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="terminal-button w-full flex justify-center py-3 px-4 rounded-md font-terminal font-bold uppercase tracking-wider focus-terminal disabled:opacity-50"
            >
              {loading ? 'ACCESSING...' : 'AUTHENTICATE'}
            </button>
          </div>

          <div className="text-center text-sm font-terminal">
            <span className="text-terminal-text/60">NEW OPERATIVE? </span>
            <Link href="/join" className="text-terminal-cyan hover:text-terminal-cyan/80 transition-colors">
              REQUEST ACCESS
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}