import type { Metadata } from "next";
import { HabitacionesContent } from "./habitaciones-content";

export const metadata: Metadata = {
  title: "Habitaciones",
  description: "Explora nuestras habitaciones y reserva en línea.",
};

export default function HabitacionesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Habitaciones
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Cada espacio está pensado para el descanso. Consulta capacidad y tarifas
          base por noche antes de reservar.
        </p>
      </header>

      <HabitacionesContent />
    </div>
  );
}
