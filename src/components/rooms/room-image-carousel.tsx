"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { PublicRoomImage } from "@/lib/api/public";
import { resolveMediaUrl } from "@/lib/format";
import { cn } from "@/lib/utils";

interface RoomImageCarouselProps {
  images: PublicRoomImage[];
  fallbackAlt: string;
  className?: string;
}

/** Carrusel operable con botones de teclado y áreas táctiles de 44 px. */
export function RoomImageCarousel({
  images,
  fallbackAlt,
  className,
}: RoomImageCarouselProps) {
  const validImages = images.filter((image) => image.url);
  const [index, setIndex] = useState(0);
  const indicatorRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const count = validImages.length;
  const current = validImages[index] ?? validImages[0];

  const goTo = useCallback(
    (nextIndex: number) => setIndex((nextIndex + count) % count),
    [count],
  );

  const handleIndicatorKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % count;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + count) % count;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = count - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      goTo(nextIndex);
      indicatorRefs.current[nextIndex]?.focus();
    }
  };

  if (!current?.url) return null;

  const stopCardActivation = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      className={cn("room-image-carousel group/carousel relative size-full", className)}
      role="group"
      aria-roledescription="carrusel"
      aria-label={`Imágenes de ${fallbackAlt}`}
    >
      <Image
        src={resolveMediaUrl(current.url)}
        alt={current.altText ?? fallbackAlt}
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Imagen anterior"
            onClick={(event) => {
              stopCardActivation(event);
              goTo(index - 1);
            }}
            className="room-image-carousel__control room-image-carousel__control--previous absolute left-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-foreground shadow-sm transition-opacity hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Imagen siguiente"
            onClick={(event) => {
              stopCardActivation(event);
              goTo(index + 1);
            }}
            className="room-image-carousel__control room-image-carousel__control--next absolute right-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-foreground shadow-sm transition-opacity hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>

          <div
            className="room-image-carousel__indicators absolute bottom-1 left-1/2 z-10 flex -translate-x-1/2"
            role="group"
            aria-label="Seleccionar imagen"
          >
            {validImages.map((image, imageIndex) => (
              <button
                key={`${image.url}-${imageIndex}`}
                ref={(element) => {
                  indicatorRefs.current[imageIndex] = element;
                }}
                type="button"
                aria-label={`Mostrar imagen ${imageIndex + 1} de ${count}`}
                aria-pressed={imageIndex === index}
                onClick={(event) => {
                  stopCardActivation(event);
                  goTo(imageIndex);
                }}
                onKeyDown={(event) => handleIndicatorKeyDown(event, imageIndex)}
                className="room-image-carousel__indicator flex size-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-2 rounded-full shadow-sm transition-transform",
                    imageIndex === index
                      ? "scale-125 bg-card"
                      : "bg-card/70 hover:bg-card",
                  )}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
