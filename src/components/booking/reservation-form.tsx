"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  guestDetailsSchema,
  type GuestDetailsValues,
} from "@/lib/validations/reservation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ReservationFormProps {
  /** Valores iniciales que pueden conservarse al volver a este paso. */
  defaultValues?: Partial<GuestDetailsValues>;
  /** Bloquea el formulario mientras se crea la reserva. */
  isSubmitting?: boolean;
  /** Recibe los datos validados para iniciar la creación de la reserva. */
  onSubmit: (values: GuestDetailsValues) => void | Promise<void>;
}

/**
 * Paso final del wizard: datos del huésped y notas opcionales.
 * Valida con Zod antes de delegar la creación al hook useCreateReservation.
 */
export function ReservationForm({
  defaultValues,
  isSubmitting = false,
  onSubmit,
}: ReservationFormProps) {
  const [guestName, setGuestName] = useState(defaultValues?.guestName ?? "");
  const [email, setEmail] = useState(defaultValues?.email ?? "");
  const [phone, setPhone] = useState(defaultValues?.phone ?? "");
  const [notes, setNotes] = useState(defaultValues?.notes ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});

    const parsed = guestDetailsSchema.safeParse({
      guestName,
      email,
      phone,
      notes: notes || undefined,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    await onSubmit(parsed.data);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
      aria-label="Datos del huésped"
    >
      {/* Sección: identidad del huésped */}
      <div className="space-y-6 border-b border-border/60 px-6 py-8 sm:px-8">
        <header className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">
            Información personal
          </h3>
          <p className="text-sm text-muted-foreground">
            Nombre tal como aparece en tu identificación.
          </p>
        </header>

        <div className="space-y-2">
          <Label htmlFor="guestName">Nombre completo</Label>
          <Input
            id="guestName"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            autoComplete="name"
            className="h-11"
            aria-invalid={Boolean(errors.guestName)}
          />
          {errors.guestName && (
            <p className="text-xs text-destructive">{errors.guestName}</p>
          )}
        </div>
      </div>

      {/* Sección: datos de contacto */}
      <div className="space-y-6 border-b border-border/60 px-6 py-8 sm:px-8">
        <header className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">Contacto</h3>
          <p className="text-sm text-muted-foreground">
            Te enviaremos la confirmación y cualquier actualización por estos
            medios.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="h-11"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              className="h-11"
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Sección: notas opcionales */}
      <div className="space-y-6 px-6 py-8 sm:px-8">
        <header className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">
            Notas adicionales
            <span className="ml-1.5 text-sm font-normal text-muted-foreground">
              (opcional)
            </span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Cuéntanos si tienes alguna preferencia o solicitud especial.
          </p>
        </header>

        <div className="space-y-2">
          <Label htmlFor="notes" className="sr-only">
            Notas opcionales
          </Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Llegada tarde, cama extra, alergias, etc."
            rows={4}
            className="resize-none"
            aria-invalid={Boolean(errors.notes)}
          />
          {errors.notes && (
            <p className="text-xs text-destructive">{errors.notes}</p>
          )}
        </div>
      </div>

      {/* CTA de confirmación — separado visualmente del formulario */}
      <div className="border-t border-border/60 bg-muted/15 px-6 py-6 sm:px-8">
        <Button
          type="submit"
          size="lg"
          className="h-12 w-full text-base sm:w-auto sm:min-w-[220px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Confirmando reserva…
            </>
          ) : (
            "Confirmar reserva"
          )}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Al confirmar, tu solicitud quedará en estado pendiente hasta que el
          equipo la revise.
        </p>
      </div>
    </form>
  );
}
