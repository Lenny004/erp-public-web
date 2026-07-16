import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring cursor-pointer focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "bg-card border-2 border-transparent hover:border-2 hover:border-foreground/70 shadow-xs aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-card/30 dark:hover:bg-card/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        accent: "bg-accent text-accent-foreground hover:opacity-80",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-80",
        primary: "bg-primary text-primary-foreground hover:opacity-80",
        white: "bg-white text-primary hover:opacity-80",
        ghost: "text-foreground hover:bg-muted/60",
      },
      // Forma del botón — `pill` para CTAs tipo marketplace (Airbnb).
      shape: {
        default: "rounded-lg",
        pill: "rounded-full",
      },
      size: {
        default: "h-8 gap-1.5 px-2.5",
        sm: "h-9 gap-1.5 px-3 text-xs",
        lg: "h-12 gap-2 px-6 text-base",
        /** Píldora ancha para barra de búsqueda en móvil. */
        pill: "h-12 gap-2 px-6 font-semibold",
        /** Círculo compacto con icono (segmento “Buscar” en desktop). */
        "pill-icon": "size-12 p-0",
        /** CTA compacto redondeado (cabecera, filtros). */
        "pill-sm": "h-9 gap-1.5 px-5 text-sm",
        icon: "size-10",
        "icon-sm": "size-8 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        action: "h-11 gap-2 rounded-sm px-4 font-bold",
        "icon-round": "size-8",
      },
    },
    compoundVariants: [
      // Los tamaños de icono conservan su radio salvo cuando la forma es píldora.
      { shape: "default", size: "icon", class: "rounded-lg" },
      { shape: "default", size: "icon-round", class: "rounded-full" },
      { shape: "pill", size: "icon", class: "rounded-full" },
      { shape: "pill", size: "icon-sm", class: "rounded-full" },
      { shape: "pill", size: "icon-round", class: "rounded-full" },
      { shape: "pill", size: "action", class: "rounded-full" },
    ],
    defaultVariants: {
      variant: "default",
      shape: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  shape = "default",
  size = "default",
  asChild = false,
  icon,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    icon?: React.ReactNode
  }) {
  const Comp = asChild ? Slot.Root : "button"

  // Con asChild, Slot exige un único hijo React — no insertar icon wrapper.
  if (asChild) {
    return (
      <Comp
        data-slot="button"
        data-variant={variant}
        data-shape={shape}
        data-size={size}
        className={cn(buttonVariants({ variant, shape, size }), className)}
        {...props}
      >
        {children}
      </Comp>
    )
  }

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-shape={shape}
      data-size={size}
      className={cn(buttonVariants({ variant, shape, size }), className)}
      {...props}
    >
      {icon && <span data-icon="inline-start" className="inline-flex items-center">{icon}</span>}
      {children}
    </Comp>
  )
}

export { Button, buttonVariants }
