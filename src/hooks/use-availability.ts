"use client";

import { useMutation } from "@tanstack/react-query";
import {
  publicApi,
  type AvailabilityRequest,
  type AvailabilityResponse,
} from "@/lib/api/public";

/**
 * Consulta disponibilidad de habitaciones para un rango de fechas.
 * Usado en el wizard de reserva y en búsquedas puntuales.
 */
export function useAvailability() {
  return useMutation<AvailabilityResponse, Error, AvailabilityRequest>({
    mutationFn: (input) => publicApi.checkAvailability(input),
  });
}
