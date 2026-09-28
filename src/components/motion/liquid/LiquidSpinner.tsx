"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LiquidSpinnerProps {
  size?: number;
  className?: string;
  /** Couleur des gouttes (currentColor par défaut). */
  color?: string;
}

/**
 * Spinner liquide RBnB : deux gouttes en rotation qui fusionnent et se séparent (filtre Gooey local
 * sur une surface minuscule → coût GPU négligeable). N'existe que pendant l'état LOADING.
 */
export function LiquidSpinner({ size = 22, className, color = "currentColor" }: LiquidSpinnerProps) {
  const filterId = `rbnb-spinner-${useId().replace(/:/g, "")}`;

  return (
    <motion.svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-hidden="true"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.6" result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7" />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`} fill={color}>
        {/* Deux gouttes qui fusionnent au centre puis se séparent : division liquide continue. */}
        <motion.g animate={{ y: [0, 8.5, 0] }} transition={{ repeat: Infinity, duration: 1.1, ease: [0.45, 0, 0.55, 1] }}>
          <circle cx="20" cy="10" r="6.2" />
        </motion.g>
        <motion.g animate={{ y: [0, -8.5, 0] }} transition={{ repeat: Infinity, duration: 1.1, ease: [0.45, 0, 0.55, 1] }}>
          <circle cx="20" cy="30" r="6.2" />
        </motion.g>
      </g>
    </motion.svg>
  );
}
