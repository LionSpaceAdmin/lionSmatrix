import * as React from 'react';
import { cn, formatTimestamp } from '@/lib/utils';

interface TerminalWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  scanLine?: boolean;
  glitch?: boolean;
}

const TerminalWindow = React.forwardRef<HTMLDivElement, TerminalWindowProps>(
  ({ className, title = 'LIONSPACE_TERMINAL', scanLine = false, glitch = false, children, ...props }, ref) => {
    const [currentTime, setCurrentTime] = React.useState(new Date());

    React.useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          'bg-terminal-secondary/50 backdrop-blur-sm border border-terminal-border rounded-lg shadow-lg overflow-hidden font-terminal text-terminal-text',
          glitch && 'animate-glitch',
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between h-8 px-3 bg-terminal-border/50">
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-xs font-semibold uppercase">{title}</div>
          <div className="text-xs">{formatTimestamp(currentTime)}</div>
        </div>
        <div className="relative p-4 h-full">
          {scanLine && (
            <div className="absolute top-0 left-0 w-full h-1 bg-terminal-green/20 animate-scan-line" />
          )}
          {children}
        </div>
      </div>
    );
  }
);

TerminalWindow.displayName = 'TerminalWindow';

export { TerminalWindow };
