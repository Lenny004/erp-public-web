"use client";

import { AlertCircle, BedDouble, Loader2 } from "lucide-react";
import type { PublicRoom } from "@/lib/api/public";
import { RoomCard } from "@/components/rooms/room-card";

interface AvailabilityPanelProps {
  /** Habitaciones devueltas por la búsqueda actual. */
  rooms: PublicRoom[];
  /** Identificador de la habitación elegida para aplicar el estado seleccionado. */
  selectedRoomId?: string | null;
  /** Notifica la habitación elegida desde una tarjeta interactiva. */
  onSelectRoom: (room: PublicRoom) => void;
  /** Query string con fechas y huéspedes para enlaces de reserva directa. */
  bookingQuery?: string;
  /** Indica que la consulta sigue en curso. */
  isLoading?: boolean;
  /** Mensaje que se muestra cuando la consulta terminó con error. */
  errorMessage?: string | null;
  /** Texto alternativo para el estado sin resultados. */
  emptyMessage?: string;
}

/**
 * Muestra habitaciones disponibles tras una búsqueda de disponibilidad.
 * Usa la grilla de RoomCard con estados de carga, error y vacío cuidados.
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
      <div
        className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border/80 bg-card py-20 text-muted-foreground animate-in fade-in duration-300"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
        <p className="text-sm">Buscando habitaciones disponibles…</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div
        className="flex items-start gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-5 animate-in fade-in duration-300"
        role="alert"
      >
        <AlertCircle
          className="mt-0.5 size-5 shrink-0 text-destructive"
          aria-hidden
        />
        <div className="space-y-1">
          <p className="font-medium text-foreground">
            No pudimos consultar la disponibilidad
          </p>
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center animate-in fade-in duration-300">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
          <BedDouble className="size-6" aria-hidden />
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Contador de resultados — refuerza claridad tipo checkout */}
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{rooms.length}</span>{" "}
        habitación{rooms.length !== 1 ? "es" : ""} disponible
        {rooms.length !== 1 ? "s" : ""}
      </p>

      {/* Grilla responsiva de RoomCard — 1/2/3 columnas según viewport */}
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
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
    </div>
  );
}
