"use client";

import { useQuery } from "@tanstack/react-query";

import { publicApi } from "@/lib/api/public";

/** Perfil de marca compartido entre cabecera y pie, con deduplicación de red. */
export function usePublicCompanyProfile() {
  return useQuery({
    queryKey: ["public", "company"],
    queryFn: () => publicApi.getCompanyProfile(),
  });
}
