# Suite E2E y de rendimiento

Playwright (Chromium) + web-vitals + Lighthouse CI. Todo vive en `e2e/`; los reportes salen en
`e2e-report/`, `test-results/` y `.lighthouseci/`, que están en `.gitignore`.

## Requisitos

- Dev server del repo corriendo (`pnpm dev`). La suite no lo levanta ni lo mata.
- Navegador de Playwright: `pnpm exec playwright install chromium` (una vez por PC).
- Lighthouse CI usa el Google Chrome instalado.

## Comandos

| Comando | Qué hace |
|---|---|
| `pnpm e2e` | Funcional + responsive en las 6 gamas: overflow horizontal, objetivos táctiles ≥ 44 px, menú móvil, flujos y formularios, captura por página y dispositivo. |
| `pnpm perf` | Core Web Vitals (LCP, CLS, INP, FCP, TTFB) y FPS por gama con throttling de CPU y red, después Lighthouse CI móvil y escritorio con assertions, y al final el resumen. `--skip-pw` / `--skip-lh` para correr una sola parte. |
| `pnpm e2e:report` | Regenera `e2e-report/RESUMEN.md` con lo último que haya. |

Variables útiles: `E2E_BASE_URL` (por defecto el puerto del dev server), `E2E_WORKERS`, `LH_BASE_URL`, `LH_RUNS`.

## Gamas de dispositivo (`devices.ts`)

| Proyecto | Viewport | CPU | Red |
|---|---|---|---|
| gama-baja-moto-g4 | 360×640 | 4x | Slow 4G (150 ms, 1.6 Mbps) |
| gama-media-pixel-7 | 412×915 | 2x | 4G (40 ms, 9 Mbps) |
| iphone-13 | 390×844 (Chromium) | 1x | sin límite |
| tablet-ipad-mini | 768×1024 | 1x | sin límite |
| desktop-1366 | 1366×768 | 1x | sin límite |
| desktop-1920 | 1920×1080 | 1x | sin límite |

El throttling se aplica por CDP solo en las pruebas `@perf`.

## Archivos

- `targets.ts`: páginas, cuáles se miden y qué modal se abre en cada una.
- `helpers.ts`: throttling, overflow, objetivos táctiles, recolector de FPS y guardado de métricas.
- `responsive.spec.ts`, `flows.spec.ts`, `vitals.spec.ts` (`@perf`), `fps.spec.ts` (`@perf`).
- `lighthouse/`: configuración de LHCI (`urls.json` + perfiles móvil y escritorio).
- `scripts/perf.mjs`, `scripts/report.mjs`.

## Notas

- Los números salen del dev server: sirven para comparar, **no** son producción.
- FPS: scroll programático con `requestAnimationFrame` (3 s) y apertura de modal o menú (1.5 s). Headless puede diferir de un dispositivo real.
- Public: usa la API real en :4000 (endpoints públicos); no se simula nada.
## Build de producción (opcional)

Con `next build` + `next start` en una copia temporal (nunca en el repo) y `NEXT_PUBLIC_API_URL=https://api.e2e.invalid`:

```
$env:E2E_BASE_URL="http://localhost:3102"; $env:E2E_API_ORIGIN="https://api.e2e.invalid"
$env:E2E_LH_MODE="mocked"; $env:E2E_ENV="prod"; $env:E2E_REPORT_DIR="e2e-report/prod"
pnpm perf
```

Toda la API se simula con `page.route` (también en Lighthouse, que corre dentro de Playwright: `lighthouse.spec.ts`).
