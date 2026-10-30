/** Une apellidos/nombres en una sola cadena limpia (el API guarda `guestName` como una columna). */
export const unirNombre = (...partes: Array<string | undefined>): string =>
  partes
    .map((s) => (s ?? "").trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .join(" ");

/**
 * Aproximación para editar un nombre guardado en una sola cadena:
 * 2 palabras → nombre + paterno; 3+ → las dos últimas son paterno y materno.
 * El usuario puede corregirla.
 */
export function separarNombreCompleto(completo = ""): {
  nombres: string;
  paterno: string;
  materno: string;
} {
  const partes = completo.trim().split(/\s+/).filter(Boolean);
  if (partes.length <= 1) return { nombres: partes[0] ?? "", paterno: "", materno: "" };
  if (partes.length === 2) return { nombres: partes[0], paterno: partes[1], materno: "" };
  return {
    nombres: partes.slice(0, -2).join(" "),
    paterno: partes[partes.length - 2],
    materno: partes[partes.length - 1],
  };
}
