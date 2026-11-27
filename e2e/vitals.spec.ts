import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { PERF_PAGES, prepare } from "./targets";
import { applyThrottling, collectErrors, saveMetric, settle, urlOf } from "./helpers";

const WEB_VITALS = fs.readFileSync(path.resolve(__dirname, "..", "node_modules", "web-vitals", "dist", "web-vitals.iife.js"), "utf8");
const GOOD = { LCP: 2500, CLS: 0.1, INP: 200, FCP: 1800, TTFB: 800 };

const HOOK = `
window.__cwv = {}; window.__evt = 0;
const save = (m) => { window.__cwv[m.name] = { value: m.value, rating: m.rating }; };
webVitals.onLCP(save, { reportAllChanges: true });
webVitals.onCLS(save, { reportAllChanges: true });
webVitals.onINP(save, { reportAllChanges: true, durationThreshold: 16 });
webVitals.onFCP(save);
webVitals.onTTFB(save);
try {
  new PerformanceObserver((l) => { for (const e of l.getEntries()) { if (e.interactionId) window.__evt = Math.max(window.__evt, e.duration); } })
    .observe({ type: 'event', durationThreshold: 16, buffered: true });
} catch (e) {}
`;

for (const target of PERF_PAGES) {
  test(`@perf cwv · ${target.name}`, async ({ page }, testInfo) => {
    const errors = collectErrors(page);
    await prepare(page, target);
    // Un solo script: Playwright envuelve cada init script, así `webVitals` queda en el mismo ámbito que el hook.
    await page.addInitScript({ content: `${WEB_VITALS}\n;window.webVitals = webVitals;\n${HOOK}` });
    await applyThrottling(page, testInfo);
    // Calentamiento: en dev Next compila la ruta la primera vez; no queremos medir el compilador.
    await page.goto(urlOf(target), { waitUntil: "load" });
    await settle(page);
    await page.goto(urlOf(target), { waitUntil: "load" });
    await settle(page);
    await page.waitForTimeout(1500);

    // Interacción para INP: click en un texto neutro y una tecla.
    const neutral = page.locator("main h1, h1, main h2, h2, main p, p").first();
    if (await neutral.isVisible().catch(() => false)) await neutral.click({ position: { x: 2, y: 2 } }).catch(() => undefined);
    await page.keyboard.press("Tab");
    await page.waitForTimeout(1500);

    const cwv = (await page.evaluate(() => (window as unknown as { __cwv: Record<string, { value: number; rating: string }> }).__cwv)) ?? {};
    const evt = await page.evaluate(() => (window as unknown as { __evt: number }).__evt);
    const val = (k: string) => (cwv[k] ? Math.round(cwv[k].value * (k === "CLS" ? 1000 : 1)) / (k === "CLS" ? 1000 : 1) : null);
    const data = {
      LCP: val("LCP"),
      CLS: val("CLS") ?? 0,
      INP: val("INP") ?? (evt ? Math.round(evt) : null),
      INP_note: cwv.INP ? "web-vitals" : evt ? "event-timing" : "interacción < 16 ms (no reportada)",
      FCP: val("FCP"),
      TTFB: val("TTFB"),
      ratings: Object.fromEntries(Object.entries(cwv).map(([k, v]) => [k, v.rating])),
      errors: errors.slice(0, 5),
    };
    saveMetric("cwv", testInfo, target, data);

    if (data.LCP != null) expect.soft(data.LCP, "LCP <= 2.5 s").toBeLessThanOrEqual(GOOD.LCP);
    expect.soft(data.CLS, "CLS <= 0.1").toBeLessThanOrEqual(GOOD.CLS);
    if (data.INP != null) expect.soft(data.INP, "INP <= 200 ms").toBeLessThanOrEqual(GOOD.INP);
  });
}
