"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { PublicRoom } from "@/lib/api/public";
import type { AvailabilitySearchValues } from "@/lib/validations/booking";
import type { GuestDetailsValues } from "@/lib/validations/reservation";
import { formatDate } from "@/lib/format";
import { useAvailability } from "@/hooks/use-availability";
import { useCreateReservation } from "@/hooks/use-create-reservation";
import { BookingSearchForm } from "@/components/booking/booking-search-form";
import { AvailabilityPanel } from "@/components/booking/availability-panel";
import { ReservationForm } from "@/components/booking/reservation-form";
import { Badge } from "@/components/ui/badge";

/** Pasos del wizard de reserva — numerados para claridad en UI y comentarios. */
type WizardStep = 1 | 2 | 3;

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
    <div className="space-y-10">
      {/* Indicador de pasos */}
      <ol className="flex flex-wrap gap-2" aria-label="Progreso de reserva">
        {[
          { n: 1, label: "Fechas" },
          { n: 2, label: "Habitación" },
          { n: 3, label: "Confirmación" },
        ].map(({ n, label }) => (
          <li key={n}>
            <Badge variant={step >= n ? "default" : "neutral"}>
              {n}. {label}
            </Badge>
          </li>
        ))}
      </ol>

      {/* PASO 1 — búsqueda de disponibilidad */}
      <section aria-labelledby="step-search-heading">
        <h2 id="step-search-heading" className="mb-4 text-lg font-semibold">
          Paso 1 — Fechas y huéspedes
        </h2>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
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
        <section aria-labelledby="step-room-heading">
          <h2 id="step-room-heading" className="mb-2 text-lg font-semibold">
            Paso 2 — Elige tu habitación
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            {formatDate(searchValues.checkin)} → {formatDate(searchValues.checkout)} ·{" "}
            {searchValues.guests} huésped{searchValues.guests > 1 ? "es" : ""}
          </p>

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
      )}

      {/* PASO 3 — datos del huésped */}
      {step === 3 && selectedRoom && searchValues && (
        <section aria-labelledby="step-guest-heading">
          <h2 id="step-guest-heading" className="mb-2 text-lg font-semibold">
            Paso 3 — Datos del huésped
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Habitación seleccionada: <strong>{selectedRoom.name}</strong>
          </p>

          <ReservationForm
            isSubmitting={createReservationMutation.isPending}
            onSubmit={handleCreateReservation}
          />
        </section>
      )}
    </div>
  );
}
