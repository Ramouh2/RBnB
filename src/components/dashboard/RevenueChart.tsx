"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { RBNB_REDUCED_TRANSITION, RBNB_SPRINGS } from "@/lib/motion/constants";
import { formatCurrencyFr } from "@/lib/format";

interface RevenueChartProps {
  series: number[];
  labels: string[];
}

/**
 * Histogramme RBnB : les barres croissent depuis leur base (scaleY, transform GPU) et se
 * réorganisent via `layout` quand la période change — aucun layout shift, aucune hauteur animée.
 */
export function RevenueChart({ series, labels }: RevenueChartProps) {
  const reduced = useReducedMotion();
  const max = Math.max(...series, 1);

  return (
    <div className="flex h-48 items-end gap-1.5 sm:gap-2" role="img" aria-label={`Revenus par période : ${series.map((v, i) => `${labels[i]} ${formatCurrencyFr(v)}`).join(", ")}`}>
      {series.map((value, index) => (
        <motion.div
          key={`${series.length}-${index}`}
          layout={!reduced}
          className="flex h-full flex-1 flex-col items-center justify-end gap-2"
          transition={reduced ? RBNB_REDUCED_TRANSITION : RBNB_SPRINGS.default}
        >
          <div className="relative w-full flex-1">
            <motion.div
              className="absolute inset-x-0 bottom-0 h-full origin-bottom rounded-t-md bg-gradient-to-t from-accent/25 to-accent/85"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: value / max }}
              transition={reduced ? RBNB_REDUCED_TRANSITION : { ...RBNB_SPRINGS.default, delay: index * 0.025 }}
            />
          </div>
          <span className="text-[10px] font-medium tabular-nums text-fg-muted">{labels[index]}</span>
        </motion.div>
      ))}
    </div>
  );
}
