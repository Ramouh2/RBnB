import type { Transition, Variants } from "framer-motion";
import { RBNB_REDUCED_TRANSITION, RBNB_SHAKE_KEYFRAMES, RBNB_SPRINGS } from "./constants";

/**
 * RBnB — Variants Framer Motion standardisés.
 * Toujours fournir la variante réduite (`reduced`) aux composants respectant prefers-reduced-motion.
 */

/** Entrée de section / page : léger déplacement vertical + fondu. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: RBNB_SPRINGS.default },
};

export const fadeUpReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: RBNB_REDUCED_TRANSITION },
};

/** Conteneur de liste cascadée. */
export function staggerContainer(stagger = 0.06, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  };
}

/** Modale / palette : déploiement depuis son point d'origine. */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 6 },
  visible: { opacity: 1, scale: 1, y: 0, transition: RBNB_SPRINGS.command },
  exit: { opacity: 0, scale: 0.98, y: 4, transition: RBNB_SPRINGS.snappy },
};

/** Fondu croisé du contenu interne lors d'un morphing de conteneur. */
export const crossfade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18, delay: 0.04 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

/** Secousse d'erreur horizontale (keyframes exactes, courbe amortie). */
export function shakeTransition(amplitude = 1): { x: number[]; transition: Transition } {
  return {
    x: RBNB_SHAKE_KEYFRAMES.map((v) => v * amplitude),
    transition: { type: "keyframes", duration: 0.52, ease: [0.36, 0.07, 0.19, 0.97] },
  };
}
