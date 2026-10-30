"use client";

/** Formulario público de contacto; no expone datos internos ni requiere sesión. */

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validations/contact";
import { useContact } from "@/hooks/use-contact";
import { useFormValidation } from "@/hooks/use-form-validation";
import { manejarError } from "@/lib/errores";
import { Button } from "@/components/ui/button";
import { Field, messageId } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Campo = keyof ContactFormValues;

const IDS: Record<Campo, string> = {
  name: "contact-name",
  email: "contact-email",
  phone: "contact-phone",
  message: "contact-message",
};

const VACIO: ContactFormValues = { name: "", email: "", phone: "", message: "" };

/**
 * Formulario de contacto con validación Zod (al salir del campo) y mutación useContact.
 * Muestra toast de éxito y resetea campos al enviar; si falla, conserva lo escrito.
 */
export function ContactForm() {
  const { mutateAsync, isPending } = useContact();
  const [values, setValues] = useState<ContactFormValues>(VACIO);
  const getValues = useCallback(() => values, [values]);
  const { errors, setErrors, validarCampo, alCambiar, validarTodo } =
    useFormValidation<Campo, ContactFormValues>(contactFormSchema, getValues);

  function updateField<K extends Campo>(key: K, value: ContactFormValues[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    alCambiar(key, next);
  }

  /** Props comunes de accesibilidad y validación por campo. */
  const control = (campo: Campo) => ({
    id: IDS[campo],
    "aria-invalid": Boolean(errors[campo]),
    "aria-describedby": messageId(IDS[campo]),
    onBlur: () => validarCampo(campo),
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isPending) return;

    const data = validarTodo(IDS);
    if (!data) return;

    try {
      const result = await mutateAsync(data);
      toast.success(result.message);
      setValues(VACIO);
      setErrors({});
    } catch (error) {
      manejarError(error, {
        contexto: "contacto:enviar",
        fallback: "No se pudo enviar el mensaje.",
        onCampos: (campos) =>
          setErrors(
            Object.fromEntries(
              Object.entries(campos).map(([k, v]) => [k, v[0]]),
            ) as Partial<Record<Campo, string>>,
          ),
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"
      aria-label="Formulario de contacto"
    >
      <div className="space-y-1 border-b border-border pb-5">
        <h2 className="text-lg font-semibold text-foreground">Escríbenos</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Te respondemos por correo o teléfono.
        </p>
      </div>

      <Field id={IDS.name} label="Nombre completo" required error={errors.name}>
        <Input
          {...control("name")}
          value={values.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Nombre y apellidos"
          autoComplete="name"
          maxLength={120}
          aria-required
        />
      </Field>

      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
        <Field id={IDS.email} label="Correo electrónico" required error={errors.email}>
          <Input
            {...control("email")}
            type="email"
            inputMode="email"
            value={values.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="nombre@dominio.com"
            autoComplete="email"
            aria-required
          />
        </Field>

        <Field id={IDS.phone} label="Teléfono" optional error={errors.phone}>
          <Input
            {...control("phone")}
            type="tel"
            inputMode="tel"
            value={values.phone ?? ""}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="0000-0000"
            autoComplete="tel"
            maxLength={30}
          />
        </Field>
      </div>

      <Field id={IDS.message} label="Mensaje" required error={errors.message} hint="Mínimo 10 caracteres.">
        <Textarea
          {...control("message")}
          value={values.message}
          onChange={(e) => updateField("message", e.target.value)}
          rows={5}
          placeholder="Fechas, tipo de habitación o tu consulta"
          className="min-h-32 resize-y"
          maxLength={2000}
          aria-required
        />
      </Field>

      <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Al enviar aceptas que usemos tus datos para responder tu consulta.
        </p>
        <Button
          type="submit"
          loading={isPending}
          icon={<Send className="size-4" aria-hidden />}
          size="action"
          className="shrink-0 sm:min-w-44"
        >
          {isPending ? "Enviando…" : "Enviar mensaje"}
        </Button>
      </div>
    </form>
  );
}
