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
  defaultValues?: Partial<GuestDetailsValues>;
  isSubmitting?: boolean;
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
      className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
      aria-label="Datos del huésped"
    >
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">Tus datos</h3>
        <p className="text-sm text-muted-foreground">
          Usaremos esta información para confirmar tu reserva.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="guestName">Nombre completo</Label>
          <Input
            id="guestName"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            autoComplete="name"
            aria-invalid={Boolean(errors.guestName)}
          />
          {errors.guestName && (
            <p className="text-xs text-destructive">{errors.guestName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
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
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">Notas (opcional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Llegada tarde, cama extra, etc."
            aria-invalid={Boolean(errors.notes)}
          />
          {errors.notes && (
            <p className="text-xs text-destructive">{errors.notes}</p>
          )}
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Confirmando reserva…
          </>
        ) : (
          "Confirmar reserva"
        )}
      </Button>
    </form>
  );
}
