/**
 * Comprobante PDF de una solicitud de reserva, generado en el navegador
 * sin dependencias. Usa fuentes estándar y WinAnsi para el español.
 */

export interface ReservationPdfInput {
  /** Identificador que el huésped debe conservar. */
  reference: string;
  /** Nombre comercial del hotel. */
  brandName: string;
  /** Correo mostrado en el comprobante. */
  contactEmail: string;
  /** Teléfono mostrado en el comprobante. */
  contactPhone: string;
  /** Momento en que el huésped descarga el archivo. */
  issuedAt: Date;
}

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 48;

/** Caracteres españoles que Helvetica no escribe como Unicode en un PDF. */
const WIN_ANSI: Record<string, number> = {
  "¡": 0xa1,
  "¿": 0xbf,
  "á": 0xe1,
  "é": 0xe9,
  "í": 0xed,
  "ó": 0xf3,
  "ú": 0xfa,
  "Á": 0xc1,
  "É": 0xc9,
  "Í": 0xcd,
  "Ó": 0xd3,
  "Ú": 0xda,
  "ñ": 0xf1,
  "Ñ": 0xd1,
  "ü": 0xfc,
  "Ü": 0xdc,
};

type Rgb = readonly [number, number, number];

const INK: Rgb = [0.12, 0.14, 0.18];
const MUTED: Rgb = [0.38, 0.4, 0.45];
const PAPER: Rgb = [0.96, 0.96, 0.97];
const WHITE: Rgb = [1, 1, 1];
const BAND: Rgb = [0.11, 0.16, 0.24];

/** Literal PDF entre paréntesis, con acentos en octal WinAnsi. */
function pdfLiteral(value: string): string {
  let encoded = "";
  for (const char of value) {
    if (char === "\\" || char === "(" || char === ")") {
      encoded += `\\${char}`;
      continue;
    }
    const code = char.charCodeAt(0);
    if (code >= 32 && code <= 126) {
      encoded += char;
      continue;
    }
    const mapped = WIN_ANSI[char];
    encoded += mapped === undefined ? "?" : `\\${mapped.toString(8).padStart(3, "0")}`;
  }
  return `(${encoded})`;
}

function wrap(text: string, maxChars: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (current && next.length > maxChars) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function rgb(color: Rgb): string {
  return color.map((channel) => channel.toFixed(3)).join(" ");
}

/**
 * Arma un PDF de una página con el número de referencia en grande.
 * El resultado es ASCII: los acentos van escapados para Helvetica.
 */
export function buildReservationPdf(input: ReservationPdfInput): Uint8Array {
  const issued = new Intl.DateTimeFormat("es-SV", { dateStyle: "long" }).format(input.issuedAt);
  const contentWidth = PAGE_WIDTH - MARGIN * 2;
  const brandLines = wrap(input.brandName, 32);
  const noteLines = wrap(
    "El hotel revisará la solicitud y te contactará para confirmarla. Conserva este PDF: si escribes o llamas, indica el número de referencia.",
    78,
  );

  const ops: string[] = [];

  const fill = (x: number, y: number, width: number, height: number, color: Rgb) => {
    ops.push(`${rgb(color)} rg`, `${x} ${y} ${width} ${height} re`, "f");
  };
  const text = (font: "F1" | "F2", size: number, x: number, y: number, value: string, color: Rgb) => {
    ops.push(
      "BT",
      `${rgb(color)} rg`,
      `/${font} ${size} Tf`,
      `1 0 0 1 ${x} ${y} Tm`,
      `${pdfLiteral(value)} Tj`,
      "ET",
    );
  };

  const bandHeight = 56 + brandLines.length * 26;
  const bandBottom = PAGE_HEIGHT - bandHeight;
  fill(0, bandBottom, PAGE_WIDTH, bandHeight, BAND);

  brandLines.forEach((line, index) => {
    text("F2", 20, MARGIN, PAGE_HEIGHT - 46 - index * 26, line, WHITE);
  });
  text("F1", 11, MARGIN, bandBottom + 18, "Solicitud de reserva", [0.82, 0.86, 0.9]);

  const labelY = bandBottom - 42;
  text("F1", 9, MARGIN, labelY, "NÚMERO DE REFERENCIA", MUTED);

  const boxTop = labelY - 16;
  const boxHeight = 72;
  const boxBottom = boxTop - boxHeight;
  fill(MARGIN, boxBottom, contentWidth, boxHeight, PAPER);
  text("F2", 16, MARGIN + 20, boxBottom + 28, input.reference, INK);

  let cursor = boxBottom - 36;
  text("F1", 11, MARGIN, cursor, "Estado", MUTED);
  text("F2", 13, MARGIN + 52, cursor - 1, "Pendiente de confirmación", INK);

  cursor -= 36;
  for (const line of noteLines) {
    text("F1", 11, MARGIN, cursor, line, INK);
    cursor -= 16;
  }

  cursor -= 18;
  text("F2", 12, MARGIN, cursor, "Contacto", INK);
  cursor -= 20;
  text("F1", 11, MARGIN, cursor, input.contactEmail, INK);
  cursor -= 16;
  text("F1", 11, MARGIN, cursor, input.contactPhone, INK);

  const footerY = 48;
  ops.push(
    `${rgb(MUTED)} RG`,
    "0.6 w",
    `${MARGIN} ${footerY + 22} m`,
    `${PAGE_WIDTH - MARGIN} ${footerY + 22} l`,
    "S",
  );
  text("F1", 9, MARGIN, footerY + 12, `Generado el ${issued}.`, MUTED);
  text("F1", 9, MARGIN, footerY, "No confirma la estadía hasta que el hotel apruebe la solicitud.", MUTED);

  return assemblePdf(ops.join("\n"));
}

/** Nombre de archivo seguro a partir del identificador de la solicitud. */
export function reservationPdfFileName(reference: string): string {
  const safe = reference.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 36);
  return `reserva-${safe || "referencia"}.pdf`;
}

function assemblePdf(content: string): Uint8Array {
  const encoder = new TextEncoder();
  const streamLength = encoder.encode(content).length;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>",
    `<< /Length ${streamLength} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  ];

  let body = "%PDF-1.4\n";
  const offsets = [0];
  for (const object of objects) {
    offsets.push(encoder.encode(body).length);
    body += `${offsets.length - 1} 0 obj\n${object}\nendobj\n`;
  }

  const xrefAt = encoder.encode(body).length;
  let xref = `xref\n0 ${objects.length + 1}\n`;
  xref += "0000000000 65535 f \n";
  for (let index = 1; index < offsets.length; index += 1) {
    xref += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  xref += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`;

  return encoder.encode(body + xref);
}
