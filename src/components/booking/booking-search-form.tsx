"use client";

/** Consulta disponibilidad pública y entrega la selección al formulario de reserva. */

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import {
  availabilitySearchSchema,
  type AvailabilitySearchValues,
} from "@/lib/validations/booking";
import { formatDateLabel, toDateInputValue } from "@/lib/format";
import { cn } from "@/lib/utils";
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

/** Clases compartidas para inputs “fantasma” superpuestos sobre el segmento (estilo Airbnb). */
const OVERLAY_INPUT_CLASS =
  "absolute inset-0 z-10 h-full w-full cursor-pointer border-0 bg-transparent p-0 opacity-0 shadow-none focus-visible:ring-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0";

/** Contenedor visual de cada segmento: label micro + valor legible + hover suave. */
const SEGMENT_SHELL_CLASS =
  "relative flex min-w-0 flex-1 flex-col justify-center px-5 py-3.5 transition-colors hover:bg-muted/40 focus-within:bg-muted/40";

/**
 * Texto legible para el segmento de huéspedes (singular/plural en español).
 */
function formatGuestsLabel(count: string): string {
  const n = Number.parseInt(count, 10);
  if (!Number.isFinite(n) || n < 1) return "Agregar huéspedes";
  return n === 1 ? "1 huésped" : `${n} huéspedes`;
}

/**
 * Formulario compacto de búsqueda: fechas + huéspedes.
 *
 * Layout inspirado en la barra de búsqueda de Airbnb:
 * - Escritorio: cáscara blanca redondeada con segmentos divididos (Entrada | Salida | Huéspedes | Buscar).
 * - Móvil: mismos segmentos apilados con separadores finos y botón de búsqueda ancho tipo píldora.
 *
 * Por defecto navega a /reservar con query params; en el wizard usa `onSearch`.
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

  const hasErrors = Boolean(errors.checkin || errors.checkout || errors.guests);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("w-full", className)}
      aria-label="Buscar habitaciones disponibles"
    >
      {/*
        Cáscara principal estilo Airbnb:
        - Fondo blanco, sombra suave y bordes muy redondeados en desktop.
        - En móvil usa rounded-2xl para que el apilado se vea equilibrado.
      */}
      <div
        className={cn(
          "overflow-hidden border border-border/50 bg-card shadow-lg",
          "rounded-2xl lg:rounded-full",
          "flex flex-col lg:flex-row lg:items-stretch",
          hasErrors && "ring-2 ring-destructive/20",
        )}
      >
        {/* ── Segmento: Entrada ── */}
        <div
          className={cn(
            SEGMENT_SHELL_CLASS,
            "border-b border-border/60 lg:border-r lg:border-b-0",
            errors.checkin && "bg-destructive/5",
          )}
        >
          <Label
            htmlFor="checkin"
            className="pointer-events-none text-[11px] font-semibold tracking-wide text-foreground"
          >
            Entrada
          </Label>
          <p
            className="pointer-events-none truncate text-sm text-muted-foreground"
            aria-hidden
          >
            {checkin ? formatDateLabel(checkin) : "Agregar fecha"}
          </p>
          <Input
            id="checkin"
            type="date"
            min={today}
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
            className={OVERLAY_INPUT_CLASS}
            aria-invalid={Boolean(errors.checkin)}
            aria-describedby={errors.checkin ? "checkin-error" : undefined}
          />
        </div>

        {/* ── Segmento: Salida ── */}
        <div
          className={cn(
            SEGMENT_SHELL_CLASS,
            "border-b border-border/60 lg:border-r lg:border-b-0",
            errors.checkout && "bg-destructive/5",
          )}
        >
          <Label
            htmlFor="checkout"
            className="pointer-events-none text-[11px] font-semibold tracking-wide text-foreground"
          >
            Salida
          </Label>
          <p
            className="pointer-events-none truncate text-sm text-muted-foreground"
            aria-hidden
          >
            {checkout ? formatDateLabel(checkout) : "Agregar fecha"}
          </p>
          <Input
            id="checkout"
            type="date"
            min={checkin || today}
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
            className={OVERLAY_INPUT_CLASS}
            aria-invalid={Boolean(errors.checkout)}
            aria-describedby={errors.checkout ? "checkout-error" : undefined}
          />
        </div>

        {/* ── Segmento: Huéspedes ── */}
        <div
          className={cn(
            SEGMENT_SHELL_CLASS,
            "border-b border-border/60 lg:border-r lg:border-b-0",
            errors.guests && "bg-destructive/5",
          )}
        >
          <Label
            htmlFor="guests"
            className="pointer-events-none text-[11px] font-semibold tracking-wide text-foreground"
          >
            Huéspedes
          </Label>
          <p
            className="pointer-events-none truncate text-sm text-muted-foreground"
            aria-hidden
          >
            {formatGuestsLabel(guests)}
          </p>
          <Input
            id="guests"
            type="number"
            min={1}
            max={12}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className={OVERLAY_INPUT_CLASS}
            aria-invalid={Boolean(errors.guests)}
            aria-describedby={errors.guests ? "guests-error" : undefined}
          />
        </div>

        {/*
          Botón de búsqueda:
          - Desktop: círculo compacto con icono Search (como Airbnb).
          - Móvil: píldora ancha con icono + texto para mayor claridad táctil.
        */}
        <div className="flex shrink-0 items-center justify-center p-3 lg:p-2 lg:pr-3">
          <Button
            type="submit"
            size="lg"
            className={cn(
              "h-12 w-full rounded-full shadow-md lg:size-12 lg:w-12 lg:px-0",
            )}
            aria-label={submitLabel}
          >
            <Search className="size-5 shrink-0" aria-hidden />
            <span className="ml-2 font-semibold lg:sr-only">{submitLabel}</span>
          </Button>
        </div>
      </div>

      {/* Mensajes de validación debajo de la cáscara (no alteran el layout del pill). */}
      {hasErrors && (
        <div className="mt-2 space-y-1 px-1" role="alert">
          {errors.checkin && (
            <p id="checkin-error" className="text-xs text-destructive">
              {errors.checkin}
            </p>
          )}
          {errors.checkout && (
            <p id="checkout-error" className="text-xs text-destructive">
              {errors.checkout}
            </p>
          )}
          {errors.guests && (
            <p id="guests-error" className="text-xs text-destructive">
              {errors.guests}
            </p>
          )}
        </div>
      )}
    </form>
  );
}
