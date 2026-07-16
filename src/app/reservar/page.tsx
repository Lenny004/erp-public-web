import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ReservarContent } from "./reservar-content";

export const metadata: Metadata = {
  title: "Reservar",
  description: "Consulta disponibilidad y confirma tu reserva en línea.",
};

export default function ReservarPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Reservar
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Sigue los pasos: fechas, habitación y datos del huésped.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden />
            Cargando reserva…
          </div>
        }
      >
        <ReservarContent />
      </Suspense>
    </div>
  );
}
