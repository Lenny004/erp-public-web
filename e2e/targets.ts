import type { Locator, Page, Project } from "@playwright/test";
import { MOCK_ALL, installPublicMock, type Routable } from "./mock-api";

export const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3002";

export type ModalAction = { label: string; trigger: Locator; opened: Locator };
export type Target = {
  name: string;
  path: string;
  /** El sitio público usa la API real en :4000 (endpoints /api/public/*); no se simula nada. */
  auth?: boolean;
  expectPath?: string;
  modal?: (page: Page) => ModalAction | null;
};

const datePopover = (page: Page): ModalAction => ({
  label: "selector de fechas",
  trigger: page.locator('form[aria-label="Buscar habitaciones disponibles"] button[aria-haspopup="dialog"]').first(),
  opened: page.locator("[data-radix-popper-content-wrapper]").first(),
});
const mobileMenuOrDates = (page: Page): ModalAction =>
  (page.viewportSize()?.width ?? 1920) < 768
    ? { label: "menú móvil", trigger: page.getByRole("button", { name: "Abrir menú" }).first(), opened: page.locator('nav[aria-label="Menú móvil"]').first() }
    : datePopover(page);

export const PAGES: Target[] = [
  { name: "home", path: "/", modal: mobileMenuOrDates },
  { name: "habitaciones", path: "/habitaciones", modal: mobileMenuOrDates },
  { name: "reservar", path: "/reservar", modal: datePopover },
  { name: "contacto", path: "/contacto" },
  { name: "legal-privacidad", path: "/legal/privacidad" },
  { name: "legal-terminos", path: "/legal/terminos" },
];

export const PERF_PAGES = PAGES.filter((p) => ["home", "habitaciones", "reservar"].includes(p.name));

export const MOBILE_MENU = {
  target: PAGES[0],
  trigger: /Abrir menú/,
  panel: 'nav[aria-label="Menú móvil"]',
  breakpoint: 768,
};

export async function prepare(page: Routable, _target: Target) {
  // En dev se usa la API real (:4000). En el build de producción (E2E_API_ORIGIN) se simula entera.
  if (MOCK_ALL) await installPublicMock(page);
}

/** Mismas URLs que Lighthouse CI en dev. */
export const LH_TARGETS: Target[] = [
  ...["home", "habitaciones", "reservar", "contacto"].map((n) => PAGES.find((p) => p.name === n)!),
];

/** El sitio público no tiene sesión: sin proyectos extra. */
export const EXTRA_PROJECTS: Project[] = [];
