"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { makeQueryClient } from "@/lib/query-client";

/** El sistema de avisos no debe bloquear el primer render de páginas públicas. */
const Toaster = dynamic(() => import("sonner").then((module) => module.Toaster), {
  ssr: false,
});

/**
 * Proveedores globales del sitio público: React Query y notificaciones Sonner.
 * Sin TooltipProvider (no hay componente tooltip en este proyecto aún).
 *
 * @param children - Árbol de rutas que comparte el cliente de consultas y el toaster.
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
