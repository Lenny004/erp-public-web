"use client";

import { AnimatedReveal } from "@/components/motion/animated-reveal";

/** Envuelve el contenido de confirmación con entrada animada. */
export function ConfirmacionReveal({ children }: { children: React.ReactNode }) {
  return <AnimatedReveal>{children}</AnimatedReveal>;
}
