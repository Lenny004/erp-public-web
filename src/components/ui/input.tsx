import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  /** Icono decorativo situado al inicio del campo. */
  leftIcon?: React.ReactNode
  /** Icono situado al final del campo, opcionalmente interactivo. */
  rightIcon?: React.ReactNode
  /** Acción ejecutada al pulsar el icono derecho, si se proporciona. */
  onRightIconClick?: () => void
}

/** Campo base que admite iconos superpuestos sin cambiar la API nativa de input. */
function Input({ className, type, leftIcon, rightIcon, onRightIconClick, ...props }: InputProps) {
  // Foco: cambia color de borde + anillo (box-shadow); nunca el grosor ni el tamaño.
  const base =
    "h-(--control-height) w-full min-w-0 rounded-md border border-input bg-card px-3 py-1 text-base text-foreground shadow-sm transition-[border-color,box-shadow] duration-(--duration-fast) outline-hidden placeholder:text-muted-foreground sm:text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-(--focus-ring) disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70 aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/20"

  if (leftIcon || rightIcon) {
    return (
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 flex items-center text-muted-foreground">
            {leftIcon}
          </span>
        )}
        <input
          type={type}
          data-slot="input"
          className={cn(base, leftIcon && "pl-10", rightIcon && "pr-10", className)}
          {...props}
        />
        {rightIcon && (
          <span
            className={cn("absolute right-3 flex items-center text-muted-foreground", onRightIconClick && "cursor-pointer")}
            onClick={onRightIconClick}
          >
            {rightIcon}
          </span>
        )}
      </div>
    )
  }

  return <input type={type} data-slot="input" className={cn(base, className)} {...props} />
}

export { Input }
