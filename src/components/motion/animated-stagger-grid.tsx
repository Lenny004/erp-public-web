"use client";

import { Children, isValidElement, type ReactNode } from "react";

interface AnimatedStaggerGridProps {
  children: ReactNode;
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
