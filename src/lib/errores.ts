"use client";

/** Manejo central de errores: normaliza cualquier error, elige un mensaje claro y notifica una sola vez. */

import { toast } from "sonner";

import { ApiError } from "@/lib/api";
import { MENSAJES_ERROR, codigoPorStatus, type CodigoError } from "@/lib/mensajes-error";

export interface ErrorNormalizado {
  codigo: CodigoError;
  status?: number;
  mensaje: string;
  camposInvalidos: Record<string, string[]> | null;
  detalle: unknown;
}

interface OpcionesManejarError {
  /** Etiqueta para logs (p. ej. "contacto:enviar"). */
  contexto?: string;
  /** Mostrar toast. Por defecto true; nunca duplica para el mismo error. */
  notificar?: boolean;
  /** Mensaje de respaldo si el error no es de API. */
  fallback?: string;
  /** Recibe los errores por campo cuando el backend los envía. */
  onCampos?: (campos: Record<string, string[]>) => void;
}

/** Mensaje de un `Error` lanzado a propósito por el front; ignora textos técnicos. */
function mensajeIntencional(error: unknown): string | null {
  if (!(error instanceof Error)) return null;
  const m = error.message?.trim();
  if (!m || /^(Error del servidor|Error HTTP|Error \d+|Failed to fetch|NetworkError|Load failed)/i.test(m)) {
    return null;
  }
  return m;
}

function esErrorDeRed(error: unknown): boolean {
  const offline = typeof navigator !== "undefined" && navigator.onLine === false;
  return offline || error instanceof TypeError;
}

/** Solo el mensaje para el usuario, sin toast ni log (para estados de error en pantalla). */
export function mensajeDeError(error: unknown, fallback?: string): string {
  if (error instanceof ApiError) return error.message;
  if (esErrorDeRed(error)) return MENSAJES_ERROR.NETWORK;
  if (typeof error === "string" && error.trim()) return error;
  return mensajeIntencional(error) ?? fallback ?? MENSAJES_ERROR.UNKNOWN;
}

/** Normaliza cualquier error y notifica una sola vez. Todo `catch` debe pasar por aquí. */
export function manejarError(
  error: unknown,
  { contexto = "app", notificar = true, fallback, onCampos }: OpcionesManejarError = {},
): ErrorNormalizado {
  let normalizado: ErrorNormalizado;
  let yaNotificado = false;

  if (error instanceof ApiError) {
    const campos = error.details?.fieldErrors;
    const hayCampos = !!campos && Object.keys(campos).length > 0;
    normalizado = {
      codigo: codigoPorStatus(error.statusCode),
      status: error.statusCode,
      mensaje: error.message,
      camposInvalidos: hayCampos ? campos! : null,
      detalle: error,
    };
    yaNotificado = error.notified;
  } else {
    const red = esErrorDeRed(error);
    normalizado = {
      codigo: red ? "NETWORK" : "UNKNOWN",
      mensaje: mensajeDeError(error, fallback),
      camposInvalidos: null,
      detalle: error,
    };
  }

  console.error(`[${contexto}]`, error);
  if (normalizado.camposInvalidos && onCampos) onCampos(normalizado.camposInvalidos);
  if (notificar && !yaNotificado && typeof window !== "undefined") {
    toast.error(normalizado.mensaje);
    if (error instanceof ApiError) error.notified = true;
  }
  return normalizado;
}
