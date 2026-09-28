"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { RBNB_REDUCED_TRANSITION, RBNB_SPRINGS } from "@/lib/motion/constants";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Délai d'entrée (s). */
  delay?: number;
  /** Déclenchement à l'entrée dans le viewport (sinon au montage). */
  inView?: boolean;
}

/** Entrée de contenu RBnB : léger déplacement + fondu, réduit à un fondu en reduced motion. */
export function Reveal({ children, className, delay = 0, inView = true }: RevealProps) {
  const reduced = useReducedMotion();
  const hidden = reduced ? { opacity: 0 } : { opacity: 0, y: 16 };
  const shown = { opacity: 1, y: 0 };
  const transition = reduced ? RBNB_REDUCED_TRANSITION : { ...RBNB_SPRINGS.default, delay };

  return inView ? (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: "-40px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  ) : (
    <motion.div className={className} initial={hidden} animate={shown} transition={transition}>
      {children}
    </motion.div>
  );
}
