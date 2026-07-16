"use client";

import { useMutation } from "@tanstack/react-query";
import {
  publicApi,
  type CreateReservationRequest,
  type CreateReservationResponse,
} from "@/lib/api/public";

/**
 * Crea una reserva en línea con estado inicial PENDIENTE.
 * Tras éxito, el caller redirige a la página de confirmación.
 */
export function useCreateReservation() {
  return useMutation<
    CreateReservationResponse,
    Error,
    CreateReservationRequest
  >({
    mutationFn: (input) => publicApi.createReservation(input),
  });
}
