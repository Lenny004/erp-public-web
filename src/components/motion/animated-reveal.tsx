"use client";

import { animated, useSpring } from "@react-spring/web";
import { useEffect, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { springConfig } from "@/lib/motion/spring-config";

interface AnimatedRevealProps {
  children: ReactNode;
  className?: string;
}

/** Revela contenido con fade + slide al montarse (pasos de wizard, secciones). */
export function AnimatedReveal({ children, className }: AnimatedRevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [styles, api] = useSpring(() => ({
    opacity: 0,
    y: 16,
  }));

  useEffect(() => {
    if (prefersReducedMotion) {
      api.set({ opacity: 1, y: 0 });
      return;
    }

    api.start({
      to: { opacity: 1, y: 0 },
      config: springConfig.gentle,
    });
  }, [api, prefersReducedMotion]);

  return (
    <animated.div style={styles} className={className}>
      {children}
    </animated.div>
  );
}
