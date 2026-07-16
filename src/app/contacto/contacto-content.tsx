import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { ContactForm } from "@/components/contact/contact-form";

/** Datos de contacto estáticos con icono y enlace cuando aplica. */
function ContactDetail({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-primary">
        <Icon className="size-4" aria-hidden />
      </div>
      <div className="min-w-0 space-y-0.5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="text-sm leading-relaxed text-foreground">{children}</div>
      </div>
    </li>
  );
}

/**
 * Layout de contacto en dos columnas (desktop):
 * información directa a la izquierda y formulario a la derecha.
 */
export function ContactoContent() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14 xl:gap-16">
      {/* Columna izquierda — datos del hotel y horario */}
      <aside className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Información directa
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            También puedes comunicarte por teléfono o correo durante horario de
            atención.
          </p>
        </div>

        <ul className="space-y-5">
          <ContactDetail icon={MapPin} label="Dirección">
            <span>{siteConfig.contactAddress}</span>
          </ContactDetail>

          <ContactDetail icon={Phone} label="Teléfono">
            <a
              href={`tel:${siteConfig.contactPhone.replace(/\s/g, "")}`}
              className="transition-colors hover:text-primary"
            >
              {siteConfig.contactPhone}
            </a>
          </ContactDetail>

          <ContactDetail icon={Mail} label="Correo">
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="break-all transition-colors hover:text-primary"
            >
              {siteConfig.contactEmail}
            </a>
          </ContactDetail>

          <ContactDetail icon={Clock} label="Horario de atención">
            <span>Lunes a domingo · 8:00 – 20:00</span>
          </ContactDetail>
        </ul>

        <p className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          Para reservas urgentes, te recomendamos llamar directamente. El formulario
          recibe respuesta en un plazo de 24 horas hábiles.
        </p>
      </aside>

      {/* Columna derecha — formulario */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <ContactForm />
      </div>
    </div>
  );
}
