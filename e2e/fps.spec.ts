import { expect, test, type Page } from "@playwright/test";
import { PERF_PAGES, prepare } from "./targets";
import { FPS_INIT, applyThrottling, fpsStats, saveMetric, settle, urlOf } from "./helpers";

type Raw = { ts: number[]; longTasks: number };

async function measureScroll(page: Page, durationMs: number) {
  return page.evaluate(async (d) => {
    const w = window as unknown as { __fpsCollect: (ms: number) => Promise<Raw> };
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const collector = w.__fpsCollect(d);
    const t0 = performance.now();
    await new Promise<void>((resolve) => {
      const step = (t: number) => {
        const p = (t - t0) / d;
        // baja y vuelve a subir
        const y = p < 0.5 ? max * (p * 2) : max * (2 - p * 2);
        window.scrollTo(0, y);
        if (p < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
    const raw = await collector;
    return { raw, scrollable: max };
  }, durationMs);
}

for (const target of PERF_PAGES) {
  test(`@perf fps · ${target.name}`, async ({ page }, testInfo) => {
    await prepare(page, target);
    await page.addInitScript({ content: FPS_INIT });
    await applyThrottling(page, testInfo);
    await page.goto(urlOf(target), { waitUntil: "load" });
    await settle(page);
    await page.waitForTimeout(1000);

    const s = await measureScroll(page, 3000);
    const scroll = { ...fpsStats(s.raw), scrollablePx: Math.round(s.scrollable) };
    await page.evaluate(() => window.scrollTo(0, 0));

    let modal: (ReturnType<typeof fpsStats> & { action: string; opened: boolean }) | null = null;
    const action = target.modal?.(page);
    if (action) {
      const trigger = action.trigger;
      if (await trigger.isVisible().catch(() => false)) {
        await page.evaluate(() => {
          const w = window as unknown as { __fpsCollect: (ms: number) => Promise<Raw>; __fpsP?: Promise<Raw> };
          w.__fpsP = w.__fpsCollect(1500);
        });
        await trigger.click();
        const raw = await page.evaluate(() => (window as unknown as { __fpsP: Promise<Raw> }).__fpsP);
        const opened = await action.opened.isVisible().catch(() => false);
        modal = { ...fpsStats(raw), action: action.label, opened };
        await page.keyboard.press("Escape").catch(() => undefined);
      } else {
        modal = { ...fpsStats({ ts: [], longTasks: 0 }), action: `${action.label} (botón no visible)`, opened: false };
      }
    }
    saveMetric("fps", testInfo, target, { scroll, modal });
    if (scroll.scrollablePx > 0) expect.soft(scroll.avgFps, "fps promedio en scroll >= 50").toBeGreaterThanOrEqual(50);
    if (modal?.frames) expect.soft(modal.avgFps, "fps promedio al abrir el modal >= 50").toBeGreaterThanOrEqual(50);
  });
}
