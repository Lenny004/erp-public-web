"use client";

/** Error Boundary de rutas: errores inesperados de render con opción de reintentar. */

import { useEffect } from "react";

import { ErrorState } from "@/components/shared/states";
import { MENSAJES_ERROR } from "@/lib/mensajes-error";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ruta]", error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <ErrorState title="Algo salió mal" message={MENSAJES_ERROR.SERVER} onRetry={reset} />
    </div>
  );
}
