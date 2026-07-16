import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import { getApiBaseUrl } from "@/lib/api-base-url";
import { siteConfig } from "@/lib/site-config";

/**
 * Formatea un monto numérico como moneda para la UI pública.
 *
 * @param amount - Valor en USD (número o cadena del API).
 * @returns Cadena localizada, p. ej. `"$125.00"`.
 */
export function formatMoney(amount: number | string): string {
  const value = typeof amount === "string" ? Number.parseFloat(amount) : amount;
  const safeValue = Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: siteConfig.currencyLabel,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeValue);
}

/**
 * Convierte una fecha ISO (`YYYY-MM-DD` o timestamp) a etiqueta legible en español.
 *
 * @param isoDate - Fecha en formato ISO 8601.
 * @returns Texto como `"15 de julio de 2026"`.
 */
export function formatDateLabel(isoDate: string): string {
  return format(parseISO(isoDate), "d 'de' MMMM yyyy", { locale: es });
}

/** Alias corto para etiquetas de fecha en wizard y tarjetas. */
export const formatDate = formatDateLabel;

/** Fecha ISO `yyyy-MM-dd` para inputs `type="date"` y query params. */
export function toDateInputValue(value: Date): string {
  return format(value, "yyyy-MM-dd");
}

/** Alias de `formatMoney` para consistencia con otros repos del monorepo. */
export const formatCurrency = formatMoney;

/**
 * Calcula el número de noches entre check-in y check-out (fechas de calendario).
 *
 * @param checkin - Fecha de entrada en ISO.
 * @param checkout - Fecha de salida en ISO (debe ser posterior al check-in).
 * @returns Número entero de noches (0 si las fechas son inválidas o iguales).
 */
export function nightsBetween(checkin: string, checkout: string): number {
  const start = parseISO(checkin);
  const end = parseISO(checkout);
  const diffMs = end.getTime() - start.getTime();
  const nights = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, nights);
}

/**
 * Resuelve la URL absoluta de un recurso multimedia servido por el API.
 *
 * - Rutas absolutas (`http…`) se devuelven sin cambios.
 * - Rutas relativas que empiezan con `/` se prefijan con `getApiBaseUrl()`.
 * - Otros valores se devuelven tal cual.
 *
 * @param path - Ruta o URL del recurso.
 * @returns URL lista para usar en `src` de `<img>` o fondos CSS.
 */
export function resolveMediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${getApiBaseUrl()}${path}`;
  return path;
}
