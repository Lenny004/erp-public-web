"use client";

import { useMutation } from "@tanstack/react-query";
import {
  publicApi,
  type ContactRequest,
  type ContactResponse,
} from "@/lib/api/public";

/** Envía el formulario de contacto al endpoint público. */
export function useContact() {
  return useMutation<ContactResponse, Error, ContactRequest>({
    mutationFn: (input) => publicApi.submitContact(input),
  });
}
