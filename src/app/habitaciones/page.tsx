import type { Metadata } from "next";
import { HabitacionesContent } from "./habitaciones-content";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Habitaciones",
  description: "Explora nuestras habitaciones y reserva en línea.",
};

/** Subtítulo breve con ubicación del hotel cuando está configurada. */
function buildListingSubtitle(): string {
  const location = siteConfig.contactAddress?.trim();

  if (location) {
    return `Estancias disponibles en ${location}.`;
  }

  return "Explora espacios cómodos y reserva tu estadía en línea.";
}

export default function HabitacionesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8">
      <header className="mb-12 space-y-3 sm:mb-14 sm:space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Habitaciones
        </h1>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          {buildListingSubtitle()}
        </p>
      </header>

      <HabitacionesContent />
    </div>
  );
}
