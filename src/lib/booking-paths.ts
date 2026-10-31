import { availabilitySearchSchema } from "@/lib/validations/booking";

/** Fechas y huéspedes que viajan entre la ficha y la página de datos. */
export interface StayQuery {
  checkin: string;
  checkout: string;
  guests: number;
}

/** Lee `checkin`, `checkout` y `guests` solo si el rango es válido. */
export function parseStayQuery(params: {
  get(name: string): string | null;
}): StayQuery | null {
  const guestsRaw = Number(params.get("guests"));
  const guests = Number.isFinite(guestsRaw) && guestsRaw > 0 ? guestsRaw : 2;
  const parsed = availabilitySearchSchema.safeParse({
    checkin: params.get("checkin") ?? "",
    checkout: params.get("checkout") ?? "",
    guests,
  });

  if (!parsed.success || parsed.data.guests == null) return null;

  return {
    checkin: parsed.data.checkin,
    checkout: parsed.data.checkout,
    guests: parsed.data.guests,
  };
}

function staySearchParams(stay: StayQuery): string {
  return new URLSearchParams({
    checkin: stay.checkin,
    checkout: stay.checkout,
    guests: String(stay.guests),
  }).toString();
}

/** Ficha de la habitación, con la estadía en la query cuando ya se eligió. */
export function roomDetailHref(roomId: string, stay?: StayQuery): string {
  if (!stay) return `/habitaciones/${roomId}`;
  return `/habitaciones/${roomId}?${staySearchParams(stay)}`;
}

/** Página intermedia: datos del huésped para una estadía ya comprobada. */
export function roomGuestHref(roomId: string, stay: StayQuery): string {
  return `/habitaciones/${roomId}/reservar?${staySearchParams(stay)}`;
}
