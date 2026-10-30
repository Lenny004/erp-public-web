import * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldProps {
  /** id del control; genera `${id}-message` para `aria-describedby`. */
  id: string;
  label: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  /** Texto de ayuda (se reemplaza por el error cuando existe). */
  hint?: React.ReactNode;
  error?: string;
  className?: string;
  /** El control debe usar `id`, `aria-describedby={messageId(id)}` y `aria-invalid`. */
  children: React.ReactNode;
}

/** id del mensaje asociado a un campo, para `aria-describedby`. */
export const messageId = (id: string) => `${id}-message`;

/**
 * Campo de formulario: label fijo arriba a la izquierda, control y mensaje de ayuda/error
 * con altura reservada (un error no empuja los demás campos).
 */
export function Field({ id, label, required, optional, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn("field", error && "field--error", className)}>
      <Label htmlFor={id} className="field__label">
        <span>
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-destructive">
              *
            </span>
          )}
          {optional && <span className="ml-1 font-normal text-muted-foreground">(opcional)</span>}
        </span>
      </Label>
      {children}
      <p
        id={messageId(id)}
        className={cn("field__message", error && "field__message--error")}
        role={error ? "alert" : undefined}
      >
        {error ?? hint}
      </p>
    </div>
  );
}
