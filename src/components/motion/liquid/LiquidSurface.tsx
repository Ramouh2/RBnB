"use client";

import { useId, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { RBNB_SPRINGS, liquidColorMatrix, toSpring, type LiquidConfig } from "@/lib/motion/constants";
import { bridgePath } from "@/lib/motion/physics";
import { clamp } from "@/lib/utils";
import { LIQUID_BAR_HEIGHT, LIQUID_PADDING, LIQUID_PILL_WIDTH, pillPath, stubPath } from "./geometry";

export interface LiquidSurfaceProps {
  /** Largeur disponible (px, mesurée par le parent). */
  width: number;
  /** Progression de la séparation : 0 = barre unique, 1 = deux barres séparées. */
  split: MotionValue<number>;
  /** Contraction en pilule compacte : 0 = pleine largeur → 1 = pilule. */
  contraction?: MotionValue<number>;
  /** Couleur de remplissage (animable : succès). */
  fill?: string;
  config: LiquidConfig;
  reduced: boolean;
  /** Opacité de la barre inférieure (mode réduit : fondu en place). */
  lowerOpacity?: MotionValue<number>;
}

interface DropBurst {
  key: number;
  x: number;
  y: number;
}

const DROPS = [
  { dx: -16, dy: -11, r: 6.5, delay: 0 },
  { dx: 13, dy: 12, r: 5.5, delay: 0.03 },
  { dx: 2, dy: 3, r: 4.5, delay: 0.06 },
] as const;

/**
 * Calque morphologique Gooey (aria-hidden) : barres, pont liquide et gouttes.
 * Filtre exact : feGaussianBlur(stdDeviation) + feColorMatrix(alpha 22 / -9), confiné à ce SVG.
 * Les champs de saisie sont rendus par-dessus, hors filtre, pour une typographie parfaitement nette.
 */
export function LiquidSurface({ width, split, contraction, fill = "#f8fafc", config, reduced, lowerOpacity }: LiquidSurfaceProps) {
  const filterId = `rbnb-goo-${useId().replace(/:/g, "")}`;
  const H = LIQUID_BAR_HEIGHT;
  const P = LIQUID_PADDING;
  const travel = H + config.gap;
  const svgWidth = width + P * 2;
  const svgHeight = H * 2 + config.gap + P * 2;
  const centerX = P + width / 2;

  const pillWidth = Math.min(LIQUID_PILL_WIDTH, width);
  const readWidth = () => width - (width - pillWidth) * (contraction ? contraction.get() : 0);
  const ruptured = useMotionValue(0);
  const retract = useMotionValue(0);
  const [burst, setBurst] = useState<DropBurst | null>(null);

  const upperPath = useTransform(() => {
    const w = readWidth();
    return pillPath(centerX - w / 2, P, w, H);
  });
  const lowerPath = useTransform(() => {
    const w = readWidth();
    return pillPath(centerX - w / 2, P + split.get() * travel, w, H);
  });

  const neckPath = useTransform(() => {
    // Toutes les MotionValues sont lues d'emblée pour que l'abonnement soit complet.
    const progress = split.get();
    const currentWidth = readWidth();
    const isRuptured = ruptured.get();
    const retraction = retract.get();
    if (reduced) return "";
    const topEdge = P + H;
    const bottomEdge = P + progress * travel;
    const gapNow = bottomEdge - topEdge;
    const base = Math.min(currentWidth * 0.5, H * 1.7);
    if (isRuptured) {
      const length = (config.pull / 2) * clamp(retraction, 0, 1);
      const tip = base * config.neck * 0.6;
      return `${stubPath(centerX, topEdge, length, base, tip, 1)} ${stubPath(centerX, bottomEdge, length, base, tip, -1)}`;
    }
    if (gapNow <= 0) return "";
    const tension = clamp(gapNow / config.pull, 0, 1);
    const neckRatio = 1 - (1 - config.neck) * tension;
    return bridgePath({ width: currentWidth, height: H, topEdge, bottomEdge, base, neckRatio, centerX });
  });

  // Rupture du pont quand la tension dépasse PULL ; reconnexion (hystérésis) à la fusion.
  useMotionValueEvent(split, "change", (value) => {
    const gapNow = value * travel - H;
    if (!ruptured.get() && gapNow > config.pull && split.getVelocity() > 0) {
      ruptured.set(1);
      retract.set(1);
      animate(retract, 0, toSpring(config));
      if (!reduced) setBurst({ key: Date.now(), x: centerX, y: P + H + config.pull / 2 });
    } else if (ruptured.get() && gapNow < config.pull * 0.85) {
      ruptured.set(0);
    }
  });

  return (
    <svg
      aria-hidden="true"
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="pointer-events-none absolute overflow-visible"
      style={{ left: -P, top: -P }}
    >
      <defs>
        <filter id={filterId} filterUnits="userSpaceOnUse" x={0} y={0} width={svgWidth} height={svgHeight}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={config.blur} result="blur" />
          <feColorMatrix in="blur" type="matrix" values={liquidColorMatrix(config)} result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
      <motion.g filter={`url(#${filterId})`} initial={false} animate={{ fill }} transition={{ duration: 0.3 }}>
        <motion.path d={upperPath} />
        <motion.g style={lowerOpacity ? { opacity: lowerOpacity } : undefined}>
          <motion.path d={lowerPath} />
        </motion.g>
        <motion.path d={neckPath} />
        {burst &&
          DROPS.map((drop, index) => (
            <motion.circle
              key={`${burst.key}-${index}`}
              initial={{ cx: burst.x, cy: burst.y, r: 0 }}
              animate={{ cx: burst.x + drop.dx, cy: burst.y + drop.dy, r: [drop.r * 0.6, drop.r, drop.r * 0.7, 0] }}
              transition={{
                cx: { ...RBNB_SPRINGS.bouncy, delay: drop.delay },
                cy: { ...RBNB_SPRINGS.bouncy, delay: drop.delay },
                r: { duration: 0.95, times: [0, 0.2, 0.6, 1], ease: [0.22, 1, 0.36, 1], delay: drop.delay },
              }}
            />
          ))}
      </motion.g>
    </svg>
  );
}
