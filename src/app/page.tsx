import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { BookingSearchForm } from "@/components/booking/booking-search-form";
import { Button } from "@/components/ui/button";
import { MapPin, ShieldCheck, Sparkles } from "lucide-react";

/** Beneficios mostrados bajo el pliegue — grid simple, sin tarjetas decorativas. */
const WHY_POINTS = [
  {
    icon: Sparkles,
    title: "Atención personalizada",
    text: "Equipo local que conoce cada detalle de tu estancia.",
  },
  {
    icon: MapPin,
    title: "Ubicación privilegiada",
    text: "A pasos de la playa y de los mejores restaurantes.",
  },
  {
    icon: ShieldCheck,
    title: "Reserva segura",
    text: "Confirmación directa con nuestro hotel, sin intermediarios.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      {/*
        HERO — primera vista: marca, titular, frase, CTAs e imagen full-bleed.
        Scrim inferior/izquierdo para legibilidad; sin badges ni tarjetas flotantes.
      */}
      <section
        className="relative flex min-h-[92svh] flex-col justify-end bg-cover bg-center"
        style={{ backgroundImage: `url(${siteConfig.heroImageUrl})` }}
      >
        <div className="hero-scrim absolute inset-0" aria-hidden />

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-28 sm:px-6 sm:pb-24 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* La marca es la señal principal del viewport; el titular no debe opacarla. */}
          <p className="mb-4 max-w-3xl font-semibold tracking-tight text-primary-foreground text-5xl sm:text-6xl lg:text-7xl">
            {siteConfig.brandName}
          </p>
          <h1 className="max-w-2xl text-xl font-medium tracking-tight text-primary-foreground/95 sm:text-2xl lg:text-3xl">
            Tu escapada frente al mar empieza aquí
          </h1>
          <p className="mt-4 max-w-xl text-base text-primary-foreground/85 sm:text-lg">
            {siteConfig.tagline}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="action" variant="white">
              <Link href="/reservar">Reservar ahora</Link>
            </Button>
            <Button
              asChild
              size="action"
              variant="outline"
              className="border-primary-foreground/50 bg-transparent text-primary-foreground hover:border-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/habitaciones">Ver habitaciones</Link>
            </Button>
          </div>
        </div>
      </section>

      {/*
        SECCIÓN 2 — búsqueda rápida bajo el pliegue (tarjeta funcional con formulario).
      */}
      <section className="border-b border-border bg-background py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 space-y-2 text-center sm:text-left">
            <h2 className="text-2xl font-semibold text-foreground">
              Planifica tu estadía
            </h2>
            <p className="text-muted-foreground">
              Elige fechas y huéspedes para continuar con la reserva.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <BookingSearchForm />
          </div>
        </div>
      </section>

      {/*
        SECCIÓN 3 — razones para reservar: grid limpio, sin clutter de tarjetas.
      */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-10 text-center text-2xl font-semibold text-foreground sm:text-left">
            Por qué reservar con nosotros
          </h2>

          <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {WHY_POINTS.map(({ icon: Icon, title, text }, index) => (
              <div
                key={title}
                className="space-y-3 text-center sm:text-left animate-in fade-in duration-500"
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                <div className="mx-auto flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary sm:mx-0">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
