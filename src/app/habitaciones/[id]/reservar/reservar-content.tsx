"use client";

/** Datos del huésped. Solo se muestra si la estadía sigue libre. */

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import type { GuestDetailsValues } from "@/lib/validations/reservation";
import { formatDate, formatMoney, nightsBetween } from "@/lib/format";
import {
  parseStayQuery,
  roomDetailHref,
  type StayQuery,
} from "@/lib/booking-paths";
import { usePublicRooms } from "@/hooks/use-public-rooms";
import { useAvailability } from "@/hooks/use-availability";
import { useCreateReservation } from "@/hooks/use-create-reservation";
import { ReservationForm } from "@/components/booking/reservation-form";
import { Button } from "@/components/ui/button";

type StayStatus = "checking" | "open" | "taken" | "too-many" | "error";

/**
 * Confirma otra vez la disponibilidad y, si la habitación sigue libre,
 * recoge los datos del huésped para crear la reserva.
 */
export function ReservarHabitacionContent() {
  const params = useParams<{ id: string }>();
  const roomId = params.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomsQuery = usePublicRooms();
  const room = roomsQuery.data?.find((item) => item.id === roomId);
  const stay = parseStayQuery(searchParams);

  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<StayStatus>("checking");
  const checkedKey = useRef<string | null>(null);

  const availability = useAvailability();
  const createReservation = useCreateReservation();

  async function verifyStay(currentRoom: NonNullable<typeof room>, currentStay: StayQuery) {
    if (currentStay.guests > currentRoom.capacity) {
      setStatus("too-many");
      return;
    }

    setStatus("checking");
    try {
      const result = await availability.mutateAsync(currentStay);
      const match = result.availableRooms.some((item) => item.id === currentRoom.id);
      setStatus(match ? "open" : "taken");
    } catch (error) {
      setStatus("error");
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
    if (!room || !stay) return;
    const key = `${room.id}|${stay.checkin}|${stay.checkout}|${stay.guests}`;
    if (checkedKey.current === key) return;
    checkedKey.current = key;
    void verifyStay(room, stay);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- una comprobación por estadía
  }, [room, stay?.checkin, stay?.checkout, stay?.guests]);

  async function handleCreateReservation(formValues: GuestDetailsValues) {
    if (!room || !stay || status !== "open") {
      toast.error("Confirma primero que la habitación está libre en esas fechas.");
      return;
    }

    try {
      const reservation = await createReservation.mutateAsync({
        roomId: room.id,
        checkin: stay.checkin,
        checkout: stay.checkout,
        guestName: formValues.guestName,
        email: formValues.email,
        phone: formValues.phone,
        guestCount: stay.guests,
        notes: formValues.notes,
      });
      router.push(`/reservar/confirmacion?id=${reservation.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo crear la reserva",
      );
    }
  }

  if (!mounted || roomsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 py-24 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" aria-hidden />
        <span className="text-sm">Cargando reserva…</span>
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

  const detailHref = roomDetailHref(room.id, stay ?? undefined);
  const otherRoomsHref = stay
    ? `/reservar?checkin=${stay.checkin}&checkout=${stay.checkout}&guests=${stay.guests}`
    : "/reservar";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Link
        href={detailHref}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Volver a la habitación
      </Link>

      <header className="mb-8 max-w-2xl space-y-2">
        <p className="text-sm text-muted-foreground">
          {room.roomType.name} · Habitación {room.number}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Completa tu reserva
        </h1>
        <p className="text-sm text-muted-foreground">
          {room.name}. Revisa la estadía y deja tus datos para enviar la solicitud.
        </p>
      </header>

      {!stay && (
        <div className="max-w-lg space-y-4" role="status">
          <p className="text-sm text-muted-foreground">
            Primero elige las fechas en la ficha de la habitación. Ahí comprobamos
            si está libre.
          </p>
          <Button asChild>
            <Link href={detailHref}>Elegir fechas</Link>
          </Button>
        </div>
      )}

      {stay && status === "checking" && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Confirmando disponibilidad…
        </p>
      )}

      {stay && status === "too-many" && (
        <div className="max-w-lg space-y-4" role="status">
          <p className="text-sm text-muted-foreground">
            Esta habitación admite hasta {room.capacity} huéspedes.
          </p>
          <Button asChild>
            <Link href={detailHref}>Cambiar huéspedes</Link>
          </Button>
        </div>
      )}

      {stay && status === "taken" && (
        <div className="max-w-lg space-y-4" role="status">
          <p className="text-sm text-muted-foreground">
            No está libre del {formatDate(stay.checkin)} al {formatDate(stay.checkout)}.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href={detailHref}>Cambiar fechas</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={otherRoomsHref}>Ver otras habitaciones</Link>
            </Button>
          </div>
        </div>
      )}

      {stay && status === "error" && (
        <div className="max-w-lg space-y-4" role="status">
          <p className="text-sm text-muted-foreground">
            No pudimos confirmar si la habitación sigue libre. Inténtalo de nuevo.
          </p>
          <Button
            type="button"
            onClick={() => {
              checkedKey.current = null;
              void verifyStay(room, stay);
            }}
          >
            Reintentar
          </Button>
        </div>
      )}

      {stay && status === "open" && (
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
          <div className="order-2 lg:order-1">
            <ReservationForm
              isSubmitting={createReservation.isPending}
              onSubmit={handleCreateReservation}
            />
          </div>
          <StaySummary room={room} stay={stay} detailHref={detailHref} />
        </div>
      )}
    </div>
  );
}

function StaySummary({
  room,
  stay,
  detailHref,
}: {
  room: {
    name: string;
    capacity: number;
    roomType: { name: string; basePrice: string | number };
  };
  stay: StayQuery;
  detailHref: string;
}) {
  const nightly = Number(room.roomType.basePrice);
  const nights = nightsBetween(stay.checkin, stay.checkout);
  const total = nights * (Number.isFinite(nightly) ? nightly : 0);

  return (
    <aside className="order-1 space-y-4 rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6 lg:sticky lg:top-24 lg:order-2">
      <div className="space-y-1">
        <p className="font-medium text-foreground">{room.name}</p>
        <p className="text-sm text-muted-foreground">{room.roomType.name}</p>
      </div>

      <dl className="space-y-3 border-t border-border/70 pt-4 text-sm">
        <div className="flex items-start justify-between gap-4">
          <dt className="text-muted-foreground">Llegada</dt>
          <dd className="text-right font-medium text-foreground">
            {formatDate(stay.checkin)}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-muted-foreground">Salida</dt>
          <dd className="text-right font-medium text-foreground">
            {formatDate(stay.checkout)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Huéspedes</dt>
          <dd className="inline-flex items-center gap-1.5 font-medium text-foreground">
            <Users className="size-3.5" aria-hidden />
            {stay.guests}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">
            {formatMoney(nightly)} × {nights} {nights === 1 ? "noche" : "noches"}
          </dt>
          <dd className="font-medium text-foreground">{formatMoney(total)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 text-base">
          <dt className="font-semibold text-foreground">Total</dt>
          <dd className="font-semibold text-foreground">{formatMoney(total)}</dd>
        </div>
      </dl>

      <Button variant="outline" asChild className="w-full">
        <Link href={detailHref}>Cambiar fechas</Link>
      </Button>
    </aside>
  );
}
