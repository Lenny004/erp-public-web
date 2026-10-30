"use client";

import { useCallback, useState } from "react";
import { z } from "zod";
import {
  guestDetailsSchema,
  type GuestDetailsValues,
} from "@/lib/validations/reservation";
import { useFormValidation } from "@/hooks/use-form-validation";
import { separarNombreCompleto, unirNombre } from "@/lib/nombres";
import { Button } from "@/components/ui/button";
import { Field, messageId } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ReservationFormProps {
  /** Valores iniciales que pueden conservarse al volver a este paso. */
  defaultValues?: Partial<GuestDetailsValues>;
  /** Bloquea el formulario mientras se crea la reserva. */
  isSubmitting?: boolean;
  /** Recibe los datos validados para iniciar la creación de la reserva. */
  onSubmit: (values: GuestDetailsValues) => void | Promise<void>;
}

/** Valores de la UI: nombre y apellidos separados; se unen en `guestName` al enviar. */
interface GuestFormState {
  firstNames: string;
  paternalSurname: string;
  maternalSurname: string;
  email: string;
  phone: string;
  notes: string;
}

type Campo = keyof GuestFormState;

/** Esquema de la UI; al pasar, se valida además contra `guestDetailsSchema` (contrato del API). */
const guestFormSchema = z.object({
  firstNames: z.string().trim().min(2, "Ingresa tu nombre").max(100, "Nombre demasiado largo"),
  paternalSurname: z.string().trim().min(2, "Ingresa tu apellido paterno").max(50, "Apellido demasiado largo"),
  maternalSurname: z.string().trim().max(50, "Apellido demasiado largo"),
  email: z.string().email("Ingresa un correo como nombre@dominio.com"),
  phone: z.string().min(7, "Ingresa un teléfono de al menos 7 dígitos").max(30, "Teléfono demasiado largo"),
  notes: z.string().max(1000, "Máximo 1000 caracteres"),
});

const IDS: Record<Campo, string> = {
  firstNames: "guestFirstNames",
  paternalSurname: "guestPaternalSurname",
  maternalSurname: "guestMaternalSurname",
  email: "email",
  phone: "phone",
  notes: "notes",
};

/**
 * Paso final del wizard: datos del huésped y notas opcionales.
 * Valida con Zod antes de delegar la creación al hook useCreateReservation.
 */
export function ReservationForm({
  defaultValues,
  isSubmitting = false,
  onSubmit,
}: ReservationFormProps) {
  const [values, setValues] = useState<GuestFormState>(() => {
    const nombre = separarNombreCompleto(defaultValues?.guestName ?? "");
    return {
      firstNames: nombre.nombres,
      paternalSurname: nombre.paterno,
      maternalSurname: nombre.materno,
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      notes: defaultValues?.notes ?? "",
    };
  });
  const getValues = useCallback(() => values, [values]);
  const { errors, validarCampo, alCambiar, validarTodo } = useFormValidation<Campo, z.infer<typeof guestFormSchema>>(
    guestFormSchema,
    getValues,
  );

  function updateField(key: Campo, value: string) {
    const next = { ...values, [key]: value };
    setValues(next);
    alCambiar(key, next);
  }

  /** Props comunes de accesibilidad y validación por campo. */
  const control = (campo: Campo) => ({
    id: IDS[campo],
    value: values[campo],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField(campo, e.target.value),
    onBlur: () => validarCampo(campo),
    "aria-invalid": Boolean(errors[campo]),
    "aria-describedby": messageId(IDS[campo]),
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    const ui = validarTodo(IDS);
    if (!ui) return;

    const parsed = guestDetailsSchema.safeParse({
      guestName: unirNombre(ui.firstNames, ui.paternalSurname, ui.maternalSurname),
      email: ui.email,
      phone: ui.phone,
      notes: ui.notes || undefined,
    });
    if (!parsed.success) return;

    await onSubmit(parsed.data);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
      aria-label="Datos del huésped"
    >
      {/* Sección: identidad del huésped */}
      <fieldset className="space-y-4 border-b border-border/60 px-6 py-8 sm:px-8">
        <legend className="sr-only">Información personal</legend>
        <header className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">Información personal</h3>
          <p className="text-sm text-muted-foreground">Tal como aparece en tu identificación.</p>
        </header>

        <Field id={IDS.firstNames} label="Nombres" required error={errors.firstNames}>
          <Input {...control("firstNames")} autoComplete="given-name" placeholder="Ej. Ana María" maxLength={100} aria-required />
        </Field>

        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <Field id={IDS.paternalSurname} label="Apellido paterno" required error={errors.paternalSurname}>
            <Input {...control("paternalSurname")} autoComplete="family-name" placeholder="Ej. López" maxLength={50} aria-required />
          </Field>
          <Field id={IDS.maternalSurname} label="Apellido materno" optional error={errors.maternalSurname}>
            <Input {...control("maternalSurname")} autoComplete="additional-name" placeholder="Ej. Martínez" maxLength={50} />
          </Field>
        </div>
      </fieldset>

      {/* Sección: datos de contacto */}
      <fieldset className="space-y-4 border-b border-border/60 px-6 py-8 sm:px-8">
        <legend className="sr-only">Contacto</legend>
        <header className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">Contacto</h3>
          <p className="text-sm text-muted-foreground">Aquí te enviaremos la confirmación.</p>
        </header>

        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <Field id={IDS.email} label="Correo electrónico" required error={errors.email}>
            <Input {...control("email")} type="email" inputMode="email" autoComplete="email" placeholder="nombre@dominio.com" aria-required />
          </Field>
          <Field id={IDS.phone} label="Teléfono" required error={errors.phone}>
            <Input {...control("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="0000-0000" maxLength={30} aria-required />
          </Field>
        </div>
      </fieldset>

      {/* Sección: notas opcionales */}
      <div className="space-y-4 px-6 py-8 sm:px-8">
        <Field id={IDS.notes} label="Notas adicionales" optional error={errors.notes} hint="Máximo 1000 caracteres.">
          <Textarea
            {...control("notes")}
            placeholder="Llegada tarde, cama extra, alergias, etc."
            rows={4}
            maxLength={1000}
            className="resize-none"
          />
        </Field>
      </div>

      {/* CTA de confirmación — separado visualmente del formulario */}
      <div className="border-t border-border/60 bg-muted/15 px-6 py-6 sm:px-8">
        <Button
          type="submit"
          size="lg"
          className="h-12 w-full text-base sm:w-auto sm:min-w-[220px]"
          loading={isSubmitting}
        >
          {isSubmitting ? "Confirmando reserva…" : "Confirmar reserva"}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Tu solicitud quedará pendiente hasta que el equipo la revise.
        </p>
      </div>
    </form>
  );
}
