'use client';

import { useEffect } from 'react';
import { runAllAccessibilityTests } from '@/lib/utils/accessibility-test';

/**
 * Test page component to validate accessibility improvements
 * This component demonstrates all the accessibility features implemented
 */
export function AccessibilityTestPage() {
  useEffect(() => {
    // Run accessibility tests after component mounts
    const timer = setTimeout(() => {
      console.log('🧪 Running accessibility validation tests...');
      runAllAccessibilityTests();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const runManualTest = () => {
    runAllAccessibilityTests();
  };

  return (
    <div className="accessibility-test-page p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-terminal-cyan mb-4">
          LionSpace Accessibility Test Page
        </h1>
        <p className="text-terminal-text">
          This page demonstrates the accessibility improvements implemented across the platform.
          Check the browser console for detailed test results.
        </p>
      </header>

      <main>
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-terminal-green">
            Color Contrast Testing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-terminal-bg p-4 rounded border border-terminal-border">
              <p className="text-terminal-cyan mb-2">Terminal Cyan on Dark Background</p>
              <p className="text-terminal-text mb-2">Terminal Text on Dark Background</p>
              <p className="text-terminal-green mb-2">Terminal Green on Dark Background</p>
              <p className="text-terminal-gold mb-2">Terminal Gold on Dark Background</p>
              <p className="text-terminal-red">Terminal Red on Dark Background</p>
            </div>
            
            <div className="bg-terminal-secondary p-4 rounded border border-terminal-border">
              <p className="text-terminal-cyan mb-2">Terminal Cyan on Secondary Background</p>
              <p className="text-terminal-text mb-2">Terminal Text on Secondary Background</p>
              <p className="text-terminal-green mb-2">Terminal Green on Secondary Background</p>
              <p className="text-terminal-gold mb-2">Terminal Gold on Secondary Background</p>
              <p className="text-terminal-red">Terminal Red on Secondary Background</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-terminal-green">
            Form Accessibility Testing
          </h2>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="test-input" className="block text-sm font-medium text-terminal-text mb-2">
                Test Input Field
              </label>
              <input
                id="test-input"
                type="text"
                className="w-full px-4 py-2 bg-terminal-secondary border border-terminal-border rounded text-terminal-text focus:ring-2 focus:ring-terminal-cyan/20 focus:border-terminal-cyan focus:outline-none"
                placeholder="Enter test text..."
                aria-describedby="input-help"
              />
              <div id="input-help" className="text-sm text-terminal-muted mt-1">
                This input demonstrates proper labeling and focus management.
              </div>
            </div>

            <div>
              <label htmlFor="test-select" className="block text-sm font-medium text-terminal-text mb-2">
                Test Select Field
              </label>
              <select
                id="test-select"
                className="w-full px-4 py-2 bg-terminal-secondary border border-terminal-border rounded text-terminal-text focus:ring-2 focus:ring-terminal-cyan/20 focus:border-terminal-cyan focus:outline-none"
              >
                <option value="">Choose an option</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-terminal-text mb-2">
                Radio Button Group
              </legend>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="test-radio"
                    value="radio1"
                    className="form-radio text-terminal-cyan bg-terminal-secondary border-terminal-border focus:ring-2 focus:ring-terminal-cyan/20"
                  />
                  <span className="text-terminal-text">Radio Option 1</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="test-radio"
                    value="radio2"
                    className="form-radio text-terminal-cyan bg-terminal-secondary border-terminal-border focus:ring-2 focus:ring-terminal-cyan/20"
                  />
                  <span className="text-terminal-text">Radio Option 2</span>
                </label>
              </div>
            </fieldset>
          </form>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-terminal-green">
            Interactive Elements Testing
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-terminal-cyan/20 text-terminal-cyan border border-terminal-cyan/50 rounded hover:bg-terminal-cyan/30 focus:bg-terminal-cyan/30 focus:outline-none focus:ring-2 focus:ring-terminal-cyan/20 transition-colors">
              Primary Button
            </button>
            
            <button className="px-4 py-2 bg-terminal-green/20 text-terminal-green border border-terminal-green/50 rounded hover:bg-terminal-green/30 focus:bg-terminal-green/30 focus:outline-none focus:ring-2 focus:ring-terminal-green/20 transition-colors">
              Success Button
            </button>
            
            <button className="px-4 py-2 bg-terminal-red/20 text-terminal-red border border-terminal-red/50 rounded hover:bg-terminal-red/30 focus:bg-terminal-red/30 focus:outline-none focus:ring-2 focus:ring-terminal-red/20 transition-colors">
              Danger Button
            </button>
            
            <button
              onClick={runManualTest}
              className="px-4 py-2 bg-terminal-gold/20 text-terminal-gold border border-terminal-gold/50 rounded hover:bg-terminal-gold/30 focus:bg-terminal-gold/30 focus:outline-none focus:ring-2 focus:ring-terminal-gold/20 transition-colors"
              aria-label="Run accessibility tests and output results to console"
            >
              🧪 Run A11y Tests
            </button>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-terminal-green">
            Loading States Testing
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div 
                className="w-8 h-8 border-2 border-terminal-cyan border-t-transparent rounded-full animate-spin"
                role="status"
                aria-label="Loading content"
              ></div>
              <span className="text-terminal-text">Loading with proper ARIA attributes...</span>
            </div>
            
            <div 
              className="p-4 bg-terminal-secondary/50 rounded border border-terminal-border"
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-terminal-green rounded-full animate-pulse"></div>
                <span className="text-terminal-text">System status: Online</span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-terminal-green">
            Keyboard Navigation Testing
          </h2>
          
          <div className="p-4 bg-terminal-secondary/50 rounded border border-terminal-border">
            <h3 className="text-lg font-semibold text-terminal-cyan mb-4">
              Navigation Instructions
            </h3>
            <ul className="space-y-2 text-terminal-text">
              <li>• <kbd className="px-2 py-1 bg-terminal-bg rounded font-mono text-xs">Tab</kbd> - Navigate forward through focusable elements</li>
              <li>• <kbd className="px-2 py-1 bg-terminal-bg rounded font-mono text-xs">Shift + Tab</kbd> - Navigate backward through focusable elements</li>
              <li>• <kbd className="px-2 py-1 bg-terminal-bg rounded font-mono text-xs">Enter</kbd> or <kbd className="px-2 py-1 bg-terminal-bg rounded font-mono text-xs">Space</kbd> - Activate buttons and links</li>
              <li>• <kbd className="px-2 py-1 bg-terminal-bg rounded font-mono text-xs">Arrow Keys</kbd> - Navigate within tab groups and menus</li>
              <li>• <kbd className="px-2 py-1 bg-terminal-bg rounded font-mono text-xs">Escape</kbd> - Close modals and dropdowns</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="text-center text-terminal-muted">
        <p>
          All accessibility improvements follow WCAG 2.1 AA guidelines.
          Open browser console to see detailed test results.
        </p>
      </footer>
    </div>
  );
}