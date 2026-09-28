"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  RBNB_DISCOUNT_BADGE_DEFAULTS,
  RBNB_REDUCED_TRANSITION,
  toSpring,
  withOverride,
  type DiscountBadgeConfig,
} from "@/lib/motion/constants";
import { cn } from "@/lib/utils";

export interface DiscountBadgeProps {
  /** `true` lorsque l'option annuelle est sélectionnée. */
  active: boolean;
  label?: string;
  className?: string;
  configOverride?: Partial<DiscountBadgeConfig>;
}

/**
 * Badge -20 % RBnB. Positionné en absolu par son parent : son apparition, son rebond élastique
 * et son onde lumineuse ne décalent jamais le toggle ni les éléments adjacents (CLS = 0).
 */
export function DiscountBadge({ active, label = "-20 %", className, configOverride }: DiscountBadgeProps) {
  const config = withOverride(RBNB_DISCOUNT_BADGE_DEFAULTS, configOverride);
  const reduced = useReducedMotion();

  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute z-20 inline-flex", className)}>
      <motion.span
        key={active ? "on" : "off"}
        initial={active && !reduced ? { scale: 1 / config.scale, opacity: 0.6 } : false}
        animate={{ scale: 1, opacity: active ? 1 : 0.55 }}
        transition={reduced ? RBNB_REDUCED_TRANSITION : toSpring(config)}
        className={cn(
          "relative inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tabular-nums tracking-wide",
          active
            ? "border-success/40 bg-[#0c2a22] text-success shadow-[0_0_18px_-4px_rgba(16,185,129,0.6)]"
            : "border-edge bg-surface-2 text-fg-muted",
        )}
      >
        {label}
        <AnimatePresence>
          {active && !reduced && (
            <motion.span
              key="wave"
              className="absolute inset-0 rounded-full border border-success"
              initial={{ scale: 1, opacity: config.glow }}
              animate={{ scale: 2.1, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
        </AnimatePresence>
      </motion.span>
    </span>
  );
}
