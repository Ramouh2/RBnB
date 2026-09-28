"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useMousePosition } from "@/hooks/useMousePosition";
import { usePointerFine } from "@/hooks/usePointerFine";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  RBNB_PRO_CARD_DEFAULTS,
  RBNB_REDUCED_TRANSITION,
  toSpring,
  withOverride,
  type AnimatedPriceConfig,
  type ProCardConfig,
} from "@/lib/motion/constants";
import { cn } from "@/lib/utils";
import { AnimatedPrice } from "./AnimatedPrice";

export interface ProCardFeature {
  icon: LucideIcon;
  label: string;
}

export interface ProCardProps {
  name?: string;
  description: string;
  price: number;
  period?: string;
  billingNote?: ReactNode;
  highlight?: string;
  features: ProCardFeature[];
  cta: ReactNode;
  className?: string;
  configOverride?: Partial<ProCardConfig>;
  priceConfigOverride?: Partial<AnimatedPriceConfig>;
}

/**
 * Carte principale « RBnB Pro ».
 * Border Beam : conic-gradient en rotation (transform GPU) mis en pause hors viewport et en reduced motion.
 * Survol : élévation, halo atmosphérique, parallaxe interne multicouche, icônes réactives au curseur.
 */
export function ProCard({
  name = "RBnB Pro",
  description,
  price,
  period = "/mois",
  billingNote,
  highlight = "Le plus populaire",
  features,
  cta,
  className,
  configOverride,
  priceConfigOverride,
}: ProCardProps) {
  const config = withOverride(RBNB_PRO_CARD_DEFAULTS, configOverride);
  const reduced = useReducedMotion();
  const pointerFine = usePointerFine();
  const interactive = pointerFine && !reduced;

  const cardRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(cardRef, { margin: "80px" });
  const pointer = useMousePosition(cardRef, { enabled: interactive });

  const spring = toSpring(config);
  const px = useSpring(pointer.nx, spring);
  const py = useSpring(pointer.ny, spring);
  const hover = useSpring(pointer.inside, { stiffness: 220, damping: 26, mass: 0.7 });

  const lift = useTransform(hover, (h) => -h * config.lift);
  const glowOpacity = useTransform(hover, (h) => config.glow * (0.55 + h * 0.45));

  // Border Beam : rotation continue uniquement quand la carte est visible.
  const rotate = useMotionValue(0);
  useEffect(() => {
    if (!inView || reduced) return;
    const from = rotate.get() % 360;
    const controls = animate(rotate, [from, from + 360], {
      duration: config.duration,
      ease: "linear",
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [inView, reduced, config.duration, rotate]);

  return (
    <motion.div
      ref={cardRef}
      className={cn("relative isolate", className)}
      style={interactive ? { y: lift } : undefined}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={reduced ? RBNB_REDUCED_TRANSITION : spring}
    >
      {/* Halo atmosphérique */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem]"
        style={{
          opacity: glowOpacity,
          background: "radial-gradient(60% 55% at 50% 30%, rgba(99,102,241,0.45), rgba(99,102,241,0.08) 55%, transparent 75%)",
        }}
      />

      {/* Cadre : faisceau lumineux sur la bordure */}
      <div className="relative overflow-hidden rounded-2xl bg-edge p-px shadow-lg">
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 aspect-square w-[260%] -translate-x-1/2 -translate-y-1/2"
          style={{
            rotate,
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 240deg, rgba(99,102,241,0.15) 285deg, #818cf8 330deg, #ffffff 350deg, transparent 360deg)",
          }}
        />

        <div className="relative flex h-full flex-col gap-6 rounded-[calc(var(--radius-2xl)-1px)] bg-surface-1 p-6 sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: "radial-gradient(80% 50% at 50% 0%, rgba(99,102,241,0.14), transparent 70%)" }}
          />

          <ParallaxLayer px={px} py={py} depth={0.35} intensity={config.intensity} enabled={interactive}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg">{name}</h3>
              <span className="rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 text-[11px] font-medium text-[#c7d2fe]">
                {highlight}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-fg-secondary">{description}</p>
          </ParallaxLayer>

          <ParallaxLayer px={px} py={py} depth={0.7} intensity={config.intensity} enabled={interactive}>
            <div className="flex items-end gap-2">
              <AnimatedPrice
                value={price}
                className="text-5xl font-semibold tracking-tight text-fg"
                suffix={period}
                suffixClassName="text-sm font-normal text-fg-muted"
                srLabel={(formatted) => `${name} : ${formatted} ${period}`}
                configOverride={priceConfigOverride}
              />
            </div>
            <div className="mt-2 h-5 text-xs text-fg-muted">{billingNote}</div>
          </ParallaxLayer>

          <ul className="relative flex flex-col gap-3">
            {features.map((feature, index) => (
              <FeatureRow key={feature.label} feature={feature} index={index} px={px} py={py} enabled={interactive} />
            ))}
          </ul>

          <div className="relative mt-auto">{cta}</div>
        </div>
      </div>
    </motion.div>
  );
}

interface ParallaxLayerProps {
  px: MotionValue<number>;
  py: MotionValue<number>;
  depth: number;
  intensity: number;
  enabled: boolean;
  children: ReactNode;
}

function ParallaxLayer({ px, py, depth, intensity, enabled, children }: ParallaxLayerProps) {
  const x = useTransform(px, (v) => v * intensity * depth);
  const y = useTransform(py, (v) => v * intensity * depth * 0.6);
  return (
    <motion.div className="relative" style={enabled ? { x, y } : undefined}>
      {children}
    </motion.div>
  );
}

interface FeatureRowProps {
  feature: ProCardFeature;
  index: number;
  px: MotionValue<number>;
  py: MotionValue<number>;
  enabled: boolean;
}

function FeatureRow({ feature, index, px, py, enabled }: FeatureRowProps) {
  const Icon = feature.icon;
  const factor = 1 + (index % 3) * 0.35;
  const x = useTransform(px, (v) => v * 2.5 * factor);
  const y = useTransform(py, (v) => v * 2.5 * factor);
  const rotate = useTransform(px, (v) => v * 8 * factor);

  return (
    <li className="flex items-center gap-3 text-sm text-fg-secondary">
      <motion.span
        className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-[#a5b4fc]"
        style={enabled ? { x, y, rotate } : undefined}
      >
        <Icon className="size-3.5" aria-hidden="true" />
      </motion.span>
      {feature.label}
    </li>
  );
}
