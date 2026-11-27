// pnpm e2e:report: arma e2e-report/RESUMEN.md con lo que haya en e2e-report/.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const R = path.resolve(root, process.env.E2E_REPORT_DIR ?? "e2e-report");
const PROD = process.env.E2E_ENV === "prod";
const repo = path.basename(root);
const readJson = (p, d = null) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return d; } };
const metrics = (kind) => {
  const dir = path.join(R, "metrics", kind);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => readJson(path.join(dir, f))).filter(Boolean);
};
const ORDER = ["gama-baja-moto-g4", "gama-media-pixel-7", "iphone-13", "tablet-ipad-mini", "desktop-1366", "desktop-1920"];
const SHORT = { "gama-baja-moto-g4": "Moto G4", "gama-media-pixel-7": "Pixel 7", "iphone-13": "iPhone 13", "tablet-ipad-mini": "iPad Mini", "desktop-1366": "1366", "desktop-1920": "1920" };
const sortRows = (rows) => rows.sort((a, b) => a.page.localeCompare(b.page) || ORDER.indexOf(a.project) - ORDER.indexOf(b.project));
const rate = (v, good, poor) => (v == null ? "–" : v <= good ? `✅ ${v}` : v <= poor ? `⚠️ ${v}` : `❌ ${v}`);
const pageName = (r) => `${r.page}${r.mocked ? " *(mock)*" : ""}`;

const out = [];
const now = new Date().toLocaleString("es-SV", { timeZone: "America/El_Salvador" });
out.push(`# Resumen E2E · ${repo}${PROD ? " · build de producción" : ""}`, "", `Generado: ${now} (hora de El Salvador)`, "");
out.push(
  PROD
    ? "> Métricas sobre el **build de producción** (`next build` + `next start` en una copia temporal). La API se simula entera con `page.route` (NEXT_PUBLIC_API_URL apunta a un https falso), así que los tiempos de red de la API son ~0."
    : "> **Ojo:** las métricas salen del servidor de desarrollo (`next dev`), con bundles sin minificar y compilación al vuelo. **No representan producción**; sirven para comparar gamas y detectar regresiones.",
  `> Las páginas marcadas *(mock)* usan una sesión y datos **simulados** solo en el navegador (\`page.route\` sobre la API en ${PROD ? "el https falso" : ":4000"}).`,
  metrics("real").length ? "> La sección *Sesión real* usa el usuario QA de la base de dev en modo solo lectura (credenciales leídas en runtime, no se guardan en el reporte)." : "> No se usó ningún usuario real.",
  "",
);

// --- Resultados Playwright
for (const run of ["e2e", "perf", "real"]) {
  const res = readJson(path.join(R, `results-${run}.json`));
  if (!res) continue;
  // Lighthouse re-ejecutado aparte (E2E_RUN=lh) reemplaza su resultado dentro de perf.
  const lhRes = run === "perf" ? readJson(path.join(R, "results-lh.json")) : null;
  if (lhRes) res.suites = [...(res.suites ?? []).filter((s) => !/lighthouse\.spec/.test(s.file ?? s.title ?? "")), ...(lhRes.suites ?? [])];
  const fails = [];
  let pass = 0, fail = 0, skip = 0;
  const walk = (suite, titles = []) => {
    for (const s of suite.suites ?? []) walk(s, [...titles, s.title]);
    for (const spec of suite.specs ?? []) {
      for (const t of spec.tests ?? []) {
        const last = t.results?.[t.results.length - 1];
        const st = last?.status ?? "skipped";
        if (st === "passed" && !(last?.errors?.length)) pass++;
        else if (st === "skipped") skip++;
        else {
          fail++;
          const msg = (last?.errors ?? [last?.error]).filter(Boolean).map((e) => (e.message ?? "").replace(/\u001b\[[0-9;]*m/g, "").split("\n").filter(Boolean)[0]).join(" | ");
          fails.push(`| ${spec.title} | ${SHORT[t.projectName] ?? t.projectName} | ${msg.replace(/\|/g, "/").slice(0, 220)} |`);
        }
      }
    }
  };
  walk(res);
  out.push(`## Playwright · ${{ e2e: "funcional y responsive (pnpm e2e)", perf: "rendimiento (pnpm perf)", real: "sesión real (pnpm e2e:real)" }[run]}`, "", `✅ ${pass} pasaron · ❌ ${fail} fallaron · ⏭️ ${skip} omitidos`, "");
  if (fails.length) out.push("| Test | Dispositivo | Primer error |", "|---|---|---|", ...fails, "");
}

// --- Responsive
const resp = sortRows(metrics("responsive"));
if (resp.length) {
  out.push("## Responsive", "", "Overflow = px de scroll horizontal (debe ser 0). Táctil = objetivos visibles < 44 px / < 24 px (solo dispositivos táctiles).", "");
  out.push("| Página | Dispositivo | Ruta final | Overflow | Táctil <44 / <24 | Errores consola |", "|---|---|---|---|---|---|");
  for (const r of resp) {
    const t = r.touch ? `${r.touch.under44 ? "❌" : "✅"} ${r.touch.under44} / ${r.touch.under24} de ${r.touch.total}` : "n/a";
    const redirected = r.finalPath !== r.path ? `⚠️ ${r.finalPath}` : r.finalPath;
    out.push(`| ${pageName(r)} | ${SHORT[r.project]} | ${redirected} | ${r.overflow.overflowPx ? "❌ " + r.overflow.overflowPx : "✅ 0"} | ${t} | ${r.errors?.length ?? 0} |`);
  }
  out.push("");
  const ov = resp.filter((r) => r.overflow.overflowPx > 0);
  if (ov.length) {
    out.push("### Culpables de overflow", "");
    for (const r of ov) out.push(`- **${r.page} · ${SHORT[r.project]}** (+${r.overflow.overflowPx}px): ${r.overflow.offenders.slice(0, 3).map((o) => "`" + o.el.replace(/`/g, "") + "` →" + o.right + "px").join(", ") || "sin elemento identificable"}`);
    out.push("");
  }
  const small = resp.filter((r) => r.touch?.under44).slice(0, 12);
  if (small.length) {
    out.push("### Ejemplos de objetivos táctiles chicos", "");
    for (const r of small) out.push(`- **${r.page} · ${SHORT[r.project]}**: ${r.touch.sample.slice(0, 4).map((s) => "`" + s.el.replace(/`/g, "") + "` " + s.w + "×" + s.h).join(", ")}`);
    out.push("");
  }
}

const menu = metrics("menu");
if (menu.length) {
  out.push("### Menú móvil", "", "| Dispositivo | Modo | Enlaces | Botón (px) |", "|---|---|---|---|");
  for (const m of menu.sort((a, b) => ORDER.indexOf(a.project) - ORDER.indexOf(b.project)))
    out.push(`| ${SHORT[m.project]} | ${m.isMobile ? "móvil" : "escritorio"} | ${m.links} | ${m.triggerBox ? Math.round(m.triggerBox.width) + "×" + Math.round(m.triggerBox.height) : "–"} |`);
  out.push("");
}

// --- Formularios
const forms = sortRows(metrics("forms"));
if (forms.length) {
  out.push("## Formularios y flujos", "", "| Página | Dispositivo | Acción | Abre | Ancho del modal | Scroll interno | Táctil <44 | Validación al enviar vacío |", "|---|---|---|---|---|---|---|---|");
  for (const f of forms) {
    const opened = f.isDialog ? "modal" : f.navigated ? "pantalla" : "–";
    const width = f.box && f.viewport ? `${Math.round(f.box.width)} / ${f.viewport.vw}px${f.box.x + f.box.width > f.viewport.vw + 1 || f.box.x < -1 ? " ❌" : ""}` : "–";
    const t = f.touch ? `${f.touch.under44 ? "❌" : "✅"} ${f.touch.under44}` : "n/a";
    out.push(`| ${pageName(f)} | ${SHORT[f.project]} | ${f.action} | ${opened} | ${width} | ${f.scrollable == null ? "–" : f.scrollable ? "sí" : "no"} | ${t} | ${f.validation ?? (f.errorState ? "❌ estado de error" : "–")} |`);
  }
  out.push("");
}

// --- Sesión real (usuario QA)
const real = metrics("real");
if (real.length) {
  out.push("## Sesión real (usuario QA de dev, solo lectura)", "", "| Página | Viewport | Ruta final | Overflow | Táctil <44 | Modal | API 5xx | 401/429 | Errores JS |", "|---|---|---|---|---|---|---|---|---|");
  for (const r of real.sort((a, b) => a.page.localeCompare(b.page) || a.viewport.localeCompare(b.viewport)))
    out.push(`| ${r.page} | ${r.viewport} | ${r.finalPath === "/login" ? "❌ /login" : r.finalPath} | ${r.overflow.overflowPx ? "❌ " + r.overflow.overflowPx : "✅ 0"} | ${r.touch ? (r.touch.under44 ? "❌ " : "✅ ") + r.touch.under44 : "n/a"} | ${r.modal ? (r.modal.opened ? "abre (" + r.modal.width + "px)" : "❌ no abre") : "–"} | ${r.api5xx.length ? "❌ " + r.api5xx.join(", ") : "0"} | ${r.authIssues?.length ? "⚠️ " + r.authIssues.join(", ") : "0"} | ${r.errors.length} |`);
  out.push("");
} else if (repo === "erp-admin-web") {
  out.push("## Sesión real", "", "No corrió: no había credenciales QA (E2E_USER/E2E_PASSWORD o erp-core-api/.qa-credentials.local). Se usó solo la sesión simulada.", "");
}

// --- CWV
const cwv = sortRows(metrics("cwv"));
if (cwv.length) {
  out.push("## Core Web Vitals (web-vitals, throttling por gama)", "", "Umbrales *bueno* de Google: LCP ≤ 2500 ms, CLS ≤ 0.1, INP ≤ 200 ms, FCP ≤ 1800 ms, TTFB ≤ 800 ms. ✅ bueno · ⚠️ mejorar · ❌ malo.", "");
  out.push("| Página | Dispositivo | LCP ms | CLS | INP ms | FCP ms | TTFB ms |", "|---|---|---|---|---|---|---|");
  for (const r of cwv)
    out.push(`| ${pageName(r)} | ${SHORT[r.project]} | ${rate(r.LCP, 2500, 4000)} | ${rate(r.CLS, 0.1, 0.25)} | ${r.INP == null ? "≤16" : rate(r.INP, 200, 500)} | ${rate(r.FCP, 1800, 3000)} | ${rate(r.TTFB, 800, 1800)} |`);
  out.push("", "INP ≤16 = la interacción simulada duró menos de 16 ms y el navegador no la reporta (bien).", "");
}

// --- FPS
const fps = sortRows(metrics("fps"));
if (fps.length) {
  out.push("## FPS (requestAnimationFrame)", "", "Scroll programático de 3 s (baja y sube) y apertura de modal/menú durante 1.5 s. Perdidos = frames de 16.7 ms saltados; largos = frames > 50 ms.", "");
  out.push("| Página | Dispositivo | Scroll prom / mín / p5 | Perdidos | Largos | Long tasks | Modal | Modal prom / mín | Perdidos |", "|---|---|---|---|---|---|---|---|---|");
  for (const r of fps) {
    const s = r.scroll;
    const m = r.modal;
    const sc = s.scrollablePx > 0 ? `${s.avgFps} / ${s.minFps} / ${s.p5Fps}` : `sin scroll (${s.avgFps} fps reposo)`;
    out.push(`| ${pageName(r)} | ${SHORT[r.project]} | ${sc} | ${s.droppedFrames} | ${s.longFrames} | ${s.longTasks} | ${m ? m.action + (m.opened ? "" : " ⚠️ no abrió") : "–"} | ${m && m.frames ? m.avgFps + " / " + m.minFps : "–"} | ${m && m.frames ? m.droppedFrames : "–"} |`);
  }
  out.push("");
}

// --- Lighthouse
const lhRows = [];
// En producción Lighthouse corre con la API simulada (prueba "@perf lighthouse"); mismo formato de manifest.
const lhFails = [];
for (const preset of ["mobile", "desktop"]) {
  const man = readJson(path.join(R, "lighthouse", preset, "manifest.json"), []);
  for (const m of man.filter((x) => x.isRepresentativeRun !== false))
    lhRows.push({ preset, path: new URL(m.url).pathname, ...m.summary, html: path.relative(R, m.htmlPath ?? "").replace(/\\/g, "/") });
  for (const a of readJson(path.join(R, "lighthouse", preset, "assertion-results.json"), []))
    if (!a.passed) lhFails.push(`- ${preset} · \`${new URL(a.url).pathname}\` · ${a.auditId ?? a.name}: ${Math.round((a.actual ?? 0) * 100) / 100} (mín ${a.expected}) [${a.level}]`);
}
if (lhRows.length) {
  const sc = (v, min) => (v == null ? "–" : `${v >= min ? "✅" : "❌"} ${Math.round(v * 100)}`);
  out.push("## Lighthouse CI", "", "Assertions: Performance ≥ 80, Accesibilidad ≥ 90, Buenas prácticas ≥ 90 (error); SEO ≥ 90 (aviso).", "");
  out.push("| Página | Perfil | Performance | Accesibilidad | Buenas prácticas | SEO | Reporte |", "|---|---|---|---|---|---|---|");
  for (const r of lhRows.sort((a, b) => a.path.localeCompare(b.path) || a.preset.localeCompare(b.preset)))
    out.push(`| ${r.path} | ${r.preset === "mobile" ? "móvil" : "escritorio"} | ${sc(r.performance, 0.8)} | ${sc(r.accessibility, 0.9)} | ${sc(r["best-practices"], 0.9)} | ${sc(r.seo, 0.9)} | [html](${r.html}) |`);
  out.push("");
  if (lhFails.length) out.push("### Assertions de Lighthouse que fallaron", "", ...lhFails, "");
}

fs.mkdirSync(R, { recursive: true });
fs.writeFileSync(path.join(R, "RESUMEN.md"), out.join("\n"));
console.log(`Resumen: ${path.join(R, "RESUMEN.md")}`);
