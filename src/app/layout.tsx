import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Providers } from "@/components/providers";
import { SiteShell } from "@/components/layout/site-shell";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const outfitSans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

/** Metadatos globales derivados de la configuración white-label del sitio. */
export const metadata: Metadata = {
  title: {
    default: siteConfig.brandName,
    template: `%s | ${siteConfig.brandName}`,
  },
  description: siteConfig.tagline,
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

/**
 * Layout raíz del App Router: aplica idioma y fuente globales, registra los
 * proveedores de cliente y mantiene la estructura común de navegación.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfitSans.variable} font-sans`}>
      <body className="min-h-dvh antialiased">
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
