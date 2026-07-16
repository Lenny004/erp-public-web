import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

/**
 * Pie de página con datos de contacto y enlaces legales obligatorios.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-primary">{siteConfig.brandName}</p>
          <p className="text-sm text-muted-foreground">{siteConfig.tagline}</p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium text-foreground">Contacto</p>
          <p className="text-muted-foreground">{siteConfig.contactAddress}</p>
          <p>
            <a
              href={`tel:${siteConfig.contactPhone.replace(/\s/g, "")}`}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              {siteConfig.contactPhone}
            </a>
          </p>
          <p>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              {siteConfig.contactEmail}
            </a>
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium text-foreground">Legal</p>
          <nav className="flex flex-col gap-1">
            <Link
              href="/legal/terminos"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              Términos y condiciones
            </Link>
            <Link
              href="/legal/privacidad"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              Política de privacidad
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {siteConfig.brandName}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
