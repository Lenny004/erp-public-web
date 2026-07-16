import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases condicionales de Tailwind y resuelve conflictos entre utilidades.
 *
 * Usa `clsx` para unir listas, objetos y valores booleanos, y `tailwind-merge`
 * para que la última clase gane cuando dos utilidades compiten (p. ej. `p-2` vs `p-4`).
 *
 * @param inputs - Valores aceptados por `clsx` (strings, arrays, objetos condicionales).
 * @returns Una cadena de clases lista para el atributo `className`.
 *
 * @example
 * cn("px-2 py-1", isActive && "bg-primary", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
