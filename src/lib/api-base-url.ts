/**
 * api-base-url.ts
 *
 * Resuelve la URL base de `erp-core-api` (misma idea que en erp-admin-web y erp-clock-web).
 * En desarrollo, si abres el sitio público desde una tablet por IP de red pero el `.env`
 * apunta a localhost, reescribe el host para que el fetch llegue al servidor correcto.
 */

/** URL local por defecto cuando no hay `NEXT_PUBLIC_API_URL` en desarrollo. */
const LOCAL_API_BASE_URL = "http://localhost:4000";

/** Caché en memoria para SSR / producción (evita recalcular en cada llamada). */
let cachedApiBaseUrl: string | null = null;

/**
 * Indica si el host es loopback (localhost / 127.0.0.1 / ::1).
 * @param host - Nombre de host de una URL o de `window.location`.
 */
function isLoopbackHost(host: string): boolean {
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

/**
 * En dev, si abres el sitio por IP de red (ej. 192.168.x.x:3000) pero
 * `NEXT_PUBLIC_API_URL` apunta a localhost, el navegador debe llamar al API
 * en la misma IP — no a localhost del dispositivo cliente.
 *
 * @param configuredUrl - Valor de `NEXT_PUBLIC_API_URL` o fallback local.
 * @returns URL base sin barra final.
 */
function resolveDevApiBaseUrl(configuredUrl: string): string {
  try {
    const apiUrl = new URL(configuredUrl);
    const pageHost = window.location.hostname;
    if (isLoopbackHost(apiUrl.hostname) && !isLoopbackHost(pageHost)) {
      apiUrl.hostname = pageHost;
      return apiUrl.origin;
    }
  } catch {
    // URL inválida en env: usar valor tal cual.
  }
  return configuredUrl.replace(/\/$/, "");
}

/**
 * Resuelve la URL base del API (`erp-core-api`).
 * - Navegador (dev): reescribe localhost → IP de la página si hace falta.
 * - Producción / SSR: usa `NEXT_PUBLIC_API_URL` (obligatoria en prod).
 *
 * @returns Origen del API sin barra final (ej. `https://api.ejemplo.com`).
 * @throws Si falta `NEXT_PUBLIC_API_URL` en producción.
 */
export function getApiBaseUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
    return resolveDevApiBaseUrl(configuredUrl ?? LOCAL_API_BASE_URL);
  }

  if (cachedApiBaseUrl == null) {
    if (configuredUrl) {
      cachedApiBaseUrl = configuredUrl.replace(/\/$/, "");
    } else if (process.env.NODE_ENV !== "production") {
      cachedApiBaseUrl = LOCAL_API_BASE_URL;
    } else {
      throw new Error(
        "Falta NEXT_PUBLIC_API_URL. Define esta variable en tu archivo .env.",
      );
    }
  }

  return cachedApiBaseUrl;
}

/**
 * Slug de la organización de esta instancia (single-tenant).
 * Se usa en cabeceras o rutas multi-tenant si el backend lo requiere.
 *
 * @returns Slug configurado o `"default"` como valor seguro.
 */
export function getOrgSlug(): string {
  return process.env.NEXT_PUBLIC_ORG_SLUG?.trim() || "default";
}
