"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Enlaces principales de navegación del sitio público. */
const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/habitaciones", label: "Habitaciones" },
  { href: "/reservar", label: "Reservar" },
  { href: "/contacto", label: "Contacto" },
] as const;

/**
 * Cabecera sticky con marca, navegación desktop y menú móvil simple.
 * El CTA "Reservar" siempre visible para conversión.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md transition-shadow duration-300">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Marca — enlace al inicio */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-primary transition-opacity hover:opacity-80"
        >
          {siteConfig.brandName}
        </Link>

        {/* Nav desktop */}
        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Navegación principal"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === href
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/reservar">Reservar</Link>
          </Button>

          {/* Toggle menú móvil */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Panel móvil — animación slide-in */}
      <div
        id="mobile-nav"
        className={cn(
          "overflow-hidden border-t border-border/60 bg-background transition-all duration-300 md:hidden",
          mobileOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Menú móvil">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                pathname === href ? "text-primary" : "text-foreground",
              )}
            >
              {label}
            </Link>
          ))}
          <Button asChild className="mt-2 w-full">
            <Link href="/reservar" onClick={() => setMobileOpen(false)}>
              Reservar
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
