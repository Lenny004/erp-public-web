# erp-public-web

Sitio público de reservas hoteleras del ecosistema ERP. Permite consultar habitaciones, verificar disponibilidad y crear reservas en línea contra **erp-core-api**.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4** con tokens OKLCH alineados a `erp-admin-web`
- **TanStack Query** para datos de la API pública
- **Zod** para validación de formularios
- **Sonner** para notificaciones toast
- **Lucide React** para iconografía

## Scripts

```bash
pnpm install
pnpm dev         # http://localhost:3002
pnpm build
pnpm start       # producción en puerto 3002
pnpm type-check
pnpm lint
```

## Endpoints consumidos

Base: `{NEXT_PUBLIC_API_URL}/api/public`

| Método | Ruta | Uso |
|--------|------|-----|
| `GET` | `/rooms` | Catálogo de habitaciones |
| `POST` | `/reservations/availability` | Disponibilidad por fechas |
| `POST` | `/reservations` | Crear reserva (estado `PENDIENTE`) |
| `POST` | `/contact` | Formulario de contacto |

## Variables de entorno

Copia `.env.example` a `.env.local` y ajusta:

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL de erp-core-api (ej. `http://localhost:4000`) |
| `NEXT_PUBLIC_BRAND_NAME` | Nombre del hotel en UI y metadata |
| `NEXT_PUBLIC_BRAND_TAGLINE` | Frase de apoyo en hero y footer |
| `NEXT_PUBLIC_HERO_IMAGE_URL` | Imagen full-bleed del inicio |
| `NEXT_PUBLIC_ORG_SLUG` | Slug de organización (white-label futuro) |
| `NEXT_PUBLIC_CONTACT_*` | Dirección, teléfono y correo de contacto |

## Relación con otros repos

| Repo | Rol |
|------|-----|
| **erp-core-api** | Backend Express + Prisma. Expone `/api/public/*` usado por este sitio. |
| **erp-admin-web** | Panel interno de gestión hotelera (reservas, habitaciones, calendario). |
| **erp-clock-web** | Control de asistencia / reloj checador (sin relación directa con reservas públicas). |
| **erp-public-web** (este) | Frontend orientado al huésped: catálogo, wizard de reserva y contacto. |

## Git hooks

Para activar el rechazo de `Co-authored-by` en commits:

```bash
git config core.hooksPath .githooks
```

## Desarrollo local

1. Levanta **erp-core-api** en el puerto 4000 con datos de habitaciones.
2. Configura `.env.local` apuntando a la API.
3. Ejecuta `pnpm dev` y abre [http://localhost:3002](http://localhost:3002).
