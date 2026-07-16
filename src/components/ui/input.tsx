import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onRightIconClick?: () => void
}

function Input({ className, type, leftIcon, rightIcon, onRightIconClick, ...props }: InputProps) {
  // Anillos de foco suaves para formularios sobre fondo blanco (marketplace).
  const base =
    "h-11 w-full min-w-0 rounded-md border border-input bg-card px-3 py-1 text-sm text-foreground shadow-sm transition-colors outline-hidden placeholder:text-muted-foreground/60 focus-visible:border-foreground/15 focus-visible:ring-1 focus-visible:ring-foreground/10 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/15"

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
