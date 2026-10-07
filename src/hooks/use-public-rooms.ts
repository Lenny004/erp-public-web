"use client";

import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api/public";

/**
 * Catálogo de habitaciones publicadas en la API pública.
 * La clave identifica de forma estable esta consulta dentro de React Query.
 */
export function usePublicRooms() {
  return useQuery({
    queryKey: ["public", "rooms"],
    queryFn: () => publicApi.getRooms(),
  });
}
