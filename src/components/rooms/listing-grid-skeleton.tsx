"use client";

import { ListingSkeleton } from "@/components/rooms/listing-skeleton";
import { cn } from "@/lib/utils";

interface ListingGridSkeletonProps {
  count?: number;
  className?: string;
  label?: string;
}

/** Rejilla de carga con las medidas reales del catálogo. */
export function ListingGridSkeleton({
  count = 6,
  className,
  label = "Cargando habitaciones",
}: ListingGridSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label={label}
      className={cn("grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3", className)}
    >
      {Array.from({ length: count }, (_, index) => (
        <ListingSkeleton key={`listing-skeleton-${index}`} />
      ))}
    </div>
  );
}
