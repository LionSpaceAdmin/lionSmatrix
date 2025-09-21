'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Toaster } from '@/components/ui/toaster';
import { isRTL } from '@/lib/i18n';

// Create a client
const queryClient = new QueryClient();

export function Providers({ children, locale }: { children: React.ReactNode; locale: string }) {
  const direction = isRTL(locale) ? 'rtl' : 'ltr';

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div dir={direction}>
            {children}
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}