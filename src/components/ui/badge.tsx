import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap border font-semibold transition-colors [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        danger:
          "border-transparent bg-destructive text-destructive-foreground",
        success: "border-transparent bg-lime-300/80 text-primary",
        warning:
          "border-transparent bg-secondary/25 text-accent",
        info: "border-transparent bg-sky-500/12 text-sky-900 dark:bg-sky-500/20 dark:text-sky-200",
        neutral:
          "border-transparent bg-slate-500/10 text-slate-700 dark:bg-slate-400/15 dark:text-slate-300",
      },
      size: {
        default: "rounded-full px-2.5 py-1 text-xs",
        sm: "rounded-md px-1.5 py-0.5 text-sm font-medium leading-tight",
        md: "rounded-full px-2.5 py-1 text-xs",
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
