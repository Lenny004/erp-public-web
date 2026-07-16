"use client";

import { AlertCircle, BedDouble, RefreshCw } from "lucide-react";
import { usePublicRooms } from "@/hooks/use-public-rooms";
import { RoomCard } from "@/components/rooms/room-card";
import { ListingSkeleton } from "@/components/rooms/listing-skeleton";
import { Button } from "@/components/ui/button";

/** Cantidad de tarjetas fantasma mientras carga el catálogo. */
const SKELETON_COUNT = 6;

/** Rejilla responsive al estilo marketplace (1 / 2 / 3 columnas). */
function ListingGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}

/**
 * Listado público de habitaciones con estados de carga, vacío y error.
 * Los datos provienen de GET /api/public/rooms vía `usePublicRooms`.
 */
export function HabitacionesContent() {
  const { data: rooms, isLoading, isError, error, refetch } = usePublicRooms();

  if (isLoading) {
    return (
      <ListingGrid>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <ListingSkeleton key={`room-skeleton-${index}`} />
        ))}
      </ListingGrid>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="mx-auto max-w-lg rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-10 text-center shadow-sm"
      >
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="size-6 text-destructive" aria-hidden />
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          No pudimos cargar las habitaciones
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {error?.message ??
            "Ocurrió un problema al consultar el catálogo. Comprueba tu conexión e inténtalo de nuevo."}
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6 gap-2"
          onClick={() => refetch()}
        >
          <RefreshCw className="size-4" aria-hidden />
          Reintentar
        </Button>
      </div>
    );
  }

  if (!rooms?.length) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
          <BedDouble className="size-6 text-muted-foreground" aria-hidden />
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          Aún no hay habitaciones publicadas
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Estamos preparando nuevas opciones para ti. Vuelve pronto o contáctanos
          si necesitas ayuda con una reserva.
        </p>
      </div>
    );
  }

  return (
    <ListingGrid>
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} className="animate-in fade-in duration-500" />
      ))}
    </ListingGrid>
  );
}
