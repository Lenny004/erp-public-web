import fs from "node:fs";
import path from "node:path";
import type { Page, TestInfo } from "@playwright/test";
import { NETWORK, PROFILES } from "./devices";
import { BASE_URL, type Target } from "./targets";

/** Carpeta de reportes; E2E_REPORT_DIR permite separar corridas (p. ej. e2e-report/prod). */
export const REPORT_DIR = path.resolve(__dirname, "..", process.env.E2E_REPORT_DIR ?? "e2e-report");

export function profileOf(testInfo: TestInfo) {
  return PROFILES[testInfo.project.name];
}

/** Guarda una métrica en e2e-report/metrics/<tipo>/<proyecto>__<pagina>.json */
export function saveMetric(kind: string, testInfo: TestInfo, target: Target, data: Record<string, unknown>) {
  const dir = path.join(REPORT_DIR, "metrics", kind);
  fs.mkdirSync(dir, { recursive: true });
  const payload = { kind, project: testInfo.project.name, page: target.name, path: target.path, mocked: !!target.auth, ...data };
  fs.writeFileSync(path.join(dir, `${testInfo.project.name}__${target.name}.json`), JSON.stringify(payload, null, 2));
}

/** CPU y red por gama, vía CDP. Solo para las pruebas @perf. */
export async function applyThrottling(page: Page, testInfo: TestInfo) {
  const profile = profileOf(testInfo);
  const cdp = await page.context().newCDPSession(page);
  if (profile.cpuSlowdown > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: profile.cpuSlowdown });
  if (profile.network) {
    const n = NETWORK[profile.network];
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: n.offline,
      latency: n.latency,
      downloadThroughput: n.downloadThroughput,
      uploadThroughput: n.uploadThroughput,
    });
  }
  return cdp;
}

/** Junta errores de consola y de página para el reporte. */
export function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message.split("\n")[0]}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text().split("\n")[0].slice(0, 200)}`);
  });
  return errors;
}

export async function settle(page: Page) {
  await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => undefined);
  await page
    .waitForFunction(() => !document.body.innerText.includes("Verificando sesión"), undefined, { timeout: 30_000 })
    .catch(() => undefined);
  await page.waitForTimeout(500);
}

export function urlOf(target: Target) {
  return new URL(target.path, BASE_URL).toString();
}

/** Desborde horizontal: compara scrollWidth vs clientWidth y lista los elementos culpables. */
export async function measureOverflow(page: Page) {
  return page.evaluate(() => {
    const d = document.documentElement;
    const vw = d.clientWidth;
    const clipped = (el: Element | null): boolean => {
      for (let p = el?.parentElement; p && p !== document.body; p = p.parentElement) {
        const ox = getComputedStyle(p).overflowX;
        if (ox !== "visible") return true;
      }
      return false;
    };
    const describe = (el: Element) => {
      const cls = (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean).slice(0, 3).join(".");
      const txt = (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40);
      return `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${cls ? "." + cls : ""}${txt ? ` "${txt}"` : ""}`;
    };
    const offenders: { el: string; right: number }[] = [];
    for (const el of Array.from(document.querySelectorAll("body *"))) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.right > vw + 1 && !clipped(el)) offenders.push({ el: describe(el), right: Math.round(r.right) });
      if (offenders.length >= 8) break;
    }
    return { scrollWidth: d.scrollWidth, clientWidth: vw, overflowPx: Math.max(0, d.scrollWidth - vw), offenders };
  });
}

/** Objetivos táctiles visibles de menos de 44 px (WCAG 2.5.5) y de menos de 24 px (WCAG 2.5.8). */
export async function measureTouchTargets(page: Page, scope = "body") {
  return page.evaluate((scopeSel) => {
    const root = document.querySelector(scopeSel) ?? document.body;
    const sel =
      'a[href],button,input:not([type=hidden]),select,textarea,[role=button],[role=link],[role=checkbox],[role=tab],[role=menuitem],[role=switch],[role=combobox]';
    const items: { el: string; w: number; h: number }[] = [];
    let total = 0;
    let under24 = 0;
    for (const el of Array.from(root.querySelectorAll(sel))) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.width === 0 || r.height === 0 || cs.visibility === "hidden" || cs.display === "none") continue;
      if (el.tagName === "A" && el.closest("p")) continue; // enlaces en línea: excepción de WCAG
      if (r.width <= 2 || r.height <= 2 || el.closest('[aria-hidden="true"]')) continue;
      if (el.matches(".sr-only:not(:focus)") || r.right <= 0 || r.bottom <= -window.scrollY || (cs.clip && cs.clip !== "auto")) continue; // ocultos para lectores de pantalla / fuera de pantalla // controles nativos ocultos (p. ej. <select> de Radix)
      total++;
      if (r.width < 44 || r.height < 44) {
        const label =
          el.getAttribute("aria-label") ?? (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 30) ?? "";
        items.push({ el: `${el.tagName.toLowerCase()} "${label || (el as HTMLInputElement).name || "?"}"`, w: Math.round(r.width), h: Math.round(r.height) });
        if (r.width < 24 || r.height < 24) under24++;
      }
    }
    return { total, under44: items.length, under24, sample: items.slice(0, 10) };
  }, scope);
}

/** Recolector de frames con requestAnimationFrame (+ long tasks). */
export const FPS_INIT = `
window.__fpsCollect = (durationMs) => new Promise((resolve) => {
  const ts = []; let longTasks = 0; let po;
  try { po = new PerformanceObserver((l) => { longTasks += l.getEntries().length; }); po.observe({ type: 'longtask' }); } catch (e) {}
  const t0 = performance.now();
  const f = (t) => { ts.push(t); if (t - t0 < durationMs) requestAnimationFrame(f); else { if (po) po.disconnect(); resolve({ ts, longTasks }); } };
  requestAnimationFrame(f);
});
`;

export type FpsStats = { frames: number; avgFps: number; minFps: number; p5Fps: number; droppedFrames: number; longFrames: number; longTasks: number; durationMs: number };

export function fpsStats(raw: { ts: number[]; longTasks: number }): FpsStats {
  const ts = raw.ts;
  const deltas = ts.slice(1).map((t, i) => t - ts[i]);
  const dur = ts.length > 1 ? ts[ts.length - 1] - ts[0] : 0;
  const sorted = [...deltas].sort((a, b) => a - b);
  const p95 = sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))] : 0;
  const max = sorted.length ? sorted[sorted.length - 1] : 0;
  const r1 = (n: number) => Math.round(n * 10) / 10;
  return {
    frames: deltas.length,
    avgFps: dur ? r1((deltas.length * 1000) / dur) : 0,
    minFps: max ? r1(1000 / max) : 0,
    p5Fps: p95 ? r1(1000 / p95) : 0,
    droppedFrames: deltas.reduce((acc, d) => acc + Math.max(0, Math.round(d / (1000 / 60)) - 1), 0),
    longFrames: deltas.filter((d) => d > 50).length,
    longTasks: raw.longTasks,
    durationMs: Math.round(dur),
  };
}
