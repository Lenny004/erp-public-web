"use client";

/** Calendario de la interfaz. La navegación usa botones, sin listas nativas del navegador. */

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import "react-day-picker/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <div className="day-picker-scope">
      <DayPicker
        showOutsideDays={showOutsideDays}
        locale={es}
        className={cn("p-3", className)}
        classNames={{
          root: cn("w-fit", classNames?.root),
          months: cn("relative flex flex-col", classNames?.months),
          month: cn("flex flex-col gap-3", classNames?.month),
          month_caption: cn(
            "relative flex h-9 items-center justify-center px-9",
            classNames?.month_caption,
          ),
          caption_label: cn(
            "text-sm font-semibold text-foreground capitalize",
            classNames?.caption_label,
          ),
          nav: cn(
            "absolute inset-x-0 top-0 z-10 flex items-center justify-between",
            classNames?.nav,
          ),
          button_previous: cn(
            buttonVariants({ variant: "ghost", size: "icon-sm" }),
            "size-8 bg-transparent p-0 text-foreground",
            classNames?.button_previous,
          ),
          button_next: cn(
            buttonVariants({ variant: "ghost", size: "icon-sm" }),
            "size-8 bg-transparent p-0 text-foreground",
            classNames?.button_next,
          ),
          month_grid: cn("w-full border-collapse", classNames?.month_grid),
          weekdays: cn("flex", classNames?.weekdays),
          weekday: cn(
            "flex-1 text-center text-xs font-medium text-muted-foreground",
            classNames?.weekday,
          ),
          week: cn("mt-1 flex w-full", classNames?.week),
          day: cn(
            "relative flex size-9 flex-1 items-center justify-center p-0 text-center text-sm",
            classNames?.day,
          ),
          day_button: cn(
            buttonVariants({ variant: "ghost", size: "icon-sm" }),
            "size-9 rounded-md border-transparent bg-transparent p-0 font-medium text-foreground shadow-none hover:bg-accent hover:text-accent-foreground",
            classNames?.day_button,
          ),
          selected: cn(
            "rounded-md bg-primary text-primary-foreground",
            "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
            classNames?.selected,
          ),
          today: cn(
            "rounded-md bg-secondary text-secondary-foreground",
            "data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground",
            classNames?.today,
          ),
          outside: cn("text-muted-foreground opacity-60", classNames?.outside),
          disabled: cn("text-muted-foreground opacity-40", classNames?.disabled),
          hidden: cn("invisible", classNames?.hidden),
          ...classNames,
        }}
        components={{
          Chevron: ({ orientation, className: iconClass }) => {
            const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
            return <Icon className={cn("size-4", iconClass)} />;
          },
        }}
        {...props}
        captionLayout="label"
      />
    </div>
  );
}

export { Calendar };
