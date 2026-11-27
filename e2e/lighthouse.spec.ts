import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, expect, test } from "@playwright/test";
import { BASE_URL, LH_TARGETS, prepare } from "./targets";
import { REPORT_DIR } from "./helpers";

/**
 * Lighthouse con la API simulada (build de producción, E2E_LH_MODE=mocked).
 * Lighthouse CI no puede interceptar la red, así que aquí Lighthouse se conecta a un Chrome
 * abierto por Playwright (contexto persistente con remote debugging) y el mock de page.route
 * se aplica a nivel de contexto. Escribe el mismo manifest que `lhci upload`.
 */
const MODE = process.env.E2E_LH_MODE;
const MIN = { performance: 0.8, accessibility: 0.9, "best-practices": 0.9, seo: 0.9 } as const;
const dynImport = new Function("u", "return import(u)") as (u: string) => Promise<{ default: unknown }>;

function lighthouseDir() {
  // lighthouse llega como dependencia de @lhci/cli (paquete oficial).
  const pnpmDir = path.resolve(__dirname, "..", "node_modules", ".pnpm");
  const dir = fs.readdirSync(pnpmDir).find((n) => n.startsWith("lighthouse@"));
  if (!dir) throw new Error("No encontré lighthouse en node_modules/.pnpm (viene con @lhci/cli)");
  return path.join(pnpmDir, dir, "node_modules", "lighthouse");
}

type Lhr = { categories: Record<string, { score: number | null }>; runtimeError?: { message: string } };
type RunnerResult = { lhr: Lhr; report: string[] };
type LighthouseFn = (url: string, flags: Record<string, unknown>, config?: unknown) => Promise<RunnerResult | undefined>;

// Lighthouse hace su propia emulación: sin las opciones de dispositivo del proyecto.
test.use({ viewport: null, deviceScaleFactor: undefined, isMobile: undefined, hasTouch: undefined });

for (const preset of ["mobile", "desktop"] as const) {
  test(`@perf lighthouse · ${preset}`, async () => {
    test.skip(MODE !== "mocked", "Solo con E2E_LH_MODE=mocked; en dev se usa Lighthouse CI.");
    test.skip(test.info().project.name !== "desktop-1366", "Corre una sola vez (los perfiles los define Lighthouse).");
    test.setTimeout(30 * 60_000);
    const lhDir = lighthouseDir();
    const lighthouse = (await dynImport(pathToFileURL(path.join(lhDir, "core", "index.js")).href)).default as LighthouseFn;
    const config = preset === "desktop" ? (await dynImport(pathToFileURL(path.join(lhDir, "core", "config", "desktop-config.js")).href)).default : undefined;

    const out = path.join(REPORT_DIR, "lighthouse", preset);
    fs.rmSync(out, { recursive: true, force: true });
    fs.mkdirSync(out, { recursive: true });
    const manifest: Record<string, unknown>[] = [];
    const failures: Record<string, unknown>[] = [];

    for (const target of LH_TARGETS) {
      const port = 9300 + Math.floor(Math.random() * 600);
      const userDir = fs.mkdtempSync(path.join(os.tmpdir(), "e2e-lh-"));
      const ctx = await chromium.launchPersistentContext(userDir, { channel: "chrome", headless: true, viewport: null, deviceScaleFactor: undefined, isMobile: undefined, hasTouch: undefined, args: [`--remote-debugging-port=${port}`] });
      try {
        await prepare(ctx, target);
        const url = new URL(target.path, BASE_URL).toString();
        const result = await lighthouse(url, { port, output: ["json", "html"], logLevel: "error", onlyCategories: Object.keys(MIN), maxWaitForLoad: 90_000 }, config);
        if (!result) throw new Error(`Lighthouse no devolvió resultado para ${url}`);
        const jsonPath = path.join(out, `${target.name}.report.json`);
        const htmlPath = path.join(out, `${target.name}.report.html`);
        fs.writeFileSync(jsonPath, result.report[0]);
        fs.writeFileSync(htmlPath, result.report[1]);
        const summary = Object.fromEntries(Object.keys(MIN).map((k) => [k, result.lhr.categories[k]?.score ?? null]));
        manifest.push({ url, isRepresentativeRun: true, jsonPath, htmlPath, summary, mocked: !!target.auth, runtimeError: result.lhr.runtimeError?.message ?? null });
        for (const [k, min] of Object.entries(MIN)) {
          const v = summary[k] as number | null;
          if (v == null || v < min) failures.push({ name: "minScore", auditId: `categories:${k}`, url, actual: v ?? 0, expected: min, level: k === "seo" ? "warn" : "error", passed: false });
        }
      } finally {
        await ctx.close();
        fs.rmSync(userDir, { recursive: true, force: true });
      }
    }
    fs.writeFileSync(path.join(out, "manifest.json"), JSON.stringify(manifest, null, 2));
    fs.writeFileSync(path.join(out, "assertion-results.json"), JSON.stringify(failures, null, 2));
    expect.soft(failures.filter((f) => f.level === "error"), "assertions de Lighthouse (Performance ≥ 0.8, Accesibilidad ≥ 0.9, Buenas prácticas ≥ 0.9)").toEqual([]);
  });
}
