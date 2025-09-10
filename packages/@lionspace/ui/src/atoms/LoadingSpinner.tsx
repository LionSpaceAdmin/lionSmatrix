'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  message = 'LOADING...', 
  fullScreen = false,
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const containerClasses = fullScreen 
    ? "min-h-screen bg-black flex items-center justify-center"
    : `flex items-center justify-center ${className}`;

  return (
    <div className={containerClasses}>
      <div 
        className="relative"
        role="status"
        aria-live="polite"
        aria-label={message}
      >
        <div className={`${sizeClasses[size]} border-2 border-terminal-cyan border-t-transparent rounded-full animate-spin`} aria-hidden="true"></div>
        <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-terminal-gold border-r-transparent rounded-full animate-spin animate-reverse`} aria-hidden="true"></div>
      </div>
      <span 
        className="ml-4 text-terminal-text font-mono text-sm"
        aria-live="polite"
        role="status"
      >
        {message}
      </span>
      {/* Screen reader only announcement */}
      <span className="sr-only">
        Loading content, please wait. This may take a few moments.
      </span>
    </div>
  );
}