import { cn } from "@/lib/utils";

/** Bloque base de carga: replica la forma del contenido con brillo suave (estático si se reduce el movimiento). */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("skeleton rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
