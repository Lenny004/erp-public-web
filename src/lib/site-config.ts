/**
 * site-config.ts
 *
 * Metadatos de marca y contacto del sitio público de reservas.
 * Todos los valores pueden sobreescribirse con variables `NEXT_PUBLIC_*`.
 */

/** Imagen hero por defecto: lobby de hotel en Unsplash (alta calidad, libre de uso). */
const DEFAULT_HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80&auto=format&fit=crop";

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
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "reservas@hotel.com",

  /** Teléfono con formato local El Salvador. */
  contactPhone:
    process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || "+503 2222-0000",

  /** Dirección física o ciudad de referencia. */
  contactAddress:
    process.env.NEXT_PUBLIC_CONTACT_ADDRESS?.trim() ||
    "Colonia Escalón, San Salvador, El Salvador",

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
