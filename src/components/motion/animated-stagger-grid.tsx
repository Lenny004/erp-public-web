"use client";

import { Children, isValidElement, type ReactNode } from "react";

interface AnimatedStaggerGridProps {
  /** Hijos válidos que se envuelven individualmente para escalonar su entrada. */
  children: ReactNode;
  /** Clases del grid que conserva la responsabilidad del layout. */
  className?: string;
}

/** Grid con entrada escalonada de sus hijos (tarjetas de habitación). */
export function AnimatedStaggerGrid({ children, className }: AnimatedStaggerGridProps) {
  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <div className={className}>
      {childArray.map((child, index) => (
        <div key={child.key ?? index} className="public-motion__stagger-item">
          {child}
        </div>
      ))}
    </div>
  );
}
