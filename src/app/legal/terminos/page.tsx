import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Términos y condiciones",
};

/** Texto legal placeholder — sustituir por contenido jurídico revisado. */
export default function TerminosPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 prose prose-neutral">
      <h1 className="text-3xl font-semibold text-foreground">
        Términos y condiciones
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Última actualización: julio 2026 · {siteConfig.brandName}
      </p>

      <div className="mt-10 space-y-6 text-foreground/90">
        <section>
          <h2 className="text-xl font-semibold">1. Reservas en línea</h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Las reservas realizadas a través de este sitio quedan sujetas a
            confirmación por parte del hotel. El estado inicial es PENDIENTE hasta
            que nuestro equipo verifique disponibilidad y datos de contacto.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. Check-in y check-out</h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            El horario estándar de entrada es a partir de las 15:00 y la salida
            antes de las 11:00, salvo acuerdo previo por escrito. Identificación
            oficial puede ser requerida al registrarse.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. Cancelaciones</h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Las políticas de cancelación y reembolso dependen del tipo de tarifa
            contratada. Consulta con recepción antes de modificar o anular tu
            reserva.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Responsabilidad</h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            {siteConfig.brandName} no se hace responsable por interrupciones
            temporales del servicio en línea causadas por mantenimiento o fallas
            técnicas ajenas a nuestro control razonable.
          </p>
        </section>
      </div>
    </article>
  );
}
