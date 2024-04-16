'use client';
import { ThemeProvider } from '@/providers/theme-provider';
import React from 'react';
import { QueryClientProvider } from './query-client-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
