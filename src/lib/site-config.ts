/**
 * site-config.ts
 *
 * Metadatos de marca y contacto del sitio público de reservas.
 * Todos los valores pueden sobreescribirse con variables `NEXT_PUBLIC_*`.
 */

/** Imagen hero por defecto local para que el LCP no dependa de un CDN externo. */
const DEFAULT_HERO_IMAGE_URL = "/images/hero.webp";

function requiredPublicText(name: string, value: string | undefined): string {
  const normalized = value?.trim();
  if (!normalized) throw new Error(`${name} es obligatoria para el sitio público.`);
  return normalized;
}

function requiredPublicEmail(name: string, value: string | undefined): string {
  const normalized = value?.trim().toLowerCase();
  if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error(`${name} debe ser un correo electrónico válido.`);
  }
  return normalized;
}

function requiredPublicPhone(name: string, value: string | undefined): string {
  const normalized = value?.trim();
  if (!normalized || !/^\+?[\d\s().-]{7,20}$/.test(normalized)) {
    throw new Error(`${name} debe ser un teléfono válido.`);
  }
  return normalized;
}

/**
 * Configuración estática del sitio, leída una vez desde el entorno de build.
 * Usar en layouts, pie de página y secciones de marketing.
 */
export const siteConfig = {
  /** Nombre comercial del hotel o marca. */
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME?.trim() || "Hotel",

  /** Eslogan corto bajo el nombre de marca. */
  tagline: process.env.NEXT_PUBLIC_BRAND_TAGLINE?.trim() || "Reserva tu estadía",

  /** Correo de contacto / reservas. */
  contactEmail: requiredPublicEmail(
    "NEXT_PUBLIC_CONTACT_EMAIL",
    process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  ),

  /** Teléfono con formato local El Salvador. */
  contactPhone: requiredPublicPhone(
    "NEXT_PUBLIC_CONTACT_PHONE",
    process.env.NEXT_PUBLIC_CONTACT_PHONE,
  ),

  /** Dirección física o ciudad de referencia. */
  contactAddress: requiredPublicText(
    "NEXT_PUBLIC_CONTACT_ADDRESS",
    process.env.NEXT_PUBLIC_CONTACT_ADDRESS,
  ),

  /** URL de la imagen principal del hero de la página de inicio. */
  heroImageUrl:
    process.env.NEXT_PUBLIC_HERO_IMAGE_URL?.trim() || DEFAULT_HERO_IMAGE_URL,

  /** Etiqueta corta de ubicación en la barra de búsqueda (ej. "¿A dónde?"). */
  locationLabel:
    process.env.NEXT_PUBLIC_LOCATION_LABEL?.trim() || "¿A dónde?",

  /** Placeholder del campo de búsqueda principal del hero. */
  searchPlaceholder:
    process.env.NEXT_PUBLIC_SEARCH_PLACEHOLDER?.trim() ||
    "Buscar destinos, hoteles…",

  /** Etiqueta de moneda mostrada en precios (el API opera en USD). */
  currencyLabel: "USD",
} as const;

export type SiteConfig = typeof siteConfig;
