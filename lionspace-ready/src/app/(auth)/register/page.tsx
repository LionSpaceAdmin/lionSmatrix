'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    callSign: '',
    securityCode: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic
    console.log('Registration attempt:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text flex items-center justify-center p-8 font-terminal">
      <div className="terminal-card max-w-md w-full space-y-8 p-8 rounded-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-terminal-cyan terminal-glow">
            OPERATIVE REGISTRATION
          </h1>
          <p className="text-terminal-text/70">
            CLASSIFIED ENROLLMENT PROTOCOL
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="callSign" className="block text-sm font-medium text-terminal-cyan font-terminal">
                CALL SIGN
              </label>
              <input
                id="callSign"
                name="callSign"
                type="text"
                required
                value={formData.callSign}
                onChange={handleChange}
                className="terminal-input mt-1 block w-full px-3 py-2 rounded-md focus-terminal"
                placeholder="OPERATIVE_ALPHA"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-terminal-cyan font-terminal">
                SECURE COMMUNICATION ID
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="terminal-input mt-1 block w-full px-3 py-2 rounded-md focus-terminal"
                placeholder="operative@secure.lionspace.ai"
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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="terminal-input mt-1 block w-full px-3 py-2 rounded-md focus-terminal"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-terminal-cyan font-terminal">
                CONFIRM ACCESS CODE
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="terminal-input mt-1 block w-full px-3 py-2 rounded-md focus-terminal"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="securityCode" className="block text-sm font-medium text-terminal-cyan font-terminal">
                INVITATION CODE
              </label>
              <input
                id="securityCode"
                name="securityCode"
                type="text"
                required
                value={formData.securityCode}
                onChange={handleChange}
                className="terminal-input mt-1 block w-full px-3 py-2 rounded-md focus-terminal"
                placeholder="LION-XXXX-XXXX"
              />
              <p className="text-xs text-terminal-muted mt-1 font-terminal">
                Contact your handler for invitation code
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-terminal-cyan focus:ring-terminal-cyan border-terminal-border rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-terminal-text font-terminal">
              I ACKNOWLEDGE THE CLASSIFIED NATURE OF THIS OPERATION
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="terminal-button w-full flex justify-center py-3 px-4 rounded-md font-terminal font-bold uppercase tracking-wider focus-terminal"
            >
              INITIATE ENROLLMENT
            </button>
          </div>

          <div className="text-center text-sm font-terminal">
            <span className="text-terminal-text/60">ALREADY ENROLLED? </span>
            <Link href="/login" className="text-terminal-cyan hover:text-terminal-cyan/80 transition-colors">
              ACCESS TERMINAL
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}