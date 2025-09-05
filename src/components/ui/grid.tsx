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
}

export function GridItem({ className = '', children }: GridItemProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

interface CardProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className = '', children }: CardProps) {
  return (
    <div className={`bg-black/50 border border-green-400/20 rounded-lg ${className}`}>
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
    <div className={`p-4 pb-2 ${className}`}>
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
    <h3 className={`text-lg font-semibold text-green-400 ${className}`}>
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
    <div className={`p-4 pt-2 ${className}`}>
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
    <p className={`text-sm text-green-400/60 ${className}`}>
      {children}
    </p>
  );
}