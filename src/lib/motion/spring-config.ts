import type { SpringConfig } from "@react-spring/web";

/** Configuraciones compartidas para animaciones del sitio público. */
export const springConfig = {
  gentle: { tension: 280, friction: 26 } satisfies SpringConfig,
  snappy: { tension: 400, friction: 28 } satisfies SpringConfig,
  instant: { duration: 0 } satisfies SpringConfig,
} as const;
