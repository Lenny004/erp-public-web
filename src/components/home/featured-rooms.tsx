"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePublicRooms } from "@/hooks/use-public-rooms";
import { RoomCard } from "@/components/rooms/room-card";
import { ListingSkeleton } from "@/components/rooms/listing-skeleton";
import { Button } from "@/components/ui/button";

/** Máximo de habitaciones mostradas en el home (estilo grid de Airbnb). */
const FEATURED_LIMIT = 6;

/**
 * Grid de habitaciones destacadas para la landing.
 * Consume el catálogo público y muestra hasta 6 tarjetas interactivas.
 */
export function FeaturedRooms() {
  const { data: rooms, isLoading, isError, error, refetch } = usePublicRooms();

  return (
    <div className="space-y-10">
      {/* Encabezado de sección con enlace al catálogo completo */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Alojamientos destacados
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Espacios seleccionados para una estadía cómoda, luminosa y cerca de
            todo lo que necesitas.
          </p>
        </div>

        <Link
          href="/habitaciones"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          Ver todas
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      {isLoading && (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: FEATURED_LIMIT }, (_, index) => (
            <ListingSkeleton key={`featured-skeleton-${index}`} />
          ))}
        </div>
      )}

      {isError && (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center"
        >
          <p className="text-destructive">
            {error?.message ?? "No se pudo cargar el catálogo de habitaciones."}
          </p>
          <Button
            type="button"
            variant="outline"
            shape="pill"
            className="mt-4"
            onClick={() => refetch()}
          >
            Reintentar
          </Button>
        </div>
      )}

      {!isLoading && !isError && !rooms?.length && (
        <p className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
          Pronto publicaremos nuestras habitaciones. Vuelve en unos días.
        </p>
      )}

      {!isLoading && !isError && !!rooms?.length && (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {rooms.slice(0, FEATURED_LIMIT).map((room, index) => (
            <div
              key={room.id}
              className="animate-in fade-in duration-500"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <RoomCard room={room} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
