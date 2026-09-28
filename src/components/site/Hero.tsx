"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, Sparkles, TrendingUp } from "lucide-react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { SpotlightBentoCard } from "@/components/motion/SpotlightBentoCard";
import { AnimatedPrice } from "@/components/pricing/AnimatedPrice";
import { NoiseBackground } from "@/components/ui/NoiseBackground";

const BARS = [42, 58, 49, 71, 64, 83, 77, 92, 88, 96, 90, 100];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <NoiseBackground className="-z-10" />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-24">
        <Reveal inView={false}>
          <Link
            href="/motion-playground"
            className="group inline-flex items-center gap-2 rounded-full border border-edge bg-surface-1/80 py-1 pl-1 pr-3 text-xs text-fg-secondary shadow-sm transition-tint hover:border-edge-strong hover:text-fg"
          >
            <span className="rounded-full bg-accent/20 px-2 py-0.5 font-medium text-[#c7d2fe]">Nouveau</span>
            Découvrez le Motion Lab RBnB
            <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" aria-hidden="true" />
          </Link>
        </Reveal>

        <Reveal inView={false} delay={0.06}>
          <h1 id="hero-title" className="mt-7 max-w-3xl text-4xl sm:text-6xl">
            Vos logements, pilotés <span className="bg-gradient-to-r from-[#c7d2fe] via-white to-[#a5b4fc] bg-clip-text text-transparent">d&apos;un seul geste.</span>
          </h1>
        </Reveal>

        <Reveal inView={false} delay={0.12}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-secondary sm:text-lg">
            RBnB réunit calendriers, réservations, tarifs et revenus dans une interface d&apos;une fluidité absolue. Pensé pour les hôtes exigeants.
          </p>
        </Reveal>

        <Reveal inView={false} delay={0.18} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <MagneticButton href="/login" size="lg">
            Commencer avec RBnB
            <ArrowRight className="size-4" aria-hidden="true" />
          </MagneticButton>
          <MagneticButton href="/#tarifs" size="lg" variant="secondary">
            Voir les tarifs
          </MagneticButton>
        </Reveal>

        <Reveal inView={false} delay={0.26} className="mt-16 w-full max-w-4xl">
          <SpotlightBentoCard contentClassName="grid gap-4 p-4 text-left sm:grid-cols-3 sm:p-6" configOverride={{ rotation: 3 }}>
            <div className="rounded-xl border border-edge-subtle bg-surface-2/60 p-4 sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-fg-muted">Revenus — 12 derniers mois</span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                  <TrendingUp className="size-3.5" aria-hidden="true" /> +18 %
                </span>
              </div>
              <AnimatedPrice value={48620} className="mt-2 text-3xl font-semibold tracking-tight text-fg" />
              <div className="mt-4 flex h-24 items-end gap-1.5" aria-hidden="true">
                {BARS.map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-accent/30 to-accent/80"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-edge-subtle bg-surface-2/60 p-4">
                <span className="flex items-center gap-2 text-xs font-medium text-fg-muted">
                  <CalendarDays className="size-3.5" aria-hidden="true" /> Taux d&apos;occupation
                </span>
                <AnimatedPrice value={87} currency="%" className="mt-2 text-3xl font-semibold tracking-tight text-fg" />
              </div>
              <div className="rounded-xl border border-edge-subtle bg-surface-2/60 p-4">
                <span className="flex items-center gap-2 text-xs font-medium text-fg-muted">
                  <Sparkles className="size-3.5" aria-hidden="true" /> Note moyenne
                </span>
                <AnimatedPrice value={4.92} fractionDigits={2} currency="★" className="mt-2 text-3xl font-semibold tracking-tight text-fg" />
              </div>
            </div>
          </SpotlightBentoCard>
        </Reveal>
      </div>
    </section>
  );
}
