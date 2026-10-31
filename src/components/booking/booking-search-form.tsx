"use client";

/** Consulta disponibilidad pública y entrega la selección al formulario de reserva. */

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addDays, format, parseISO, startOfDay } from "date-fns";
import { Minus, Plus, Search } from "lucide-react";
import {
  availabilitySearchSchema,
  type AvailabilitySearchValues,
} from "@/lib/validations/booking";
import { formatDateLabel, toDateInputValue } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface BookingSearchFormProps {
  /** Valores iniciales (p. ej. desde query params del home o /reservar). */
  defaultValues?: Partial<AvailabilitySearchValues>;
  /** Si se define, se llama en lugar de navegar a /reservar. */
  onSearch?: (values: AvailabilitySearchValues & { guests: number }) => void;
  /** Texto del botón principal. */
  submitLabel?: string;
  /** Barra horizontal en escritorio, o siempre apilada para una columna estrecha. */
  layout?: "bar" | "stack";
  /** Ocultar navegación automática cuando hay onSearch. */
  className?: string;
}

/** Segmento de la barra: etiqueta corta arriba y valor debajo, sin cromado de botón. */
const SEGMENT_TRIGGER_CLASS =
  "h-auto min-h-16 w-full justify-start gap-0 rounded-none px-5 py-3.5 text-left font-normal whitespace-normal hover:bg-muted/40";

/** Segmento de fecha. Abre el calendario de la interfaz. */
function BookingDateField({
  id,
  label,
  value,
  onChange,
  min,
  invalid,
  describedBy,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  invalid?: boolean;
  describedBy?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = value ? parseISO(value) : undefined;
  const minimum = min ? startOfDay(parseISO(min)) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="ghost"
          className={cn(SEGMENT_TRIGGER_CLASS, "flex-col items-start")}
          aria-invalid={invalid}
          aria-describedby={describedBy}
        >
          <span className="text-[11px] font-semibold tracking-wide text-foreground">
            {label}
          </span>
          <span className="truncate text-sm font-normal text-muted-foreground">
            {value ? formatDateLabel(value) : "Agregar fecha"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected ?? minimum}
          disabled={minimum ? { before: minimum } : undefined}
          onSelect={(day) => {
            if (!day) return;
            onChange(format(day, "yyyy-MM-dd"));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

const MIN_GUESTS = 1;
const MAX_GUESTS = 12;

function formatGuestsLabel(count: number): string {
  if (!Number.isFinite(count) || count < 1) return "Agregar huéspedes";
  return count === 1 ? "1 huésped" : `${count} huéspedes`;
}

/** Segmento de huéspedes con botones de la interfaz, sin el spinner nativo. */
function BookingGuestsField({
  value,
  onChange,
  invalid,
  describedBy,
}: {
  value: number;
  onChange: (value: number) => void;
  invalid?: boolean;
  describedBy?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="guests"
          type="button"
          variant="ghost"
          className={cn(SEGMENT_TRIGGER_CLASS, "flex-col items-start")}
          aria-invalid={invalid}
          aria-describedby={describedBy}
        >
          <span className="text-[11px] font-semibold tracking-wide text-foreground">
            Huéspedes
          </span>
          <span className="truncate text-sm font-normal text-muted-foreground">
            {formatGuestsLabel(value)}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-foreground">Huéspedes</p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              shape="pill"
              disabled={value <= MIN_GUESTS}
              aria-label="Quitar huésped"
              onClick={() => onChange(Math.max(MIN_GUESTS, value - 1))}
            >
              <Minus className="size-4" />
            </Button>
            <span className="w-6 text-center text-sm font-semibold tabular-nums">{value}</span>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              shape="pill"
              disabled={value >= MAX_GUESTS}
              aria-label="Agregar huésped"
              onClick={() => onChange(Math.min(MAX_GUESTS, value + 1))}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
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
  layout = "bar",
  className,
}: BookingSearchFormProps) {
  const router = useRouter();
  const today = toDateInputValue(new Date());
  const tomorrow = toDateInputValue(
    new Date(Date.now() + 24 * 60 * 60 * 1000),
  );

  const [checkin, setCheckin] = useState(defaultValues?.checkin ?? today);
  const [checkout, setCheckout] = useState(defaultValues?.checkout ?? tomorrow);
  const [guests, setGuests] = useState(defaultValues?.guests ?? 2);
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
      guests: parsed.data.guests ?? guests,
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
  const stacked = layout === "stack";

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
          stacked
            ? "flex flex-col rounded-2xl"
            : "flex flex-col rounded-2xl lg:flex-row lg:items-stretch lg:rounded-full",
          hasErrors && "ring-2 ring-destructive/20",
        )}
      >
        {/* ── Segmento: Entrada ── */}
        <div
          className={cn(
            "min-w-0 flex-1 border-b border-border/60",
            !stacked && "lg:border-r lg:border-b-0",
            errors.checkin && "bg-destructive/5",
          )}
        >
          <BookingDateField
            id="checkin"
            label="Entrada"
            value={checkin}
            min={today}
            invalid={Boolean(errors.checkin)}
            describedBy={errors.checkin ? "checkin-error" : undefined}
            onChange={(next) => {
              setCheckin(next);
              if (checkout && next >= checkout) {
                setCheckout(format(addDays(parseISO(next), 1), "yyyy-MM-dd"));
              }
            }}
          />
        </div>

        {/* ── Segmento: Salida ── */}
        <div
          className={cn(
            "min-w-0 flex-1 border-b border-border/60",
            !stacked && "lg:border-r lg:border-b-0",
            errors.checkout && "bg-destructive/5",
          )}
        >
          <BookingDateField
            id="checkout"
            label="Salida"
            value={checkout}
            min={format(addDays(parseISO(checkin || today), 1), "yyyy-MM-dd")}
            invalid={Boolean(errors.checkout)}
            describedBy={errors.checkout ? "checkout-error" : undefined}
            onChange={setCheckout}
          />
        </div>

        {/* ── Segmento: Huéspedes ── */}
        <div
          className={cn(
            "min-w-0 flex-1 border-b border-border/60",
            !stacked && "lg:border-r lg:border-b-0",
            errors.guests && "bg-destructive/5",
          )}
        >
          <BookingGuestsField
            value={guests}
            invalid={Boolean(errors.guests)}
            describedBy={errors.guests ? "guests-error" : undefined}
            onChange={setGuests}
          />
        </div>

        {/*
          Botón de búsqueda:
          - Desktop: círculo compacto con icono Search (como Airbnb).
          - Móvil: píldora ancha con icono + texto para mayor claridad táctil.
        */}
        <div
          className={cn(
            "flex shrink-0 items-center justify-center p-3",
            !stacked && "lg:p-2 lg:pr-3",
          )}
        >
          <Button
            type="submit"
            size="lg"
            className={cn(
              "h-12 w-full rounded-full shadow-md",
              !stacked && "lg:size-12 lg:w-12 lg:px-0",
            )}
            aria-label={submitLabel}
          >
            <Search className="size-5 shrink-0" aria-hidden />
            <span className={cn("ml-2 font-semibold", !stacked && "lg:sr-only")}>{submitLabel}</span>
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
