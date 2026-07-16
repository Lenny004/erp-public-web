/**
 * Imágenes de habitación de hotel en Unsplash (alta calidad, uso como fallback).
 * Se sirven con ancho fijo para rendimiento predecible en tarjetas de listado.
 */
export const PLACEHOLDER_ROOM_IMAGES = [
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611892440504-42a784e24d32?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80&auto=format&fit=crop",
] as const

/** Hash determinista (djb2) para elegir siempre la misma imagen dado un identificador. */
function hashSeed(seed: string): number {
  let hash = 5381
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 33) ^ seed.charCodeAt(i)
  }
  return hash >>> 0
}

/**
 * Devuelve una URL de placeholder estable para la habitación indicada.
 * Usa el id o nombre como semilla para que el listado no “parpadee” entre cargas.
 */
export function getPlaceholderRoomImage(seed: string): string {
  if (!seed) {
    return PLACEHOLDER_ROOM_IMAGES[0]
  }
  const index = hashSeed(seed) % PLACEHOLDER_ROOM_IMAGES.length
  return PLACEHOLDER_ROOM_IMAGES[index]
}
