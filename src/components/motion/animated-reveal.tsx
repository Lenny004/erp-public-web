"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedRevealProps {
  children: ReactNode;
  className?: string;
}

/** Revela contenido con fade + slide al montarse (pasos de wizard, secciones). */
export function AnimatedReveal({ children, className }: AnimatedRevealProps) {
  return (
    <div className={cn("public-motion__reveal", className)}>
      {children}
    </div>
  );
}
