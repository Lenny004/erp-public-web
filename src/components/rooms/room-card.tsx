"use client";

import Link from "next/link";
import Image from "next/image";
import { Users } from "lucide-react";
import type { PublicRoom } from "@/lib/api/public";
import { formatMoney, resolveMediaUrl } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RoomCardProps {
  room: PublicRoom;
  /** Si true, resalta la tarjeta como seleccionada en el wizard. */
  selected?: boolean;
  /** Callback al elegir habitación dentro del panel de disponibilidad. */
  onSelect?: (room: PublicRoom) => void;
  /** Query string opcional para prellenar fechas en /reservar. */
  bookingQuery?: string;
  className?: string;
}

/**
 * Tarjeta interactiva de habitación: imagen, datos y CTA de reserva.
 * Usada en listado y en el paso de selección del wizard.
 */
export function RoomCard({
  room,
  selected = false,
  onSelect,
  bookingQuery = "",
  className,
}: RoomCardProps) {
  const cover = room.images[0]?.url ? resolveMediaUrl(room.images[0].url) : null;
  const alt = room.images[0]?.altText ?? room.name;
  const reserveHref = `/reservar?roomId=${room.id}${bookingQuery}`;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
        selected && "ring-2 ring-primary ring-offset-2",
        className,
      )}
    >
      {/* Imagen de portada */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {cover ? (
          <Image
            src={cover}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sin imagen
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground">{room.name}</h3>
            <Badge variant="secondary">{room.roomType.name}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Habitación {room.number}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Users className="size-4" aria-hidden />
            Hasta {room.capacity} huéspedes
          </span>
          <span className="font-medium text-foreground">
            {formatMoney(room.roomType.basePrice)}
            <span className="font-normal text-muted-foreground"> / noche</span>
          </span>
        </div>

        <div className="mt-auto flex gap-2 pt-2">
          {onSelect ? (
            <Button
              type="button"
              className="w-full"
              variant={selected ? "secondary" : "default"}
              onClick={() => onSelect(room)}
            >
              {selected ? "Seleccionada" : "Elegir habitación"}
            </Button>
          ) : (
            <Button asChild className="w-full">
              <Link href={reserveHref}>Reservar</Link>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
