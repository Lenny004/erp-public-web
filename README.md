<!-- readme-standard:v1 -->
<!-- Esta línea permite que los agentes de IA reconozcan y actualicen este README. No la borres. -->

<!-- section:header -->
# erp-public-web

> Sitio público de reservas hoteleras para huéspedes; consume solo `/api/public/*` de erp-core-api.

<!-- section:toc -->
## 📑 Contenido

- [Aspectos destacados](#-aspectos-destacados)
- [Descripción](#️-descripción)
- [Requisitos](#-requisitos)
- [Instalación](#️-instalación)
- [Uso](#-uso)
- [Configuración](#️-configuración)
- [Estructura del proyecto](#️-estructura-del-proyecto)
- [Desarrollo](#️-desarrollo)
- [Pruebas](#-pruebas)
- [Hoja de ruta y estado](#️-hoja-de-ruta-y-estado)
- [Soporte y contribuciones](#-soporte-y-contribuciones)
- [Licencia](#-licencia)

<!-- section:highlights -->
## 🌟 Aspectos destacados

- **Reservas en línea**: catálogo, disponibilidad y creación de reservas con estado `PENDIENTE` y origen `EN_LINEA`.
- **Sin login de huésped**: el API público aplica rate limit; no hay JWT de admin en este cliente.
- **White-label por despliegue**: marca, textos e imágenes vía `NEXT_PUBLIC_*` (single-tenant).
- **Formularios validados**: Zod antes de llamar al API (reserva y contacto).
- **Alineado al admin**: tokens OKLCH y Tailwind v4 coherentes con `erp-admin-web`.

<!-- section:overview -->
## ℹ️ Descripción

Frontend orientado al huésped: inicio, habitaciones, wizard de reserva, confirmación y contacto. La confirmación operativa (check-in, pagos, cambios de estado) ocurre en `erp-admin-web`. No confirma reservas ni cobra en este sitio.

Cada despliegue es una instancia para un hotel: no hay panel SaaS multiempresa ni cuenta de huésped.

**Ecosistema** (repos separados en `ERP-System/` por comodidad local):

```text
erp-admin-web (3000)     JWT de usuario + RBAC
erp-clock-web (3001)     PIN → JWT efímero (asistencia)
erp-public-web (3002)    API pública de reservas (sin login)
        ↓
   erp-core-api (4000)
        ↓
   PostgreSQL 16
```

| Repositorio | Rol |
|-------------|-----|
| **erp-core-api** | Expone `/api/public/*` y rate-limita el sitio. |
| **erp-admin-web** | Habitaciones, calendario y reservas (confirma o rechaza `PENDIENTE`). |
| **erp-clock-web** | Marcación de asistencia (sin relación con reservas públicas). |
| **erp-public-web** (este) | Catálogo, wizard de reserva y contacto. |

**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, TanStack Query, Zod, Sonner, Lucide React, pnpm 11.

<!-- section:requirements -->
## 📋 Requisitos

- Node.js ≥ 20 (recomendado 22)
- pnpm 11
- `erp-core-api` en `http://localhost:4000` con habitaciones y tipos cargados
- `CORS_ORIGIN` del API debe incluir `http://localhost:3002` en desarrollo

<!-- section:installation -->
## ⬇️ Instalación

```bash
pnpm install
cp .env.example .env.local
```

<!-- section:usage -->
## 🚀 Uso

```bash
pnpm dev
```

Servidor local: [http://localhost:3002](http://localhost:3002)

1. Levanta `erp-core-api` con datos de habitaciones.
2. Añade `http://localhost:3002` a `CORS_ORIGIN` del API.
3. Ajusta `.env.local` (marca, contacto, `NEXT_PUBLIC_API_URL`).
4. Recorre: inicio → habitaciones → disponibilidad → reserva → confirmación.

**Rutas de la UI**

| Ruta | Descripción |
|------|-------------|
| `/` | Hero, búsqueda de fechas y habitaciones destacadas |
| `/habitaciones` | Catálogo público |
| `/reservar` | Wizard de disponibilidad y datos del huésped |
| `/reservar/confirmacion` | Reserva creada (`PENDIENTE`) |
| `/contacto` | Formulario de contacto |
| `/legal/terminos` y `/legal/privacidad` | Textos legales |

**Endpoints consumidos** (base `{NEXT_PUBLIC_API_URL}/api/public`)

| Método | Ruta | Uso |
|--------|------|-----|
| `GET` | `/rooms` | Catálogo |
| `POST` | `/reservations/availability` | Disponibilidad por fechas |
| `POST` | `/reservations` | Crear reserva (`PENDIENTE`) |
| `POST` | `/contact` | Contacto |

**Despliegue (plantilla por cliente)**

```text
api.<dominio>           → erp-core-api
admin.<dominio>         → erp-admin-web
reservas.<dominio>      → erp-public-web
```

Incluye el origen HTTPS del sitio en `CORS_ORIGIN` del API.

<!-- section:configuration -->
## ⚙️ Configuración

Copia `.env.example` a `.env.local`. Nunca commitear secretos.

| Variable | Descripción | Ejemplo | Requerida |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL de erp-core-api (sin barra final) | `http://localhost:4000` | Sí |
| `NEXT_PUBLIC_BRAND_NAME` | Nombre del hotel en UI y metadata | `Hotel Vista Azul` | Sí |
| `NEXT_PUBLIC_BRAND_TAGLINE` | Frase en hero y footer | `Descanso frente al mar…` | No |
| `NEXT_PUBLIC_HERO_IMAGE_URL` | Imagen del inicio | URL HTTPS pública | No |
| `NEXT_PUBLIC_ORG_SLUG` | Slug de organización | `default` | Sí |
| `NEXT_PUBLIC_LOCATION_LABEL` | Ubicación en UI | `El Salvador` | No |
| `NEXT_PUBLIC_SEARCH_PLACEHOLDER` | Placeholder del buscador | `¿Cuándo te hospedas?` | No |
| `NEXT_PUBLIC_CONTACT_ADDRESS` | Dirección de contacto | Texto libre | No |
| `NEXT_PUBLIC_CONTACT_PHONE` | Teléfono | `+503 …` | No |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Correo reservas/contacto | `reservas@ejemplo.sv` | No |

<!-- section:structure -->
## 🗂️ Estructura del proyecto

```text
src/
  app/                 # Páginas (inicio, habitaciones, reservar, contacto, legal)
  components/          # layout, rooms, booking, contact, ui, motion
  hooks/               # usePublicRooms, useAvailability, useCreateReservation, …
  lib/
    api/public.ts      # Cliente público (métodos nombrados)
    validations/       # Zod (reserva, booking, contacto)
    site-config.ts     # Branding desde env
```

Convenciones: Server Components por defecto; `"use client"` en wizard e interactivos; alias `@/*` → `./src/*`; UI en español, código en inglés; combinar clases con `cn()`; respetar `prefers-reduced-motion`.

<!-- section:development -->
## 🛠️ Desarrollo

```bash
pnpm dev          # puerto 3002
pnpm build
pnpm start        # puerto 3002
pnpm type-check
pnpm lint
pnpm clean        # elimina .next
```

Reglas: `.cursor/rules/`. Skill de código: `.cursor/skills/improve-public-web-code/`. Fuente para agentes: `AGENTS.md`.

No usar cliente JWT de admin ni rutas `/api/reservations` internas.

<!-- section:testing -->
## ✅ Pruebas

```bash
pnpm type-check
pnpm lint
```

No hay suite de pruebas unitarias en este repositorio; la verificación local habitual es type-check y lint.

<!-- section:roadmap -->
## 🗺️ Hoja de ruta y estado

**Fuera de alcance actual**

- Pasarela de pagos o DTE en el sitio público
- Cuenta de huésped / login
- Gestión de inventario de habitaciones (admin)
- SaaS multi-hotel o panel central de tenants
- Monorepo

<!-- section:contributing -->
## 💭 Soporte y contribuciones

- Documentación de agentes: `AGENTS.md` y `.env.example`.
- Implementación del API público: módulo `public` en `erp-core-api`.

**Git**

- Rama principal: `main` (solo vía PR). Integración: `feature-public`.
- Ramas: `feat/<nombre>`, `fix/<nombre>`, `chore/<nombre>`.
- Commits en español con prefijo convencional. **Prohibido** `Co-authored-by:`.

```bash
git config core.hooksPath .githooks
```

<!-- section:license -->
## 📄 Licencia

MIT. Ver [LICENSE](LICENSE).
