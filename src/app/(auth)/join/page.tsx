'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function JoinPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-black text-green-400 flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-center mb-2">Join the Resistance</h1>
          <p className="text-center text-green-400/60">Free membership - Start fighting misinformation today</p>
        </div>
        
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-black border border-green-400/30 rounded-md text-green-400 placeholder-green-400/30 focus:outline-none focus:ring-green-400 focus:border-green-400"
                placeholder="warrior@lionspace.ai"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-black border border-green-400/30 rounded-md text-green-400 placeholder-green-400/30 focus:outline-none focus:ring-green-400 focus:border-green-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-green-400 rounded-md text-green-400 bg-black hover:bg-green-400/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition-colors"
            >
              Join Now - It's Free
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-green-400/60">Already a member? </span>
            <Link href="/login" className="text-green-400 hover:text-green-300">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}