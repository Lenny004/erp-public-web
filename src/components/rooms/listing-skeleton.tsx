import { cn } from "@/lib/utils";

interface ListingSkeletonProps {
  className?: string;
}

/**
 * Tarjeta fantasma reutilizable para estados de carga del catálogo.
 * Replica el layout Airbnb de `RoomCard`: imagen cuadrada + líneas de texto.
 */
export function ListingSkeleton({ className }: ListingSkeletonProps) {
  return (
    <article aria-hidden className={cn("w-full", className)}>
      <div className="aspect-square animate-pulse rounded-xl bg-muted" />
      <div className="space-y-2 pt-3">
        <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
        <div className="h-3.5 w-1/2 animate-pulse rounded-md bg-muted" />
        <div className="h-3.5 w-2/5 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-1/3 animate-pulse rounded-md bg-muted pt-0.5" />
      </div>
    </article>
  );
}
