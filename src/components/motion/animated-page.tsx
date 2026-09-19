"use client";

import { animated, useSpring } from "@react-spring/web";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { springConfig } from "@/lib/motion/spring-config";

interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
}

/** Entrada suave del contenido principal al cambiar de ruta. */
export function AnimatedPage({ children, className }: AnimatedPageProps) {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [styles, api] = useSpring(() => ({
    opacity: 1,
    y: 0,
  }));

  useEffect(() => {
    if (prefersReducedMotion) {
      api.set({ opacity: 1, y: 0 });
      return;
    }

    api.start({
      from: { opacity: 0, y: 10 },
      to: { opacity: 1, y: 0 },
      config: springConfig.gentle,
    });
  }, [pathname, api, prefersReducedMotion]);

  return (
    <animated.div style={styles} className={className}>
      {children}
    </animated.div>
  );
}
