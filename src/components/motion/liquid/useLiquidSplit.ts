"use client";

import { useEffect } from "react";
import { animate, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { RBNB_REDUCED_TRANSITION, toSpring, type LiquidConfig } from "@/lib/motion/constants";
import { clamp } from "@/lib/utils";
import { LIQUID_BAR_HEIGHT } from "./geometry";

export interface LiquidSplit {
  /** 0 = barre unique → 1 = deux barres séparées. */
  split: MotionValue<number>;
  /** Opacité de la rangée inférieure (fondu en place en mode réduit). */
  reveal: MotionValue<number>;
  /** Translation verticale de la rangée inférieure (px). */
  lowerY: MotionValue<number>;
  /** Anime la séparation (ressort liquide k 55 / damping 11) et résout à la fin. */
  animateSplit: (target: 0 | 1) => Promise<void>;
}

/**
 * Pilote la cinématique de séparation liquide. Avec `expanded` défini, la séparation suit la prop ;
 * sans, le parent orchestre via `animateSplit` (LiquidLogin).
 */
export function useLiquidSplit(config: LiquidConfig, reduced: boolean, expanded?: boolean): LiquidSplit {
  const split = useMotionValue(expanded ? 1 : 0);
  const fade = useMotionValue(expanded ? 1 : 0);
  const travel = LIQUID_BAR_HEIGHT + config.gap;

  const reveal = useTransform(() => {
    const progress = split.get();
    const faded = fade.get();
    return reduced ? faded : clamp((progress - 0.35) / 0.45, 0, 1);
  });
  const lowerY = useTransform(split, (value) => value * travel);

  const animateSplit = (target: 0 | 1) => {
    if (reduced) {
      split.jump(target);
      return animate(fade, target, RBNB_REDUCED_TRANSITION).then(() => undefined);
    }
    fade.jump(target);
    return animate(split, target, { ...toSpring(config), restDelta: 0.004, restSpeed: 0.02 }).then(() => undefined);
  };

  const { stiffness, damping, mass } = config;
  useEffect(() => {
    if (expanded === undefined) return;
    const target = expanded ? 1 : 0;
    if (reduced) {
      split.jump(target);
      const controls = animate(fade, target, RBNB_REDUCED_TRANSITION);
      return () => controls.stop();
    }
    fade.jump(target);
    const controls = animate(split, target, { type: "spring", stiffness, damping, mass });
    return () => controls.stop();
  }, [expanded, reduced, split, fade, stiffness, damping, mass]);

  return { split, reveal, lowerY, animateSplit };
}
