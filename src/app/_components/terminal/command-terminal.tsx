'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

interface Command {
  id: string;
  input: string;
  output: string;
  timestamp: Date;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface CommandTerminalProps {
  title?: string;
  height?: string;
  onCommand?: (command: string) => Promise<string>;
  welcomeMessage?: string;
  commands?: Record<string, string>;
}

export function CommandTerminal({
  title = 'TERMINAL',
  height = '400px',
  onCommand,
  welcomeMessage = 'LionSpace Intelligence Terminal v2.0.0\nType "help" for available commands.\n',
  commands = {
    help: 'Available commands: help, status, clear, analyze, scan',
    status: 'System Status: OPERATIONAL\nAll systems functioning within normal parameters.',
    clear: '__CLEAR__',
    analyze: 'Initiating analysis protocol...\nScanning data streams...\nAnalysis complete.',
    scan: 'Scanning network...\nNodes detected: 247\nThreat level: MODERATE'
  }
}: CommandTerminalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Add welcome message
    if (welcomeMessage) {
      setHistory([{
        id: 'welcome',
        input: '',
        output: welcomeMessage,
        timestamp: new Date(),
        type: 'info'
      }]);
    }
  }, [welcomeMessage]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (!trimmedCmd) return;

    let output = '';
    let type: Command['type'] = 'success';

    // Check built-in commands
    if (trimmedCmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    if (commands[trimmedCmd]) {
      output = commands[trimmedCmd];
    } else if (onCommand) {
      try {
        output = await onCommand(trimmedCmd);
      } catch (error) {
        output = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        type = 'error';
      }
    } else {
      output = `Command not found: ${trimmedCmd}\nType "help" for available commands.`;
      type = 'error';
    }

    const newCommand: Command = {
      id: Date.now().toString(),
      input: cmd,
      output,
      timestamp: new Date(),
      type
    };

    setHistory(prev => [...prev, newCommand]);
    setInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        const historicalCommand = history[history.length - 1 - newIndex];
        if (historicalCommand?.input) {
          setInput(historicalCommand.input);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        const historicalCommand = history[history.length - 1 - newIndex];
        if (historicalCommand?.input) {
          setInput(historicalCommand.input);
        }
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const getOutputColor = (type: Command['type']) => {
    switch (type) {
      case 'error': return 'text-terminal-red';
      case 'warning': return 'text-terminal-gold';
      case 'success': return 'text-terminal-cyan';
      default: return 'text-terminal-text';
    }
  };

  return (
    <div className="terminal-card rounded-lg overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-terminal-secondary px-4 py-2 border-b border-terminal-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-terminal-red" />
            <div className="w-3 h-3 rounded-full bg-terminal-gold" />
            <div className="w-3 h-3 rounded-full bg-terminal-cyan" />
          </div>
          <span className="text-xs text-terminal-muted font-terminal ml-2">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="status-online" />
          <span className="text-xs text-terminal-cyan font-terminal">CONNECTED</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div 
        ref={terminalRef}
        className="bg-terminal-bg p-4 overflow-y-auto font-terminal text-sm"
        style={{ height }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Command History */}
        {history.map((cmd) => (
          <div key={cmd.id} className="mb-3">
            {cmd.input && (
              <div className="flex items-start gap-2 text-terminal-text">
                <ChevronRight className="w-4 h-4 text-terminal-cyan flex-shrink-0 mt-0.5" />
                <span className="break-all">{cmd.input}</span>
              </div>
            )}
            <pre className={`whitespace-pre-wrap break-all mt-1 ${getOutputColor(cmd.type)}`}>
              {cmd.output}
            </pre>
          </div>
        ))}

        {/* Current Input Line */}
        <div className="flex items-start gap-2">
          <ChevronRight className="w-4 h-4 text-terminal-cyan flex-shrink-0 mt-0.5" />
          <div className="flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-terminal-text font-terminal"
              spellCheck={false}
              autoComplete="off"
              placeholder="Enter command..."
            />
            <span className="terminal-cursor" />
          </div>
        </div>
      </div>
    </div>
  );
}