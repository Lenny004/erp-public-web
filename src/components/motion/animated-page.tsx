"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedPageProps {
  /** Contenido de la ruta que se reinicia cuando cambia el pathname. */
  children: ReactNode;
  /** Clases adicionales para el contenedor de transición. */
  className?: string;
}

/** Entrada suave del contenido principal al cambiar de ruta. */
export function AnimatedPage({ children, className }: AnimatedPageProps) {
  const pathname = usePathname();
  return (
    <div key={pathname} className={cn("public-motion__page", className)}>
      {children}
    </div>
  );
}
