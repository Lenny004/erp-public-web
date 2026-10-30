/** Catálogo único de mensajes de error visibles para el usuario (sin dependencias; lo usa también el cliente HTTP). */

export type CodigoError =
  | "NETWORK"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION"
  | "CONFLICT"
  | "RATE_LIMIT"
  | "SERVER"
  | "UNKNOWN";

/** Textos visibles para el usuario; viven solo aquí. */
export const MENSAJES_ERROR: Record<CodigoError, string> = {
  NETWORK: "No hay conexión. Revisa tu internet e inténtalo de nuevo.",
  FORBIDDEN: "No tienes permiso para realizar esta acción.",
  NOT_FOUND: "No encontramos lo que buscas.",
  VALIDATION: "Revisa los campos marcados.",
  CONFLICT: "Esta solicitud ya existe o cambió. Actualiza e inténtalo de nuevo.",
  RATE_LIMIT: "Demasiados intentos. Espera un momento e inténtalo de nuevo.",
  SERVER: "Algo salió mal de nuestro lado. Inténtalo de nuevo en unos minutos.",
  UNKNOWN: "No se pudo completar la acción.",
};

/** Traduce un status HTTP a un código de error de la interfaz. */
export function codigoPorStatus(status?: number): CodigoError {
  if (status === 0) return "NETWORK";
  if (status === 401 || status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";
  if (status === 429) return "RATE_LIMIT";
  if (status === 400 || status === 422) return "VALIDATION";
  if (status !== undefined && status >= 500) return "SERVER";
  return "UNKNOWN";
}

/**
 * Mensaje que ve el usuario para un error de API. En 4xx se respeta el mensaje
 * de negocio del backend (ya viene en español); en red/5xx o si falta, se usa el genérico.
 */
export function mensajeParaUsuario(status: number, mensajeServidor?: string): string {
  const codigo = codigoPorStatus(status);
  if (codigo === "NETWORK" || codigo === "SERVER") return MENSAJES_ERROR[codigo];
  const limpio = mensajeServidor?.trim();
  if (!limpio || /^Error \d+$/.test(limpio)) return MENSAJES_ERROR[codigo];
  return limpio;
}
