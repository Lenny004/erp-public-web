"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validations/contact";
import { useContact } from "@/hooks/use-contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * Formulario de contacto con validación Zod y mutación useContact.
 * Muestra toast de éxito y resetea campos al enviar.
 */
export function ContactForm() {
  const { mutateAsync, isPending } = useContact();
  const [values, setValues] = useState<ContactFormValues>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});

  function updateField<K extends keyof ContactFormValues>(
    key: K,
    value: ContactFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Limpia el error del campo al editar para feedback inmediato
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});

    const parsed = contactFormSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof ContactFormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactFormValues;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      const result = await mutateAsync(parsed.data);
      toast.success(result.message);
      setValues({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo enviar el mensaje",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"
      aria-label="Formulario de contacto"
    >
      <div className="space-y-1 border-b border-border pb-5">
        <h2 className="text-lg font-semibold text-foreground">Escríbenos</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Completa el formulario y nuestro equipo se pondrá en contacto contigo.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-name">Nombre completo</Label>
        <Input
          id="contact-name"
          value={values.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Ej. María González"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-email">Correo electrónico</Label>
          <Input
            id="contact-email"
            type="email"
            value={values.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="tu@correo.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-phone">
            Teléfono
            <span className="ml-1 font-normal text-muted-foreground">(opcional)</span>
          </Label>
          <Input
            id="contact-phone"
            type="tel"
            value={values.phone ?? ""}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+503 0000-0000"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Mensaje</Label>
        <Textarea
          id="contact-message"
          value={values.message}
          onChange={(e) => updateField("message", e.target.value)}
          rows={5}
          placeholder="Cuéntanos sobre tu consulta, fechas de interés o tipo de habitación…"
          className="min-h-32 resize-y"
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Al enviar aceptas que usemos tus datos para responder tu consulta.
        </p>
        <Button type="submit" disabled={isPending} size="action" className="shrink-0">
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Enviando…
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden />
              Enviar mensaje
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
