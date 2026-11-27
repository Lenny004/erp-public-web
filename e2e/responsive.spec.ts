import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { PAGES, MOBILE_MENU, prepare } from "./targets";
import { REPORT_DIR, collectErrors, measureOverflow, measureTouchTargets, profileOf, saveMetric, settle, urlOf } from "./helpers";

for (const target of PAGES) {
  test(`responsive · ${target.name}`, async ({ page }, testInfo) => {
    const errors = collectErrors(page);
    await prepare(page, target);
    await page.goto(urlOf(target), { waitUntil: "load" });
    await settle(page);

    const finalPath = new URL(page.url()).pathname;
    const overflow = await measureOverflow(page);
    const touch = profileOf(testInfo).touch ? await measureTouchTargets(page) : null;

    const shotDir = path.join(REPORT_DIR, "screenshots", testInfo.project.name);
    fs.mkdirSync(shotDir, { recursive: true });
    const shot = path.join(shotDir, `${target.name}.png`);
    await page.screenshot({ path: shot, fullPage: true });
    await testInfo.attach("captura", { path: shot, contentType: "image/png" });

    saveMetric("responsive", testInfo, target, { finalPath, overflow, touch, errors: errors.slice(0, 10) });

    expect.soft(finalPath, "la página no debe redirigir a otra ruta").toBe(target.expectPath ?? target.path);
    expect.soft(overflow.overflowPx, `overflow horizontal: ${JSON.stringify(overflow.offenders.slice(0, 3))}`).toBe(0);
    if (touch) expect.soft(touch.under44, `objetivos táctiles < 44px: ${JSON.stringify(touch.sample.slice(0, 5))}`).toBe(0);
  });
}

test(`menú móvil`, async ({ page }, testInfo) => {
  const target = MOBILE_MENU.target;
  await prepare(page, target);
  await page.goto(urlOf(target), { waitUntil: "load" });
  await settle(page);
  const vw = page.viewportSize()?.width ?? 0;
  const isMobile = vw < MOBILE_MENU.breakpoint;
  const trigger = page.getByRole("button", { name: MOBILE_MENU.trigger }).first();
  if (!isMobile) {
    test.info().annotations.push({ type: "nota", description: `ancho ${vw}px: se usa la navegación de escritorio` });
    saveMetric("menu", testInfo, target, { isMobile, links: null, triggerBox: null, panelBox: null });
    return;
  }
  await expect(trigger, "el botón del menú móvil debe estar visible").toBeVisible();
  const box = await trigger.boundingBox();
  if (profileOf(testInfo).touch && box) expect.soft(Math.min(box.width, box.height), "el botón del menú debe medir >= 44px").toBeGreaterThanOrEqual(44);
  await trigger.click();
  const panel = page.locator(MOBILE_MENU.panel).first();
  await expect(panel, "el panel del menú debe abrir dentro de la pantalla").toBeInViewport({ ratio: 0.9 });
  await page.waitForTimeout(400);
  const pb = await panel.boundingBox();
  if (pb) expect.soft(pb.x + pb.width, "el panel no debe salirse del viewport").toBeLessThanOrEqual(vw + 1);
  const links = await panel.locator("a[href]").count();
  expect.soft(links, "el menú debe tener enlaces").toBeGreaterThan(0);
  const shotDir = path.join(REPORT_DIR, "screenshots", testInfo.project.name);
  fs.mkdirSync(shotDir, { recursive: true });
  await page.screenshot({ path: path.join(shotDir, `menu-movil.png`) });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  await expect.soft(panel, "Escape debe cerrar el menú").not.toBeInViewport({ ratio: 0.5 });
  saveMetric("menu", testInfo, target, { isMobile, links, triggerBox: box, panelBox: pb });
});
