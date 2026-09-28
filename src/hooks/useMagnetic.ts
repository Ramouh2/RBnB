"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { RBNB_MAGNETIC_BUTTON_DEFAULTS, type MagneticButtonConfig } from "@/lib/motion/constants";
import { usePointerFine } from "./usePointerFine";
import { useReducedMotion } from "./useReducedMotion";

export interface MagneticState<T extends HTMLElement> {
  ref: RefObject<T | null>;
  /** Translation magnétique (ressort) à appliquer sur l'élément. */
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** Position locale du curseur (px) pour le reflet radial. */
  glowX: MotionValue<number>;
  glowY: MotionValue<number>;
  /** Opacité du reflet (0 hors zone → 1 au contact), amortie par ressort. */
  glowOpacity: MotionValue<number>;
  /** `true` si l'appareil dispose d'un curseur (magnétisme possible). */
  pointerFine: boolean;
  reduced: boolean;
}

type MagneticOptions = Partial<
  Pick<MagneticButtonConfig, "radius" | "strength" | "stiffness" | "damping" | "mass">
> & { disabled?: boolean };

/**
 * Attraction magnétique progressive dans un rayon autour de l'élément.
 * - Intensité proportionnelle à la proximité (0 au bord du rayon, maximale au contact).
 * - Aucune mise à jour d'état React : tout transite par des MotionValues.
 * - Désactivé automatiquement sur écran tactile ; en reduced motion, seul le reflet est conservé.
 */
export function useMagnetic<T extends HTMLElement>(options: MagneticOptions = {}): MagneticState<T> {
  const {
    radius = RBNB_MAGNETIC_BUTTON_DEFAULTS.radius,
    strength = RBNB_MAGNETIC_BUTTON_DEFAULTS.strength,
    stiffness = RBNB_MAGNETIC_BUTTON_DEFAULTS.stiffness,
    damping = RBNB_MAGNETIC_BUTTON_DEFAULTS.damping,
    mass = RBNB_MAGNETIC_BUTTON_DEFAULTS.mass,
    disabled = false,
  } = options;

  const ref = useRef<T | null>(null);
  const pointerFine = usePointerFine();
  const reduced = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawGlow = useMotionValue(0);
  const glowX = useMotionValue(-9999);
  const glowY = useMotionValue(-9999);

  const springOptions = { stiffness, damping, mass };
  const x = useSpring(rawX, springOptions);
  const y = useSpring(rawY, springOptions);
  const glowOpacity = useSpring(rawGlow, { stiffness: 260, damping: 30, mass: 0.6 });

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled || !pointerFine) {
      rawX.set(0);
      rawY.set(0);
      rawGlow.set(0);
      return;
    }

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = element.getBoundingClientRect();
      // Position au repos (sans la translation magnétique en cours) pour éviter toute boucle de rétroaction.
      const left = rect.left - x.get();
      const top = rect.top - y.get();
      const centerX = left + rect.width / 2;
      const centerY = top + rect.height / 2;

      const dx = Math.max(left - event.clientX, 0, event.clientX - (left + rect.width));
      const dy = Math.max(top - event.clientY, 0, event.clientY - (top + rect.height));
      const distance = Math.hypot(dx, dy);

      if (distance > radius) {
        rawX.set(0);
        rawY.set(0);
        rawGlow.set(0);
        return;
      }

      const proximity = radius > 0 ? 1 - distance / radius : 1;
      glowX.set(event.clientX - left);
      glowY.set(event.clientY - top);
      rawGlow.set(proximity);

      if (reduced) {
        rawX.set(0);
        rawY.set(0);
        return;
      }
      rawX.set((event.clientX - centerX) * strength * proximity);
      rawY.set((event.clientY - centerY) * strength * proximity);
    };

    const reset = () => {
      rawX.set(0);
      rawY.set(0);
      rawGlow.set(0);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
    };
  }, [disabled, pointerFine, reduced, radius, strength, rawX, rawY, rawGlow, glowX, glowY, x, y]);

  return { ref, x, y, glowX, glowY, glowOpacity, pointerFine, reduced };
}
