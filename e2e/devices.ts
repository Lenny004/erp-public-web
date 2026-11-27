import { devices, type Project } from "@playwright/test";

/**
 * Gamas de dispositivo. Todo corre en Chromium porque el throttling usa CDP.
 * La CPU y la red se aplican solo en las pruebas de rendimiento (@perf);
 * las funcionales corren sin throttling para que no tarden de más.
 */
export type NetworkProfile = {
  label: string;
  offline: boolean;
  latency: number;
  downloadThroughput: number;
  uploadThroughput: number;
};

const kbps = (n: number) => (n * 1024) / 8;

export const NETWORK: Record<"slow4g" | "fast4g", NetworkProfile> = {
  // Mismo perfil que usa Lighthouse para móvil ("Slow 4G"): 150 ms RTT, 1.6 Mbps / 750 Kbps.
  slow4g: { label: "Slow 4G", offline: false, latency: 150, downloadThroughput: kbps(1600), uploadThroughput: kbps(750) },
  // "Fast 4G" de DevTools: 40 ms RTT, 9 Mbps / 1.5 Mbps.
  fast4g: { label: "4G", offline: false, latency: 40, downloadThroughput: kbps(9000), uploadThroughput: kbps(1500) },
};

export type DeviceProfile = {
  label: string;
  cpuSlowdown: number;
  network?: keyof typeof NETWORK;
  touch: boolean;
};

export const PROFILES: Record<string, DeviceProfile> = {
  "gama-baja-moto-g4": { label: "Gama baja · Moto G4 360x640 · CPU 4x · Slow 4G", cpuSlowdown: 4, network: "slow4g", touch: true },
  "gama-media-pixel-7": { label: "Gama media · Pixel 7 412x915 · CPU 2x · 4G", cpuSlowdown: 2, network: "fast4g", touch: true },
  "iphone-13": { label: "iPhone 13 390x844 (emulado en Chromium)", cpuSlowdown: 1, touch: true },
  "tablet-ipad-mini": { label: "Tablet · iPad Mini 768x1024", cpuSlowdown: 1, touch: true },
  "desktop-1366": { label: "Escritorio 1366x768", cpuSlowdown: 1, touch: false },
  "desktop-1920": { label: "Escritorio 1920x1080", cpuSlowdown: 1, touch: false },
};

const IGNORE = [/real-session\.spec\.ts$/, /auth\.setup\.ts$/];

export const PROJECTS: Project[] = ([
  { name: "gama-baja-moto-g4", use: { ...devices["Moto G4"], browserName: "chromium" } },
  { name: "gama-media-pixel-7", use: { ...devices["Pixel 7"], browserName: "chromium" } },
  { name: "iphone-13", use: { ...devices["iPhone 13"], browserName: "chromium" } },
  { name: "tablet-ipad-mini", use: { ...devices["iPad Mini"], browserName: "chromium" } },
  { name: "desktop-1366", use: { ...devices["Desktop Chrome"], viewport: { width: 1366, height: 768 } } },
  { name: "desktop-1920", use: { ...devices["Desktop Chrome"], viewport: { width: 1920, height: 1080 } } },
] as Project[]).map((p) => ({ ...p, testIgnore: IGNORE }));
