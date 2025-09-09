'use client';

import { useState } from 'react';

interface CommandPanelProps {
  sessionId?: string;
}

export function CommandPanel({ sessionId }: CommandPanelProps) {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    // Add to history
    setHistory(prev => [...prev, command]);
    
    // Send command to server
    try {
      const response = await fetch('/api/war-room/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, command }),
      });
      
      if (response.ok) {
        setCommand('');
      }
    } catch (error) {
      console.error('Command failed:', error);
    }
  };

  return (
    <div className="bg-gray-950 rounded-lg p-4">
      <h3 className="text-green-400 font-mono text-sm mb-3">COMMAND INTERFACE</h3>
      
      {/* Command History */}
      <div className="bg-black rounded p-3 h-32 overflow-y-auto mb-3 font-mono text-xs">
        {history.length === 0 ? (
          <p className="text-green-600/30">No commands executed</p>
        ) : (
          history.map((cmd, i) => (
            <div key={i} className="text-green-400">
              <span className="text-green-600">&gt;</span> {cmd}
            </div>
          ))
        )}
      </div>

      {/* Command Input */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter command..."
          className="flex-1 bg-black border border-green-900 rounded px-3 py-2 text-green-400 font-mono text-sm focus:outline-none focus:border-green-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-900 hover:bg-green-800 text-green-100 font-mono text-sm rounded transition-colors"
        >
          EXECUTE
        </button>
      </form>
    </div>
  );
}