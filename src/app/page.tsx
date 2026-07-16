import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { BookingSearchForm } from "@/components/booking/booking-search-form";
import { FeaturedRooms } from "@/components/home/featured-rooms";
import { Button } from "@/components/ui/button";
import { MapPin, ShieldCheck, Sparkles } from "lucide-react";

/** Beneficios bajo el pliegue — grid simple, sin tarjetas decorativas. */
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
        SECCIÓN 1 — HERO (primera vista)
        Composición única: marca dominante, titular, apoyo, CTAs e imagen full-bleed.
        Sin tarjetas, badges ni overlays sobre la fotografía (solo scrim de legibilidad).
      */}
      <section
        className="relative flex min-h-[92svh] w-full flex-col justify-end bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${siteConfig.heroImageUrl})` }}
      >
        {/* Degradado suave — no es un badge; solo mejora contraste del texto */}
        <div className="hero-scrim absolute inset-0" aria-hidden />

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-8 sm:pb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* La marca es la señal principal del viewport */}
          <p className="max-w-4xl font-semibold tracking-tight text-white text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">
            {siteConfig.brandName}
          </p>

          {/* Un solo titular editorial */}
          <h1 className="mt-5 max-w-2xl text-xl font-medium tracking-tight text-white/95 sm:text-2xl lg:text-3xl">
            Descubre una estadía memorable frente al mar
          </h1>

          {/* Una sola frase de apoyo */}
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
            {siteConfig.tagline}
          </p>

          {/* Un grupo de CTA — primario + secundario */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              shape="pill"
              className="h-12 px-8 text-base font-semibold shadow-lg"
            >
              <Link href="/reservar">Reservar ahora</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/60 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm hover:border-white hover:bg-white/20"
            >
              <Link href="/habitaciones">Explorar habitaciones</Link>
            </Button>
          </div>
        </div>
      </section>

      {/*
        SECCIÓN 2 — BÚSQUEDA (bajo el pliegue)
        Barra tipo píldora que envuelve BookingSearchForm; sin competir con el hero.
      */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="mb-8 space-y-2 text-center sm:text-left">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              ¿Cuándo te hospedas?
            </h2>
            <p className="text-neutral-600">
              Indica fechas y huéspedes para ver disponibilidad al instante.
            </p>
          </div>

          {/* Shell redondeado estilo Airbnb — sombra suave, sin borde duro */}
          <div className="rounded-[2rem] border border-neutral-200/80 bg-white p-5 shadow-[0_8px_28px_rgba(0,0,0,0.08)] sm:rounded-full sm:p-3 sm:pl-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <BookingSearchForm submitLabel="Buscar" />
          </div>
        </div>
      </section>

      {/*
        SECCIÓN 3 — HABITACIONES DESTACADAS
        Grid interactivo con hasta 6 habitaciones (client component).
      */}
      <section className="bg-neutral-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <FeaturedRooms />
        </div>
      </section>

      {/*
        SECCIÓN 4 — POR QUÉ RESERVAR
        Grid limpio de tres puntos; iconos discretos, sin clutter de tarjetas.
      */}
      <section className="border-t border-neutral-200/80 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight text-neutral-900 sm:text-left sm:text-3xl">
            Por qué reservar con nosotros
          </h2>

          <div className="grid gap-12 sm:grid-cols-3 sm:gap-10">
            {WHY_POINTS.map(({ icon: Icon, title, text }, index) => (
              <div
                key={title}
                className="space-y-4 text-center sm:text-left animate-in fade-in duration-500"
                style={{ animationDelay: `${250 + index * 100}ms` }}
              >
                {/* Icono en círculo neutro — sin verdes ni acentos saturados */}
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-800 sm:mx-0">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
                <p className="text-sm leading-relaxed text-neutral-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
