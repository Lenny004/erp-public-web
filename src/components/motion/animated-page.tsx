"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedPageProps {
  children: ReactNode;
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
