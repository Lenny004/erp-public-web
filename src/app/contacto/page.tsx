import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { ContactoContent } from "./contacto-content";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos o llámanos para resolver tus dudas.",
};

/** Página de contacto — layout suave con encabezado y columnas en desktop. */
export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <header className="mb-12 max-w-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <MessageCircle className="size-5" aria-hidden />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Contacto
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Estamos para ayudarte con reservas, eventos o cualquier consulta sobre
            tu estadía. Escríbenos y te respondemos a la brevedad.
          </p>
        </div>
      </header>

      <ContactoContent />
    </div>
  );
}
