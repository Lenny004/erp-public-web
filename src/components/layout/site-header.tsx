"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Pixel threshold before the home header transitions from transparent to solid. */
const SCROLL_SOLID_THRESHOLD = 24;

/** Shared header bar height — keep spacer in sync when adjusting layout. */
const HEADER_HEIGHT_CLASS = "h-[72px]";

/**
 * Primary navigation links (excluding the "Reservar" CTA, which lives in the action cluster).
 * Labels are Spanish for end users; hrefs stay English route segments.
 */
const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/habitaciones", label: "Habitaciones" },
  { href: "/contacto", label: "Contacto" },
] as const;

/**
 * Marketplace-style sticky header inspired by Airbnb:
 * - Frosted white bar with subtle border on most routes
 * - Transparent overlay on the home hero until the user scrolls
 * - Centered understated nav on desktop, polished slide-in drawer on mobile
 */
export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /** True when the header floats over the hero with no solid background. */
  const isTransparent = isHome && !scrolled;

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > SCROLL_SOLID_THRESHOLD);
  }, []);

  // Track scroll position for the home-page transparent → solid transition.
  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Reset scroll state when navigating away from home.
  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
    } else {
      handleScroll();
    }
  }, [isHome, handleScroll]);

  // Close the mobile drawer on route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent background scroll while the mobile drawer is open.
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
            : "border-b border-border/50 bg-white/85 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-white/75",
        )}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Brand — left anchor, larger semibold wordmark */}
          <Link
            href="/"
            className={cn(
              "shrink-0 text-xl font-semibold tracking-tight transition-colors sm:text-[1.35rem]",
              isTransparent
                ? "text-white hover:text-white/90"
                : "text-foreground hover:text-foreground/80",
            )}
          >
            {siteConfig.brandName}
          </Link>

          {/* Desktop nav — absolutely centered for a balanced marketplace layout */}
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
                        ? "bg-white/15 text-white"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
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

          {/* Right cluster — primary CTA + mobile toggle */}
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

            {/* Mobile menu trigger — pill shape mirrors Airbnb host menu */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "rounded-full border px-3 md:hidden",
                isTransparent
                  ? "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  : "border-border/80 bg-white text-foreground shadow-sm hover:bg-muted/40",
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

      {/* Reserve layout space on non-home routes so content is not hidden under fixed header */}
      {!isHome && (
        <div className={cn(HEADER_HEIGHT_CLASS, "shrink-0")} aria-hidden />
      )}

      {/* Mobile drawer — full-screen overlay with slide-in panel */}
      <div
        id="mobile-nav-drawer"
        className={cn(
          "fixed inset-0 z-[60] md:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
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

        {/* Panel slides in from the right */}
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <span className="text-lg font-semibold tracking-tight text-foreground">
              {siteConfig.brandName}
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

          {/* Drawer links */}
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

          {/* Drawer footer CTA */}
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
