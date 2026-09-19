"use client";

import { animated, useTrail } from "@react-spring/web";
import { Children, isValidElement, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { springConfig } from "@/lib/motion/spring-config";

interface AnimatedStaggerGridProps {
  children: ReactNode;
  className?: string;
}

/** Grid con entrada escalonada de sus hijos (tarjetas de habitación). */
export function AnimatedStaggerGrid({ children, className }: AnimatedStaggerGridProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const childArray = Children.toArray(children).filter(isValidElement);
  const trail = useTrail(childArray.length, {
    from: { opacity: 0, y: 16 },
    to: { opacity: 1, y: 0 },
    config: springConfig.gentle,
    immediate: prefersReducedMotion,
  });

  return (
    <div className={className}>
      {childArray.map((child, index) => (
        <animated.div key={child.key ?? index} style={trail[index]}>
          {child}
        </animated.div>
      ))}
    </div>
  );
}
