---
name: improve-public-web-code
description: Improves, reviews, and refactors erp-public-web (Next.js hotel booking site). Use when writing or editing public pages, reservation wizard, contact form, public API client, branding, or when the user asks to mejorar código, refactorizar, revisar calidad, o alinear el sitio público a las convenciones del repo.
---

# Mejorar código — erp-public-web

Sitio de huéspedes. Crea reservas `PENDIENTE`. No cobra ni confirma estancia.

## Flujo

1. Datos: `src/lib/api/public.ts` + hooks TanStack Query existentes.
2. Validación: `src/lib/validations/` (Zod) antes del POST.
3. Marca: `site-config.ts` / `NEXT_PUBLIC_*`. Cero nombres de hotel en JSX.
4. `pnpm type-check` y `pnpm lint`.

## Checklist

- [ ] Solo `/api/public/*`
- [ ] No JWT de admin ni `/api/reservations` interno
- [ ] Checkout posterior a checkin
- [ ] Tokens visuales alineados al admin (OKLCH / Tailwind v4)
- [ ] `cn()`; sin utilidades v3 deprecadas
- [ ] Debounce o submit explícito en availability (rate limit del API)
- [ ] `prefers-reduced-motion`
- [ ] Copy en español

## Patrones

```typescript
const rooms = await publicApi.listRooms();
const availability = await publicApi.checkAvailability({ checkin, checkout, guests });
const reservation = await publicApi.createReservation(payload);
```

Confirmación de UI ≠ confirmación operativa. El admin cambia el estado después.

## No hacer

- Pasarela de pagos o DTE en este repo
- Login de huésped
- Hardcodear teléfonos, direcciones o marca (van en env)
