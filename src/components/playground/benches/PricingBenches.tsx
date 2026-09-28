"use client";

import { useState } from "react";
import { AnimatedPrice } from "@/components/pricing/AnimatedPrice";
import { PricingToggle, type BillingPeriod } from "@/components/pricing/PricingToggle";
import { planPrice } from "@/components/pricing/plans";
import {
  RBNB_ANIMATED_PRICE_DEFAULTS,
  RBNB_DISCOUNT_BADGE_DEFAULTS,
  RBNB_PRICING_TOGGLE_DEFAULTS,
  type AnimatedPriceConfig,
} from "@/lib/motion/constants";
import { Bench, BenchButton, useBenchConfig } from "../Bench";
import type { ControlSpec } from "../ControlSlider";

interface ToggleBenchConfig {
  stiffness: number;
  damping: number;
  mass: number;
  scale: number;
  badgeStiffness: number;
  badgeDamping: number;
  badgeScale: number;
  glow: number;
}

const TOGGLE_DEFAULTS: ToggleBenchConfig = {
  ...RBNB_PRICING_TOGGLE_DEFAULTS,
  badgeStiffness: RBNB_DISCOUNT_BADGE_DEFAULTS.stiffness,
  badgeDamping: RBNB_DISCOUNT_BADGE_DEFAULTS.damping,
  badgeScale: RBNB_DISCOUNT_BADGE_DEFAULTS.scale,
  glow: RBNB_DISCOUNT_BADGE_DEFAULTS.glow,
};

const TOGGLE_CONTROLS: ControlSpec<keyof ToggleBenchConfig>[] = [
  { key: "stiffness", label: "pilule · stiffness", min: 50, max: 800, step: 5 },
  { key: "damping", label: "pilule · damping", min: 2, max: 60, step: 0.5 },
  { key: "mass", label: "pilule · mass (inertie)", min: 0.2, max: 3, step: 0.05 },
  { key: "scale", label: "pilule · scale (stretch)", min: 0, max: 0.4, step: 0.01 },
  { key: "badgeStiffness", label: "badge · stiffness", min: 50, max: 800, step: 5 },
  { key: "badgeDamping", label: "badge · damping", min: 2, max: 60, step: 0.5 },
  { key: "badgeScale", label: "badge · scale (rebond)", min: 1, max: 1.8, step: 0.01 },
  { key: "glow", label: "badge · glow (onde)", min: 0, max: 1, step: 0.01 },
];

export function PricingToggleBench() {
  const { config, set, reset } = useBenchConfig<ToggleBenchConfig>(TOGGLE_DEFAULTS);
  const [period, setPeriod] = useState<BillingPeriod>("monthly");

  return (
    <Bench
      index={8}
      title="Pricing Toggle + Badge -20 %"
      description="Pilule layoutId avec inertie et squash & stretch ; badge à rebond élastique et onde lumineuse, positionné en absolu (CLS = 0)."
      exportName="RBNB_PRICING_TOGGLE_BENCH"
      config={config}
      controls={TOGGLE_CONTROLS}
      onChange={set}
      onReset={reset}
      status={<span className="font-mono">{period}</span>}
    >
      <div className="flex flex-col items-center gap-8">
        <PricingToggle
          value={period}
          onChange={setPeriod}
          configOverride={{ stiffness: config.stiffness, damping: config.damping, mass: config.mass, scale: config.scale }}
          badgeConfigOverride={{
            stiffness: config.badgeStiffness,
            damping: config.badgeDamping,
            scale: config.badgeScale,
            glow: config.glow,
          }}
        />
        <AnimatedPrice
          value={planPrice(30, period)}
          className="text-4xl font-semibold tracking-tight text-fg"
          suffix="/mois"
          suffixClassName="text-sm font-normal text-fg-muted"
        />
      </div>
    </Bench>
  );
}

const PRICE_CONTROLS: ControlSpec<keyof AnimatedPriceConfig>[] = [
  { key: "stiffness", label: "stiffness", min: 50, max: 800, step: 5 },
  { key: "damping", label: "damping", min: 2, max: 60, step: 0.5 },
  { key: "mass", label: "mass", min: 0.2, max: 3, step: 0.05 },
  { key: "blur", label: "blur max (vertical)", min: 0, max: 8, step: 0.1, unit: "px" },
  { key: "intensity", label: "intensity (flou / vitesse)", min: 0, max: 0.3, step: 0.005 },
];

export function AnimatedPriceBench() {
  const { config, set, reset } = useBenchConfig<AnimatedPriceConfig>(RBNB_ANIMATED_PRICE_DEFAULTS);
  const [value, setValue] = useState(1290);

  const adjust = (delta: number) => setValue((current) => Math.max(0, current + delta));

  return (
    <Bench
      index={9}
      title="AnimatedPrice"
      description="Compteur mécanique : chaque chiffre roule dans sa colonne avec un flou vertical proportionnel à sa vitesse. tabular-nums."
      exportName="RBNB_ANIMATED_PRICE_DEFAULTS"
      config={config}
      controls={PRICE_CONTROLS}
      onChange={set}
      onReset={reset}
      actions={
        <>
          <BenchButton onClick={() => adjust(-100)}>−100</BenchButton>
          <BenchButton onClick={() => adjust(-1)}>−1</BenchButton>
          <BenchButton onClick={() => adjust(1)}>+1</BenchButton>
          <BenchButton onClick={() => adjust(100)}>+100</BenchButton>
          <BenchButton onClick={() => setValue(Math.round(Math.random() * 99_999))}>Aléatoire</BenchButton>
        </>
      }
    >
      <AnimatedPrice
        value={value}
        className="text-6xl font-semibold tracking-tight text-fg sm:text-7xl"
        configOverride={config}
      />
    </Bench>
  );
}
