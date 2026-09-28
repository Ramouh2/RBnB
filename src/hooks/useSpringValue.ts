"use client";

import { useEffect } from "react";
import { isMotionValue, useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { RBNB_SPRINGS, type SpringParams } from "@/lib/motion/constants";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Connecte une valeur cible (nombre ou MotionValue) à un ressort RBnB.
 * En mode reduced-motion, le ressort est court-circuité : la valeur saute instantanément.
 */
export function useSpringValue(
  source: number | MotionValue<number>,
  spring: SpringParams = RBNB_SPRINGS.default,
): MotionValue<number> {
  const reduced = useReducedMotion();
  const fallback = useMotionValue(isMotionValue(source) ? source.get() : source);
  const input: MotionValue<number> = isMotionValue(source) ? source : fallback;

  useEffect(() => {
    if (!isMotionValue(source)) fallback.set(source);
  }, [source, fallback]);

  const springValue = useSpring(input, {
    stiffness: spring.stiffness,
    damping: spring.damping,
    mass: spring.mass,
  });

  useEffect(() => {
    if (!reduced) return;
    springValue.jump(input.get());
    return input.on("change", (latest) => springValue.jump(latest));
  }, [reduced, input, springValue]);

  return springValue;
}
