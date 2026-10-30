"use client";

import Link from "next/link";
import { BedDouble } from "lucide-react";
import { usePublicRooms } from "@/hooks/use-public-rooms";
import { AnimatedStaggerGrid } from "@/components/motion/animated-stagger-grid";
import { RoomCard } from "@/components/rooms/room-card";
import { ListingGridSkeleton } from "@/components/rooms/listing-grid-skeleton";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { mensajeDeError } from "@/lib/errores";

/** Cantidad de tarjetas fantasma mientras carga el catálogo. */
const SKELETON_COUNT = 6;

/**
 * Listado público de habitaciones con estados de carga, vacío y error.
 * Los datos provienen de GET /api/public/rooms vía `usePublicRooms`.
 */
export function HabitacionesContent() {
  const { data: rooms, isLoading, isError, error, refetch, isFetching } = usePublicRooms();

  if (isLoading) {
    return <ListingGridSkeleton count={SKELETON_COUNT} />;
  }

  if (isError) {
    return (
      <ErrorState
        title="No pudimos cargar las habitaciones"
        message={mensajeDeError(error)}
        onRetry={() => refetch()}
        retrying={isFetching}
      />
    );
  }

  if (!rooms?.length) {
    return (
      <EmptyState
        icon={<BedDouble />}
        title="Aún no hay habitaciones publicadas"
        description="Vuelve pronto o escríbenos si necesitas ayuda con una reserva."
        action={
          <Button asChild variant="outline">
            <Link href="/contacto">Contactar</Link>
          </Button>
        }
      />
    );
  }

  return (
    <AnimatedStaggerGrid className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </AnimatedStaggerGrid>
  );
}
