import { z } from "zod";

/** Datos del huésped en el paso final del wizard de reserva (sin roomId/fechas). */
export const guestDetailsSchema = z.object({
  guestName: z
    .string()
    .min(2, "Indica tu nombre completo")
    .max(200, "Nombre demasiado largo"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z
    .string()
    .min(7, "Indica un teléfono de contacto")
    .max(30, "Teléfono demasiado largo"),
  notes: z.string().max(1000, "Máximo 1000 caracteres").optional(),
});

export type GuestDetailsValues = z.infer<typeof guestDetailsSchema>;
