"use client";

import { Loader2 } from "lucide-react";
import { usePublicRooms } from "@/hooks/use-public-rooms";
import { RoomCard } from "@/components/rooms/room-card";

/**
 * Listado de habitaciones con estados de carga, vacío y error.
 * Los datos provienen de GET /api/public/rooms.
 */
export function HabitacionesContent() {
  const { data: rooms, isLoading, isError, error, refetch } = usePublicRooms();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" aria-hidden />
        Cargando habitaciones…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="text-destructive">
          {error?.message ?? "No se pudo cargar el catálogo de habitaciones."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!rooms?.length) {
    return (
      <p className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
        No hay habitaciones publicadas en este momento. Vuelve pronto.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-500">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}
