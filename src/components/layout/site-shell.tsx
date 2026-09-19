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
      <SiteHeader />
      <main className="flex-1">
        <AnimatedPage>{children}</AnimatedPage>
      </main>
      <SiteFooter />
    </div>
  );
}
