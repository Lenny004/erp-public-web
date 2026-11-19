import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ReservarContent } from "./reservar-content";

export const metadata: Metadata = {
  title: "Reservar",
  description: "Consulta disponibilidad y confirma tu reserva en línea.",
};

/**
 * Página contenedora del wizard de reserva.
 * El layout usa ancho máximo controlado y cabecera clara (estilo checkout premium).
 */
export default function ReservarPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Cabecera con fondo sutil — separa el contexto del flujo de reserva */}
      <div className="border-b border-border/50 bg-card/40">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <header className="mx-auto max-w-2xl space-y-3 text-center">
            <h1 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Reserva en línea
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Indica tu estadía y abre la ficha de la habitación para ver fotos,
              precio y confirmar la reserva.
            </p>
          </header>
        </div>
      </div>

      {/* Contenido del wizard — ancho generoso para la grilla de habitaciones */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <Suspense
          fallback={
            <div className="flex items-center justify-center gap-3 py-24 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" aria-hidden />
              <span className="text-sm">Cargando reserva…</span>
            </div>
          }
        >
          <ReservarContent />
        </Suspense>
      </div>
    </div>
  );
}
