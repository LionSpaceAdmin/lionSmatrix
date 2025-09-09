'use client';

import { useState } from 'react';
import { useTranslation } from '@/app/_contexts/translation-context';

export default function SettingsPage() {
  const { currentLanguage, setLanguage, availableLanguages } = useTranslation();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-terminal-border pb-4">
        <h1 className="text-2xl font-bold text-terminal-cyan font-mono">
          SYSTEM SETTINGS
        </h1>
        <p className="text-terminal-muted font-mono text-sm mt-1">
          Configure your intelligence platform
        </p>
      </div>

      {/* Language Settings */}
      <div className="bg-terminal-secondary rounded border border-terminal-border p-6">
        <h2 className="text-lg font-mono text-terminal-cyan mb-4">
          LANGUAGE & LOCALIZATION
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-terminal-text font-mono text-sm mb-2">
              INTERFACE LANGUAGE
            </label>
            <select
              value={currentLanguage}
              onChange={(e) => setLanguage(e.target.value)}
              className="terminal-input w-full md:w-auto"
            >
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="text-terminal-muted font-mono text-xs">
            Current intelligence feed language: {currentLanguage.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-terminal-secondary rounded border border-terminal-border p-6">
        <h2 className="text-lg font-mono text-terminal-cyan mb-4">
          DISPLAY PREFERENCES
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-terminal-text font-mono text-sm">
                DARK MODE
              </div>
              <div className="text-terminal-muted font-mono text-xs">
                Enable terminal-style interface
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-terminal-cyan' : 'bg-terminal-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-terminal-secondary rounded border border-terminal-border p-6">
        <h2 className="text-lg font-mono text-terminal-cyan mb-4">
          NOTIFICATIONS
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-terminal-text font-mono text-sm">
                THREAT ALERTS
              </div>
              <div className="text-terminal-muted font-mono text-xs">
                Real-time security notifications
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications ? 'bg-terminal-cyan' : 'bg-terminal-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-terminal-secondary rounded border border-terminal-border p-6">
        <h2 className="text-lg font-mono text-terminal-cyan mb-4">
          ACCOUNT SECURITY
        </h2>
        <div className="space-y-4">
          <button className="terminal-button w-full md:w-auto">
            CHANGE PASSWORD
          </button>
          <button className="terminal-button-secondary w-full md:w-auto">
            ENABLE 2FA
          </button>
          <button className="terminal-button w-full md:w-auto text-terminal-red border-terminal-red">
            REVOKE ALL SESSIONS
          </button>
        </div>
      </div>
    </div>
  );
}