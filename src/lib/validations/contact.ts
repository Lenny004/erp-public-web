import { z } from "zod";

/**
 * Esquema del formulario de contacto público (página de contacto / pie de página).
 * El teléfono es opcional; el mensaje exige un mínimo para evitar envíos vacíos.
 */
export const contactFormSchema = z.object({
  name: z
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
    .max(30, "El teléfono es demasiado largo")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(2000, "El mensaje es demasiado largo"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
