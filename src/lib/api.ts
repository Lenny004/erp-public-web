import { getApiBaseUrl } from "@/lib/api-base-url";

// ---------------------------------------------------------------------------
// Tipos de error
// ---------------------------------------------------------------------------

/** Detalles opcionales devueltos por el API en errores de validación u otros fallos. */
export interface ApiErrorDetails {
  fieldErrors?: Record<string, string[]>;
  formErrors?: string[];
  [key: string]: unknown;
}

/**
 * Error tipado para respuestas HTTP fallidas del API público.
 * No incluye lógica de JWT ni reintentos de autenticación.
 */
export class ApiError extends Error {
  constructor(
    /** Código HTTP (0 indica fallo de red). */
    public readonly statusCode: number,
    message: string,
    /** Cuerpo `details` del API, p. ej. errores de Zod aplanados. */
    public readonly details?: ApiErrorDetails,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ---------------------------------------------------------------------------
// Tipos internos de respuesta
// ---------------------------------------------------------------------------

/** Envoltorio estándar de éxito en rutas públicas: `{ data: T }`. */
interface ApiSuccessWrapper<T> {
  data: T;
}

/** Cuerpo de error canónico de erp-core-api. */
interface ApiErrorBody {
  success?: false;
  error?: string;
  message?: string;
  details?: ApiErrorDetails;
}

// ---------------------------------------------------------------------------
// Cliente HTTP ligero (sin JWT)
// ---------------------------------------------------------------------------

/**
 * Cliente fetch mínimo para endpoints públicos de `erp-core-api`.
 * Parsea JSON, desenvuelve `{ data }` en éxito y lanza `ApiError` si `!ok`.
 */
export class PublicApiClient {
  constructor(private readonly baseUrl: string = getApiBaseUrl()) {}

  /**
   * Ejecuta una petición HTTP y devuelve el payload ya desenvuelto.
   *
   * @param path - Ruta relativa al origen del API (ej. `/api/public/rooms`).
   * @param options - Opciones nativas de `fetch`.
   * @throws {ApiError} En fallo de red o respuesta HTTP no exitosa.
   */
  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    let response: Response;

    try {
      response = await fetch(url, options);
    } catch {
      throw new ApiError(0, "No se pudo conectar con el servidor.");
    }

    const body = (await response.json().catch(() => ({}))) as
      | ApiSuccessWrapper<T>
      | ApiErrorBody
      | T;

    if (!response.ok) {
      const errorBody = body as ApiErrorBody;
      throw new ApiError(
        response.status,
        errorBody.message ?? `Error ${response.status}`,
        errorBody.details,
      );
    }

    // Las rutas públicas responden con `{ data: … }`.
    if (body && typeof body === "object" && "data" in body) {
      return (body as ApiSuccessWrapper<T>).data;
    }

    return body as T;
  }

  /**
   * GET JSON al API público.
   *
   * @param path - Ruta relativa.
   */
  get<T>(path: string): Promise<T> {
    return this.request<T>(path, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  }

  /**
   * POST JSON al API público.
   *
   * @param path - Ruta relativa.
   * @param payload - Cuerpo serializable (omitir para POST sin cuerpo).
   */
  post<T>(path: string, payload?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: payload !== undefined ? JSON.stringify(payload) : undefined,
    });
  }
}

/** Instancia compartida del cliente público. */
export const publicApiClient = new PublicApiClient();
