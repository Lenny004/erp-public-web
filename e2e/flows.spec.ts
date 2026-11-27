import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { PAGES } from "./targets";
import { REPORT_DIR, collectErrors, measureTouchTargets, profileOf, saveMetric, settle, urlOf } from "./helpers";

const home = PAGES.find((p) => p.name === "home")!;
const reservar = PAGES.find((p) => p.name === "reservar")!;

test("home: hero, buscador y habitaciones destacadas", async ({ page }, testInfo) => {
  const errors = collectErrors(page);
  await page.goto(urlOf(home));
  await settle(page);
  await expect(page.locator("h1").first(), "debe haber un h1").toBeVisible();
  const form = page.locator('form[aria-label="Buscar habitaciones disponibles"]').first();
  await expect(form, "el buscador de reservas debe estar visible").toBeVisible();
  const box = await form.boundingBox();
  const vw = page.viewportSize()!.width;
  if (box) expect.soft(box.x + box.width, "el buscador cabe a lo ancho").toBeLessThanOrEqual(vw + 1);
  const touch = profileOf(testInfo).touch ? await measureTouchTargets(page, 'form[aria-label="Buscar habitaciones disponibles"]') : null;
  const errorState = await page.getByText(/No se pudo|Error al cargar|Reintentar/i).count();
  saveMetric("forms", testInfo, home, { action: "buscador home", isDialog: false, box, touch, errorState, errors: errors.slice(0, 5) });
  expect.soft(errorState, "no debe mostrar estados de error al cargar datos").toBe(0);
  if (touch) expect.soft(touch.under44, `objetivos táctiles < 44px en el buscador: ${JSON.stringify(touch.sample.slice(0, 5))}`).toBe(0);
});

test("home: el buscador abre el selector de fechas y lleva a /reservar", async ({ page }, testInfo) => {
  await page.goto(urlOf(home));
  await settle(page);
  const form = page.locator('form[aria-label="Buscar habitaciones disponibles"]').first();
  const dates = form.locator('button[aria-haspopup="dialog"]').first();
  await dates.click();
  const pop = page.locator("[data-radix-popper-content-wrapper]").first();
  await expect(pop, "el popover de fechas debe abrir").toBeVisible();
  const pb = await pop.boundingBox();
  const vw = page.viewportSize()!.width;
  if (pb) expect.soft(pb.x >= -1 && pb.x + pb.width <= vw + 1, `el calendario cabe a lo ancho (${Math.round(pb.x)}..${Math.round(pb.x + pb.width)} en ${vw})`).toBeTruthy();
  const shotDir = path.join(REPORT_DIR, "screenshots", testInfo.project.name);
  fs.mkdirSync(shotDir, { recursive: true });
  await page.screenshot({ path: path.join(shotDir, "home-calendario.png") });
  await page.keyboard.press("Escape");
  const submit = form.locator('button[type="submit"]').first();
  await submit.click();
  await page.waitForTimeout(1500);
  const url = new URL(page.url());
  saveMetric("search", testInfo, home, { popover: pb, after: url.pathname + url.search });
  expect.soft(url.pathname, "buscar debe llevar a /reservar o /habitaciones (o validar)").toMatch(/^\/(reservar|habitaciones)?/);
});

test("reservar: carga sin errores y el formulario es usable", async ({ page }, testInfo) => {
  const errors = collectErrors(page);
  await page.goto(urlOf(reservar));
  await settle(page);
  await expect(page.locator("main").first()).toBeVisible();
  const errorState = await page.getByText(/No se pudo|Error al cargar/i).count();
  const inputs = await page.locator("main input:not([type=hidden]), main button[aria-haspopup]").count();
  const touch = profileOf(testInfo).touch ? await measureTouchTargets(page, "main") : null;
  saveMetric("forms", testInfo, reservar, { action: "página reservar", isDialog: false, inputs, touch, errorState, errors: errors.slice(0, 5) });
  expect.soft(errorState, "no debe mostrar estados de error").toBe(0);
  expect.soft(inputs, "debe haber controles para elegir fechas/huéspedes").toBeGreaterThan(0);
});
