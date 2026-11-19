import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import { getApiBaseUrl } from "@/lib/api-base-url";
import { siteConfig } from "@/lib/site-config";

const DECIMAL_AMOUNT_PATTERN = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;

/**
 * Formatea un monto numérico como moneda para la UI pública.
 *
 * @param amount - Valor en USD (número o cadena del API).
 * @returns Cadena localizada o `"Precio no disponible"` para valores inválidos.
 */
export function formatMoney(amount: number | string): string {
  const value = parseMoneyAmount(amount);

  if (value === null) return "Precio no disponible";

  return new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: siteConfig.currencyLabel,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Convierte un valor monetario del API solo si es un número completo y finito. */
export function parseMoneyAmount(amount: number | string): number | null {
  if (typeof amount === "string") {
    const normalizedAmount = amount.trim();

    if (!DECIMAL_AMOUNT_PATTERN.test(normalizedAmount)) return null;

    const value = Number(normalizedAmount);
    return Number.isFinite(value) && value >= 0 ? value : null;
  }

  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

/** Multiplica precio por noche por noches en centavos para evitar deriva decimal. */
export function calculateStayTotal(
  nightlyPrice: number | string,
  nights: number,
): number | null {
  const nightlyCents = parseMoneyCents(nightlyPrice);

  if (nightlyCents === null || !Number.isSafeInteger(nights) || nights < 1) {
    return null;
  }

  const totalCents = nightlyCents * nights;

  return Number.isSafeInteger(totalCents) ? totalCents / 100 : null;
}

/** Convierte decimales a centavos con redondeo decimal, antes de multiplicar. */
function parseMoneyCents(amount: number | string): number | null {
  if (parseMoneyAmount(amount) === null) return null;

  const normalizedAmount = String(amount).trim().toLowerCase();
  const decimalParts = /^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))(?:e([+-]?\d+))?$/.exec(
    normalizedAmount,
  );

  if (!decimalParts) return null;

  const wholePart = decimalParts[2] ?? "0";
  const fractionPart = decimalParts[3] ?? decimalParts[4] ?? "";
  const exponent = Number(decimalParts[5] ?? 0);

  if (!Number.isSafeInteger(exponent) || Math.abs(exponent) > 1000) return null;

  const digits = `${wholePart}${fractionPart}`;
  const centsPosition = wholePart.length + exponent + 2;
  const centsDigits = centsPosition > 0
    ? digits.padEnd(centsPosition, "0").slice(0, centsPosition)
    : "0";
  const roundingDigit = centsPosition >= 0 ? digits[centsPosition] ?? "0" : "0";
  const roundedCents = Number(centsDigits) + (roundingDigit >= "5" ? 1 : 0);

  return Number.isSafeInteger(roundedCents) ? roundedCents : null;
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

  if (!Number.isFinite(diffMs)) return 0;

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
