"use client";

import { useState } from "react";
import { ArrowRight, CalendarDays, TrendingUp, Wallet } from "lucide-react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SpotlightBentoCard, SpotlightBentoGrid } from "@/components/motion/SpotlightBentoCard";
import { ProCard } from "@/components/pricing/ProCard";
import { RBNB_PLANS, planPrice } from "@/components/pricing/plans";
import type { BillingPeriod } from "@/components/pricing/PricingToggle";
import {
  RBNB_PRO_CARD_DEFAULTS,
  RBNB_SPOTLIGHT_DEFAULTS,
  type ProCardConfig,
  type SpotlightConfig,
} from "@/lib/motion/constants";
import { Bench, BenchButton, useBenchConfig } from "../Bench";
import type { ControlSpec } from "../ControlSlider";

const SPOTLIGHT_CONTROLS: ControlSpec<keyof SpotlightConfig>[] = [
  { key: "radius", label: "rayon du spotlight", min: 80, max: 700, step: 10, unit: "px" },
  { key: "glow", label: "glow (bordure)", min: 0, max: 1, step: 0.01 },
  { key: "intensity", label: "intensity (halo)", min: 0, max: 0.4, step: 0.01 },
  { key: "rotation", label: "rotation (tilt max)", min: 0, max: 6, step: 0.1, unit: "°" },
  { key: "depth", label: "profondeur (translateZ)", min: 0, max: 40, step: 1, unit: "px" },
  { key: "stiffness", label: "stiffness", min: 50, max: 800, step: 5 },
  { key: "damping", label: "damping", min: 2, max: 60, step: 0.5 },
  { key: "mass", label: "mass", min: 0.2, max: 3, step: 0.05 },
];

const TILES = [
  { icon: Wallet, label: "Revenus", value: "7 420 €" },
  { icon: CalendarDays, label: "Réservations", value: "34" },
  { icon: TrendingUp, label: "Occupation", value: "87 %" },
];

export function SpotlightBentoBench() {
  const { config, set, reset } = useBenchConfig<SpotlightConfig>(RBNB_SPOTLIGHT_DEFAULTS);
  return (
    <Bench
      index={5}
      title="SpotlightBentoCard"
      description="Spotlight X/Y, bordure illuminée diffusée aux cartes voisines (SpotlightBentoGrid), tilt 3D borné à ±6°."
      exportName="RBNB_SPOTLIGHT_DEFAULTS"
      config={config}
      controls={SPOTLIGHT_CONTROLS}
      onChange={set}
      onReset={reset}
    >
      <SpotlightBentoGrid className="grid w-full max-w-lg grid-cols-2 gap-3 sm:grid-cols-3">
        {TILES.map((tile, index) => (
          <SpotlightBentoCard
            key={tile.label}
            configOverride={config}
            className={index === 0 ? "col-span-2 sm:col-span-1" : undefined}
            contentClassName="flex h-full flex-col gap-6 p-4"
          >
            <tile.icon className="size-4 text-fg-secondary" aria-hidden="true" />
            <div>
              <p className="text-xs text-fg-muted">{tile.label}</p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-fg">{tile.value}</p>
            </div>
          </SpotlightBentoCard>
        ))}
      </SpotlightBentoGrid>
    </Bench>
  );
}

const PRO_CONTROLS: ControlSpec<keyof ProCardConfig>[] = [
  { key: "duration", label: "duration (tour du beam)", min: 1.5, max: 16, step: 0.5, unit: "s" },
  { key: "glow", label: "glow (halo)", min: 0, max: 1, step: 0.01 },
  { key: "intensity", label: "intensity (parallaxe)", min: 0, max: 24, step: 0.5, unit: "px" },
  { key: "lift", label: "élévation", min: 0, max: 16, step: 0.5, unit: "px" },
  { key: "stiffness", label: "stiffness", min: 50, max: 800, step: 5 },
  { key: "damping", label: "damping", min: 2, max: 60, step: 0.5 },
  { key: "mass", label: "mass", min: 0.2, max: 3, step: 0.05 },
];

export function ProCardBench() {
  const { config, set, reset } = useBenchConfig<ProCardConfig>(RBNB_PRO_CARD_DEFAULTS);
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const pro = RBNB_PLANS[1];

  return (
    <Bench
      index={10}
      title="Pro Card"
      description="Border Beam continu (pausé hors viewport), halo atmosphérique, parallaxe interne et icônes réactives au curseur."
      exportName="RBNB_PRO_CARD_DEFAULTS"
      config={config}
      controls={PRO_CONTROLS}
      onChange={set}
      onReset={reset}
      previewClassName="py-12"
      actions={
        <>
          <BenchButton active={period === "monthly"} onClick={() => setPeriod("monthly")}>
            Mensuel
          </BenchButton>
          <BenchButton active={period === "annual"} onClick={() => setPeriod("annual")}>
            Annuel
          </BenchButton>
        </>
      }
    >
      <ProCard
        className="w-full max-w-sm"
        description={pro.description}
        price={planPrice(pro.monthlyPrice, period)}
        features={pro.features}
        billingNote={period === "annual" ? "Facturé annuellement" : "Sans engagement"}
        configOverride={config}
        cta={
          <MagneticButton className="w-full" size="lg">
            Essayer RBnB Pro
            <ArrowRight className="size-4" aria-hidden="true" />
          </MagneticButton>
        }
      />
    </Bench>
  );
}
