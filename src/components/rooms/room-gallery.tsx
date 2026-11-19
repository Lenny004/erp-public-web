"use client";

import { useState } from "react";
import Image from "next/image";

import type { PublicRoomImage } from "@/lib/api/public";
import { resolveMediaUrl } from "@/lib/format";
import { getPlaceholderRoomImage } from "@/lib/listing-placeholders";
import { cn } from "@/lib/utils";

interface RoomGalleryProps {
  /** Fotos publicadas de la habitación. */
  images: PublicRoomImage[];
  /** Texto alternativo cuando una foto no trae el suyo. */
  alt: string;
  /** Semilla estable para el placeholder si no hay fotos. */
  seed: string;
}

interface GalleryPhoto {
  src: string;
  alt: string;
}

/**
 * Galería de la ficha: foto principal y miniaturas para cambiarla.
 * Sin fotos del API, muestra el mismo placeholder que el listado.
 */
export function RoomGallery({ images, alt, seed }: RoomGalleryProps) {
  const photos: GalleryPhoto[] = images
    .filter((image) => image.url)
    .map((image) => ({
      src: resolveMediaUrl(image.url),
      alt: image.altText || alt,
    }));
  const gallery =
    photos.length > 0 ? photos : [{ src: getPlaceholderRoomImage(seed), alt }];
  const [index, setIndex] = useState(0);
  const current = gallery[index] ?? gallery[0];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
        {/*
          Las fotos del catálogo pueden venir de cualquier host. next/image
          lanza si el dominio no está en remotePatterns y deja la página en blanco.
        */}
        <Image
          src={current.src}
          alt={current.alt}
          fill
          unoptimized
          priority={index === 0}
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
        />
      </div>

      {gallery.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {gallery.map((photo, photoIndex) => (
            <button
              key={`${photo.src}-${photoIndex}`}
              type="button"
              onClick={() => setIndex(photoIndex)}
              aria-label={`Ver foto ${photoIndex + 1} de ${gallery.length}`}
              aria-pressed={photoIndex === index}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl bg-muted ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                photoIndex === index && "ring-2 ring-primary",
              )}
            >
              <Image
                src={photo.src}
                alt=""
                fill
                unoptimized
                loading="lazy"
                sizes="(max-width: 640px) 25vw, 20vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
