import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { HabitacionContent } from "./habitacion-content";

export const metadata: Metadata = {
  title: "Habitación",
  description: "Fotos, precio por noche y reserva en línea.",
};

/** Ficha pública de una habitación, con la comprobación de fechas al lado de las fotos. */
export default function HabitacionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center gap-3 py-24 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          <span className="text-sm">Cargando habitación…</span>
        </div>
      }
    >
      <HabitacionContent />
    </Suspense>
  );
}
