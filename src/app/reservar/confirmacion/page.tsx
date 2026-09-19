import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Home, Mail, Phone } from "lucide-react";
import { ConfirmacionReveal } from "@/app/reservar/confirmacion/confirmacion-content";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Reserva confirmada",
  description: "Tu solicitud de reserva fue recibida.",
};

interface ConfirmacionPageProps {
  searchParams: Promise<{ id?: string }>;
}

/** Pasos tranquilos post-reserva — tono calmado, sin urgencia artificial. */
const NEXT_STEPS = [
  {
    icon: Mail,
    title: "Revisa tu correo",
    description:
      "Te enviaremos un mensaje con los detalles de tu solicitud en cuanto sea procesada.",
  },
  {
    icon: Phone,
    title: "Mantente disponible",
    description:
      "Nuestro equipo puede contactarte por teléfono para confirmar fechas y preferencias.",
  },
  {
    icon: CheckCircle2,
    title: "Espera la confirmación final",
    description:
      "Tu reserva está en estado pendiente hasta que el equipo de hospedaje la apruebe.",
  },
];

/**
 * Página de éxito tras crear la reserva.
 * Explica el estado PENDIENTE, muestra el ID de referencia y próximos pasos claros.
 */
export default async function ConfirmacionPage({
  searchParams,
}: ConfirmacionPageProps) {
  const { id } = await searchParams;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-24">
        <ConfirmacionReveal>
          <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
            <CheckCircle2
              className="size-10 text-primary"
              strokeWidth={1.5}
              aria-hidden
            />
          </div>

          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Solicitud enviada
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              ¡Gracias por tu reserva!
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Recibimos tu solicitud correctamente. El equipo de{" "}
              <span className="font-medium text-foreground">
                {siteConfig.brandName}
              </span>{" "}
              la revisará y te contactará pronto para confirmarla.
            </p>
          </div>

          {id ? (
            <div className="mt-8 rounded-2xl border border-border/80 bg-card px-6 py-5 text-center shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Número de referencia
              </p>
              <p className="mt-2 font-mono text-lg font-semibold tracking-wide text-foreground">
                {id}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Guarda este código para cualquier consulta sobre tu reserva.
              </p>
            </div>
          ) : (
            <p className="mt-8 rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-5 text-center text-sm text-muted-foreground">
              Guarda este enlace o revisa tu correo para el número de referencia.
            </p>
          )}

          <div className="mt-10 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Qué sigue
            </h2>
            <ul className="space-y-3">
              {NEXT_STEPS.map(({ icon: Icon, title, description }) => (
                <li
                  key={title}
                  className="flex gap-4 rounded-xl border border-border/60 bg-card/50 px-4 py-4"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
                    <Icon className="size-4" aria-hidden />
                  </div>
                  <div className="space-y-0.5 text-left">
                    <p className="text-sm font-medium text-foreground">
                      {title}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="h-12 gap-2">
              <Link href="/">
                <Home className="size-4" aria-hidden />
                Volver al inicio
              </Link>
            </Button>
          </div>
        </ConfirmacionReveal>
      </div>
    </div>
  );
}
