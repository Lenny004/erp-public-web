"use client";

import { ListingSkeleton } from "@/components/rooms/listing-skeleton";
import { useDelayedVisible } from "@/hooks/use-delayed-visible";
import { cn } from "@/lib/utils";

interface ListingGridSkeletonProps {
  count?: number;
  className?: string;
  label?: string;
}

/** Rejilla de carga con las medidas reales del catálogo; aparece tras 150 ms para evitar parpadeos. */
export function ListingGridSkeleton({
  count = 6,
  className,
  label = "Cargando habitaciones",
}: ListingGridSkeletonProps) {
  const visible = useDelayedVisible(150);

  return (
    <div
      aria-busy="true"
      aria-label={label}
      className={cn("grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3", className)}
    >
      {visible &&
        Array.from({ length: count }, (_, index) => <ListingSkeleton key={`listing-skeleton-${index}`} />)}
    </div>
  );
}
