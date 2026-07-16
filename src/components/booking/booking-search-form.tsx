"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, Users } from "lucide-react";
import {
  availabilitySearchSchema,
  type AvailabilitySearchValues,
} from "@/lib/validations/booking";
import { toDateInputValue } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookingSearchFormProps {
  /** Valores iniciales (p. ej. desde query params del home o /reservar). */
  defaultValues?: Partial<AvailabilitySearchValues>;
  /** Si se define, se llama en lugar de navegar a /reservar. */
  onSearch?: (values: AvailabilitySearchValues & { guests: number }) => void;
  /** Texto del botón principal. */
  submitLabel?: string;
  /** Ocultar navegación automática cuando hay onSearch. */
  className?: string;
}

/**
 * Formulario compacto de búsqueda: fechas + huéspedes.
 * Por defecto navega a /reservar con query params; en el wizard usa onSearch.
 */
export function BookingSearchForm({
  defaultValues,
  onSearch,
  submitLabel = "Buscar disponibilidad",
  className,
}: BookingSearchFormProps) {
  const router = useRouter();
  const today = toDateInputValue(new Date());
  const tomorrow = toDateInputValue(
    new Date(Date.now() + 24 * 60 * 60 * 1000),
  );

  const [checkin, setCheckin] = useState(defaultValues?.checkin ?? today);
  const [checkout, setCheckout] = useState(defaultValues?.checkout ?? tomorrow);
  const [guests, setGuests] = useState(String(defaultValues?.guests ?? 2));
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});

    const parsed = availabilitySearchSchema.safeParse({
      checkin,
      checkout,
      guests,
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

    const payload = {
      ...parsed.data,
      guests: (parsed.data.guests ?? Number(guests)) || 2,
    };

    if (onSearch) {
      onSearch(payload);
      return;
    }

    const params = new URLSearchParams({
      checkin: payload.checkin,
      checkout: payload.checkout,
      guests: String(payload.guests),
    });
    router.push(`/reservar?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      aria-label="Buscar habitaciones disponibles"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="checkin">Entrada</Label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="checkin"
              type="date"
              min={today}
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
              className="pl-10"
              aria-invalid={Boolean(errors.checkin)}
            />
          </div>
          {errors.checkin && (
            <p className="text-xs text-destructive">{errors.checkin}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="checkout">Salida</Label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="checkout"
              type="date"
              min={checkin || today}
              value={checkout}
              onChange={(e) => setCheckout(e.target.value)}
              className="pl-10"
              aria-invalid={Boolean(errors.checkout)}
            />
          </div>
          {errors.checkout && (
            <p className="text-xs text-destructive">{errors.checkout}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="guests">Huéspedes</Label>
          <div className="relative">
            <Users className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="guests"
              type="number"
              min={1}
              max={12}
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="pl-10"
              aria-invalid={Boolean(errors.guests)}
            />
          </div>
          {errors.guests && (
            <p className="text-xs text-destructive">{errors.guests}</p>
          )}
        </div>

        <div className="flex items-end">
          <Button type="submit" size="lg" className="w-full">
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
