---
name: gsap-animations
description: Patrones y antipatrones para animar con GSAP en Next.js 15 (App Router, React 19) sin romper SSR, FPS ni CLS. Úsala siempre que se agregue, revise o depure una animación con GSAP, ScrollTrigger o timelines en erp-admin-web o erp-public-web, aunque el pedido solo diga "animar" o "transición".
---

# Skill: Animaciones con GSAP en Next.js 15

> Estado: **investigación**. GSAP todavía **no** está instalado en este repo. No lo instales ni animes nada hasta que LENNYX apruebe esta skill.
> Fuentes: docs oficiales de GSAP (gsap.com/resources/React, gsap.com/docs/v3/GSAP/gsap.matchMedia()), licencia estándar (gsap.com/community/standard-license) y blog de la 3.13. Versiones en npm al 2026-11-27: `gsap@3.15.1`, `@gsap/react@2.1.2` (peer: `gsap ^3.12.5`, `react >=17`).

## 0. Reglas que mandan

1. **Solo `transform` y `opacity`.** En GSAP: `x`, `y`, `xPercent`, `yPercent`, `scale`, `rotation`, `autoAlpha`. Nunca `width`, `height`, `top`, `left`, `margin`, `padding` ni `font-size`: esas propiedades fuerzan layout, bajan los FPS y suben el CLS.
2. **Toda animación vive en un `useGSAP()`** o en una función `contextSafe()`. Si no, no se limpia (StrictMode monta dos veces y al navegar quedan tweens huérfanos).
3. **`"use client"`** en todo archivo que importe `gsap`. Las páginas siguen siendo Server Components; solo la isla animada es cliente.
4. **Respetar `prefers-reduced-motion`** siempre, con `gsap.matchMedia()`.
5. **El contenido existe sin JS.** Nada crítico (LCP, textos, botones) puede quedar invisible hasta que corra la animación.
6. **Una sola librería por elemento.** Ya usamos `@react-spring/web`: no se mezclan GSAP y react-spring en el mismo nodo. GSAP es para timelines, secuencias y scroll; los micro-efectos de hover van con CSS/Tailwind (`transition`, `tw-animate-css`).

## 1. Instalación (cuando se apruebe)

```bash
pnpm add gsap @gsap/react
```

Los dos son paquetes oficiales del npm público. Desde la 3.13 todos los plugins (ScrollTrigger, SplitText, Flip, MorphSVG, etc.) vienen en el mismo paquete `gsap`; no hay registro privado ni token.

Registro, una sola vez en un módulo cliente:

```ts
// src/lib/gsap.ts
"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger); // registrar useGSAP evita choques de versión de React
export { gsap, ScrollTrigger, useGSAP };
```

Importar siempre desde `@/lib/gsap`, no desde `gsap` directo, para que el registro ocurra una vez.

## 2. `useGSAP()`: cleanup y scope

`useGSAP()` reemplaza a `useEffect`/`useLayoutEffect`. Envuelve todo en un `gsap.context()` y lo revierte al desmontar: tweens, timelines, ScrollTriggers, Draggables y SplitText.

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function HeroReveal({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".hero-item", { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" });
    },
    { scope }, // ".hero-item" solo busca dentro de este contenedor
  );

  return <div ref={scope}>{children}</div>;
}
```

Config:

| Opción | Default | Uso |
|---|---|---|
| `scope` | ninguno | Ref del contenedor. Los selectores de texto solo buscan dentro. **Úsalo siempre.** |
| `dependencies` | `[]` | Como en `useEffect`. |
| `revertOnUpdate` | `false` | Si es `true`, revierte y vuelve a crear la animación cada vez que cambia una dependencia. Úsalo cuando la animación depende del estado. |

### Animaciones por interacción → `contextSafe`

Lo que se crea **después** de que corre el hook (onClick, setTimeout, respuesta de la API) no entra al context y no se limpia.

```tsx
const scope = useRef<HTMLDivElement>(null);
const { contextSafe } = useGSAP({ scope });

const toggle = contextSafe(() => {
  gsap.to(".panel", { autoAlpha: open ? 0 : 1, y: open ? 8 : 0, duration: 0.2 });
});
```

Si agregas listeners a mano dentro de `useGSAP`, devuelve un cleanup que los quite.

## 3. Client Components y SSR

- `useGSAP` es seguro con SSR: usa `useLayoutEffect` en el navegador y cae a `useEffect` en el servidor. Pero el archivo **necesita `"use client"`**.
- Patrón: la `page.tsx` (Server Component) trae datos y renderiza `<HeroReveal>` (cliente) solo alrededor de lo que se anima.
- **No uses `gsap.from()` con `autoAlpha: 0` sobre el elemento LCP** (imagen hero o H1). El servidor lo pinta visible, la hidratación lo oculta y después lo muestra: eso empeora el LCP y produce parpadeo. Para el hero, anima elementos secundarios o usa `gsap.fromTo` con `opacity` desde 0.01, nunca un `display`.
- Evita el flash de contenido sin animar (FOUC) con CSS, no con JS:

```css
/* Solo si hay JS y el usuario acepta movimiento */
@media (prefers-reduced-motion: no-preference) {
  .js .reveal { visibility: hidden; } /* GSAP lo hace visible con autoAlpha */
}
```

  …y en `layout.tsx` pon la clase `js` en `<html>` con un script inline. Si JS falla, el contenido se ve.
- Nada de `window` ni `document` fuera de `useGSAP`/handlers: rompe el render del servidor.

## 4. Responsive y `prefers-reduced-motion` con `gsap.matchMedia()`

`gsap.matchMedia()` crea su propio context. Cuando una media query deja de cumplirse, revierte solo lo que creó esa rama. **No lo envuelvas en otro `gsap.context()`**; dentro de `useGSAP` sí se puede usar, y se revierte al desmontar.

```tsx
useGSAP(
  () => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        isMobile: "(max-width: 1023px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { isDesktop, reduceMotion } = ctx.conditions as Record<string, boolean>;

        if (reduceMotion) {
          gsap.set(".card", { autoAlpha: 1 }); // estado final, sin movimiento
          return;
        }

        gsap.from(".card", {
          y: isDesktop ? 40 : 16,  // menos recorrido en móvil
          autoAlpha: 0,
          stagger: isDesktop ? 0.08 : 0.04,
          duration: isDesktop ? 0.6 : 0.4,
        });
      },
    );
  },
  { scope },
);
```

Breakpoints iguales a los de Tailwind (`md` 768, `lg` 1024). En gama baja usa menos elementos animados a la vez y duraciones más cortas.

## 5. ScrollTrigger sin fugas de memoria

- Crea los ScrollTrigger **dentro** de `useGSAP` o de `mm.add()`. Así se matan solos al desmontar o al cambiar de breakpoint. Nunca en el nivel del módulo ni en un `useEffect` sin cleanup.
- Usa `trigger` con refs o selectores dentro del `scope`, no IDs globales.
- **Medidas que cambian** (imágenes que cargan, fuentes, datos de TanStack Query): llama `ScrollTrigger.refresh()` cuando terminan de cargar, y usa `invalidateOnRefresh: true` si los valores vienen de una función (`x: () => -el.scrollWidth + window.innerWidth`).
- **Navegación en App Router:** al cambiar de ruta, el componente se desmonta y `useGSAP` revierte. Si un layout persistente (header) tiene ScrollTriggers que dependen del contenido de la página, refresca con `usePathname()` como dependencia.
- **`pin: true` mueve el layout**: reserva el alto (`pinSpacing`, que viene activado por defecto) y no pinees en móvil gama baja; desactívalo en la rama `isMobile`.
- `scrub: true` o un número (`scrub: 0.5`) en lugar de `onUpdate` pesado. Si usas `onUpdate`, no leas el layout (`getBoundingClientRect`) en cada frame.
- `markers: true` solo en local; no puede llegar a un commit.
- Escuchas de `resize` o `scroll` propias: no hacen falta, ScrollTrigger ya las maneja.

```tsx
useGSAP(
  () => {
    gsap.from(".section-title", {
      y: 32,
      autoAlpha: 0,
      scrollTrigger: { trigger: ".section-title", start: "top 85%", once: true },
    });
  },
  { scope },
);
```

`once: true` en revelados de entrada: se desactiva solo después de correr y no sigue escuchando el scroll.

## 6. Rendimiento (FPS) y CLS

- Solo `transform` y `opacity` (regla 1). `autoAlpha` = `opacity` + `visibility`, mejor que `opacity` sola para ocultar.
- `will-change: transform` solo mientras dura la animación (GSAP aplica `force3D` en los transforms). No lo dejes fijo en decenas de elementos.
- El estado inicial tiene que ocupar su espacio final. Animar `y`/`scale` no mueve vecinos; animar `height` sí, y eso es CLS. Para acordeones usa Flip o `clip-path`/`scaleY` sobre un hijo, nunca `height: auto` en listas largas.
- Stagger de muchos elementos: menos de unos 30 a la vez; virtualiza las tablas largas antes de animar sus filas.
- `gsap.ticker.lagSmoothing()` se deja en el default.
- Mide con la suite E2E de QA (FPS por rAF y CWV). Meta: ≥ 55 fps en desktop y ≥ 30 fps en gama baja, CLS ≤ 0.1 y sin empeorar el LCP.

## 7. Antipatrones

| ❌ No | ✅ Sí |
|---|---|
| `useEffect(() => { gsap.to(...) }, [])` sin revert | `useGSAP(() => {...}, { scope })` |
| `gsap.to(".box")` sin scope (toma elementos de otras páginas) | `scope` con ref |
| Tween en un onClick sin `contextSafe` | `contextSafe(() => gsap.to(...))` |
| Animar `width`, `height`, `top`, `left` | `x`, `y`, `scale`, `autoAlpha` |
| Ocultar el H1 o la imagen hero hasta animarlos | Animar solo elementos secundarios |
| `gsap.context()` alrededor de `gsap.matchMedia()` | `matchMedia` solo (ya trae context) |
| ScrollTrigger creado en el nivel del módulo | Dentro de `useGSAP` o `mm.add` |
| `markers: true` en el commit | Solo local |
| `pin` en móvil gama baja | Desactivado en la rama `isMobile` |
| Mezclar GSAP y react-spring en el mismo nodo | Una librería por elemento |
| Animaciones sin rama de `reduceMotion` | `matchMedia` con `(prefers-reduced-motion: reduce)` |

## 8. Licencia

- Desde el 30 de abril de 2025 (versión 3.13), GSAP es **100 % gratis**, incluido el uso comercial y todos los plugins que antes eran del Club (SplitText, MorphSVG, ScrollSmoother, etc.). Lo patrocina Webflow.
- Licencia: "Standard No Charge GSAP License" de Webflow. **No es MIT.** Permite usarla en cualquier sitio o app web, incluidos los nuestros.
- Prohibido: usar GSAP para construir una herramienta **no-code de animación visual** que compita con Webflow, hacerle ingeniería inversa para eso, y quitar los avisos de copyright o la marca.
- El código generado por IA está permitido, según el FAQ oficial.
- Para el ERP (admin, public y clock) no hay problema. Si algún día el ERP ofreciera un "editor visual de animaciones" a clientes, hay que revisar la licencia de nuevo.

## 9. Checklist antes de dar por lista una animación

- [ ] El archivo tiene `"use client"` y el import viene de `@/lib/gsap`.
- [ ] Está dentro de `useGSAP` con `scope`, o en una función `contextSafe`.
- [ ] Solo anima `transform`/`opacity`/`autoAlpha`.
- [ ] Tiene rama `prefers-reduced-motion` que deja el estado final sin movimiento.
- [ ] No oculta el elemento LCP y el contenido se ve sin JS.
- [ ] ScrollTrigger con `once` o `scrub`, sin `markers`, y sin `pin` en móvil.
- [ ] Navegar entre páginas y volver no duplica animaciones (probar con StrictMode en `pnpm dev`).
- [ ] La suite E2E de QA pasa: FPS y CLS dentro del presupuesto en gama baja y desktop.
- [ ] `pnpm type-check` y `pnpm build` en verde.
