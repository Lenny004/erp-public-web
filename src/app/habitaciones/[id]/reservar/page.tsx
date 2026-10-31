import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ReservarHabitacionContent } from "./reservar-content";

export const metadata: Metadata = {
  title: "Datos del huésped",
  description: "Completa tus datos para enviar la solicitud de reserva.",
};

/** Paso intermedio: la estadía ya se validó en la ficha y aquí se piden los datos. */
export default function ReservarHabitacionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center gap-3 py-24 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          <span className="text-sm">Cargando reserva…</span>
        </div>
      }
    >
      <ReservarHabitacionContent />
    </Suspense>
  );
}
