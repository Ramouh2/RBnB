"use client";

import { useRef, useState } from "react";
import { ArrowRight, Bell, CalendarPlus, CreditCard, Minus, Plus, RefreshCw, Wand2 } from "lucide-react";
import { ElasticSlider } from "@/components/motion/ElasticSlider";
import { MagneticButton } from "@/components/motion/MagneticButton";
import {
  MorphingCommandBar,
  type MorphingCommandBarHandle,
  type RbnbCommand,
} from "@/components/motion/MorphingCommandBar";
import { StatefulSubmitButton, type SubmitStatus } from "@/components/motion/StatefulSubmitButton";
import type { CommandBarMode } from "@/components/motion/command-bar/types";
import { AnimatedPrice } from "@/components/pricing/AnimatedPrice";
import { estimateProPrice } from "@/components/pricing/plans";
import {
  RBNB_COMMAND_BAR_DEFAULTS,
  RBNB_ELASTIC_SLIDER_DEFAULTS,
  RBNB_MAGNETIC_BUTTON_DEFAULTS,
  RBNB_SUBMIT_BUTTON_DEFAULTS,
  type CommandBarConfig,
  type ElasticSliderConfig,
  type MagneticButtonConfig,
  type SubmitButtonConfig,
} from "@/lib/motion/constants";
import { Bench, BenchButton, useBenchConfig } from "../Bench";
import type { ControlSpec } from "../ControlSlider";

const SPRING_CONTROLS = [
  { key: "stiffness", label: "stiffness", min: 50, max: 800, step: 5 },
  { key: "damping", label: "damping", min: 2, max: 60, step: 0.5 },
  { key: "mass", label: "mass", min: 0.2, max: 3, step: 0.05 },
] as const;

const MAGNETIC_CONTROLS: ControlSpec<keyof MagneticButtonConfig>[] = [
  { key: "radius", label: "magnetic radius", min: 0, max: 140, step: 1, unit: "px" },
  { key: "strength", label: "intensity (attraction)", min: 0, max: 1, step: 0.01 },
  { key: "glow", label: "glow", min: 0, max: 1, step: 0.01 },
  { key: "tapScale", label: "scale (tap tactile)", min: 0.8, max: 1, step: 0.01 },
  { key: "squashX", label: "squash X", min: 0.9, max: 1.15, step: 0.005 },
  { key: "squashY", label: "squash Y", min: 0.85, max: 1.1, step: 0.005 },
  ...SPRING_CONTROLS,
];

export function MagneticButtonBench() {
  const { config, set, reset } = useBenchConfig<MagneticButtonConfig>(RBNB_MAGNETIC_BUTTON_DEFAULTS);
  return (
    <Bench
      index={2}
      title="MagneticButton"
      description="CTA magnétique : attraction progressive dans le rayon, reflet radial suivant le curseur, squash & stretch au clic."
      exportName="RBNB_MAGNETIC_BUTTON_DEFAULTS"
      config={config}
      controls={MAGNETIC_CONTROLS}
      onChange={set}
      onReset={reset}
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <MagneticButton size="lg" configOverride={config}>
          Commencer avec RBnB
          <ArrowRight className="size-4" aria-hidden="true" />
        </MagneticButton>
        <MagneticButton size="lg" variant="secondary" configOverride={config}>
          Voir les tarifs
        </MagneticButton>
      </div>
    </Bench>
  );
}

const SUBMIT_CONTROLS: ControlSpec<keyof SubmitButtonConfig>[] = [
  { key: "tapScale", label: "scale (tap)", min: 0.85, max: 1, step: 0.01 },
  { key: "particles", label: "particules", min: 0, max: 24, step: 1 },
  { key: "intensity", label: "intensity (projection)", min: 8, max: 70, step: 1, unit: "px" },
  { key: "shake", label: "amplitude secousse", min: 0, max: 2.5, step: 0.05 },
  ...SPRING_CONTROLS,
];

const STATUSES: SubmitStatus[] = ["idle", "loading", "success", "error"];

export function StatefulSubmitButtonBench() {
  const { config, set, reset } = useBenchConfig<SubmitButtonConfig>(RBNB_SUBMIT_BUTTON_DEFAULTS);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [fullWidth, setFullWidth] = useState(false);

  const simulate = async () => {
    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 1100));
    setStatus(Math.random() > 0.35 ? "success" : "error");
  };

  return (
    <Bench
      index={4}
      title="StatefulSubmitButton"
      description="IDLE → LOADING → SUCCESS → ERROR : morphing de largeur (layout), spinner liquide, coche tracée, particules, secousse."
      exportName="RBNB_SUBMIT_BUTTON_DEFAULTS"
      config={config}
      controls={SUBMIT_CONTROLS}
      onChange={set}
      onReset={reset}
      status={<span className="font-mono uppercase">{status}</span>}
      actions={
        <>
          {STATUSES.map((value) => (
            <BenchButton key={value} active={status === value} onClick={() => setStatus(value)}>
              {value}
            </BenchButton>
          ))}
          <BenchButton active={fullWidth} aria-pressed={fullWidth} onClick={() => setFullWidth((v) => !v)}>
            Pleine largeur
          </BenchButton>
        </>
      }
    >
      <div className="flex w-full max-w-sm justify-center pt-4">
        <StatefulSubmitButton
          type="button"
          status={status}
          fullWidth={fullWidth}
          configOverride={config}
          onClick={() => void simulate()}
          successLabel="Paiement confirmé"
          errorLabel="Réessayer"
          errorMessage="Paiement refusé par la banque."
        >
          <CreditCard className="size-4" aria-hidden="true" />
          Payer 24 €
        </StatefulSubmitButton>
      </div>
    </Bench>
  );
}

const SLIDER_CONTROLS: ControlSpec<keyof ElasticSliderConfig>[] = [
  { key: "maxOverflow", label: "débordement max", min: 0, max: 90, step: 1, unit: "px" },
  { key: "scale", label: "scale (saisie)", min: 0.6, max: 1, step: 0.01 },
  { key: "intensity", label: "intensity (étirement)", min: 0, max: 0.8, step: 0.01 },
  ...SPRING_CONTROLS,
];

export function ElasticSliderBench() {
  const { config, set, reset } = useBenchConfig<ElasticSliderConfig>(RBNB_ELASTIC_SLIDER_DEFAULTS);
  const [listings, setListings] = useState(6);

  return (
    <Bench
      index={6}
      title="ElasticSlider"
      description="Tirez au-delà des bornes : la piste s'étire et résiste (amortissement logarithmique), puis revient élastiquement. Couplé à AnimatedPrice."
      exportName="RBNB_ELASTIC_SLIDER_DEFAULTS"
      config={config}
      controls={SLIDER_CONTROLS}
      onChange={set}
      onReset={reset}
      status={<span className="font-mono tabular-nums">{listings} logements</span>}
    >
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <AnimatedPrice
          value={estimateProPrice(listings, "monthly")}
          className="text-5xl font-semibold tracking-tight text-fg"
          suffix="/mois"
          suffixClassName="text-sm font-normal text-fg-muted"
        />
        <ElasticSlider
          value={listings}
          onChange={setListings}
          min={1}
          max={50}
          label="Nombre de logements"
          formatValue={(v) => `${v} logements`}
          startIcon={<Minus className="size-4" />}
          endIcon={<Plus className="size-4" />}
          configOverride={config}
        />
      </div>
    </Bench>
  );
}

const COMMAND_CONTROLS: ControlSpec<keyof CommandBarConfig>[] = [
  ...SPRING_CONTROLS,
  { key: "duration", label: "duration (notification)", min: 600, max: 6000, step: 100, unit: "ms" },
  { key: "backdrop", label: "voile", min: 0, max: 0.9, step: 0.01 },
];

export function MorphingCommandBarBench() {
  const { config, set, reset } = useBenchConfig<CommandBarConfig>(RBNB_COMMAND_BAR_DEFAULTS);
  const bar = useRef<MorphingCommandBarHandle>(null);
  const [mode, setMode] = useState<CommandBarMode>("compact");
  const counter = useRef(0);

  const commands: RbnbCommand[] = [
    {
      id: "sync",
      label: "Synchroniser les calendriers",
      icon: RefreshCw,
      onSelect: () => new Promise((resolve) => setTimeout(resolve, 1200)),
      successMessage: "Calendriers à jour",
    },
    {
      id: "booking",
      label: "Nouvelle réservation",
      icon: CalendarPlus,
      onSelect: () => new Promise((resolve) => setTimeout(resolve, 600)),
      successMessage: "Brouillon créé",
    },
    { id: "lab", label: "Recalibrer le Motion Lab", icon: Wand2, successMessage: "Constantes RBnB rechargées" },
  ];

  return (
    <Bench
      index={3}
      title="MorphingCommandBar"
      description="Dynamic Island × ⌘K : une enveloppe partagée (layoutId) morphe entre compact, palette ouverte et pilule d'action."
      exportName="RBNB_COMMAND_BAR_DEFAULTS"
      config={config}
      controls={COMMAND_CONTROLS}
      onChange={set}
      onReset={reset}
      previewClassName="p-0"
      status={<span className="font-mono">{mode}</span>}
      actions={
        <>
          <BenchButton active={mode === "compact"} onClick={() => bar.current?.close()}>
            Compact
          </BenchButton>
          <BenchButton active={mode === "open"} onClick={() => bar.current?.open()}>
            Ouvrir
          </BenchButton>
          <BenchButton
            active={mode === "action"}
            onClick={() => {
              counter.current += 1;
              bar.current?.notify({
                id: `n-${counter.current}`,
                title: "Nouvelle réservation RBnB",
                description: "Camille R. · Loft Canal · 2 → 5 oct.",
                tone: "success",
                icon: Bell,
              });
            }}
          >
            Notification
          </BenchButton>
        </>
      }
    >
      <MorphingCommandBar
        ref={bar}
        placement="inline"
        hotkey={false}
        commands={commands}
        configOverride={config}
        onModeChange={setMode}
      />
    </Bench>
  );
}
