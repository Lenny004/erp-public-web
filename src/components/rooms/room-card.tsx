import Link from "next/link";
import Image from "next/image";
import { Users } from "lucide-react";

import type { PublicRoom } from "@/lib/api/public";
import { formatMoney, parseMoneyAmount } from "@/lib/format";
import { getPlaceholderRoomImage } from "@/lib/listing-placeholders";
import { cn } from "@/lib/utils";
import { RoomImageCarousel } from "@/components/rooms/room-image-carousel";

interface RoomCardProps {
  room: PublicRoom;
  selected?: boolean;
  onSelect?: (room: PublicRoom) => void;
  bookingQuery?: string;
  className?: string;
}

/** Tarjeta de habitación con controles independientes para el carrusel y la acción. */
export function RoomCard({
  room,
  selected = false,
  onSelect,
  bookingQuery = "",
  className,
}: RoomCardProps) {
  const apiImages = room.images.filter((img) => img.url);
  const nightlyPrice = parseMoneyAmount(room.roomType.basePrice);
  const dateQuery = bookingQuery.replace(/^&/, "");
  const reserveHref = dateQuery
    ? `/habitaciones/${room.id}?${dateQuery}`
    : `/habitaciones/${room.id}`;

  return (
    <article
      className={cn(
        "room-card group min-w-0 rounded-xl",
        selected && "room-card--selected",
        className,
      )}
    >
      <div className="room-card__media relative aspect-square overflow-hidden rounded-xl bg-muted">
        {apiImages.length > 0 ? (
          <RoomImageCarousel images={apiImages} fallbackAlt={room.name} />
        ) : (
          <Image
            src={getPlaceholderRoomImage(room.id || room.name)}
            alt={room.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}
      </div>

      <div className="room-card__content space-y-1 pt-3">
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
            {nightlyPrice === null
              ? "Precio no disponible"
              : formatMoney(nightlyPrice)}
          </span>
          {nightlyPrice !== null && (
            <span className="text-sm text-muted-foreground"> noche</span>
          )}
        </p>

        {onSelect ? (
          <button
            type="button"
            onClick={() => onSelect(room)}
            aria-pressed={selected}
            className="room-card__action mt-3 w-full rounded-lg border border-primary px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {selected ? "Habitación seleccionada" : "Seleccionar habitación"}
          </button>
        ) : (
          <Link
            href={reserveHref}
            className="room-card__action mt-3 inline-flex min-h-11 items-center rounded-lg px-1 py-2 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Ver habitación
          </Link>
        )}
      </div>
    </article>
  );
}
