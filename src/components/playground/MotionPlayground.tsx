"use client";

import { useEffect } from "react";
import { Accessibility } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SegmentedControl } from "@/components/motion/SegmentedControl";
import { NoiseBackground } from "@/components/ui/NoiseBackground";
import {
  setReducedMotionOverride,
  useReducedMotion,
  useReducedMotionOverride,
  useSystemReducedMotion,
  type ReducedMotionOverride,
} from "@/hooks/useReducedMotion";
import {
  AnimatedPriceBench,
  ElasticSliderBench,
  LiquidAuthInputBench,
  LiquidLoginBench,
  MagneticButtonBench,
  MorphingCommandBarBench,
  PricingToggleBench,
  ProCardBench,
  SpotlightBentoBench,
  StatefulSubmitButtonBench,
} from "./benches";

/** Laboratoire de calibration en direct du Motion System RBnB (10 bancs d'essai). */
export function MotionPlayground() {
  const override = useReducedMotionOverride();
  const system = useSystemReducedMotion();
  const reduced = useReducedMotion();

  // L'override n'a de sens que dans le laboratoire : on revient au réglage système en le quittant.
  useEffect(() => () => setReducedMotionOverride("system"), []);

  return (
    <main className="flex-1">
      <section className="relative isolate overflow-hidden border-b border-edge-subtle">
        <NoiseBackground className="-z-10" />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
          <Reveal inView={false} className="max-w-2xl">
            <span className="rounded-full border border-edge bg-surface-1 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-fg-secondary">
              Motion Lab
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl">Le laboratoire du Motion System RBnB</h1>
            <p className="mt-4 text-base leading-relaxed text-fg-secondary">
              Calibrez en direct chaque ressort, rayon et intensité. <strong className="font-medium text-fg">Reset defaults</strong>{" "}
              restaure les constantes optimales de RBnB, <strong className="font-medium text-fg">Copy config</strong> exporte l&apos;objet
              TypeScript exact.
            </p>
          </Reveal>

          <Reveal inView={false} delay={0.1} className="flex flex-col gap-3 rounded-2xl border border-edge bg-surface-1/80 p-4">
            <span className="flex items-center gap-2 text-xs font-medium text-fg-secondary">
              <Accessibility className="size-4" aria-hidden="true" />
              prefers-reduced-motion
            </span>
            <SegmentedControl<ReducedMotionOverride>
              label="Mode de mouvement du Motion Lab"
              size="sm"
              value={override}
              onChange={setReducedMotionOverride}
              options={[
                { value: "system", label: `Système (${system ? "réduit" : "complet"})` },
                { value: "reduce", label: "Réduit" },
                { value: "full", label: "Complet" },
              ]}
            />
            <span className="text-xs text-fg-muted">
              Mode actif : <span className="font-medium text-fg">{reduced ? "mouvements réduits" : "physique complète"}</span>
            </span>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <LiquidAuthInputBench />
        <MagneticButtonBench />
        <MorphingCommandBarBench />
        <StatefulSubmitButtonBench />
        <SpotlightBentoBench />
        <ElasticSliderBench />
        <LiquidLoginBench />
        <PricingToggleBench />
        <AnimatedPriceBench />
        <ProCardBench />
      </div>
    </main>
  );
}
