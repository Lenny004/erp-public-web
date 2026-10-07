"use client";

import Link from "next/link";
import Image from "next/image";
import { Users } from "lucide-react";

import type { PublicRoom } from "@/lib/api/public";
import { formatMoney } from "@/lib/format";
import { getPlaceholderRoomImage } from "@/lib/listing-placeholders";
import { cn } from "@/lib/utils";
import { RoomImageCarousel } from "@/components/rooms/room-image-carousel";

interface RoomCardProps {
  room: PublicRoom;
  /** Si true, resalta la tarjeta como seleccionada en el wizard. */
  selected?: boolean;
  /** Callback al elegir habitación dentro del panel de disponibilidad. */
  onSelect?: (room: PublicRoom) => void;
  /** Query string opcional para prellenar fechas en /reservar. */
  bookingQuery?: string;
  /** Clases adicionales del enlace o botón que envuelve la tarjeta. */
  className?: string;
}

/**
 * Tarjeta de habitación estilo Airbnb: imagen grande arriba, datos abajo.
 * Sin fotos del API, usa un placeholder Unsplash estable por id de habitación.
 */
export function RoomCard({
  room,
  selected = false,
  onSelect,
  bookingQuery = "",
  className,
}: RoomCardProps) {
  const apiImages = room.images.filter((img) => img.url);
  const hasApiImages = apiImages.length > 0;
  const placeholderUrl = getPlaceholderRoomImage(room.id || room.name);
  const reserveHref = `/reservar?roomId=${room.id}${bookingQuery}`;

  const cardClassName = cn(
    "group block w-full text-left transition-opacity duration-200 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl",
    selected && "ring-2 ring-primary ring-offset-2",
    className,
  );

  const content = (
    <>
      {/* Imagen principal — sin borde ni sombra de tarjeta (patrón listing) */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        {hasApiImages ? (
          <RoomImageCarousel images={apiImages} fallbackAlt={room.name} />
        ) : (
          <Image
            src={placeholderUrl}
            alt={room.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}
      </div>

      {/* Texto debajo de la imagen */}
      <div className="space-y-1 pt-3">
        <h3 className="truncate font-medium text-foreground">{room.name}</h3>

        <p className="truncate text-sm text-muted-foreground">
          {room.roomType.name} · Habitación {room.number}
        </p>

        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="size-3.5 shrink-0" aria-hidden />
          Hasta {room.capacity} huéspedes
        </p>

        <p className="pt-0.5">
          <span className="font-semibold text-foreground">
            {formatMoney(room.roomType.basePrice)}
          </span>
          <span className="text-sm text-muted-foreground"> noche</span>
        </p>
      </div>
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(room)}
        aria-pressed={selected}
        aria-label={
          selected ? `${room.name}, seleccionada` : `Elegir ${room.name}`
        }
        className={cardClassName}
      >
        {content}
      </button>
    );
  }

  return (
    <Link href={reserveHref} className={cardClassName}>
      {content}
    </Link>
  );
}
