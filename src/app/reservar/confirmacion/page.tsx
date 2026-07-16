import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Reserva confirmada",
  description: "Tu solicitud de reserva fue recibida.",
};

interface ConfirmacionPageProps {
  searchParams: Promise<{ id?: string }>;
}

/**
 * Página de éxito tras crear la reserva.
 * Explica el estado PENDIENTE y muestra el ID de referencia.
 */
export default async function ConfirmacionPage({
  searchParams,
}: ConfirmacionPageProps) {
  const { id } = await searchParams;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="size-8" aria-hidden />
      </div>

      <h1 className="text-2xl font-semibold text-foreground">
        ¡Solicitud recibida!
      </h1>

      <p className="mt-4 text-muted-foreground">
        Tu reserva está en estado <strong>PENDIENTE</strong>. Nuestro equipo de{" "}
        {siteConfig.brandName} la revisará y te contactará por correo o teléfono
        para confirmarla.
      </p>

      {id ? (
        <p className="mt-6 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
          Número de referencia:{" "}
          <span className="font-mono font-medium text-foreground">{id}</span>
        </p>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Guarda este enlace o revisa tu correo para el número de referencia.
        </p>
      )}

      <Button asChild className="mt-8" size="lg">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
