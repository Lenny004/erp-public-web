/**
 * Imágenes locales WebP de habitación para evitar una petición externa por tarjeta.
 * Se sirven con ancho fijo para rendimiento predecible en tarjetas de listado.
 */
export const PLACEHOLDER_ROOM_IMAGES = [
  "/images/room-placeholder-1.webp",
  "/images/room-placeholder-2.webp",
  "/images/room-placeholder-3.webp",
  "/images/room-placeholder-4.webp",
  "/images/room-placeholder-5.webp",
  "/images/room-placeholder-6.webp",
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
