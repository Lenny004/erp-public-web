import type { Metadata } from "next";
import { ContactoContent } from "./contacto-content";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos o llámanos para resolver tus dudas.",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Contacto
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Estamos para ayudarte con reservas, eventos o cualquier consulta sobre
          tu estadía.
        </p>
      </header>

      <ContactoContent />
    </div>
  );
}
