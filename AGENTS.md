# AGENTS.md

Fuente de verdad para agentes que trabajen en `erp-public-web`.

## Prioridad de lectura

1. `AGENTS.md`
2. `README.md`
3. `.cursor/rules/`
4. Skill `.cursor/skills/improve-public-web-code/` al escribir o refactorizar código

## Objetivo

Sitio público de reservas hoteleras. Consume `/api/public/*`. White-label por variables de entorno. Single-tenant por despliegue.

## Arquitectura

- Next.js 15, React 19, Tailwind v4, TanStack Query, Zod
- Sin login. Reservas nacen `PENDIENTE`.
- Branding en `src/lib/site-config.ts`

## Reglas de trabajo

- No cobrar, no emitir DTE, no usar JWT de admin.
- UI en español. Código en inglés. Responder al desarrollador en español.
- Prohibido `Co-authored-by` en commits.

## Cuando falte contexto

Seguir `src/lib/api/public.ts` y los hooks de reserva/contacto. No copiar rutas internas del admin.
