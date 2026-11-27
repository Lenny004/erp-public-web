import type { BrowserContext, Page, Request, Route } from "@playwright/test";

/**
 * API pública SIMULADA (solo para el build de producción, donde NEXT_PUBLIC_API_URL es un https falso).
 * Datos ficticios con la misma forma que /api/public/* y el mismo volumen que la base de dev
 * (4 habitaciones, una con 5 fotos), para comparar dev contra producción.
 */
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
const EXTRA_ORIGIN = process.env.E2E_API_ORIGIN?.replace(/\/$/, "");
export const MOCK_ALL = !!EXTRA_ORIGIN;
const API = EXTRA_ORIGIN ? new RegExp(`^${escapeRe(EXTRA_ORIGIN)}\\/`) : null;
export type Routable = Page | BrowserContext;

const img = (q: string) => ({ url: `https://encrypted-tbn0.gstatic.com/images?q=tbn:${q}&s=10`, altText: null });
const ROOMS = [
  { id: "room-e2e-1", name: "Habitación Doble E2E", number: "101", capacity: 2, roomType: { name: "Doble", basePrice: "80.99" }, images: [img("ANd9GcQy1uetsyNfakyunqD1VdewET8exQWEJYmadMjDJQh9gV7E1-v3t4o_PRhf")] },
  {
    id: "room-e2e-2", name: "Habitación Estándar E2E", number: "102", capacity: 2, roomType: { name: "Estandar", basePrice: "50" },
    images: [
      img("ANd9GcQgZHAVMqZ7AmjZ2AMnfRiwrZ6Nk0WbwUUGseI9kHy_ZLulLE2qz-UbdC8"),
      img("ANd9GcRnx5D0namI0czSjzYrt35m0fdWg4tEk9bl_dDe-gnZG6hx2gsri_0psP0J"),
      img("ANd9GcQ9OqKrLoSxMdwMZrM2F34iWXKU2e9Nut5W7s1KZRP4OXCsw0dSmQhZnrY"),
      img("ANd9GcQQP0BrIoxQUlbhVbGGsQ3DdWG0As_mc0TyVoV4K5HinQt6HJ-ZnL3ZVMHs"),
      img("ANd9GcRSlN7RAJZMDOTCo1ESpWRRZLX9akiX3K9ofE2enOYh5WTgWYpLjP3tDCY_"),
    ],
  },
  { id: "room-e2e-3", name: "Habitación Familiar E2E", number: "103", capacity: 4, roomType: { name: "Familiar", basePrice: "99" }, images: [] },
  { id: "room-e2e-4", name: "Suite Familiar E2E", number: "104", capacity: 2, roomType: { name: "Familiar", basePrice: "99" }, images: [] },
];
const COMPANY = { legalName: "Hotel Demo E2E, S.A. de C.V.", commercialName: "Hotel Demo E2E", address: "Dirección ficticia E2E", phone: "+503 0000-0000", email: "contacto@example.invalid", website: null, logoUrl: null };

function cors(req: Request) {
  return { "access-control-allow-origin": req.headers()["origin"] ?? "*", "access-control-allow-headers": "content-type, accept", "access-control-allow-methods": "GET,POST,OPTIONS" };
}
const json = (route: Route, status: number, body: unknown) =>
  route.fulfill({ status, contentType: "application/json", headers: cors(route.request()), body: JSON.stringify(body) });

export async function installPublicMock(page: Routable) {
  if (!API) return;
  await page.route(API, async (route) => {
    const req = route.request();
    const { pathname } = new URL(req.url());
    if (req.method() === "OPTIONS") return route.fulfill({ status: 204, headers: cors(req) });
    if (pathname === "/api/public/company") return json(route, 200, { success: true, data: COMPANY });
    if (pathname === "/api/public/rooms") return json(route, 200, { success: true, data: ROOMS });
    if (pathname.startsWith("/api/public/rooms/")) return json(route, 200, { success: true, data: ROOMS.find((r) => pathname.endsWith(r.id)) ?? ROOMS[0] });
    if (pathname === "/api/public/reservations/availability") {
      const body = (req.postDataJSON() ?? {}) as { checkin?: string; checkout?: string; guests?: number };
      return json(route, 200, { success: true, data: { checkin: body.checkin, checkout: body.checkout, guests: body.guests ?? null, availableRooms: ROOMS, totalAvailable: ROOMS.length } });
    }
    if (req.method() !== "GET") return json(route, 400, { error: "E2E_MOCK_READ_ONLY", message: "Mock E2E: escrituras deshabilitadas" });
    return json(route, 200, { success: true, data: [] });
  });
}
