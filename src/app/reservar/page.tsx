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
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <header className="mx-auto max-w-2xl space-y-3 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Reserva en línea
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Tu estadía, paso a paso
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              Consulta disponibilidad, elige tu habitación y confirma tus datos
              con la misma claridad de un checkout moderno.
            </p>
          </header>
        </div>
      </div>

      {/* Contenido del wizard — ancho generoso para la grilla de habitaciones */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
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
