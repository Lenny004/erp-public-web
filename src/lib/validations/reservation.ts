import { z } from "zod";
import { personNameSchema } from "@/lib/validations/person-name";

/** Datos del huésped en el paso final del wizard de reserva (sin roomId/fechas). */
export const guestDetailsSchema = z.object({
  guestName: personNameSchema("Nombre", 2, 200),
  email: z.string().email("Correo electrónico inválido").max(100, "Máximo 100 caracteres"),
  phone: z
    .string()
    .max(30, "Teléfono demasiado largo")
    .refine(
      (value) => /^[+()\d\s-]+$/.test(value) && (value.match(/\d/g)?.length ?? 0) >= 7,
      "Indica un teléfono válido de al menos 7 dígitos",
    ),
  notes: z.string().max(1000, "Máximo 1000 caracteres").optional(),
});

export type GuestDetailsValues = z.infer<typeof guestDetailsSchema>;
