"use client";

import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { PublicRoomImage } from "@/lib/api/public";
import { resolveMediaUrl } from "@/lib/format";
import { cn } from "@/lib/utils";

interface RoomImageCarouselProps {
  /** Imágenes válidas del catálogo que pueden recorrerse. */
  images: PublicRoomImage[];
  /** Texto alternativo por defecto si una imagen no tiene altText. */
  fallbackAlt: string;
  /** Clases adicionales del contenedor del carrusel. */
  className?: string;
}

/**
 * Carrusel simple de imágenes con flechas y puntos indicadores.
 * Las flechas detienen la propagación del clic para no activar el enlace de la tarjeta.
 */
export function RoomImageCarousel({
  images,
  fallbackAlt,
  className,
}: RoomImageCarouselProps) {
  const validImages = images.filter((img) => img.url);
  const [index, setIndex] = useState(0);
  const count = validImages.length;
  const current = validImages[index] ?? validImages[0];

  const goTo = useCallback(
    (nextIndex: number) => {
      setIndex((nextIndex + count) % count);
    },
    [count],
  );

  const handlePrev = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    goTo(index - 1);
  };

  const handleNext = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    goTo(index + 1);
  };

  const handleDot = (event: React.MouseEvent, dotIndex: number) => {
    event.preventDefault();
    event.stopPropagation();
    setIndex(dotIndex);
  };

  if (!current?.url) return null;

  return (
    <div className={cn("group/carousel relative size-full", className)}>
      {/*
        Las fotos del catálogo pueden venir de cualquier host. next/image
        lanza si el dominio no está en remotePatterns y deja la página en blanco.
      */}
      <img
        src={resolveMediaUrl(current.url)}
        alt={current.altText ?? fallbackAlt}
        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />

      {count > 1 && (
        <>
          {/* Flechas — visibles al pasar el cursor sobre la imagen */}
          <button
            type="button"
            aria-label="Imagen anterior"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-foreground opacity-0 shadow-sm transition-opacity hover:bg-card group-hover/carousel:opacity-100"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Imagen siguiente"
            onClick={handleNext}
            className="absolute right-3 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-foreground opacity-0 shadow-sm transition-opacity hover:bg-card group-hover/carousel:opacity-100"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>

          {/* Puntos indicadores */}
          <div
            className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5"
            role="tablist"
            aria-label="Galería de imágenes"
          >
            {validImages.map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                role="tab"
                aria-label={`Imagen ${dotIndex + 1} de ${count}`}
                aria-selected={dotIndex === index}
                onClick={(event) => handleDot(event, dotIndex)}
                className={cn(
                  "size-1.5 rounded-full transition-all",
                  dotIndex === index
                    ? "scale-125 bg-card"
                    : "bg-card/60 hover:bg-card/80",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
