import Link from "next/link";
import { Compass, Home, Search } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";

/** Página 404 amigable estilo marketplace con CTAs de regreso. */
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* Icono decorativo al estilo del resto del sitio */}
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Compass className="size-8" aria-hidden />
        </div>

        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Error 404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Página no encontrada
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          La ruta que buscas no existe en {siteConfig.brandName}. Puede que haya sido
          movida o escrita incorrectamente.
        </p>

        {/* CTAs principales — regreso al marketplace */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="action">
            <Link href="/">
              <Home className="size-4" aria-hidden />
              Ir al inicio
            </Link>
          </Button>
          <Button asChild size="action" variant="outline">
            <Link href="/habitaciones">
              <Search className="size-4" aria-hidden />
              Ver habitaciones
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          ¿Necesitas ayuda?{" "}
          <Link
            href="/contacto"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Contáctanos
          </Link>
        </p>
      </div>
    </div>
  );
}
