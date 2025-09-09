'use client';

import { ReactNode } from 'react';

interface GridShellProps {
  className?: string;
  children: ReactNode;
}

export function GridShell({ className = '', children }: GridShellProps) {
  return (
    <div className={`grid ${className}`}>
      {children}
    </div>
  );
}

interface GridItemProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export function GridItem({ className = '', children, onClick }: GridItemProps) {
  return (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  );
}

interface CardProps {
  className?: string;
  children: ReactNode;
  variant?: 'default' | 'glow' | 'solid';
}

export function Card({ className = '', children, variant = 'default' }: CardProps) {
  const baseClasses = 'rounded-lg transition-all duration-200';
  const variantClasses = {
    default: 'bg-terminal-bg/95 border border-terminal-border shadow-terminal',
    glow: 'bg-terminal-secondary/50 border border-terminal-cyan/30 shadow-glow-cyan',
    solid: 'bg-terminal-secondary border border-terminal-border'
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  className?: string;
  children: ReactNode;
}

export function CardHeader({ className = '', children }: CardHeaderProps) {
  return (
    <div className={`p-6 pb-4 border-b border-terminal-border/50 ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  className?: string;
  children: ReactNode;
}

export function CardTitle({ className = '', children }: CardTitleProps) {
  return (
    <h3 className={`text-lg font-bold text-terminal-cyan uppercase tracking-wider font-terminal ${className}`}>
      {children}
    </h3>
  );
}

interface CardContentProps {
  className?: string;
  children: ReactNode;
}

export function CardContent({ className = '', children }: CardContentProps) {
  return (
    <div className={`p-6 pt-4 ${className}`}>
      {children}
    </div>
  );
}

interface CardDescriptionProps {
  className?: string;
  children: ReactNode;
}

export function CardDescription({ className = '', children }: CardDescriptionProps) {
  return (
    <p className={`text-sm text-terminal-muted font-terminal ${className}`}>
      {children}
    </p>
  );
}