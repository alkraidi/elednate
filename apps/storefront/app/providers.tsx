'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { CartProvider } from '@/lib/cart-context';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } },
      })
  );
  return (
    <QueryClientProvider client={client}>
      <CartProvider>
        {children}
        <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' } }} />
      </CartProvider>
    </QueryClientProvider>
  );
}
