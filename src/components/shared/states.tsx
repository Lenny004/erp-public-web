/** Estados de sección: vacío / sin resultados y error con "Reintentar". El resto de la pantalla sigue funcionando. */

import * as React from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Acción principal (p. ej. "Ver habitaciones", "Limpiar filtros"). */
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "mx-auto flex max-w-md flex-col items-center gap-(--space-3) rounded-2xl border border-dashed border-border bg-muted/30 px-(--space-5) py-(--space-7) text-center",
        className,
      )}
    >
      {icon && (
        <div
          aria-hidden="true"
          className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-6"
        >
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

interface ErrorStateProps {
  title?: React.ReactNode;
  message?: React.ReactNode;
  onRetry?: () => void;
  /** Deshabilita "Reintentar" mientras se vuelve a consultar. */
  retrying?: boolean;
  className?: string;
}

export function ErrorState({
  title = "No pudimos cargar esta sección",
  message,
  onRetry,
  retrying = false,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "mx-auto flex max-w-lg flex-col items-center gap-(--space-3) rounded-2xl border border-destructive/20 bg-destructive/5 px-(--space-5) py-(--space-7) text-center",
        className,
      )}
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {message && <p className="text-sm leading-relaxed text-muted-foreground">{message}</p>}
      </div>
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          className="mt-(--space-2)"
          loading={retrying}
          icon={<RefreshCw className="size-4" aria-hidden />}
          onClick={onRetry}
        >
          {retrying ? "Reintentando…" : "Reintentar"}
        </Button>
      )}
    </div>
  );
}
