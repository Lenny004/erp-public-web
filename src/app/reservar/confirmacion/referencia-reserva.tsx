"use client";

/** Acciones para conservar el número de referencia de una solicitud pendiente. */

import { useState } from "react";
import { Check, Copy, Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  buildReservationPdf,
  reservationPdfFileName,
} from "@/lib/reservation-reference-pdf";

interface ReferenciaReservaProps {
  /** Identificador de la solicitud recién creada. */
  reference: string;
  /** Nombre comercial del hotel, para el archivo y el texto compartido. */
  brandName: string;
  /** Correo de contacto incluido en el comprobante descargable. */
  contactEmail: string;
  /** Teléfono de contacto incluido en el comprobante descargable. */
  contactPhone: string;
}

/** PDF de la solicitud, con el número de referencia y el contacto del hotel. */
function referencePdf(props: ReferenciaReservaProps): File {
  const bytes = buildReservationPdf({ ...props, issuedAt: new Date() });
  const name = reservationPdfFileName(props.reference);
  return new File([bytes as BlobPart], name, { type: "application/pdf" });
}

/**
 * Muestra el número de referencia y permite copiarlo, descargarlo o compartirlo.
 */
export function ReferenciaReserva({
  reference,
  brandName,
  contactEmail,
  contactPhone,
}: ReferenciaReservaProps) {
  const [copied, setCopied] = useState(false);

  async function writeReference() {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      return false;
    }
  }

  async function copyReference() {
    const copied = await writeReference();
    if (copied) {
      toast.success("Número de referencia copiado.");
      return;
    }
    toast.error("No se pudo copiar. Selecciona el número y cópialo manualmente.");
  }

  function downloadReference() {
    const file = referencePdf({ reference, brandName, contactEmail, contactPhone });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("Descargamos el PDF de tu reserva.");
  }

  async function shareReference() {
    const file = referencePdf({ reference, brandName, contactEmail, contactPhone });
    const payload = {
      title: `Reserva en ${brandName}`,
      text: `Número de referencia de mi reserva en ${brandName}: ${reference}`,
    };

    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ ...payload, files: [file] });
        return;
      }
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error("No se pudo abrir el menú de compartir.");
      return;
    }

    const copied = await writeReference();
    if (copied) {
      toast.message("Este dispositivo no puede compartir. El número quedó copiado.");
      return;
    }
    toast.error("No se pudo copiar. Selecciona el número y cópialo manualmente.");
  }

  return (
    <div className="mt-8 rounded-2xl border border-border/80 bg-card px-6 py-5 text-center shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Número de referencia
      </p>
      <p className="mt-2 break-all font-mono text-lg font-semibold tracking-wide text-foreground">
        {reference}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Cópialo, descárgalo en PDF o compártelo para no perderlo.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={copyReference}>
          {copied ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
          {copied ? "Copiado" : "Copiar"}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={downloadReference}>
          <Download className="size-4" aria-hidden />
          Descargar PDF
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={shareReference}>
          <Share2 className="size-4" aria-hidden />
          Compartir
        </Button>
      </div>
    </div>
  );
}
