import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";

/** Página 404 amigable con enlace de regreso al inicio. */
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-primary">
        Error 404
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-foreground">
        Página no encontrada
      </h1>
      <p className="mt-4 text-muted-foreground">
        La ruta que buscas no existe en {siteConfig.brandName}. Puede que haya sido
        movida o escrita incorrectamente.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Ir al inicio</Link>
      </Button>
    </div>
  );
}
