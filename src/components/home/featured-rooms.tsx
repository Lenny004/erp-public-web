"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePublicRooms } from "@/hooks/use-public-rooms";
import { AnimatedStaggerGrid } from "@/components/motion/animated-stagger-grid";
import { RoomCard } from "@/components/rooms/room-card";
import { ListingGridSkeleton } from "@/components/rooms/listing-grid-skeleton";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { mensajeDeError } from "@/lib/errores";

/** Máximo de habitaciones mostradas en el home (estilo grid de Airbnb). */
const FEATURED_LIMIT = 6;

/**
 * Grid de habitaciones destacadas para la landing.
 * Consume el catálogo público y muestra hasta 6 tarjetas interactivas.
 */
export function FeaturedRooms() {
  const { data: rooms, isLoading, isError, error, refetch, isFetching } = usePublicRooms();

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

      {isLoading && <ListingGridSkeleton count={FEATURED_LIMIT} />}

      {isError && (
        <ErrorState
          title="No pudimos cargar las habitaciones"
          message={mensajeDeError(error)}
          onRetry={() => refetch()}
          retrying={isFetching}
        />
      )}

      {!isLoading && !isError && !rooms?.length && (
        <EmptyState
          className="max-w-none"
          title="Pronto publicaremos nuestras habitaciones"
          description="Vuelve en unos días."
        />
      )}

      {!isLoading && !isError && !!rooms?.length && (
        <AnimatedStaggerGrid className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.slice(0, FEATURED_LIMIT).map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </AnimatedStaggerGrid>
      )}
    </div>
  );
}
