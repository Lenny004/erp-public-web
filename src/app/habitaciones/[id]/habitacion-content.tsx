"use client";

/** Ficha de habitación: galería, datos y comprobación de fechas. */

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import type { AvailabilitySearchValues } from "@/lib/validations/booking";
import { formatDate, formatMoney, nightsBetween } from "@/lib/format";
import { roomDetailHref, roomGuestHref } from "@/lib/booking-paths";
import { usePublicRooms } from "@/hooks/use-public-rooms";
import { useAvailability } from "@/hooks/use-availability";
import { BookingSearchForm } from "@/components/booking/booking-search-form";
import { RoomGallery } from "@/components/rooms/room-gallery";
import { Button } from "@/components/ui/button";

type StayStatus = "idle" | "checking" | "open" | "taken" | "too-many";

type StaySearch = AvailabilitySearchValues & { guests: number };

/**
 * Página de detalle al estilo de un anuncio: la estadía se comprueba
 * junto a las fotos. Los datos del huésped van en el paso siguiente.
 */
export function HabitacionContent() {
  const params = useParams<{ id: string }>();
  const roomId = params.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomsQuery = usePublicRooms();
  const room = roomsQuery.data?.find((item) => item.id === roomId);

  const initialCheckin = searchParams.get("checkin") ?? undefined;
  const initialCheckout = searchParams.get("checkout") ?? undefined;
  const guestsParam = Number(searchParams.get("guests"));
  const initialGuests = Number.isFinite(guestsParam) && guestsParam > 0 ? guestsParam : 2;

  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState<StaySearch | null>(
    initialCheckin && initialCheckout
      ? {
          checkin: initialCheckin,
          checkout: initialCheckout,
          guests: initialGuests,
        }
      : null,
  );
  const [status, setStatus] = useState<StayStatus>("idle");
  const autoChecked = useRef(false);

  const availability = useAvailability();

  async function checkStay(values: StaySearch) {
    if (!room) return;
    setSearch(values);

    router.replace(roomDetailHref(room.id, values), {
      scroll: false,
    });

    if (values.guests > room.capacity) {
      setStatus("too-many");
      return;
    }

    setStatus("checking");
    try {
      const result = await availability.mutateAsync(values);
      const match = result.availableRooms.some((item) => item.id === room.id);
      setStatus(match ? "open" : "taken");
    } catch (error) {
      setStatus("idle");
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo consultar la disponibilidad",
      );
    }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!room || autoChecked.current || !initialCheckin || !initialCheckout) return;
    autoChecked.current = true;
    void checkStay({
      checkin: initialCheckin,
      checkout: initialCheckout,
      guests: initialGuests,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- una sola comprobación al abrir la ficha con fechas
  }, [room]);

  if (!mounted || roomsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 py-24 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" aria-hidden />
        <span className="text-sm">Cargando habitación…</span>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-start gap-4 px-4 py-20">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          No encontramos esta habitación
        </h1>
        <p className="text-sm text-muted-foreground">
          Puede que ya no esté publicada o que el enlace esté incompleto.
        </p>
        <Button asChild>
          <Link href="/habitaciones">Ver habitaciones</Link>
        </Button>
      </div>
    );
  }

  const nightly = Number(room.roomType.basePrice);
  const nights = search ? nightsBetween(search.checkin, search.checkout) : 0;
  const total = nights * (Number.isFinite(nightly) ? nightly : 0);
  const otherRoomsHref = search
    ? `/reservar?checkin=${search.checkin}&checkout=${search.checkout}&guests=${search.guests}`
    : "/reservar";
  const guestHref = search ? roomGuestHref(room.id, search) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Link
        href="/habitaciones"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Habitaciones
      </Link>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
        <div className="space-y-6">
          <RoomGallery images={room.images} alt={room.name} seed={room.id} />

          <header className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {room.roomType.name} · Habitación {room.number}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {room.name}
            </h1>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4" aria-hidden />
              Hasta {room.capacity} huéspedes
            </p>
          </header>
        </div>

        <aside className="space-y-4 rounded-2xl border border-border/80 bg-card p-5 shadow-sm lg:sticky lg:top-24 sm:p-6">
          <p>
            <span className="text-2xl font-semibold text-foreground">
              {formatMoney(room.roomType.basePrice)}
            </span>
            <span className="text-sm text-muted-foreground"> / noche</span>
          </p>

          <BookingSearchForm
            layout="stack"
            defaultValues={search ?? undefined}
            onSearch={checkStay}
            submitLabel={status === "checking" ? "Comprobando…" : "Comprobar fechas"}
          />

          {status === "checking" && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Revisando disponibilidad…
            </p>
          )}

          {status === "too-many" && (
            <p className="text-sm text-muted-foreground" role="status">
              Esta habitación admite hasta {room.capacity} huéspedes.
            </p>
          )}

          {status === "taken" && search && (
            <div className="space-y-3" role="status">
              <p className="text-sm text-muted-foreground">
                No está libre del {formatDate(search.checkin)} al{" "}
                {formatDate(search.checkout)}.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link href={otherRoomsHref}>Ver otras habitaciones</Link>
              </Button>
            </div>
          )}

          {status === "open" && search && guestHref && (
            <div className="space-y-4">
              <p className="text-sm text-foreground" role="status">
                Libre del {formatDate(search.checkin)} al {formatDate(search.checkout)}.
              </p>
              <dl className="space-y-2 border-t border-border/70 pt-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">
                    {formatMoney(nightly)} × {nights}{" "}
                    {nights === 1 ? "noche" : "noches"}
                  </dt>
                  <dd className="font-medium text-foreground">{formatMoney(total)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 text-base">
                  <dt className="font-semibold text-foreground">Total</dt>
                  <dd className="font-semibold text-foreground">{formatMoney(total)}</dd>
                </div>
              </dl>

              <Button asChild size="lg" className="h-12 w-full">
                <Link href={guestHref}>Continuar</Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                En el siguiente paso completas tus datos para enviar la solicitud.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
