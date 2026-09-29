/** Cliente HTTP del contrato `/api/public/*`, incluido el perfil white-label. */
import { publicApiClient } from "@/lib/api";

// ---------------------------------------------------------------------------
// Tipos de dominio — habitaciones y disponibilidad
// ---------------------------------------------------------------------------

/** Imagen de habitación expuesta en el catálogo público. */
export interface PublicRoomImage {
  url: string;
  altText: string | null;
}

/** Habitación disponible para reserva en línea. */
export interface PublicRoom {
  id: string;
  name: string;
  number: string;
  capacity: number;
  roomType: {
    name: string;
    /** Precio base por noche (Prisma `Decimal` serializado como string o número). */
    basePrice: string | number;
  };
  images: PublicRoomImage[];
}

/** Parámetros para consultar disponibilidad en un rango de fechas. */
export interface AvailabilityRequest {
  checkin: string;
  checkout: string;
  guests?: number;
}

/** Resultado de la búsqueda de habitaciones libres. */
export interface AvailabilityResponse {
  checkin: string;
  checkout: string;
  guests: number | null;
  availableRooms: PublicRoom[];
  totalAvailable: number;
}

// ---------------------------------------------------------------------------
// Tipos de dominio — reservas
// ---------------------------------------------------------------------------

/** Datos del formulario de reserva enviados al API. */
export interface CreateReservationRequest {
  roomId: string;
  checkin: string;
  checkout: string;
  guestName: string;
  email: string;
  phone: string;
  guestCount: number;
  notes?: string;
}

/** Identidad pública de la empresa configurada en la instalación. */
export interface PublicCompanyProfile {
  legalName: string;
  commercialName: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logoUrl: string | null;
}

/** Reserva creada (estado inicial `PENDIENTE`, origen `EN_LINEA`). */
export interface CreateReservationResponse {
  id: string;
  status: string;
  source: string;
  checkin: string;
  checkout: string;
  guestName: string;
  guestPhone: string;
  guestCount?: number;
  notes: string | null;
  total: string | number;
  roomId?: string;
  organizationId?: string;
  guestDoc?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ---------------------------------------------------------------------------
// Tipos de dominio — contacto
// ---------------------------------------------------------------------------

/** Mensaje del formulario de contacto público. */
export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

/** Confirmación tras enviar el formulario de contacto. */
export interface ContactResponse {
  message: string;
}

// ---------------------------------------------------------------------------
// Cliente de endpoints públicos
// ---------------------------------------------------------------------------

const PUBLIC_API_BASE = "/api/public";

/**
 * Funciones tipadas sobre los endpoints públicos de hotel en `erp-core-api`.
 * Todas las rutas están bajo `/api/public` y no requieren autenticación.
 */
export const publicApi = {
  /** Obtiene la identidad pública para marca y contacto del sitio. */
  getCompanyProfile: (): Promise<PublicCompanyProfile | null> =>
    publicApiClient.get<PublicCompanyProfile | null>(`${PUBLIC_API_BASE}/company`),
  /** Lista habitaciones con estado `DISPONIBLE` y sus imágenes. */
  getRooms: (): Promise<PublicRoom[]> =>
    publicApiClient.get<PublicRoom[]>(`${PUBLIC_API_BASE}/rooms`),

  /** Consulta habitaciones libres entre check-in y check-out. */
  checkAvailability: (
    request: AvailabilityRequest,
  ): Promise<AvailabilityResponse> =>
    publicApiClient.post<AvailabilityResponse>(
      `${PUBLIC_API_BASE}/reservations/availability`,
      request,
    ),

  /** Crea una reserva pendiente con origen `EN_LINEA`. */
  createReservation: (
    request: CreateReservationRequest,
  ): Promise<CreateReservationResponse> =>
    publicApiClient.post<CreateReservationResponse>(
      `${PUBLIC_API_BASE}/reservations`,
      request,
    ),

  /** Envía un mensaje de contacto (respuesta de acuse de recibo). */
  submitContact: (request: ContactRequest): Promise<ContactResponse> =>
    publicApiClient.post<ContactResponse>(
      `${PUBLIC_API_BASE}/contact`,
      request,
    ),
};
