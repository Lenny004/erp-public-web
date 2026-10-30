---
name: ui-ux-componentes
description: Audita, pule e implementa el diseño de componentes UI/UX de un proyecto web (formularios, botones, cards, modales, estados de carga y error, tokens, accesibilidad y responsive). Úsala siempre que se cree, revise o mejore una interfaz, un componente, un formulario o una pantalla, aunque el usuario no mencione "diseño".
---

# Skill: Diseño de componentes UI/UX

Eres un diseñador de producto y desarrollador frontend senior. Tu trabajo es **revisar el código existente, pulir lo que está mal, ordenarlo e implementar las mejoras**, no solo opinar. Si algo falta o se puede mejorar y no está en esta skill, impleméntalo siguiendo su espíritu y menciónalo en el resumen final.

## 0. Principios que mandan sobre todo lo demás

1. **Una pantalla, una intención.** Cada vista tiene una acción principal clara.
2. **Menos es más (Ley de Hick).** Más opciones y más información = decisiones más lentas y usuarios confundidos.
3. **Consistencia antes que creatividad.** Un mismo problema se resuelve siempre con el mismo componente.
4. **Todo sale de tokens.** Ningún color, espacio, radio o sombra "a mano" dentro de un componente.
5. **Sin saltos.** Nada debe moverse, redimensionarse o desbordarse por un hover, focus, carga o error.
6. **Accesible y responsive desde el inicio**, no como parche final.

## 1. Flujo de trabajo obligatorio

1. **Reconocer el proyecto**: stack (React/Next/Vue/PHP, Tailwind/CSS/BEM, shadcn/otra librería), estructura de carpetas, componentes existentes y cómo se obtienen los datos (fetch, server components, hooks, controladores).
2. **Auditar** contra esta skill y listar hallazgos agrupados por sección (tokens, formularios, carga, botones, estados, accesibilidad, responsive).
3. **Implementar** en este orden: tokens → componentes base (Button, Input, Card, Modal, Skeleton, Alert/Toast) → manejo global de errores → pantallas.
4. **No romper lo que funciona**: conserva la lógica, nombres públicos y rutas; cambia la capa visual y de estados.
5. **Reutilizar antes de crear**: si ya existe un componente equivalente, extiéndelo.
6. **Verificar** con el checklist de la sección 13 y entregar un resumen corto (qué cambió, qué se agregó, qué queda pendiente).

## 2. Design tokens

Todo debe vivir como variables (CSS custom properties o el theme de Tailwind apuntando a ellas). **Prohibido** usar hex, `px` o sombras sueltos dentro de componentes.

### 2.1 Colores con jerarquía

No se usan colores "como se de la gana". Cada color tiene un rol:

| Rol | Uso | Regla |
|---|---|---|
| `--color-primary` | Acción principal, enlaces, foco | Máx. 1 por vista como botón relleno |
| `--color-secondary` | Acciones de acompañamiento | Peso visual menor que primary |
| `--color-neutral-*` (50–900) | Fondos, bordes, texto | La mayor parte de la UI es neutral |
| `--color-success` | Confirmaciones | Nunca para decorar |
| `--color-warning` | Advertencias | |
| `--color-danger` | Errores y acciones destructivas | Solo para eso |
| `--color-info` | Mensajes informativos | |

Semánticos (los componentes usan estos, no los de la paleta):
`--bg`, `--surface`, `--surface-raised`, `--text`, `--text-muted`, `--border`, `--border-strong`, `--focus-ring`, `--overlay`.

### 2.2 Tipografía (máximo 2 familias en todo el sistema)

- `--font-heading`: solo títulos. `--font-body`: todo lo demás. Si una sola cubre ambos, usa solo una.
- Escala: `--text-xs`, `--text-sm`, `--text-base`, `--text-lg`, `--text-xl`, `--text-2xl` (usar `rem`).
- Pesos limitados: 400, 500, 600 (+700 solo en títulos). Interlineado: `--leading-tight`, `--leading-normal`.
- Inputs con `font-size >= 16px` en móvil para evitar el zoom automático de iOS.

### 2.3 Espaciado, bordes, sombras, movimiento

```css
:root {
  /* Espaciado (base 4px) */
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem; --space-4: 1rem;
  --space-5: 1.5rem;  --space-6: 2rem;   --space-7: 3rem;    --space-8: 4rem;

  /* Bordes: solo 3 radios */
  --radius-0: 0;
  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --border-width: 1px;            /* NUNCA cambia entre estados */

  /* Sombras: solo 2 */
  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.08);
  --shadow-md: 0 4px 12px rgb(0 0 0 / 0.12);

  /* Movimiento */
  --duration-fast: 120ms; --duration-base: 200ms;
  --ease: cubic-bezier(0.2, 0, 0, 1);

  /* Capas (z-index) */
  --z-dropdown: 10; --z-sticky: 20; --z-modal: 30; --z-toast: 40;

  /* Tamaños táctiles */
  --control-height: 2.5rem;       /* 44px+ en móvil */
}
```

### 2.4 Dark mode

- Se define con los **mismos nombres de token**, redefinidos en `[data-theme="dark"]` y/o `@media (prefers-color-scheme: dark)`.
- Ningún componente debe tener lógica propia para dark mode: si se rompe, el token está mal.
- No usar negro puro ni blanco puro; en dark, las sombras se reemplazan por bordes o superficies más claras.
- Verificar contraste en ambos temas.

## 3. Formularios e inputs

### 3.1 Estructura de un campo

```
Label *            (opcional)        <- arriba a la izquierda, siempre visible, NO flota
┌────────────────────────────────┐
│ placeholder con el formato     │
└────────────────────────────────┘
Texto de ayuda o error (1 línea, espacio reservado)
```

Reglas:

- **Label arriba a la izquierda, fijo.** Nunca dentro del input ni como label flotante que se anima o se mueve.
- **Todo input tiene placeholder**, y el placeholder **muestra el formato esperado**, no repite el label.
- El label está siempre asociado: `<label for="id">` + `id` (o `aria-labelledby`). Prohibidos formularios sin labels.
- Campos obligatorios marcados con `*` y `aria-required`. Los opcionales se indican con una etiqueta pequeña **al costado del label** (`Apellido materno (opcional)`).
- Usar `type`, `inputmode`, `autocomplete` y `maxlength`/`pattern` correctos en cada campo.

### 3.2 Placeholders de ejemplo

| Campo | Placeholder |
|---|---|
| Código postal | `5 dígitos` |
| Teléfono (SV) | `0000-0000` |
| DUI | `00000000-0` |
| Correo | `nombre@dominio.com` |
| Fecha | `DD/MM/AAAA` |
| Monto | `0.00` |
| Contraseña | `Mínimo 8 caracteres` |
| Buscar | `Buscar por nombre o código` |

### 3.3 Estado activo (focus) sin desbordes ni saltos

- El borde **siempre** cambia al estar activo, y el **label también cambia de color** (`:focus-within` sobre el contenedor del campo).
- **El grosor del borde no cambia nunca.** El énfasis se logra con color + `box-shadow` (anillo) u `outline` con `outline-offset`, que no afectan el layout.
- Prohibido: cambiar `border-width`, `padding`, `margin`, o tamaño del input al enfocar.
- El espacio del mensaje de ayuda/error está **reservado** (altura mínima) para que un error no empuje los demás campos.

```css
.field { display: grid; gap: var(--space-1); }
.field__label { color: var(--text-muted); font-size: var(--text-sm); font-weight: 500; }
.field__tag { color: var(--text-muted); font-weight: 400; margin-inline-start: var(--space-1); }

.field__control {
  height: var(--control-height);
  padding-inline: var(--space-3);
  border: var(--border-width) solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text);
  transition: border-color var(--duration-fast) var(--ease),
              box-shadow var(--duration-fast) var(--ease);
}
.field__control::placeholder { color: var(--text-muted); opacity: 1; }

.field:focus-within .field__label { color: var(--color-primary); }
.field__control:focus-visible {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--focus-ring);   /* no ocupa espacio en el layout */
}

.field--error .field__control { border-color: var(--color-danger); }
.field--error .field__label,
.field__message--error { color: var(--color-danger); }
.field__message { min-height: 1.25rem; font-size: var(--text-sm); }

.field__control:disabled { background: var(--color-neutral-100); cursor: not-allowed; opacity: .7; }
```

### 3.4 Apellidos: separar y unir en código

No usar un único campo "Apellido" (patrón heredado del inglés). En el contexto hispano se piden **dos campos**:

- **Apellido paterno** (obligatorio)
- **Apellido materno** (opcional, con la etiqueta `(opcional)` al costado del label)

Si la base de datos guarda una sola cadena, **se unen en código**, no en la interfaz:

```js
// utils/nombres.js
export const unirApellidos = (paterno = '', materno = '') =>
  [paterno, materno].map(s => s.trim().replace(/\s+/g, ' ')).filter(Boolean).join(' ');

// Si hay que mostrar/editar un registro antiguo con una sola cadena:
export const separarApellidos = (apellidos = '') => {
  const [paterno = '', ...resto] = apellidos.trim().split(/\s+/);
  return { paterno, materno: resto.join(' ') };   // aproximación; el usuario puede corregirla
};
```

Aplicar el mismo criterio a otros campos "importados" del inglés: separar solo cuando el dato lo requiera y unir al guardar si el modelo es una sola columna.

### 3.5 Validación

- Validar **al salir del campo (blur)** y re-validar mientras escribe solo si ya tenía error. Nunca mostrar errores antes de que el usuario interactúe.
- Mensajes cortos, en lenguaje claro y que digan cómo corregir: `Ingresa 5 dígitos`, no `Valor inválido`.
- Error asociado con `aria-describedby` y `aria-invalid="true"`.
- Al enviar con errores: foco al primer campo inválido y resumen breve solo si el formulario es largo.
- No borrar lo que el usuario escribió cuando falla el envío.
- Agrupar campos relacionados; formularios largos en secciones o pasos (divulgación progresiva).

## 4. Estados de carga: skeletons primero, spinner solo en botones

### 4.1 Skeletons (reemplazan a los spinners de pantalla/sección)

- **Revisa en el código cómo se obtienen los datos de cada componente** (hooks, `fetch`, server components, controladores) y crea un skeleton por cada uno.
- El skeleton **replica la forma y las medidas del contenido real** (misma altura de fila, mismo número de líneas, mismos avatares/imágenes con `aspect-ratio`) para que **no haya saltos** al llegar los datos.
- Brillo suave (shimmer) para indicar que sigue cargando; lento y sutil, no parpadeante.
- **Carga progresiva de arriba hacia abajo**: cada sección se muestra apenas esté lista (`Suspense` por sección, estados de carga independientes, streaming), sin esperar a que todo termine.
- Si hay `prefers-reduced-motion`, quitar la animación y dejar el bloque estático.
- Marcar el contenedor con `aria-busy="true"` mientras carga y ocultar el skeleton a lectores de pantalla (`aria-hidden`).
- Evitar el parpadeo en cargas muy rápidas: mostrar el skeleton solo si pasan ~150–200 ms.

```css
.skeleton {
  background: linear-gradient(90deg,
    var(--color-neutral-100) 25%, var(--color-neutral-200) 50%, var(--color-neutral-100) 75%);
  background-size: 200% 100%;
  border-radius: var(--radius-sm);
  animation: skeleton-shimmer 1.6s var(--ease) infinite;
}
@keyframes skeleton-shimmer { to { background-position: -200% 0; } }
@media (prefers-reduced-motion: reduce) { .skeleton { animation: none; } }
```

### 4.2 Spinner (solo en botones)

- Se usa **únicamente dentro de botones** que disparan acciones cortas: guardar, crear, editar, eliminar, generar un documento, cargar algo.
- Mientras carga: el botón queda `disabled` + `aria-busy="true"`, **conserva su ancho** (no cambia de tamaño), muestra el spinner junto al texto o reemplazando el ícono, y el texto pasa a gerundio (`Guardando…`).
- Si la acción puede tardar mucho (más de ~10 s), usar progreso o un estado de proceso, no un spinner infinito.

## 5. Botones

Una jerarquía clara. **No todos los botones son iguales.**

| Variante | Rol | Estilo | Regla |
|---|---|---|---|
| **default** (primary) | Acción principal | Relleno `--color-primary`, mayor peso visual | **Solo 1 por componente/vista** |
| **secondary** | Acompaña a la principal | Relleno suave o borde, menos peso | Puede haber varios, nunca compite con el primary |
| **ghost** | Apoyo (cancelar, volver, ver más) | **Sin relleno ni borde, solo texto** | Para acciones de baja prioridad |
| **destructive** | Acciones sin vuelta atrás | `--color-danger` | Siempre con advertencia/confirmación |

- Orden en grupos: la acción principal va al lado donde termina la lectura (derecha en LTR) y es visualmente la más fuerte.
- Destructive: confirmar con modal que **nombre lo que se pierde** (`Eliminar "Factura 0042"`), botón de confirmación con el verbo concreto (no "Aceptar"). Si es posible, preferir **deshacer** (toast con "Deshacer") sobre confirmar.
- Botones solo ícono: `aria-label` obligatorio y área táctil mínima de 44×44 px.
- Texto del botón = verbo + objeto (`Guardar cambios`), nunca "Enviar" o "OK" genéricos.
- Tamaños limitados: `sm`, `md` (default), `lg`.

## 6. Ley de Hick y reducción de ruido

- Una **acción principal** por vista y destacada; el resto en segundo plano.
- Máx. ~5–7 opciones visibles en un menú o grupo; lo demás en "Más" o agrupado.
- **Divulgación progresiva**: opciones avanzadas ocultas hasta que se necesiten.
- **Sin texto de relleno** (descripciones obvias, explicaciones que repiten el título, instrucciones que el placeholder ya cubre). Microcopy corto y directo.
- Evitar elementos que compitan por atención: banners permanentes, badges innecesarios, íconos decorativos, más de un color de acento, animaciones sin función.
- Interfaz **fácil de escanear**: jerarquía tipográfica clara, alineación consistente, espacio en blanco, tablas con encabezados y filas legibles, datos importantes primero.
- Valores por defecto inteligentes y autocompletado para reducir decisiones.

## 7. Consistencia entre componentes

- Botones, cards, campos, modales, menús, tablas y alertas comparten radios, bordes, sombras, espaciados y tipografía.
- Cards: `--surface`, `--radius-md`, `--shadow-sm`; padding de la escala. Modales: `--shadow-md`, overlay `--overlay`, foco atrapado.
- Mismo patrón de cabecera de componente (título, acción principal a un lado) en todo el sistema.
- Íconos de un solo set, un solo grosor y tamaños de la escala.
- Dark mode verificado componente por componente.
- **Clases no repetitivas y generales**: si una combinación de clases/estilos se repite, conviértela en un componente o clase reutilizable (`.btn`, `.card`, `.field`; BEM o `cva` según el proyecto). Nada de estilos inline ni copiar y pegar cadenas largas de utilidades.

## 8. Estados de la interfaz

Define y diseña **cada estado** de cada lista, tabla y pantalla con datos:

| Estado | Qué mostrar |
|---|---|
| **Cargando** | Skeleton con las medidas del contenido (sección 4) |
| **Vacío** | Mensaje corto + qué hacer + botón de la acción principal (`Aún no hay clientes` · `Crear cliente`) |
| **Sin resultados** (búsqueda/filtro) | Qué se buscó + `Limpiar filtros` |
| **Error** | Qué falló, en lenguaje claro, y botón `Reintentar`; sin códigos técnicos para el usuario |
| **Éxito** | Confirmación breve y no bloqueante (toast) |
| **Sin permisos / sin conexión** | Mensaje específico, no un error genérico |
| **Parcial** | Si falla una sección, el resto sigue funcionando |

Si el proyecto **no usa alertas de shadcn ni SweetAlert**, crea componentes propios `Alert` (en línea, persistente) y `Toast` (temporal, `role="status"`/`role="alert"`) con las variantes success, warning, danger e info, usando tokens.

### 8.1 Función generalizada de errores (obligatoria)

Revisa cómo se manejan hoy los `try/catch`, respuestas de API y errores de formulario, y **centralízalos** en una sola función que se consuma en todas partes:

```js
// lib/errores.js
const MENSAJES = {
  NETWORK:      'No hay conexión. Revisa tu internet e inténtalo de nuevo.',
  UNAUTHORIZED: 'Tu sesión expiró. Inicia sesión de nuevo.',
  FORBIDDEN:    'No tienes permiso para realizar esta acción.',
  NOT_FOUND:    'No encontramos lo que buscas.',
  VALIDATION:   'Revisa los campos marcados.',
  CONFLICT:     'Este registro ya existe o fue modificado.',
  SERVER:       'Algo salió mal de nuestro lado. Inténtalo de nuevo en unos minutos.',
  UNKNOWN:      'No se pudo completar la acción.',
};

const porStatus = (s) =>
  s === 401 ? 'UNAUTHORIZED' : s === 403 ? 'FORBIDDEN' : s === 404 ? 'NOT_FOUND' :
  s === 409 ? 'CONFLICT' : (s === 400 || s === 422) ? 'VALIDATION' : s >= 500 ? 'SERVER' : 'UNKNOWN';

/** Normaliza cualquier error y notifica una sola vez. Devuelve el error normalizado. */
export function manejarError(error, { contexto = '', notificar = true, onCampos } = {}) {
  const status = error?.status ?? error?.response?.status;
  const codigo = !navigator.onLine || error?.name === 'TypeError' ? 'NETWORK' : porStatus(status);
  const normalizado = {
    codigo,
    status,
    mensaje: error?.userMessage ?? MENSAJES[codigo],           // lo que ve el usuario
    camposInvalidos: error?.fields ?? error?.errors ?? null,    // { campo: 'mensaje' }
    detalle: error,                                              // solo para logs
  };
  console.error(`[${contexto || 'app'}]`, error);               // o servicio de logging
  if (normalizado.camposInvalidos && onCampos) onCampos(normalizado.camposInvalidos);
  if (notificar) notificar_(normalizado.mensaje);                // toast/alert del sistema
  return normalizado;
}
```

Reglas: todo `catch` llama a `manejarError`; nada de `alert()` ni mensajes escritos a mano en cada pantalla; los textos viven en un solo lugar; nunca mostrar stack traces ni mensajes crudos del servidor. Envolver `fetch` en un cliente HTTP único que lance errores con `status`. Agregar un **Error Boundary** (o equivalente) para errores inesperados de render.

## 9. Estados de interacción

Todo elemento interactivo (botones, enlaces, inputs, selects, checkboxes, tabs, menús, filas clicables) define cuando corresponda:

- **hover**: cambio sutil de fondo/color (solo en dispositivos con hover: `@media (hover: hover)`).
- **focus-visible**: anillo claro y consistente (`--focus-ring`), nunca eliminado con `outline: none` sin reemplazo.
- **active**: feedback inmediato al presionar.
- **disabled**: visualmente atenuado, `cursor: not-allowed`, no recibe eventos, con `disabled` o `aria-disabled`.
- **loading**: botón deshabilitado con spinner.
- **Evitar doble clic**: los botones de acción se deshabilitan apenas empieza la petición y se reactivan al terminar (también con `try/finally`); formularios con protección contra doble envío.
- Transiciones cortas (`--duration-fast`), sin mover el layout.

## 10. Accesibilidad (WCAG 2.2 AA como mínimo)

- **Formularios**: todos los campos con label asociado, `fieldset`/`legend` en grupos de radios y checkboxes, errores vinculados con `aria-describedby`.
- **Imágenes**: `alt` descriptivo; `alt=""` si es decorativa. Íconos significativos con `aria-label`.
- **Contraste**: texto normal ≥ 4.5:1, texto grande y componentes UI ≥ 3:1, en light y dark. Nunca comunicar algo solo con color (agregar ícono o texto).
- **Teclado**: todo operable sin mouse, orden de tabulación lógico, foco visible, modales con foco atrapado y cierre con `Esc`, devolver el foco al elemento que lo abrió.
- **Semántica**: `button` para acciones y `a` para navegación; un solo `h1`; jerarquía de encabezados ordenada; landmarks (`header`, `nav`, `main`, `footer`).
- **Anuncios**: toasts y errores con `role="status"` / `role="alert"`; estados de carga con `aria-busy`.
- **Movimiento**: respetar `prefers-reduced-motion`.
- **Zoom y texto**: la interfaz funciona al 200 % sin perder contenido; usar `rem`, no `px`, para tamaños de texto.
- Atributo `lang` correcto en el documento.

## 11. Responsive (mobile-first, no "encoger el desktop")

- Diseñar primero para móvil y **mejorar** hacia tablet y escritorio con `min-width`.
- Breakpoints sugeridos (como tokens): 640 / 768 / 1024 / 1280 / 1536 px. Probar también anchos intermedios y pantallas grandes con `max-width` en el contenido.
- Rediseñar la composición en cada tamaño, no solo reducir:
  - Tablas → tarjetas o lista apilada en móvil, o scroll horizontal controlado con la primera columna fija.
  - Navegación → barra inferior o menú desplegable en móvil; barra lateral en escritorio.
  - Formularios → una columna en móvil; 2 columnas en pantallas amplias solo si los campos están relacionados.
  - Modales → hoja inferior o pantalla completa en móvil.
  - Acciones → la acción principal accesible con el pulgar, en barra fija inferior si el formulario es largo.
- Áreas táctiles ≥ 44×44 px y separación suficiente entre controles.
- Layouts con `grid`/`flex`, `clamp()` y container queries; imágenes con `aspect-ratio` y `srcset`; evitar anchos fijos.
- Sin scroll horizontal accidental ni desbordes; considerar `safe-area-inset` y teclado virtual en móvil.

## 12. Mejoras adicionales que debes implementar si faltan

- Escala de `z-index` en tokens (sin valores arbitrarios como `9999`).
- Estados `:disabled`, `[aria-busy]` y `[aria-invalid]` en los componentes base.
- Confirmar al salir de un formulario con cambios sin guardar.
- Atajos de teclado solo si aportan; no recargar la interfaz.
- Formato de fechas, moneda y números según el idioma/región del usuario (`Intl`).
- Textos de la interfaz en un solo idioma y centralizados, listos para i18n.
- Evitar *layout shift*: dimensiones explícitas en imágenes, íconos y contenedores de carga.
- Documentar los componentes base (props, variantes, estados) en un `README` o Storybook, sin texto innecesario.

## 13. Checklist final (verifica antes de entregar)

**Tokens y consistencia**
- [ ] No quedan colores, espacios, radios o sombras fuera de variables
- [ ] Máx. 2 tipografías; bordes 0/sm/md; sombras sm/md
- [ ] Dark mode definido con los mismos tokens y revisado
- [ ] Sin clases/estilos repetidos: todo es componente o clase reutilizable

**Formularios**
- [ ] Label arriba a la izquierda, fijo, asociado al input
- [ ] Todos los inputs con placeholder que muestra el formato
- [ ] Focus cambia borde y color del label sin mover nada ni desbordar
- [ ] Apellido paterno y materno separados (materno opcional, etiqueta al costado) y unidos en código si aplica
- [ ] Errores claros, junto al campo, con espacio reservado

**Carga y estados**
- [ ] Skeletons con las medidas reales y shimmer suave; carga progresiva de arriba hacia abajo
- [ ] Spinner solo en botones de acciones cortas
- [ ] Estados vacío, error, sin resultados y éxito definidos
- [ ] Una única función de manejo de errores consumida en todo el proyecto

**Botones e interacción**
- [ ] 1 botón principal por componente; secondary, ghost y destructive con su rol
- [ ] Hover, focus-visible, active y disabled en todo elemento interactivo
- [ ] Sin doble clic en acciones; destructive con advertencia

**Accesibilidad y responsive**
- [ ] Contraste AA, `alt` en imágenes, navegación completa con teclado
- [ ] Probado en móvil, tablet y escritorio (varios anchos), sin scroll horizontal
- [ ] Sin texto de relleno ni elementos que compitan con la acción principal

## 14. Formato de entrega

Al terminar, responde con un resumen **corto**:

1. Qué encontraste (3–6 hallazgos principales).
2. Qué cambiaste e implementaste (por sección).
3. Qué agregaste que no estaba pedido.
4. Pendientes o decisiones que requieren al usuario (si las hay).

No expliques lo obvio ni repitas el contenido de esta skill.

## 15. Aplicación en erp-public-web

Piezas base ya disponibles; reutilízalas antes de crear otras:

| Necesidad | Usar |
|---|---|
| Tokens (espaciado, sombras, z-index, foco, overlay) | `src/app/globals.css` (`--space-*`, `--shadow-sm/md`, `--z-*`, `--focus-ring`, `--control-height`) |
| Botón con spinner | `<Button loading>` (deshabilita, `aria-busy`, conserva ancho) |
| Campo con label, `*`/`(opcional)` y mensaje reservado | `<Field id label required o optional error hint>` + `messageId(id)` en `aria-describedby` |
| Validación blur + foco al primer error | `useFormValidation(schema, getValues)` |
| Nombre + apellido paterno/materno → `guestName` | `unirNombre`, `separarNombreCompleto` (`src/lib/nombres.ts`) |
| Skeleton | `Skeleton`, `ListingSkeleton`, `ListingGridSkeleton` (aparece tras 150 ms) |
| Vacío / error de sección | `EmptyState`, `ErrorState` con `onRetry` (`src/components/shared/states.tsx`) |
| Errores | `manejarError(error, { contexto, onCampos })` en todo `catch`; `mensajeDeError(error)` para pantallas; textos en `src/lib/mensajes-error.ts` |
| Error inesperado de render | `src/app/error.tsx` |

El cliente `src/lib/api.ts` ya traduce red/5xx a mensajes del catálogo; en 4xx respeta el mensaje de negocio del API.
