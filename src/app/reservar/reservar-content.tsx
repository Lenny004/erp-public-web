"use client";

/** Búsqueda pública de disponibilidad. Cada resultado abre la ficha; los datos del huésped van después. */

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { PublicRoom } from "@/lib/api/public";
import type { AvailabilitySearchValues } from "@/lib/validations/booking";
import { formatDate } from "@/lib/format";
import { useAvailability } from "@/hooks/use-availability";
import { BookingSearchForm } from "@/components/booking/booking-search-form";
import { AvailabilityPanel } from "@/components/booking/availability-panel";
import { AnimatedReveal } from "@/components/motion/animated-reveal";

/**
 * Consulta habitaciones libres y enlaza cada resultado a su ficha.
 * Si la URL trae `roomId`, abre esa ficha y conserva las fechas.
 */
export function ReservarContent() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [preselectedRoomId, setPreselectedRoomId] = useState<string | null>(null);
  const [searchValues, setSearchValues] = useState<
    (AvailabilitySearchValues & { guests: number }) | null
  >(null);
  const [availableRooms, setAvailableRooms] = useState<PublicRoom[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const availabilityMutation = useAvailability();

  const bookingQuery = useMemo(() => {
    if (!searchValues) return "";
    const params = new URLSearchParams({
      checkin: searchValues.checkin,
      checkout: searchValues.checkout,
      guests: String(searchValues.guests),
    });
    return `&${params.toString()}`;
  }, [searchValues]);

  const runAvailabilitySearch = useCallback(
    async (values: AvailabilitySearchValues & { guests: number }) => {
      setSearchValues(values);
      setHasSearched(true);

      try {
        const result = await availabilityMutation.mutateAsync(values);
        setAvailableRooms(result.availableRooms);
      } catch (error) {
        setAvailableRooms([]);
        toast.error(
          error instanceof Error
            ? error.message
            : "No se pudo consultar la disponibilidad",
        );
      }
    },
    [availabilityMutation],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkin = params.get("checkin") ?? undefined;
    const checkout = params.get("checkout") ?? undefined;
    const guestsValue = Number(params.get("guests"));
    const guests =
      Number.isFinite(guestsValue) && guestsValue > 0 ? guestsValue : 2;
    const roomId = params.get("roomId");

    if (roomId) {
      const next = new URLSearchParams();
      if (checkin) next.set("checkin", checkin);
      if (checkout) next.set("checkout", checkout);
      if (params.get("guests")) next.set("guests", String(guests));
      const query = next.toString();
      setPreselectedRoomId(roomId);
      router.replace(
        query ? `/habitaciones/${roomId}?${query}` : `/habitaciones/${roomId}`,
      );
      setReady(true);
      return;
    }

    if (checkin && checkout) {
      const values = { checkin, checkout, guests };
      setSearchValues(values);
      void runAvailabilitySearch(values);
    }

    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al abrir la página
  }, []);

  if (!ready || preselectedRoomId) {
    return (
      <div className="flex items-center justify-center gap-3 py-24 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" aria-hidden />
        <span className="text-sm">
          {preselectedRoomId ? "Abriendo la habitación…" : "Cargando disponibilidad…"}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-14">
      <section
        aria-labelledby="search-heading"
        className="mx-auto max-w-3xl"
      >
        <header className="mb-6 space-y-1">
          <h2
            id="search-heading"
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

      {hasSearched && searchValues && (
        <AnimatedReveal>
          <section aria-labelledby="results-heading">
            <header className="mb-8 space-y-3">
              <h2
                id="results-heading"
                className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
              >
                Habitaciones disponibles
              </h2>
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
              bookingQuery={bookingQuery}
              isLoading={availabilityMutation.isPending}
              errorMessage={
                availabilityMutation.isError
                  ? availabilityMutation.error?.message ??
                    "Error de disponibilidad"
                  : null
              }
            />
          </section>
        </AnimatedReveal>
      )}
    </div>
  );
}
