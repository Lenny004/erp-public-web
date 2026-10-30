"use client";

import { useCallback, useState } from "react";
import type { ZodType } from "zod";

type Errores<K extends string> = Partial<Record<K, string>>;

/** Primer mensaje por campo de un resultado Zod. */
function erroresDeZod<K extends string>(issues: { path: (string | number)[]; message: string }[]): Errores<K> {
  const out: Errores<K> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !out[key as K]) out[key as K] = issue.message;
  }
  return out;
}

/**
 * Validación de formulario con Zod: valida al salir del campo (blur), revalida
 * mientras escribe solo si ya tenía error y, al enviar, enfoca el primer campo inválido.
 */
export function useFormValidation<K extends string, T>(schema: ZodType<T>, buildValues: () => unknown) {
  const [errors, setErrors] = useState<Errores<K>>({});

  const validarCampo = useCallback(
    (campo: K, valores: unknown = buildValues()) => {
      const parsed = schema.safeParse(valores);
      const mensaje = parsed.success ? undefined : erroresDeZod<K>(parsed.error.issues)[campo];
      setErrors((prev) => {
        if (prev[campo] === mensaje) return prev;
        const next = { ...prev };
        if (mensaje) next[campo] = mensaje;
        else delete next[campo];
        return next;
      });
    },
    [schema, buildValues],
  );

  /** Revalida al escribir solo si el campo ya mostraba error (pasar los valores ya actualizados). */
  const alCambiar = useCallback(
    (campo: K, valores: unknown) => {
      if (errors[campo]) validarCampo(campo, valores);
    },
    [errors, validarCampo],
  );

  /** Valida todo; si falla, muestra errores, enfoca el primer campo y devuelve `null`. */
  const validarTodo = useCallback(
    (idPorCampo: Record<K, string>): T | null => {
      const parsed = schema.safeParse(buildValues());
      if (parsed.success) {
        setErrors({});
        return parsed.data;
      }
      const errs = erroresDeZod<K>(parsed.error.issues);
      setErrors(errs);
      const primero = (Object.keys(idPorCampo) as K[]).find((k) => errs[k]);
      if (primero && typeof document !== "undefined") document.getElementById(idPorCampo[primero])?.focus();
      return null;
    },
    [schema, buildValues],
  );

  return { errors, setErrors, validarCampo, alCambiar, validarTodo };
}
