import { z } from "zod";
import { personNameSchema } from "@/lib/validations/person-name";

/**
 * Esquema del formulario de contacto público (página de contacto / pie de página).
 * El teléfono es opcional; el mensaje exige un mínimo para evitar envíos vacíos.
 */
export const contactFormSchema = z.object({
  name: personNameSchema("Nombre", 2, 120),
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Ingresa un correo electrónico válido")
    .max(100, "Máximo 100 caracteres"),
  phone: z
    .string()
    .max(30, "El teléfono es demasiado largo")
    .refine(
      (value) => value === "" || (/^[+()\d\s-]+$/.test(value) && (value.match(/\d/g)?.length ?? 0) >= 7),
      "Ingresa un teléfono válido de al menos 7 dígitos",
    )
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(2000, "El mensaje es demasiado largo"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
