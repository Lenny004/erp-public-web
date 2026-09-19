"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import type { PublicRoom } from "@/lib/api/public";
import type { AvailabilitySearchValues } from "@/lib/validations/booking";
import type { GuestDetailsValues } from "@/lib/validations/reservation";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAvailability } from "@/hooks/use-availability";
import { useCreateReservation } from "@/hooks/use-create-reservation";
import { BookingSearchForm } from "@/components/booking/booking-search-form";
import { AvailabilityPanel } from "@/components/booking/availability-panel";
import { ReservationForm } from "@/components/booking/reservation-form";
import { AnimatedReveal } from "@/components/motion/animated-reveal";

/** Pasos del wizard de reserva — numerados para claridad en UI y comentarios. */
type WizardStep = 1 | 2 | 3;

/** Definición estática de pasos para el indicador de progreso. */
const WIZARD_STEPS = [
  { n: 1 as const, label: "Fechas" },
  { n: 2 as const, label: "Habitación" },
  { n: 3 as const, label: "Confirmación" },
];

/**
 * Wizard completo de reserva en línea:
 * 1) Buscar disponibilidad (prefill desde searchParams)
 * 2) Elegir habitación (o preselección vía roomId)
 * 3) Formulario de huésped y confirmación
 */
export function ReservarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCheckin = searchParams.get("checkin") ?? undefined;
  const initialCheckout = searchParams.get("checkout") ?? undefined;
  const initialGuests = searchParams.get("guests")
    ? Number(searchParams.get("guests"))
    : undefined;
  const preselectedRoomId = searchParams.get("roomId");

  const [step, setStep] = useState<WizardStep>(1);
  const [searchValues, setSearchValues] = useState<
    (AvailabilitySearchValues & { guests: number }) | null
  >(
    initialCheckin && initialCheckout
      ? {
          checkin: initialCheckin,
          checkout: initialCheckout,
          guests: initialGuests ?? 2,
        }
      : null,
  );
  const [availableRooms, setAvailableRooms] = useState<PublicRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<PublicRoom | null>(null);

  const availabilityMutation = useAvailability();
  const createReservationMutation = useCreateReservation();

  const bookingQuery = useMemo(() => {
    if (!searchValues) return "";
    const params = new URLSearchParams({
      checkin: searchValues.checkin,
      checkout: searchValues.checkout,
      guests: String(searchValues.guests),
    });
    return `&${params.toString()}`;
  }, [searchValues]);

  /** Ejecuta la búsqueda de disponibilidad y avanza al paso 2. */
  const runAvailabilitySearch = useCallback(
    async (values: AvailabilitySearchValues & { guests: number }) => {
      setSearchValues(values);
      setSelectedRoom(null);

      try {
        const result = await availabilityMutation.mutateAsync(values);
        setAvailableRooms(result.availableRooms);

        // Preselección si roomId viene en la URL y sigue disponible.
        if (preselectedRoomId) {
          const match = result.availableRooms.find((r) => r.id === preselectedRoomId);
          if (match) {
            setSelectedRoom(match);
            setStep(3);
            return;
          }
        }

        setStep(2);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "No se pudo consultar la disponibilidad",
        );
      }
    },
    [availabilityMutation, preselectedRoomId],
  );

  // Auto-búsqueda única al llegar con fechas en la URL (desde home o habitaciones).
  useEffect(() => {
    if (!searchValues) return;
    void runAvailabilitySearch(searchValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al montar con params iniciales
  }, []);

  function handleSelectRoom(room: PublicRoom) {
    setSelectedRoom(room);
    setStep(3);
  }

  async function handleCreateReservation(formValues: GuestDetailsValues) {
    if (!selectedRoom || !searchValues) {
      toast.error("Completa los pasos anteriores antes de confirmar.");
      return;
    }

    try {
      const reservation = await createReservationMutation.mutateAsync({
        roomId: selectedRoom.id,
        checkin: searchValues.checkin,
        checkout: searchValues.checkout,
        guestName: formValues.guestName,
        email: formValues.email,
        phone: formValues.phone,
        notes: formValues.notes,
      });

      router.push(`/reservar/confirmacion?id=${reservation.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo crear la reserva",
      );
    }
  }

  return (
    <div className="space-y-14">
      {/* Indicador de progreso — círculos numerados + conectores (sin badges) */}
      <nav aria-label="Progreso de reserva" className="mx-auto max-w-xl">
        <ol className="flex items-start justify-between">
          {WIZARD_STEPS.map(({ n, label }, index) => {
            const isActive = step === n;
            const isComplete = step > n;

            return (
              <li
                key={n}
                className={cn(
                  "relative flex flex-1 flex-col items-center",
                  /* Conector horizontal entre pasos */
                  index < WIZARD_STEPS.length - 1 &&
                    "before:absolute before:top-5 before:left-[calc(50%+1.25rem)] before:h-px before:w-[calc(100%-2.5rem)] before:content-['']",
                  index < WIZARD_STEPS.length - 1 &&
                    (isComplete ? "before:bg-primary" : "before:bg-border"),
                )}
              >
                {/* Círculo del paso: completado (check), activo (anillo) o pendiente */}
                <span
                  className={cn(
                    "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
                    isComplete && "bg-primary text-primary-foreground",
                    isActive &&
                      "bg-primary text-primary-foreground shadow-md ring-4 ring-primary/15",
                    !isActive &&
                      !isComplete &&
                      "border-2 border-border bg-background text-muted-foreground",
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isComplete ? (
                    <Check className="size-4" strokeWidth={2.5} aria-hidden />
                  ) : (
                    n
                  )}
                </span>

                <span
                  className={cn(
                    "mt-3 text-center text-xs font-medium sm:text-sm",
                    isActive || isComplete
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* PASO 1 — búsqueda de disponibilidad */}
      <section
        aria-labelledby="step-search-heading"
        className="mx-auto max-w-3xl"
      >
        <header className="mb-6 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Paso 1
          </p>
          <h2
            id="step-search-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            Fechas y huéspedes
          </h2>
          <p className="text-sm text-muted-foreground">
            Indica cuándo llegas, cuándo sales y cuántas personas viajan.
          </p>
        </header>

        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
          <BookingSearchForm
            defaultValues={searchValues ?? undefined}
            onSearch={runAvailabilitySearch}
            submitLabel={
              availabilityMutation.isPending
                ? "Buscando…"
                : "Buscar disponibilidad"
            }
          />
        </div>
      </section>

      {/* PASO 2 — selección de habitación (visible tras búsqueda exitosa) */}
      {step >= 2 && searchValues && (
        <AnimatedReveal>
        <section aria-labelledby="step-room-heading">
          <header className="mb-8 space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Paso 2
              </p>
              <h2
                id="step-room-heading"
                className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
              >
                Elige tu habitación
              </h2>
            </div>

            {/* Resumen de fechas en pill discreta */}
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-border/80 bg-muted/30 px-4 py-2 text-sm text-muted-foreground">
              <span>{formatDate(searchValues.checkin)}</span>
              <span aria-hidden className="text-border">
                →
              </span>
              <span>{formatDate(searchValues.checkout)}</span>
              <span aria-hidden className="text-border">
                ·
              </span>
              <span>
                {searchValues.guests} huésped
                {searchValues.guests > 1 ? "es" : ""}
              </span>
            </div>
          </header>

          <AvailabilityPanel
            rooms={availableRooms}
            selectedRoomId={selectedRoom?.id}
            onSelectRoom={handleSelectRoom}
            bookingQuery={bookingQuery}
            isLoading={availabilityMutation.isPending}
            errorMessage={
              availabilityMutation.isError
                ? availabilityMutation.error?.message ?? "Error de disponibilidad"
                : null
            }
          />
        </section>
        </AnimatedReveal>
      )}

      {/* PASO 3 — datos del huésped */}
      {step === 3 && selectedRoom && searchValues && (
        <AnimatedReveal className="mx-auto max-w-2xl">
        <section aria-labelledby="step-guest-heading">
          <header className="mb-8 space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Paso 3
              </p>
              <h2
                id="step-guest-heading"
                className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
              >
                Datos del huésped
              </h2>
              <p className="text-sm text-muted-foreground">
                Revisa tu selección y completa la información de contacto.
              </p>
            </div>

            {/* Resumen de habitación elegida */}
            <div className="rounded-xl border border-border/80 bg-muted/20 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Habitación: </span>
              <span className="font-medium text-foreground">
                {selectedRoom.name}
              </span>
            </div>
          </header>

          <ReservationForm
            isSubmitting={createReservationMutation.isPending}
            onSubmit={handleCreateReservation}
          />
        </section>
        </AnimatedReveal>
      )}
    </div>
  );
}
