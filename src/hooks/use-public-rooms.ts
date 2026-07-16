"use client";

import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api/public";

/**
 * Catálogo de habitaciones publicadas en la API pública.
 * Cache key estable para invalidación cruzada si se añaden mutaciones futuras.
 */
export function usePublicRooms() {
  return useQuery({
    queryKey: ["public", "rooms"],
    queryFn: () => publicApi.getRooms(),
  });
}
