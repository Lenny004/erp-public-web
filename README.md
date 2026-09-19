# erp-public-web

Sitio público de reservas hoteleras del ecosistema ERP. Permite consultar habitaciones, verificar disponibilidad, crear una reserva en línea (estado `PENDIENTE`, origen `EN_LINEA`) y enviar un mensaje de contacto. Consume **solo** `/api/public/*` en **erp-core-api**.

**Plantilla single-tenant por despliegue**: branding y copy se configuran por variables de entorno. No hay login de huésped ni JWT de admin.

## Rol en el ecosistema

```txt
erp-admin-web (3000)     JWT de usuario + RBAC
erp-clock-web (3001)     PIN → JWT efímero (scope attendance)
erp-public-web (3002)    API pública de reservas (sin login)
        ↓
   erp-core-api (4000)
        ↓
   PostgreSQL 16
```

| Repositorio | Rol |
|-------------|-----|
| **erp-core-api** | Backend. Expone `/api/public/*` y rate-limita el sitio. |
| **erp-admin-web** | Gestiona habitaciones, calendario y reservas (confirma o rechaza las `PENDIENTE`). |
| **erp-clock-web** | Marcación de asistencia (sin relación con reservas públicas). |
| **erp-public-web** (este) | Frontend orientado al huésped: catálogo, wizard de reserva y contacto. |

No es un monorepo. Los cuatro repos conviven en la carpeta de trabajo `ERP-System/` solo por comodidad local.

## Stack

| Área | Tecnología |
|------|------------|
| Framework | Next.js 15 (App Router) + React 19 |
| Lenguaje | TypeScript estricto (`moduleResolution: bundler`) |
| UI | Tailwind CSS v4 (tokens OKLCH alineados a `erp-admin-web`), shadcn/ui |
| Datos remotos | TanStack Query contra `/api/public` |
| Validación | Zod (formularios de reserva y contacto) |
| Notificaciones | Sonner |
| Iconografía | Lucide React |
| Gestor de paquetes | pnpm 11 |

## Requisitos

- Node.js 20+ (recomendado 22)
- pnpm 11
- `erp-core-api` en [http://localhost:4000](http://localhost:4000) con habitaciones y tipos de habitación cargados
- `CORS_ORIGIN` del API debe incluir `http://localhost:3002` en desarrollo (el API admite 3000/3001 por defecto; el sitio público hay que añadirlo)

## Arquitectura

- Sin autenticación de usuario. El API público aplica rate limit.
- Cliente en `src/lib/api/public.ts` (mismo estilo de métodos nombrados que el admin).
- Formularios validados con Zod antes de llamar al API.
- Server Components por defecto; `"use client"` en wizard, listados interactivos y formularios.
- Path alias `@/*` → `./src/*`.
- UI en español. Código en inglés.
- White-label básico vía `NEXT_PUBLIC_BRAND_*` y `NEXT_PUBLIC_ORG_SLUG`.

## Estructura del código

```txt
src/
  app/
    page.tsx                 # Inicio + hero
    habitaciones/            # Catálogo
    reservar/                # Wizard + confirmación
    contacto/
    legal/                   # Términos y privacidad
  components/
    layout/                  # Header, footer, shell
    rooms/ booking/ contact/
    ui/                      # shadcn
    motion/                  # Revelados y springs
  hooks/                     # usePublicRooms, useAvailability, useCreateReservation, useContact
  lib/
    api.ts / api/public.ts   # Cliente público
    validations/             # Zod de reserva, booking y contacto
    site-config.ts           # Branding desde env
    api-base-url.ts
```

## Desarrollo local

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Servidor local: [http://localhost:3002](http://localhost:3002)

1. Levanta `erp-core-api` con datos de habitaciones.
2. Añade `http://localhost:3002` a `CORS_ORIGIN` del API.
3. Ajusta `.env.local` (marca, contacto, `NEXT_PUBLIC_API_URL`).
4. Abre el sitio y recorre: inicio → habitaciones → disponibilidad → reserva → confirmación.

## Rutas de la UI

| Ruta | Descripción |
|------|-------------|
| `/` | Hero, búsqueda de fechas y habitaciones destacadas |
| `/habitaciones` | Catálogo público |
| `/reservar` | Wizard de disponibilidad y datos del huésped |
| `/reservar/confirmacion` | Reserva creada (`PENDIENTE`) |
| `/contacto` | Formulario de contacto |
| `/legal/terminos` y `/legal/privacidad` | Textos legales |

## Endpoints consumidos

Base: `{NEXT_PUBLIC_API_URL}/api/public`

| Método | Ruta | Uso |
|--------|------|-----|
| `GET` | `/rooms` | Catálogo de habitaciones |
| `POST` | `/reservations/availability` | Disponibilidad por fechas |
| `POST` | `/reservations` | Crear reserva (`PENDIENTE`) |
| `POST` | `/contact` | Formulario de contacto |

La confirmación operativa (check-in, pagos, cambios de estado) ocurre en `erp-admin-web`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Desarrollo en el puerto 3002 |
| `pnpm build` | Compilar producción |
| `pnpm start` | Servir build en el puerto 3002 |
| `pnpm type-check` | Verificar TypeScript |
| `pnpm lint` | ESLint (Next) |
| `pnpm clean` | Eliminar `.next` |

## Variables de entorno

Copia `.env.example` a `.env.local`. Nunca commitear secretos.

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL de `erp-core-api` (sin barra final) |
| `NEXT_PUBLIC_BRAND_NAME` | Nombre del hotel en UI y metadata |
| `NEXT_PUBLIC_BRAND_TAGLINE` | Frase de apoyo en hero y footer |
| `NEXT_PUBLIC_HERO_IMAGE_URL` | Imagen full-bleed del inicio |
| `NEXT_PUBLIC_ORG_SLUG` | Slug de organización (white-label) |
| `NEXT_PUBLIC_LOCATION_LABEL` | Ubicación mostrada en UI |
| `NEXT_PUBLIC_SEARCH_PLACEHOLDER` | Placeholder del buscador de fechas |
| `NEXT_PUBLIC_CONTACT_ADDRESS` | Dirección de contacto |
| `NEXT_PUBLIC_CONTACT_PHONE` | Teléfono |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Correo de reservas / contacto |

## Convenciones de desarrollo

- No confirmar reservas ni cobrar en este sitio: el API crea `PENDIENTE`.
- No usar el cliente JWT de admin ni rutas `/api/reservations` internas.
- Tokens visuales alineados al admin (OKLCH / Tailwind v4). Combinar clases con `cn()`.
- Validar con Zod. Nunca `any`.
- Respetar `prefers-reduced-motion` en animaciones.
- Responder siempre en español al desarrollador.

Reglas persistentes: `.cursor/rules/`. Skill de mejora de código: `.cursor/skills/improve-public-web-code/`.

## Git

- Rama principal: `main` (solo vía PR).
- Integración: `feature-public`.
- Features: `feat/<nombre>`, `fix/<nombre>`, `chore/<nombre>`.
- Commits en español con prefijo convencional.
- **Prohibido** `Co-authored-by:` en commits.

Activar los hooks locales:

```bash
git config core.hooksPath .githooks
```

`prepare-commit-msg` elimina trailers de co-autoría; `commit-msg` los rechaza si reaparecen.

## Despliegue (plantilla por cliente)

```txt
api.<dominio>           → erp-core-api
admin.<dominio>         → erp-admin-web
reservas.<dominio>      → erp-public-web
```

Incluye el origen HTTPS de este sitio en `CORS_ORIGIN` del API. Branding por env, sin hardcodear el nombre del hotel en componentes.

## Fuera de alcance

- Pasarela de pagos o DTE en el sitio público
- Cuenta de huésped / login
- Gestión de inventario de habitaciones (admin)
- SaaS multi-hotel o panel central de tenants
- Monorepo

## Documentación adicional

| Documento | Contenido |
|-----------|-----------|
| `AGENTS.md` | Fuente de verdad para agentes |
| `.env.example` | Variables de branding y API |
| `erp-core-api` módulo `public` | Implementación y rate limit del API público |
