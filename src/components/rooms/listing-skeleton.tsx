import { Skeleton } from "@/components/ui/skeleton";
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
      <Skeleton className="aspect-square rounded-xl" />
      <div className="space-y-2 pt-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-3.5 w-2/5" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </article>
  );
}
