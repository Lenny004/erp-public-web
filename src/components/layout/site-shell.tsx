import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AnimatedPage } from "@/components/motion/animated-page";

/**
 * Envoltorio común: cabecera sticky + contenido principal + pie.
 * Usado en layout.tsx para todas las rutas públicas.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#contenido"
        className="sr-only z-(--z-toast) rounded-md bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-md focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus-visible:ring-3 focus-visible:ring-(--focus-ring)"
      >
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido" tabIndex={-1} className="flex-1 outline-none">
        <AnimatedPage>{children}</AnimatedPage>
      </main>
      <SiteFooter />
    </div>
  );
}
