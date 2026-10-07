"use client";

/** Cabecera white-label que muestra el nombre comercial de la empresa configurada. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { publicApi } from "@/lib/api/public";

/** Umbral de desplazamiento antes de volver sólido el header de la portada. */
const SCROLL_SOLID_THRESHOLD = 24;

/** Altura compartida del header; mantiene sincronizado el espacio reservado. */
const HEADER_HEIGHT_CLASS = "h-[72px]";

/**
 * Enlaces de navegación principal; el CTA «Reservar» vive en el grupo de acciones.
 * Las etiquetas son visibles en español y los segmentos de ruta se mantienen en inglés.
 */
const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/habitaciones", label: "Habitaciones" },
  { href: "/contacto", label: "Contacto" },
] as const;

/**
 * Header fijo del sitio público:
 * - Barra translúcida con borde sutil en las rutas internas.
 * - Superposición transparente sobre el hero hasta que se desplaza la portada.
 * - Navegación centrada en escritorio y panel deslizable en móvil.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [brandName, setBrandName] = useState(siteConfig.brandName);

  useEffect(() => {
    // El perfil público puede reemplazar la marca de fallback definida en build.
    publicApi.getCompanyProfile().then((company) => {
      if (company?.commercialName || company?.legalName) setBrandName(company.commercialName || company.legalName);
    }).catch(() => undefined);
  }, []);

  /** Indica que el header flota sobre el hero sin fondo sólido. */
  const isTransparent = isHome && !scrolled;

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > SCROLL_SOLID_THRESHOLD);
  }, []);

  // Sigue el scroll para alternar el header de transparente a sólido en la portada.
  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Reinicia el estado de scroll al salir de la portada.
  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
    } else {
      handleScroll();
    }
  }, [isHome, handleScroll]);

  // Cierra el panel móvil al cambiar de ruta.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Evita el scroll del fondo mientras el panel móvil está abierto.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ease-out",
          HEADER_HEIGHT_CLASS,
          isTransparent
            ? "border-b border-transparent bg-transparent"
            : "border-b border-border/50 bg-card/85 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-card/75",
        )}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Marca: ancla izquierda con wordmark semibold. */}
          <Link
            href="/"
            className={cn(
              "shrink-0 text-xl font-semibold tracking-tight transition-colors sm:text-[1.35rem]",
              isTransparent
                ? "text-primary-foreground hover:text-primary-foreground/90"
                : "text-foreground hover:text-foreground/80",
            )}
          >
            {brandName}
          </Link>

          {/* Navegación de escritorio centrada para equilibrar el layout. */}
          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex"
            aria-label="Navegación principal"
          >
            {NAV_LINKS.map(({ href, label }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isTransparent
                      ? isActive
                        ? "bg-primary-foreground/15 text-primary-foreground"
                        : "text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                      : isActive
                        ? "bg-foreground/5 text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Grupo derecho: CTA principal y control del menú móvil. */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Button
              asChild
              size="pill-sm"
              shape="pill"
              variant="primary"
              className="hidden shadow-sm sm:inline-flex"
            >
              <Link href="/reservar">Reservar</Link>
            </Button>

            {/* Activador del menú móvil con forma de píldora. */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "rounded-full border px-3 md:hidden",
                isTransparent
                  ? "border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
                  : "border-border/80 bg-card text-foreground shadow-sm hover:bg-muted/40",
              )}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? (
                <X className="size-4" aria-hidden />
              ) : (
                <Menu className="size-4" aria-hidden />
              )}
              <span className="sr-only">
                {mobileOpen ? "Cerrar menú" : "Abrir menú"}
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Reserva espacio en rutas internas para no ocultar el contenido bajo el header fijo. */}
      {!isHome && (
        <div className={cn(HEADER_HEIGHT_CLASS, "shrink-0")} aria-hidden />
      )}

      {/* Panel móvil: overlay de pantalla completa con panel deslizable. */}
      <div
        id="mobile-nav-drawer"
        className={cn(
          "fixed inset-0 z-[60] md:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        {/* Fondo que permite cerrar el panel. */}
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          aria-label="Cerrar menú"
          tabIndex={mobileOpen ? 0 : -1}
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel que entra desde la derecha. */}
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-card shadow-2xl transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          {/* Encabezado del panel. */}
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <span className="text-lg font-semibold tracking-tight text-foreground">
              {brandName}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              aria-label="Cerrar menú"
              onClick={() => setMobileOpen(false)}
            >
              <X className="size-5" aria-hidden />
            </Button>
          </div>

          {/* Enlaces del panel. */}
          <nav
            className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4"
            aria-label="Menú móvil"
          >
            {NAV_LINKS.map(({ href, label }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                    isActive
                      ? "bg-foreground/5 text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* CTA inferior del panel. */}
          <div className="border-t border-border/60 p-4">
            <Button asChild variant="primary" size="pill" shape="pill" className="w-full">
              <Link href="/reservar" onClick={() => setMobileOpen(false)}>
                Reservar
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
