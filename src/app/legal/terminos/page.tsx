import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Términos y condiciones",
};

/** Texto legal placeholder — sustituir por contenido jurídico revisado. */
export default function TerminosPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      {/* Encabezado con ritmo tipográfico claro */}
      <header className="space-y-4 border-b border-border pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="size-5" aria-hidden />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Términos y condiciones
          </h1>
          <p className="text-sm text-muted-foreground">
            Última actualización: julio 2026 · {siteConfig.brandName}
          </p>
        </div>
      </header>

      {/* Cuerpo legal — prosa legible con espaciado consistente */}
      <div className="prose prose-neutral mt-10 max-w-none space-y-10 text-foreground/90 dark:prose-invert">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            1. Reservas en línea
          </h2>
          <p className="text-base leading-7 text-muted-foreground">
            Las reservas realizadas a través de este sitio quedan sujetas a
            confirmación por parte del hotel. El estado inicial es{" "}
            <strong className="font-medium text-foreground">PENDIENTE</strong> hasta
            que nuestro equipo verifique disponibilidad y datos de contacto.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            2. Check-in y check-out
          </h2>
          <p className="text-base leading-7 text-muted-foreground">
            El horario estándar de entrada es a partir de las 15:00 y la salida
            antes de las 11:00, salvo acuerdo previo por escrito. Identificación
            oficial puede ser requerida al registrarse.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            3. Cancelaciones
          </h2>
          <p className="text-base leading-7 text-muted-foreground">
            Las políticas de cancelación y reembolso dependen del tipo de tarifa
            contratada. Consulta con recepción antes de modificar o anular tu
            reserva.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            4. Responsabilidad
          </h2>
          <p className="text-base leading-7 text-muted-foreground">
            {siteConfig.brandName} no se hace responsable por interrupciones
            temporales del servicio en línea causadas por mantenimiento o fallas
            técnicas ajenas a nuestro control razonable.
          </p>
        </section>
      </div>

      <footer className="mt-12 border-t border-border pt-8">
        <p className="text-sm text-muted-foreground">
          ¿Dudas sobre privacidad? Consulta nuestra{" "}
          <Link
            href="/legal/privacidad"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            política de privacidad
          </Link>
          .
        </p>
      </footer>
    </article>
  );
}
