import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Política de privacidad",
};

/** Texto legal placeholder — sustituir por contenido jurídico revisado. */
export default function PrivacidadPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold text-foreground">
        Política de privacidad
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Última actualización: julio 2026 · {siteConfig.brandName}
      </p>

      <div className="mt-10 space-y-6 text-foreground/90">
        <section>
          <h2 className="text-xl font-semibold">Datos que recopilamos</h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Al reservar o contactarnos recopilamos nombre, correo electrónico,
            teléfono y fechas de estadía necesarios para gestionar tu solicitud.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Uso de la información</h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Utilizamos tus datos únicamente para confirmar reservas, responder
            consultas y mejorar la experiencia en el hotel. No vendemos información
            personal a terceros.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Conservación y seguridad</h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Conservamos los datos el tiempo necesario para obligaciones legales y
            operativas. Aplicamos medidas técnicas razonables para proteger la
            información transmitida por este sitio.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Tus derechos</h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Puedes solicitar acceso, rectificación o eliminación de tus datos
            escribiendo a {siteConfig.contactEmail}.
          </p>
        </section>
      </div>
    </article>
  );
}
