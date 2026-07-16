import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { ContactForm } from "@/components/contact/contact-form";

/** Layout de contacto: formulario + datos estáticos del hotel. */
export function ContactoContent() {
  return (
    <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
      <div className="lg:col-span-3">
        <ContactForm />
      </div>

      <aside className="space-y-6 lg:col-span-2">
        <h2 className="text-lg font-semibold text-foreground">
          Información directa
        </h2>

        <ul className="space-y-4 text-sm">
          <li className="flex gap-3">
            <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <span className="text-muted-foreground">{siteConfig.contactAddress}</span>
          </li>
          <li className="flex gap-3">
            <Phone className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <a
              href={`tel:${siteConfig.contactPhone.replace(/\s/g, "")}`}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              {siteConfig.contactPhone}
            </a>
          </li>
          <li className="flex gap-3">
            <Mail className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              {siteConfig.contactEmail}
            </a>
          </li>
        </ul>
      </aside>
    </div>
  );
}
