"use client";

import { useId, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useTransform, useVelocity } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSpringValue } from "@/hooks/useSpringValue";
import {
  RBNB_ANIMATED_PRICE_DEFAULTS,
  RBNB_REDUCED_TRANSITION,
  RBNB_SPRINGS,
  withOverride,
  type AnimatedPriceConfig,
} from "@/lib/motion/constants";
import { formatNumberFr } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface AnimatedPriceProps {
  value: number;
  /** Symbole affiché après le nombre (null pour un nombre nu). */
  currency?: string | null;
  fractionDigits?: number;
  /** Contenu après le prix (ex : « /mois »). */
  suffix?: ReactNode;
  /** Texte lu par les lecteurs d'écran ; reçoit la valeur formatée. */
  srLabel?: (formatted: string) => string;
  className?: string;
  suffixClassName?: string;
  configOverride?: Partial<AnimatedPriceConfig>;
}

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * Compteur numérique mécanique RBnB : chaque chiffre roule dans sa propre colonne,
 * avec un flou vertical proportionnel à sa vitesse. `tabular-nums` : aucune vibration horizontale.
 */
export function AnimatedPrice({
  value,
  currency = "€",
  fractionDigits = 0,
  suffix,
  srLabel,
  className,
  suffixClassName,
  configOverride,
}: AnimatedPriceProps) {
  const config = withOverride(RBNB_ANIMATED_PRICE_DEFAULTS, configOverride);
  const reduced = useReducedMotion();
  const formatted = formatNumberFr(value, fractionDigits);
  const chars = [...formatted, ...(currency ? [" ", ...currency] : [])];
  const readable = currency ? `${formatted} ${currency}` : formatted;

  return (
    <span className={cn("inline-flex items-end", className)}>
      <span aria-live="polite" aria-atomic="true" className="sr-only">
        {srLabel ? srLabel(readable) : readable}
      </span>
      <span aria-hidden="true" className="inline-flex h-[1em] items-stretch leading-none tabular-nums">
        <AnimatePresence initial={false} mode="popLayout">
          {chars.map((char, index) => {
            // Clé par rang depuis la droite : chaque chiffre conserve sa colonne quand la longueur change.
            const key = `${chars.length - index}-${/\d/.test(char) ? "d" : char}`;
            return (
              <motion.span
                key={key}
                layout="position"
                initial={{ opacity: 0, y: "-40%" }}
                animate={{ opacity: 1, y: "0%" }}
                exit={{ opacity: 0, y: "40%" }}
                transition={reduced ? RBNB_REDUCED_TRANSITION : RBNB_SPRINGS.default}
                className="relative inline-flex h-[1em]"
              >
                {/\d/.test(char) ? (
                  <DigitColumn digit={Number(char)} config={config} reduced={reduced} />
                ) : (
                  <span className="inline-flex h-[1em] items-center">{char}</span>
                )}
              </motion.span>
            );
          })}
        </AnimatePresence>
      </span>
      {suffix && <span className={cn("ml-1.5", suffixClassName)}>{suffix}</span>}
    </span>
  );
}

interface DigitColumnProps {
  digit: number;
  config: AnimatedPriceConfig;
  reduced: boolean;
}

function DigitColumn({ digit, config, reduced }: DigitColumnProps) {
  const filterId = `rbnb-digit-${useId().replace(/:/g, "")}`;
  const blurRef = useRef<SVGFEGaussianBlurElement | null>(null);

  const position = useSpringValue(digit, config);
  const y = useTransform(position, (p) => `${-p * 10}%`);
  const velocity = useVelocity(position);
  const blur = useTransform(velocity, (v) => (reduced ? 0 : Math.min(Math.abs(v) * config.intensity, config.blur)));
  const filter = useTransform(blur, (b) => (b > 0.05 ? `url(#${filterId})` : "none"));

  // Flou strictement vertical (stdDeviation "0 b") appliqué directement au DOM : aucun re-render.
  useMotionValueEvent(blur, "change", (b) => {
    blurRef.current?.setAttribute("stdDeviation", `0 ${b.toFixed(2)}`);
  });

  return (
    <span className="relative inline-block h-[1em] w-[1ch] overflow-hidden">
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <filter id={filterId} x="0" y="-20%" width="100%" height="140%">
          <feGaussianBlur ref={blurRef} stdDeviation="0 0" />
        </filter>
      </svg>
      <motion.span className="absolute inset-x-0 top-0 flex flex-col" style={{ y, filter }}>
        {DIGITS.map((d) => (
          <span key={d} className="flex h-[1em] items-center justify-center">
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}
