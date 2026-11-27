// pnpm perf: CWV + FPS por gama (Playwright @perf) + Lighthouse CI móvil y escritorio + resumen.
// Flags: --skip-pw (sin Playwright), --skip-lh (sin Lighthouse).
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const report = path.resolve(root, process.env.E2E_REPORT_DIR ?? "e2e-report");
// E2E_LH_MODE=mocked: Lighthouse corre dentro de Playwright con la API simulada (build de producción).
const lhMocked = process.env.E2E_LH_MODE === "mocked";
const args = new Set(process.argv.slice(2));
const run = (cmd, env = {}) => {
  console.log(`\n> ${cmd}`);
  return spawnSync(cmd, { cwd: root, stdio: "inherit", shell: true, env: { ...process.env, ...env } }).status ?? 1;
};

let failed = false;
const urls = JSON.parse(fs.readFileSync(path.join(here, "..", "lighthouse", "urls.json"), "utf8"));
const base = process.env.E2E_BASE_URL || process.env.LH_BASE_URL || urls.base;

// Calentar las rutas: en dev, Next compila cada ruta al primer request.
for (const p of urls.paths) {
  try {
    const r = await fetch(new URL(p, base), { signal: AbortSignal.timeout(120_000) });
    console.log(`warmup ${p} -> ${r.status}`);
  } catch (e) {
    console.log(`warmup ${p} -> error ${e.message}`);
  }
}

if (!args.has("--skip-pw")) {
  const code = run("pnpm exec playwright test -c e2e/playwright.config.ts --grep @perf", { E2E_RUN: "perf", E2E_WORKERS: "1" });
  // En modo mocked, la prueba "@perf lighthouse" ya escribió e2e-report/.../lighthouse/<perfil>/.
  if (code !== 0) failed = true;
}

if (!args.has("--skip-lh") && !lhMocked) {
  for (const preset of ["mobile", "desktop"]) {
    const cfg = `e2e/lighthouse/lighthouserc.${preset}.cjs`;
    const out = path.join(report, "lighthouse", preset);
    fs.rmSync(path.join(root, ".lighthouseci"), { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
    if (run(`pnpm exec lhci collect --config=${cfg}`) !== 0) { failed = true; continue; }
    if (run(`pnpm exec lhci assert --config=${cfg}`) !== 0) failed = true;
    run(`pnpm exec lhci upload --config=${cfg}`);
    const ar = path.join(root, ".lighthouseci", "assertion-results.json");
    fs.mkdirSync(out, { recursive: true });
    if (fs.existsSync(ar)) fs.copyFileSync(ar, path.join(out, "assertion-results.json"));
    else fs.writeFileSync(path.join(out, "assertion-results.json"), "[]");
  }
}

run("node e2e/scripts/report.mjs");
process.exit(failed ? 1 : 0);
