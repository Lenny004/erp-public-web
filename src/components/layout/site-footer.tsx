"use client";

/** Pie público con contacto y dirección obtenidos de la ficha global de empresa. */

import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { publicApi } from "@/lib/api/public";
import { useEffect, useState } from "react";

/** Enlaces de exploración del marketplace de hospitalidad. */
const EXPLORE_LINKS = [
  { href: "/habitaciones", label: "Habitaciones" },
  { href: "/reservar", label: "Reservar" },
  { href: "/contacto", label: "Contacto" },
] as const;

/** Enlaces legales obligatorios. */
const LEGAL_LINKS = [
  { href: "/legal/terminos", label: "Términos y condiciones" },
  { href: "/legal/privacidad", label: "Política de privacidad" },
] as const;

const linkClassName =
  "text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground";

/**
 * Pie de página con identidad de marca, navegación secundaria,
 * contacto y aviso legal. Diseño limpio para marketplace premium.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const [company, setCompany] = useState<{ name: string; address: string; phone: string; email: string }>({ name: siteConfig.brandName, address: siteConfig.contactAddress, phone: siteConfig.contactPhone, email: siteConfig.contactEmail });

  useEffect(() => {
    publicApi.getCompanyProfile().then((data) => { if (data) setCompany({ name: data.commercialName || data.legalName, address: data.address || siteConfig.contactAddress, phone: data.phone || siteConfig.contactPhone, email: data.email || siteConfig.contactEmail }); }).catch(() => undefined);
  }, []);

  return (
    <footer className="border-t border-border/40 bg-card">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Marca y propuesta de valor */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-block text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
            >
              {company.name}
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.tagline}
            </p>
          </div>

          {/* Explorar */}
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wider text-foreground/70">
              Explorar
            </p>
            <nav className="flex flex-col gap-3" aria-label="Explorar el sitio">
              {EXPLORE_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} className={linkClassName}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wider text-foreground/70">
              Contacto
            </p>
            <address className="space-y-3 not-italic">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {company.address}
              </p>
              <p>
                <a
                  href={`tel:${company.phone.replace(/\s/g, "")}`}
                  className={linkClassName}
                >
                  {company.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${company.email}`} className={linkClassName}>
                  {company.email}
                </a>
              </p>
            </address>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wider text-foreground/70">
              Legal
            </p>
            <nav className="flex flex-col gap-3" aria-label="Enlaces legales">
              {LEGAL_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} className={linkClassName}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Barra inferior con copyright */}
      <div className="border-t border-border/30 bg-muted/80">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <p className="text-center text-xs text-muted-foreground">
            © {year} {company.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
