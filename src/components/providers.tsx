"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { makeQueryClient } from "@/lib/query-client";

/**
 * Proveedores globales del sitio público: React Query y notificaciones Sonner.
 * Sin TooltipProvider (no hay componente tooltip en este proyecto aún).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
      />
    </QueryClientProvider>
  );
}
