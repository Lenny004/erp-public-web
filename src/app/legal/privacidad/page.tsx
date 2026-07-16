import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Política de privacidad",
};

/** Texto legal placeholder — sustituir por contenido jurídico revisado. */
export default function PrivacidadPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      {/* Encabezado con ritmo tipográfico claro */}
      <header className="space-y-4 border-b border-border pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Shield className="size-5" aria-hidden />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Política de privacidad
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
            Datos que recopilamos
          </h2>
          <p className="text-base leading-7 text-muted-foreground">
            Al reservar o contactarnos recopilamos nombre, correo electrónico,
            teléfono y fechas de estadía necesarios para gestionar tu solicitud.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Uso de la información
          </h2>
          <p className="text-base leading-7 text-muted-foreground">
            Utilizamos tus datos únicamente para confirmar reservas, responder
            consultas y mejorar la experiencia en el hotel. No vendemos información
            personal a terceros.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Conservación y seguridad
          </h2>
          <p className="text-base leading-7 text-muted-foreground">
            Conservamos los datos el tiempo necesario para obligaciones legales y
            operativas. Aplicamos medidas técnicas razonables para proteger la
            información transmitida por este sitio.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Tus derechos
          </h2>
          <p className="text-base leading-7 text-muted-foreground">
            Puedes solicitar acceso, rectificación o eliminación de tus datos
            escribiendo a{" "}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {siteConfig.contactEmail}
            </a>
            .
          </p>
        </section>
      </div>

      <footer className="mt-12 border-t border-border pt-8">
        <p className="text-sm text-muted-foreground">
          También puedes revisar nuestros{" "}
          <Link
            href="/legal/terminos"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            términos y condiciones
          </Link>
          .
        </p>
      </footer>
    </article>
  );
}
