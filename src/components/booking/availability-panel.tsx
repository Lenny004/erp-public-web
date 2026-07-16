"use client";

import { Loader2 } from "lucide-react";
import type { PublicRoom } from "@/lib/api/public";
import { RoomCard } from "@/components/rooms/room-card";

interface AvailabilityPanelProps {
  rooms: PublicRoom[];
  selectedRoomId?: string | null;
  onSelectRoom: (room: PublicRoom) => void;
  /** Query string con fechas para enlaces de reserva directa. */
  bookingQuery?: string;
  isLoading?: boolean;
  errorMessage?: string | null;
  emptyMessage?: string;
}

/**
 * Muestra habitaciones disponibles tras una búsqueda de disponibilidad.
 * Permite seleccionar una para continuar al formulario de huésped.
 */
export function AvailabilityPanel({
  rooms,
  selectedRoomId,
  onSelectRoom,
  bookingQuery = "",
  isLoading = false,
  errorMessage,
  emptyMessage = "No hay habitaciones disponibles para esas fechas. Prueba otro rango.",
}: AvailabilityPanelProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-16 text-muted-foreground animate-in fade-in duration-300">
        <Loader2 className="size-5 animate-spin" aria-hidden />
        Buscando habitaciones disponibles…
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="form-validation-alert animate-in fade-in duration-300">
        {errorMessage}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-12 text-center text-muted-foreground animate-in fade-in duration-300">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          selected={room.id === selectedRoomId}
          onSelect={onSelectRoom}
          bookingQuery={bookingQuery}
        />
      ))}
    </div>
  );
}
