import { z } from "zod";

// ---------------------------------------------------------------------------
// Esquemas compartidos de fechas
// ---------------------------------------------------------------------------

/** Fecha ISO de calendario (`YYYY-MM-DD`) usada en búsqueda y reserva. */
const isoDateField = z
  .string()
  .min(1, "La fecha es obligatoria")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Usa el formato AAAA-MM-DD");

/**
 * Valida que la fecha de salida sea estrictamente posterior a la de entrada.
 *
 * @param data - Par check-in / check-out del formulario.
 * @returns `true` si checkout > checkin.
 */
function isCheckoutAfterCheckin(data: {
  checkin: string;
  checkout: string;
}): boolean {
  return new Date(data.checkout) > new Date(data.checkin);
}

// ---------------------------------------------------------------------------
// Búsqueda de disponibilidad
// ---------------------------------------------------------------------------

/**
 * Esquema del buscador de disponibilidad en la página principal / resultados.
 * `guests` es opcional y se limita a un rango razonable para habitaciones hoteleras.
 */
export const availabilitySearchSchema = z
  .object({
    checkin: isoDateField,
    checkout: isoDateField,
    guests: z
      .coerce
      .number()
      .int("El número de huéspedes debe ser entero")
      .min(1, "Mínimo 1 huésped")
      .max(20, "Máximo 20 huéspedes")
      .optional(),
  })
  .refine(isCheckoutAfterCheckin, {
    message: "La fecha de salida debe ser posterior a la de entrada",
    path: ["checkout"],
  });

export type AvailabilitySearchValues = z.infer<typeof availabilitySearchSchema>;

// ---------------------------------------------------------------------------
// Formulario de reserva
// ---------------------------------------------------------------------------

/**
 * Esquema del formulario de confirmación de reserva (datos del huésped + habitación).
 */
export const reservationFormSchema = z
  .object({
    guestName: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(120, "El nombre es demasiado largo"),
    email: z
      .string()
      .min(1, "El correo es obligatorio")
      .email("Ingresa un correo electrónico válido"),
    phone: z
      .string()
      .min(7, "El teléfono debe tener al menos 7 dígitos")
      .max(30, "El teléfono es demasiado largo"),
    notes: z
      .string()
      .max(500, "Las notas no pueden superar 500 caracteres")
      .optional(),
    roomId: z.string().uuid("Selecciona una habitación válida"),
    checkin: isoDateField,
    checkout: isoDateField,
  })
  .refine(isCheckoutAfterCheckin, {
    message: "La fecha de salida debe ser posterior a la de entrada",
    path: ["checkout"],
  });

export type ReservationFormValues = z.infer<typeof reservationFormSchema>;
