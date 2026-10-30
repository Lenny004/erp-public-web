"use client";

import { useEffect, useState } from "react";

/** Evita el parpadeo de skeletons en cargas rápidas: devuelve `true` tras `delayMs`. */
export function useDelayedVisible(delayMs = 150): boolean {
  const [visible, setVisible] = useState(delayMs <= 0);

  useEffect(() => {
    if (delayMs <= 0) return;
    const timer = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  return visible;
}
