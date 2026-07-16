"use client";

import { QueryClient } from "@tanstack/react-query";

/** Opciones por defecto para todas las consultas del sitio público. */
const DEFAULT_QUERY_OPTIONS = {
  /** Datos considerados frescos durante 60 s antes de un refetch en segundo plano. */
  staleTime: 60_000,
  refetchOnWindowFocus: true,
  retry: 1,
} as const;

/**
 * Crea un `QueryClient` nuevo para el App Router.
 *
 * El `QueryClientProvider` del layout debe obtener la instancia vía
 * `useState(() => makeQueryClient())` para tener una copia estable por montaje
 * (evita fugas entre requests SSR y el error "No QueryClient set").
 *
 * @returns Instancia configurada de React Query.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: DEFAULT_QUERY_OPTIONS,
    },
  });
}
