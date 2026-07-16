import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap border font-medium transition-colors [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        /** Chip de tipo de habitación — tono neutro y discreto. */
        secondary:
          "border-border/40 bg-foreground/[0.04] text-muted-foreground",
        danger:
          "border-transparent bg-destructive text-destructive-foreground",
        success: "border-transparent bg-lime-300/80 text-primary",
        warning:
          "border-transparent bg-secondary/25 text-accent",
        info: "border-transparent bg-sky-500/12 text-sky-900 dark:bg-sky-500/20 dark:text-sky-200",
        neutral:
          "border-border/40 bg-muted/40 text-muted-foreground",
      },
      size: {
        default: "rounded-full px-2.5 py-0.5 text-[11px] tracking-wide",
        sm: "rounded-md px-1.5 py-0.5 text-xs leading-tight",
        md: "rounded-full px-2.5 py-0.5 text-[11px] tracking-wide",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

function Badge({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
