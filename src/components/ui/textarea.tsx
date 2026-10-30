import * as React from "react"

import { cn } from "@/lib/utils"

/** Área de texto base con estilos de formulario y soporte para estados nativos. */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-20 w-full resize-y rounded-md border border-input bg-card px-3 py-2 text-base text-foreground shadow-sm transition-[border-color,box-shadow] duration-(--duration-fast) outline-none placeholder:text-muted-foreground sm:text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-(--focus-ring) disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70 aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
